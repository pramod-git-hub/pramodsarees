import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAdd = () => addToCart(product, 1)

  return (
    <div className="bg-white/95 rounded-2xl shadow-md shadow-amber-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-amber-600">
          {product.category}
        </div>
        <h3 className="font-semibold text-slate-800 line-clamp-1">{product.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="font-semibold text-lg text-brand">₹{product.price}</div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="text-xs rounded-full border border-amber-300 px-3 py-1 hover:bg-amber-50"
            >
              Add
            </button>
            <Link
              href={`/product/${product.id}`}
              className="text-xs rounded-full bg-brand px-3 py-1 text-white hover:bg-amber-700"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
