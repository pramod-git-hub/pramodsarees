export const dynamic = 'force-dynamic'
import Head from 'next/head'
import Header from '../components/Header.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { supabase } from '../lib/supabaseClient'
export default function Home({products}){
  return (
    <div>
      <Head><title>Pramod's Sarees</title></Head>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-6">Latest Sarees</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p=> <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </div>
  )
}
export async function getServerSideProps(){
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  const products = (data || []).map((p) => {
    const { publicURL } = supabase.storage.from('product-images').getPublicUrl(p.image_path || '')
    return { ...p, image_url: publicURL }
  })
  return { props: { products } }
}
