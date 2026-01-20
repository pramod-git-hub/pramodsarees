
MULTI IMAGE + VIDEO SLIDER ADDED

Component:
components/MediaSlider.jsx

Usage:
<MediaSlider images={product.images} video={product.video_url} />

Supabase:
- products.images : text[]
- products.video_url : text

Storage buckets:
- product-images (public)
- product-videos (public)

Vercel env:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
