'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './logo'

interface HeaderProps {
  className?: string
}

const shouldShowPalentines = () => {
  // Get current date in EST/EDT
  const now = new Date()
  const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const feb18 = new Date(est.getFullYear(), 1, 18, 23, 59, 59) // February 18th at 23:59:59
  
  return est <= feb18
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/menu') {
      return pathname === '/menu' || pathname.startsWith('/menu/')
    }
    return pathname === path
  }

  const showPalentines = shouldShowPalentines()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-creamsicle">
      <div className="container mx-auto px-4">
        {/* Top row with logo and buttons */}
        <div className="h-16 flex items-center justify-between">
          <Logo className={className} />
          
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-eggplant hover:text-cutiepie transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/sign-in" className="font-quicksand hover:text-eggplant transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        {/* Navigation row - shown below on mobile, normal position on desktop */}
        <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2">
          {/* Main nav items */}
          <nav className="flex items-center justify-center gap-4 pb-2 md:pb-0 md:h-16">
            <Link 
              href="/menu" 
              className={`font-quicksand hover:text-eggplant transition-colors whitespace-nowrap ${
                isActive('/menu') ? 'font-bold text-eggplant' : ''
              }`}
            >
              Menu
            </Link>
            {/* Puppy Palentines - shown here on desktop */}
            {showPalentines && (
              <div className="hidden md:block">
                <Link 
                  href="/puppy-palentines" 
                  className={`font-quicksand text-pink-600 hover:text-pink-700 transition-colors whitespace-nowrap ${
                    isActive('/puppy-palentines') ? 'font-bold' : ''
                  }`}
                >
                  🐾 Puppy Palentines
                </Link>
              </div>
            )}
            <Link 
              href="/about" 
              className={`font-quicksand hover:text-eggplant transition-colors whitespace-nowrap ${
                isActive('/about') ? 'font-bold text-eggplant' : ''
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-quicksand hover:text-eggplant transition-colors whitespace-nowrap ${
                isActive('/contact') ? 'font-bold text-eggplant' : ''
              }`}
            >
              Contact
            </Link>
            <Link 
              href="https://training.daydreamersnyc.com" 
              className="font-quicksand hover:text-eggplant transition-colors whitespace-nowrap"
            >
              Training
            </Link>
          </nav>

          {/* Puppy Palentines - mobile only */}
          {showPalentines && (
            <div className="flex justify-center pb-4 md:hidden">
              <Link 
                href="/puppy-palentines" 
                className={`font-quicksand text-pink-600 hover:text-pink-700 transition-colors whitespace-nowrap ${
                  isActive('/puppy-palentines') ? 'font-bold' : ''
                }`}
              >
                🐾 Puppy Palentines
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 