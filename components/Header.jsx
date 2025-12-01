import Link from 'next/link'

export default function Header(){ 
  return (
    <header className="w-full py-6 bg-gradient-to-r from-rose-50 to-amber-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">

        <Link 
          href="/" 
          className="text-2xl font-bold"
        >
          Pramod's Sarees
        </Link>

        <nav className="flex items-center gap-4">

          <Link 
            href="/admin"
            className="mr-4"
          >
            Admin
          </Link>

          <button 
            onClick={(e)=>e.preventDefault()} 
            className="cursor-pointer"
          >
            Cart
          </button>

        </nav>
      </
