import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { acupoints } from '../data/acupoints-seed'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log(`Seeding ${acupoints.length} acupoints...`)

  const { error } = await supabase
    .from('acupoints')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(acupoints as unknown as any[], { onConflict: 'id' })

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`✓ Seeded ${acupoints.length} acupoints successfully`)
}

seed()
