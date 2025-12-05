import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-6 bg-gradient-to-r from-rose-50 to-amber-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">

        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">Pramod's Sarees</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/admin">
            <span className="cursor-pointer">Admin</span>
          </Link>

          <span 
            className="cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            Cart
          </span>
        </nav>

      </div>
    </header>
  );
}
