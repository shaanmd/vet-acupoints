import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  // Auth check — protocol builder requires a logged-in account
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { clinicalSigns, species } = body as { clinicalSigns: string; species: string }

  if (!clinicalSigns?.trim()) {
    return new Response('Clinical signs are required', { status: 400 })
  }

  // Fetch all acupoints from DB to inject as grounding context
  const { data: acupoints } = await supabase
    .from('acupoints')
    .select('id, name, alias, grouping, tcm_indication, western_indication, category')

  const acupointsContext = JSON.stringify(acupoints, null, 2)

  const systemPrompt = `You are an expert in Traditional Chinese Veterinary Medicine (TCVM) and veterinary acupuncture. You assist qualified veterinary professionals in designing acupuncture treatment protocols.

You will receive a list of available acupuncture points as your reference database, plus a clinical case description. Your task is to recommend a specific, evidence-informed acupuncture protocol drawn ONLY from the provided point database.

Format your response using this exact structure:

## Assessment
A brief TCVM interpretation of the case (Pattern diagnosis, Zang-Fu imbalances, etc.)

## Recommended Protocol
A numbered list of recommended points. For each point:
- **[POINT-ID]** — Point name — *Reason for inclusion*

## Treatment Notes
Practical suggestions: needle technique (tonification/sedation), moxa, frequency, adjuncts.

## Important Disclaimer
Always end with: "This AI-generated protocol is for educational reference only. All treatment decisions must be made by a qualified, TCVM-certified veterinary professional."

Be specific and clinical. Do not suggest points outside the provided database.`

  const userPrompt = `Available acupuncture points database:
${acupointsContext}

Clinical case:
Species: ${species}
Clinical signs and history: ${clinicalSigns}

Please suggest an acupuncture treatment protocol.`

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // Use textStream to pipe only the text deltas (not raw SSE JSON events)
    const textStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const text of stream.textStream) {
          controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return new Response('Failed to generate protocol', { status: 500 })
  }
}
