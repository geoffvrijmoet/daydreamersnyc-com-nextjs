import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Logo } from './logo'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-creamsicle">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo className={className} />
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="font-quicksand hover:text-eggplant transition-colors">
            Menu
          </Link>
          <Link href="/about" className="font-quicksand hover:text-eggplant transition-colors">
            About
          </Link>
          <Link href="/contact" className="font-quicksand hover:text-eggplant transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="text-eggplant hover:text-cutiepie transition-colors">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          <Link href="/sign-in" className="font-quicksand hover:text-eggplant transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
} 