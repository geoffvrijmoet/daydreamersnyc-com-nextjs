import { Quicksand } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Breadcrumbs } from './components/breadcrumbs'
import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart-context'
import { LocalBusinessStructuredData } from '@/components/structured-data'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand', 
})

const aloevera = localFont({
  src: './fonts/Aloevera-OVoWO.ttf',
  variable: '--font-aloevera',
})

export const metadata: Metadata = {
  title: 'Daydreamers | Food & Snacks for Dogs & Cats',
  description: 'Premium pet supplies for your furry friends. Visit our Brooklyn dog park pop-ups for fresh doggy ice cream, or shop our selection of treats, chews, and toys.',
  metadataBase: new URL('https://daydreamersnyc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Daydreamers | Food & Snacks for Dogs & Cats',
    description: 'Premium pet supplies for your furry friends. Visit our Brooklyn dog park pop-ups for fresh doggy ice cream.',
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daydreamers | Food & Snacks for Dogs & Cats',
    description: 'Premium pet supplies for your furry friends. Visit our Brooklyn dog park pop-ups for fresh doggy ice cream.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png' },
    ],
  },
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
          <LocalBusinessStructuredData />
          <div className="min-h-screen flex flex-col">
            <Header className="font-aloevera" />
            <Breadcrumbs />
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
