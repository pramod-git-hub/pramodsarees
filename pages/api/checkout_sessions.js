import Stripe from 'stripe'
import { supabase } from '../../lib/supabaseClient'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { productId } = req.body
  const { data: product } = await supabase.from('products').select('*').eq('id', productId).single()
  if(!product) return res.status(404).json({ error: 'Product not found' })
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: { name: product.title, description: product.description },
        unit_amount: Math.round(Number(product.price) * 100)
      },
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`
  })
  res.status(200).json({ url: session.url })
}
