import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import SEO from '../components/SEO'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['Silk','Cotton','Soft Silk','Designer','Daily Wear','Fancy']

export default function Home({ initialProducts }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const products = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesCat = category === 'All' || p.category === category
      const q = search.toLowerCase()
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [initialProducts, search, category])

  return (
    <>
      <SEO />
      <section className="mb-6 md:mb-8">
        <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400 text-white px-6 py-8 md:px-10 md:py-10 shadow-lg shadow-rose-200">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Handpicked Sarees for Every Occasion
          </h1>
          <p className="text-sm md:text-base text-rose-50 max-w-2xl">
            Explore Silk, Cotton, Soft Silk, Designer, Daily Wear and Fancy sarees with WhatsApp ordering,
            online payment and cash on delivery options.
          </p>
        </div>
      </section>

      <section className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Search sarees by name or style..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full md:w-48 rounded-full border border-amber-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </section>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white/80 p-6 text-sm text-slate-500 shadow">
          No sarees found. Try a different name or category.
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </section>
      )}
    </>
  )
}

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('products')
    .select('id,title,description,price,category,image_path')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
  }

  const products = (data || []).map(p => {
    const { data: urlData } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(p.image_path)
    return {
      ...p,
      image_url: urlData?.publicUrl || null
    }
  })

  return { props: { initialProducts: products } }
}
