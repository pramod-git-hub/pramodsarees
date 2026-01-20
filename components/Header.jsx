import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { items } = useCart()
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setCartCount(items.reduce((sum, i) => sum + i.quantity, 0))
  }, [items])

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Pramod Sarees"

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-amber-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <Link href="/">
          <span className="font-poppins font-bold text-xl md:text-2xl bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent cursor-pointer">
            {storeName}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-full border border-amber-200 px-3 py-1 text-sm"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-amber-100 bg-white/95 px-4 pb-3 space-y-2 text-sm">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link><br />
          <Link href="/cart" onClick={() => setOpen(false)}>Cart ({cartCount})</Link><br />
          <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
        </div>
      )}
    </header>
  )
}
