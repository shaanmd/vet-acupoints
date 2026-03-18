'use client'
import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle } from 'lucide-react'
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

  // Markdown renderer using vetai tokens
  function renderMarkdown(text: string) {
    return text
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-serif font-semibold text-vetai-text mt-5 mb-2">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-vetai-text">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-vetai-muted">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-vetai-text">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-vetai-text"><span>$2</span></li>')
      .replace(/\n\n/g, '<br />')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-serif font-semibold text-vetai-text flex items-center gap-2">
          <span className="text-vetai-secondary">✦</span>
          AI Protocol Builder
        </h1>
        <p className="mt-1 text-sm text-vetai-muted">
          Describe your patient&apos;s clinical signs and get a suggested acupuncture protocol powered by Claude AI.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Species selector */}
        <div>
          <label className="block text-xs font-semibold text-vetai-muted uppercase tracking-widest mb-2">
            Species
          </label>
          <div className="flex gap-2">
            {SPECIES_OPTIONS.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSpecies(s.value)}
                className={`flex items-center gap-1.5 rounded-tag px-4 py-2 text-sm font-semibold transition-all ${
                  species === s.value
                    ? 'bg-vetai-primary text-white shadow-sm'
                    : 'border border-vetai-border bg-vetai-surface text-vetai-muted hover:border-vetai-secondary/50 hover:text-vetai-text'
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
            <label className="block text-xs font-semibold text-vetai-muted uppercase tracking-widest">
              Clinical Signs &amp; History
            </label>
            <button
              type="button"
              onClick={handleUseExample}
              className="text-xs text-vetai-secondary hover:underline underline-offset-2"
            >
              Use example case
            </button>
          </div>
          <textarea
            value={clinicalSigns}
            onChange={e => setClinicalSigns(e.target.value)}
            placeholder="Describe the patient: age, breed, presenting signs, TCVM observations (tongue, pulse), relevant history..."
            rows={5}
            className="w-full rounded-btn border border-vetai-border bg-vetai-surface px-4 py-3 text-sm text-vetai-text placeholder-vetai-muted/60 outline-none transition focus:border-vetai-secondary focus:ring-2 focus:ring-vetai-secondary/20 resize-none"
          />
          <p className="mt-1 text-xs text-vetai-muted/70">
            The more clinical detail you provide, the more relevant the protocol will be.
          </p>
        </div>

        {/* AI Generate button — vetai-btn-ai gradient */}
        <button
          type="submit"
          disabled={loading || !clinicalSigns.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-btn py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: loading || !clinicalSigns.trim()
              ? '#1A3A5C'
              : 'linear-gradient(135deg, #1A3A5C, #48C9A0)',
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating protocol...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              ✦ Generate Protocol
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-btn border border-red-100 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !result && (
        <div className="rounded-card border border-vetai-border bg-vetai-surface p-5 space-y-3 animate-pulse">
          <div className="h-4 w-40 rounded-full bg-vetai-border" />
          <div className="h-3 w-full rounded-full bg-vetai-bg" />
          <div className="h-3 w-4/5 rounded-full bg-vetai-bg" />
          <div className="h-3 w-full rounded-full bg-vetai-bg" />
          <div className="h-3 w-3/4 rounded-full bg-vetai-bg" />
        </div>
      )}

      {/* Result — AI card with gradient strip */}
      {result && (
        <div className="relative rounded-card border border-vetai-border bg-vetai-surface shadow-sm overflow-hidden">
          {/* AI gradient strip */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: 'linear-gradient(90deg, #1A3A5C, #48C9A0)' }}
          />

          <div className="p-5 pt-6">
            {/* AI insight header */}
            <div
              className="flex items-center gap-2 mb-4 p-3 rounded-[10px]"
              style={{ background: 'rgba(72,201,160,0.08)', border: '1px solid rgba(72,201,160,0.2)' }}
            >
              <span className="text-vetai-secondary text-base flex-shrink-0">✦</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-vetai-primary">AI-Generated Protocol</p>
                <p className="text-[11px] text-vetai-muted">
                  {species.charAt(0).toUpperCase() + species.slice(1)} · Powered by Claude
                </p>
              </div>
            </div>

            {/* Streamed markdown content */}
            <div
              className="text-sm text-vetai-text leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
