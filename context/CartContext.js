import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem('cart')
    if (raw) {
      try { setItems(JSON.parse(raw)) } catch(e) {}
    }
  }, [])

  // persist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        price: Number(product.price) || 0,
        image_url: product.image_url || null,
        category: product.category || '',
        description: product.description || '',
        quantity: qty,
      }]
    })
  }

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const setQuantity = (id, quantity) => {
    const q = Math.max(1, Number(quantity) || 1)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i))
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, setQuantity, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
