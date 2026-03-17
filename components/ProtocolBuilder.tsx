'use client'
import { useState } from 'react'
import { Wand2, Loader2, AlertCircle } from 'lucide-react'
import { Species } from '@/lib/types'

const SPECIES_OPTIONS: { value: Species; label: string; emoji: string }[] = [
  { value: 'canine', label: 'Canine', emoji: '🐕' },
  { value: 'feline', label: 'Feline', emoji: '🐈' },
  { value: 'equine', label: 'Equine', emoji: '🐴' },
]

const EXAMPLE_CASES: Record<Species, string> = {
  canine: '5-year-old Labrador, hindlimb weakness, reluctant to rise, possible IVDD. Tongue pale, pulse deep and weak. Previously active dog.',
  feline: '8-year-old DSH cat, chronic constipation, abdominal bloating, occasional vomiting. Qi stagnation pattern suspected.',
  equine: '12-year-old Warmblood mare, thoracolumbar stiffness, reduced collection, occasional hindlimb dragging. Performance decline over 3 months.',
}

export default function ProtocolBuilder() {
  const [species, setSpecies] = useState<Species>('canine')
  const [clinicalSigns, setClinicalSigns] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!clinicalSigns.trim()) return

    setLoading(true)
    setResult('')
    setError(null)

    try {
      const response = await fetch('/api/protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalSigns, species }),
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || 'Failed to generate protocol')
      }

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No response body')

      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setResult(accumulated)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleUseExample() {
    setClinicalSigns(EXAMPLE_CASES[species])
  }

  // Simple markdown to HTML renderer for the streamed result
  function renderMarkdown(text: string) {
    return text
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-gray-900 mt-5 mb-2">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-gray-600">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal"><span>$2</span></li>')
      .replace(/\n\n/g, '<br />')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-tcvm-600" />
          AI Protocol Builder
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Describe your patient&apos;s clinical signs and get a suggested acupuncture protocol powered by Claude AI.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Species selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Species
          </label>
          <div className="flex gap-2">
            {SPECIES_OPTIONS.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSpecies(s.value)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  species === s.value
                    ? 'bg-tcvm-600 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-tcvm-300'
                }`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical signs textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Clinical Signs & History
            </label>
            <button
              type="button"
              onClick={handleUseExample}
              className="text-xs text-tcvm-600 hover:underline"
            >
              Use example case
            </button>
          </div>
          <textarea
            value={clinicalSigns}
            onChange={e => setClinicalSigns(e.target.value)}
            placeholder="Describe the patient: age, breed, presenting signs, TCVM observations (tongue, pulse), relevant history..."
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-tcvm-500 focus:ring-2 focus:ring-tcvm-200 resize-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            The more clinical detail you provide, the more relevant the protocol will be.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !clinicalSigns.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-tcvm-600 py-3.5 text-sm font-semibold text-white transition hover:bg-tcvm-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating protocol...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Protocol
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl border border-tcvm-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Wand2 className="h-4 w-4 text-tcvm-600" />
            <span className="text-sm font-bold text-gray-900">AI-Generated Protocol</span>
            <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {species.charAt(0).toUpperCase() + species.slice(1)}
            </span>
          </div>
          <div
            className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !result && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3 animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-4/5 rounded bg-gray-100" />
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-3/4 rounded bg-gray-100" />
        </div>
      )}
    </div>
  )
}
