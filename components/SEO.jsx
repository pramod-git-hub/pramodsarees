import Head from 'next/head'

export default function SEO({ title, description }) {
  const fullTitle = title ? `${title} | Pramod Sarees` : "Pramod Sarees - Premium Saree Collection"
  const desc = description || "Shop Silk, Cotton, Soft Silk, Designer, Daily Wear and Fancy sarees with online payment, WhatsApp ordering and cash on delivery."
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
    </Head>
  )
}
