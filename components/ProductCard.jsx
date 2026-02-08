import Link from "next/link"
import { useCart } from "../context/CartContext"
import MediaSlider from "./MediaSlider"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* MEDIA */}
      <MediaSlider
        images={product.images}
        video={product.video}
      />

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-slate-800">
          {product.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-red-600 text-lg">
            ₹{product.price}
          </span>

          <Link
            href={`/product/${product.id}`}
            className="text-xs rounded-full bg-red-500 px-3 py-1 text-white"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
