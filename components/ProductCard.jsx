import MediaSlider from './MediaSlider'

export default function ProductCard({ product }) {
  const images = Array.isArray(product.images) ? product.images : []
  const video = product.video || null

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <MediaSlider images={images} video={video} />

      <div className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <p className="font-bold text-red-600 mt-2">₹{product.price}</p>

        <button className="mt-3 w-full bg-red-500 text-white py-2 rounded">
          Order on WhatsApp
        </button>
      </div>
    </div>
  )
}

