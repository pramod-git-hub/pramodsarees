import ProductCard from '../components/ProductCard'
import { supabaseServer } from '../lib/supabaseServer'

export default function Home({ products }) {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Premium Saree Collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data, error } = await supabaseServer
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

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

