import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import SEO from '../components/SEO'

function loadRazorpayScript(src) {
  return new Promise(resolve => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CartPage() {
  const { items, total, setQuantity, removeFromCart, clearCart } = useCart()

  useEffect(() => {
    loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js')
  }, [])

  const handleWhatsApp = () => {
    if (!items.length) return
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'
    const lines = items.map(
      i => `${i.title} (₹${i.price} × ${i.quantity}) = ₹${i.price * i.quantity}`
    )
    const msg = encodeURIComponent(
      `Hello, I want to order these sarees:\n\n${lines.join('\n')}\n\nTotal: ₹${total.toFixed(0)}\nPayment: COD / UPI.`
    )
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank")
  }

  const handleRazorpay = async () => {
    if (!items.length) return

    const ok = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!ok) {
      alert('Unable to load Razorpay. Check your internet.')
      return
    }

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      })
      const data = await res.json()
      if (!data.id) throw new Error('Invalid order response')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Pramod Sarees',
        description: 'Saree Order Payment',
        order_id: data.id,
        handler: function () {
          alert('Payment successful! We will confirm your order on WhatsApp.')
          clearCart()
        },
        theme: {
          color: '#d97706'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Unable to start online payment. You can use WhatsApp or COD.')
    }
  }

  return (
    <>
      <SEO title="Your Cart" />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>

        {!items.length ? (
          <div className="rounded-2xl bg-white/80 p-6 text-sm text-slate-500 shadow">
            Your cart is empty. Add some sarees first.
          </div>
        ) : (
          <>
            <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={item.image_url || '/placeholder.png'}
                      alt={item.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">₹{item.price} per saree</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-full border border-amber-300 text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => setQuantity(item.id, e.target.value)}
                        className="w-16 rounded-full border border-amber-300 px-2 py-1 text-center text-sm"
                      />
                      <button
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-full border border-amber-300 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-24 text-right text-sm font-semibold">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl bg-white/80 p-4 shadow">
              <div className="text-lg font-bold">
                Total: <span className="text-brand">₹{total.toFixed(0)}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  WhatsApp Checkout
                </button>
                <button
                  onClick={handleRazorpay}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Pay Online (Razorpay)
                </button>
                <button
                  onClick={() => alert('COD selected. We will confirm on WhatsApp.')}
                  className="rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-amber-50"
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
