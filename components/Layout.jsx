import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="page-frame flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
