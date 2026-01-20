import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Admin() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)

  const uploadFile = async (file, bucket) => {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const imageUrls = []
      for (let img of images) {
        const url = await uploadFile(img, 'product-images')
        imageUrls.push(url)
      }

      const videoUrl = video
        ? await uploadFile(video, 'product-videos')
        : null

      await supabase.from('products').insert({
        title,
        description,
        price,
        images: imageUrls,
        video_url: videoUrl
      })

      alert('Product added successfully')
      setTitle('')
      setDescription('')
      setPrice('')
      setImages([])
      setVideo(null)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} /><br /><br />
      <textarea placeholder="Description" onChange={e => setDescription(e.target.value)} /><br /><br />
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} /><br /><br />

      <label>Multiple Images</label><br />
      <input type="file" multiple onChange={e => setImages(e.target.files)} /><br /><br />

      <label>One Video</label><br />
      <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} /><br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Uploading...' : 'Add Product'}
      </button>
    </div>
  )
}

