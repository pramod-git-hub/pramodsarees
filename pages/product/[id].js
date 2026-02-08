import { supabase } from "../../lib/supabaseClient"
import MediaSlider from "../../components/MediaSlider"

export async function getServerSideProps({ params }) {
  const { id } = params

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return { notFound: true }
  }

  return {
    props: {
      product: {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        video: data.video || null
      }
    }
  }
}

export default function ProductPage({ product }) {
  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* MEDIA */}
      <MediaSlider images={product.images} video={product.video} />

      {/* DETAILS */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="text-2xl font-semibold text-red-600 mb-6">
          ₹{product.price}
        </div>

        <a
          href={`https://wa.me/91XXXXXXXXXX?text=I want ${product.title}`}
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Order on WhatsApp
        </a>
      </div>
    </div>
  )
}
