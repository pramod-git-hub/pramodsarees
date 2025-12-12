import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useCart } from '../../context/CartContext'
import SEO from '../../components/SEO'

export default function ProductPage({ product }) {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)

  if (!product) {
    return <div className="rounded-2xl bg-white/80 p-6 shadow text-sm">Product not found.</div>
  }

  const handleAdd = () => {
    addToCart(product, qty)
    alert('Added to cart')
  }

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'
    const msg = encodeURIComponent(
      `Hello, I want to order this saree:\n\n${product.title}\nCategory: ${product.category}\nPrice: ₹${product.price}\nQuantity: ${qty}`
    )
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank")
  }

  return (
    <>
      <SEO title={product.title} description={product.description} />
      <div className="grid gap-8 md:grid-cols-[1.15fr,1fr]">
        <div className="rounded-3xl bg-white/80 p-3 shadow">
          <img
            src={product.image_url || '/placeholder.png'}
            alt={product.title}
            className="w-full h-[420px] md:h-[520px] object-cover rounded-2xl"
          />
        </div>
        <div className="rounded-3xl bg-white/80 p-5 shadow flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.title}</h1>
          </div>
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {product.description}
          </p>
          <div className="text-3xl font-bold text-brand">₹{product.price}</div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Quantity</span>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-full border border-amber-200 px-3 py-1 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWhatsApp}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600"
            >
              Order on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params
  const { data, error } = await supabase
    .from('products')
    .select('id,title,description,price,category,image_path')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Product fetch error:', error)
    return { props: { product: null } }
  }

  const { data: urlData } = supabase
    .storage
    .from('product-images')
    .getPublicUrl(data.image_path)

  const product = {
    ...data,
    image_url: urlData?.publicUrl || null
  }

  return { props: { product } }
}
