import '../styles/globals.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function MyApp({ Component, pageProps }) {

  // Prevent crash during prerender (404, 500, static build)
  if (!supabase) return <Component {...pageProps} />

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
