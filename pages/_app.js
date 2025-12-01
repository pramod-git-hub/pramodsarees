export const dynamic = 'force-dynamic'

import '../styles/globals.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function MyApp({ Component, pageProps }) {

  // IMPORTANT FIX – prevents crash during build
  if (!supabase) {
    return <Component {...pageProps} />
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

