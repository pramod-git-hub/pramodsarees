import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import MediaSlider from '../components/MediaSlider'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts(data || [])
    })
  }, [])

  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p.id}>
          <MediaSlider images={p.images} video={p.video_url} />
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <b>₹{p.price}</b>
        </div>
      ))}
    </div>
  )
}
