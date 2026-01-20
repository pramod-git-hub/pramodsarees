import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import SEO from '../components/SEO'

const CATEGORIES = ['Silk','Cotton','Soft Silk','Designer','Daily Wear','Fancy']

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Silk',
    image_path: '',
    file: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = window.localStorage.getItem('admin_authed')
    if (token === 'yes') {
      setAuthed(true)
      fetchProducts()
    }
  }, [])

  const handleLogin = e => {
    e.preventDefault()
    if (
      email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '') &&
      password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '')
    ) {
      setAuthed(true)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('admin_authed', 'yes')
      }
      fetchProducts()
    } else {
      alert('Invalid admin credentials')
    }
  }

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('id,title,price,category,image_path')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    setProducts(data || [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    let imagePath = form.image_path

    try {
      if (form.file) {
        const fileName = `${Date.now()}-${form.file.name}`
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('product-images')
          .upload(fileName, form.file, { cacheControl: '3600', upsert: false })
        if (uploadError) {
          throw uploadError
        }
        imagePath = uploadData.path
      }

      const { error } = await supabase.from('products').insert({
        title: form.title,
        description: form.description,
        price: Number(form.price) || 0,
        category: form.category,
        image_path: imagePath,
      })
      if (error) throw error

      setForm({
        title: '',
        description: '',
        price: '',
        category: 'Silk',
        image_path: '',
        file: null,
      })
      fetchProducts()
      alert('Product added.')
    } catch (err) {
      console.error(err)
      alert('Failed to save product. Check console.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    setLoading(true)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert('Delete failed')
    } else {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
    setLoading(false)
  }

  const handleLogout = () => {
    setAuthed(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('admin_authed')
    }
  }

  if (!authed) {
    return (
      <>
        <SEO title="Admin Login" />
        <div className="max-w-sm mx-auto mt-10 rounded-2xl bg-white/90 p-6 shadow">
          <h1 className="mb-4 text-xl font-bold text-slate-800">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-3 text-sm">
            <div>
              <label className="text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Login
            </button>
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Admin Panel" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="rounded-full border border-rose-400 px-4 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr,1.2fr]">
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-2xl bg-white/90 p-4 shadow text-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800">Add Product</h2>
          <p className="text-xs text-slate-500 mb-2">
            Upload image to Supabase bucket <b>product-images</b> or let this form upload directly.
          </p>
          <div>
            <label className="text-slate-600 text-xs">Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-slate-600 text-xs">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 text-xs">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="text-slate-600 text-xs">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              >
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-slate-600 text-xs">Image file (upload to product-images)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })}
              className="mt-1 w-full text-xs"
            />
          </div>
          <div>
            <label className="text-slate-600 text-xs">OR existing image path</label>
            <input
              value={form.image_path}
              onChange={e => setForm({ ...form, image_path: e.target.value })}
              placeholder="e.g. 1731234567890-saree.jpg"
              className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>

        <div className="space-y-3 rounded-2xl bg-white/90 p-4 shadow text-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Products</h2>
            <button
              onClick={fetchProducts}
              className="rounded-full border border-brand px-3 py-1 text-xs font-medium text-brand hover:bg-amber-50"
            >
              Refresh
            </button>
          </div>
          {loading && <p className="text-xs text-slate-500">Loading...</p>}
          <div className="max-h-[380px] overflow-y-auto space-y-2">
            {products.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2"
              >
                <div>
                  <div className="font-medium text-slate-800">{p.title}</div>
                  <div className="text-xs text-slate-500">
                    {p.category} • ₹{p.price}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs text-rose-600 hover:text-rose-700"
                >
                  Delete
                </button>
              </div>
            ))}
            {!products.length && !loading && (
              <p className="text-xs text-slate-500">No products yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
