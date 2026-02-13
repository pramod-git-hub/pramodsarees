import bcrypt from 'bcryptjs'
import { supabaseServer } from '../../../lib/supabaseServer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }

  const { data: admin, error } = await supabaseServer
    .from('admins')
    .select('*')
    .eq('email', email.trim())
    .single()

  if (error || !admin) {
    return res.status(401).json({ message: 'Invalid admin credentials' })
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash)

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid admin credentials' })
  }

  return res.status(200).json({
    success: true,
    admin: {
      id: admin.id,
      email: admin.email
    }
  })
}

