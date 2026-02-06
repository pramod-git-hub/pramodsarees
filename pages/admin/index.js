import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminPage() {
  // ✅ ALL hooks at top level (VERY IMPORTANT)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(false)

  const uploadFile = async (file) => {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase
      .storage
      .from('product-images')
      .upload(fileName, file)

    if (error) throw error

    return supabase
      .storage
      .from('product-images')
      .getPublicUrl(fileName).data.publicUrl
  }

 const handleSubmit = async () => {
  if (!title || !price) {
    alert('Title and price required')
    return
  }

  setLoading(true)

  try {
    const imageUrls = []

    if (images && images.length > 0) {
      for (const img of images) {
        const url = await uploadFile(img)
        imageUrls.push(url)
      }
    }

    let videoUrl = null
    if (video) {
      videoUrl = await uploadFile(video)
    }

    await supabase.from('products').insert({
      title,
      description,
      price,
      images: imageUrls.length > 0 ? imageUrls : [],
      video: videoUrl
    })

    alert('Product added')
    setTitle('')
    setDescription('')
    setPrice('')
    setImages([])
    setVideo(null)
  } catch (e) {
    alert(e.message)
  }

  setLoading(false)
}

  // ✅ JSX return ONLY (no hooks below this)
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin – Add Product</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        className="mb-3"
        onChange={(e) => setImages([...e.target.files])}
      />

      <input
        type="file"
        accept="video/*"
        className="mb-3"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Uploading...' : 'Add Product'}
      </button>
    </div>
  )
}

