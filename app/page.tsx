import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-creamsicle/20">
      {/* Hero Image */}
      <div className="flex justify-center">
        <Image
          src="/images/Just Stanley and clouds.png"
          alt="Stanley with clouds"
          width={500}
          height={500}
          className="w-auto h-auto"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full px-4 pb-16 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-quicksand text-eggplant mb-4">
            Welcome to Daydreamers
          </h1>
          <p className="text-lg font-quicksand text-eggplant max-w-2xl mb-8">
            We sell ice cream and other snacks for dogs at our pop-up locations in dog parks in Brooklyn, NY.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/menu"
            className="px-8 py-4 bg-eggplant text-creamsicle rounded-full font-quicksand font-bold text-lg hover:bg-eggplant/90 transition-colors"
          >
            View Our Menu
          </Link>
          <Link 
            href="https://training.daydreamersnyc.com"
            className="px-8 py-4 bg-eggplant text-creamsicle rounded-full font-quicksand font-bold text-lg hover:bg-eggplant/90 transition-colors"
          >
            Interested in Training?
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  alternates: {
    canonical: 'https://daydreamersnyc.com',
  },
}
