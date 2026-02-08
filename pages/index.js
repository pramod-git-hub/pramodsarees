import { supabase } from "../lib/supabaseClient"
import ProductCard from "../components/ProductCard"

export default function Home({ products }) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">
        Premium Saree Collection
      </h1>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ✅ SERVER SIDE FETCH */
export async function getServerSideProps() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })

  if (error) {
    console.error(error)
    return { props: { products: [] } }
  }

  return {
    props: {
      products: data || []
    }
  }
}
