import Link from 'next/link'

export default function ProductCard({ product }) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <img 
        src={product.image_url} 
        alt={product.title} 
        className="w-full h-64 object-cover rounded-lg" 
      />

      <h3 className="mt-3 font-semibold">{product.title}</h3>
      <p className="text-sm mt-1">{product.description}</p>

      <div className="mt-3 flex justify-between items-center">
        <div className="font-bold">₹{product.price}</div>

        <Link 
          href={`/product/${product.id}`} 
          className="px-3 py-1 rounded bg-amber-500 text-white"
        >
          View
        </Link>
      </div>
    </div>
  )
}
