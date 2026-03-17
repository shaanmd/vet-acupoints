// One-time script: reads original constants.ts, transforms to new snake_case schema
// Usage: node scripts/transform-seed.mjs
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcPath = join(__dirname, '../VetAcuPoints-source-temp/constants.ts')

let raw = readFileSync(srcPath, 'utf8')

// Strip the import statement and type annotation to get plain JS
// Split lines, remove import line, rejoin
const lines = raw.split('\n')
raw = lines
  .filter(line => !line.startsWith('import '))
  .join('\n')
  .replace(/export const ACUPOINTS: Acupoint\[\] = /, 'const ACUPOINTS = ')

// Replace TypeScript enum references with string values
const categoryMap = {
  'PointCategory.MASTER': "'Master Points'",
  'PointCategory.INFLUENTIAL': "'Influential/Bone/Marrow'",
  'PointCategory.SHU_MU': "'Back-Shu & Front-Mu'",
  'PointCategory.EMPIRICAL': "'Empirical & Distal'",
  'PointCategory.FIVE_SHU': "'Five Shu Points'",
}

for (const [key, val] of Object.entries(categoryMap)) {
  raw = raw.split(key).join(val)
}

// Evaluate to get the array (use Function constructor so var leaks to the return)
const fn = new Function(`${raw}; return ACUPOINTS;`)
const ACUPOINTS = fn()

// Transform to new snake_case schema
const newData = ACUPOINTS.map(p => ({
  id: p.id,
  name: p.name,
  alias: p.alias || null,
  grouping: p.grouping,
  tcm_indication: p.tcmIndication,
  western_indication: p.westernIndication,
  category: p.category,
  location_canine: p.locationDetails.canine,
  location_feline: p.locationDetails.feline,
  location_equine: p.locationDetails.equine,
}))

// Write as TypeScript export
const output = `// Auto-generated from VetAcuPoints source constants.ts
// Run scripts/seed-supabase.ts to push this data to Supabase

export const acupoints = ${JSON.stringify(newData, null, 2)} as const
`

writeFileSync(join(__dirname, '../data/acupoints-seed.ts'), output)
console.log(`Transformed ${newData.length} acupoints -> data/acupoints-seed.ts`)
