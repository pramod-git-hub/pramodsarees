import Razorpay from 'razorpay'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { amount } = req.body || {}
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    return res.status(500).json({ error: 'Razorpay keys missing' })
  }

  const instance = new Razorpay({ key_id, key_secret })

  try {
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      payment_capture: 1,
    })
    return res.status(200).json(order)
  } catch (err) {
    console.error('Razorpay error:', err)
    return res.status(500).json({ error: 'Unable to create order' })
  }
}
