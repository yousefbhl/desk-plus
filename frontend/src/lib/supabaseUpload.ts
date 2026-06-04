// frontend/src/lib/supabaseUpload.ts
//
// Uploads a product image straight to Supabase Storage (same approach as
// Desk+ Cloud), then returns the PUBLIC URL. The product record itself is
// created via the Laravel API — this only handles the image file.
//
// Requires these in frontend/.env (Vite needs the VITE_ prefix):
//   VITE_SUPABASE_URL=https://fgzqszadrnoidytvkicf.supabase.co
//   VITE_SUPABASE_ANON_KEY=your_anon_key
//
// Bucket: product-images  (must be public, RLS as you set in Cloud)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const BUCKET = 'product-images'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

/**
 * Upload a single image file and get back its public URL.
 * Throws on failure so the caller can show a toast.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
  }

  // unique path so files never collide
  const ext  = file.name.split('.').pop() || 'jpg'
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
