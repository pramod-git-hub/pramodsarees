import Header from '../../components/Header'
import { supabase } from '../../lib/supabaseClient'
export default function ProductPage({product}){
  async function handleBuy(){
    const res = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    })
    const data = await res.json()
    if(data.url) window.location = data.url
  }
  return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image_url} className="w-full h-96 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="mt-3">{product.description}</p>
          <div className="mt-5 font-bold text-xl">₹{product.price}</div>
          <button onClick={handleBuy} className="mt-6 px-6 py-3 bg-amber-600 text-white rounded">Buy Now</button>
        </div>
      </main>
    </div>
  )
}
export async function getServerSideProps({ params }){
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()
  const { publicURL } = supabase.storage.from('product-images').getPublicUrl(data.image_path || '')
  return { props: { product: { ...data, image_url: publicURL } } }
}
