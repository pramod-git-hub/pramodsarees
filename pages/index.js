
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import MediaSlider from '../components/MediaSlider'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('products').select('*')
      setProducts(data || [])
    }
    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Pramod Sarees</h1>
      {products.map(p => (
        <div key={p.id} style={{ marginBottom: 40 }}>
          <MediaSlider images={p.images || []} video={p.video_url} />
          <h2>{p.title}</h2>
          <p>{p.description}</p>
          <b>₹{p.price}</b>
        </div>
      ))}
    </div>
  )
}
