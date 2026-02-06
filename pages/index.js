import { supabase } from '../lib/supabaseClient'
import MediaSlider from '../components/MediaSlider'

export async function getServerSideProps() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return { props: { products: data || [] } }
}

export default function Home({ products }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Premium Saree Collection
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Slider */}
            <div className="w-full">
              <MediaSlider images={p.images} video={p.video} />
            </div>

            {/* Product details */}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">
                {p.title}
              </h2>

              <p className="text-red-600 font-bold text-xl mb-2">
                ₹{p.price}
              </p>

              {p.description && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {p.description}
                </p>
              )}

              <button className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
                Order on WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

