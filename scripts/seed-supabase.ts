import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { acupoints } from '../data/acupoints-seed'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Seed requires service_role key to bypass RLS (anon key is read-only)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('Get your service_role key from: Supabase → Project Settings → API → service_role')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠ Using anon key — this will fail due to RLS. Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
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
