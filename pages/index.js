import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import MediaSlider from '../components/MediaSlider'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setProducts(data || [])
      } else {
        console.error(error)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Pramod Sarees</h1>

      {products.length === 0 && (
        <p>No products found</p>
      )}

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            marginBottom: 40,
            padding: 15,
            border: '1px solid #ddd',
            borderRadius: 10
          }}
        >
          {/* 🔥 IMAGE + VIDEO SLIDER */}
          <MediaSlider
            images={product.images || []}
            video={product.video_url}
          />

          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <strong>₹{product.price}</strong>

          {/* Debug (optional – remove later) */}
          {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
        </div>
      ))}
    </div>
  )
}
