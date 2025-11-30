## Setup (quick)
1. Create a Supabase project and enable `uuid-ossp` extension (or use `gen_random_uuid()`):
   - Create table `products`:
     - id uuid primary key default uuid_generate_v4()
     - title text
     - description text
     - price numeric
     - image_path text
     - created_at timestamp with time zone default now()
2. Create a Storage bucket `product-images`.
3. Create a Stripe account and get API keys.
4. Copy `.env.example` to `.env.local` and fill values.
5. Install: `npm install`
6. Run: `npm run dev`
