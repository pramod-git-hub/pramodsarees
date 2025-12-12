export default function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-white/80 py-3 text-xs text-center text-slate-500">
      © {new Date().getFullYear()} Pramod Sarees. All rights reserved. |
      {' '}WhatsApp orders & Cash on Delivery available.
    </footer>
  )
}
