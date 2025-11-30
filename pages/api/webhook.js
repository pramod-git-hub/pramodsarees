import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export default async function handler(req, res){
  const sig = req.headers['stripe-signature']
  let event
  try{
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch(err){
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  // handle events (payment_intent.succeeded etc.) to fulfill orders
  res.json({ received: true })
}
export const config = { api: { bodyParser: false } }
