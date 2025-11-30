import '../styles/globals.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function MyApp({ Component, pageProps }) {

  // Prevent Supabase during prerender / SSR on Vercel
  if (!supabase) return <Component {...pageProps} />

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
