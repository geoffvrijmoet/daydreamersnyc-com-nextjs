import { Quicksand } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart-context'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand', 
})

const aloevera = localFont({
  src: './fonts/Aloevera-OVoWO.ttf',
  variable: '--font-aloevera',
})

export const metadata: Metadata = {
  title: 'Daydreamers Pet Supply',
  description: 'Premium pet supplies for your furry friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${aloevera.variable} font-quicksand`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header className="font-aloevera" />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
