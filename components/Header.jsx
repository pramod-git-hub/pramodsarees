import Link from 'next/link'
export default function Header(){ 
  return (
    <header className="w-full py-6 bg-gradient-to-r from-rose-50 to-amber-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/"><a className="text-2xl font-bold">Pramod's Sarees</a></Link>
        <nav>
          <Link href="/admin"><a className="mr-4">Admin</a></Link>
          <a href="#" onClick={(e)=>e.preventDefault()}>Cart</a>
        </nav>
      </div>
    </header>
  )
}
