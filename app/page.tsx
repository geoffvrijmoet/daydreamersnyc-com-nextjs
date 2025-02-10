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
      <div className="relative z-10 flex flex-col items-center justify-end h-full px-4 pb-16 pt-32">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/menu"
            className="px-8 py-4 bg-eggplant text-creamsicle rounded-full font-quicksand font-bold text-lg hover:bg-eggplant/90 transition-colors"
          >
            Menu
          </Link>
          <Link 
            href="/about"
            className="px-8 py-4 bg-creamsicle text-eggplant rounded-full font-quicksand font-bold text-lg hover:bg-creamsicle/80 transition-colors"
          >
            About Us
          </Link>
          <Link 
            href="https://training.daydreamersnyc.com"
            className="px-8 py-4 bg-eggplant text-creamsicle rounded-full font-quicksand font-bold text-lg hover:bg-eggplant/90 transition-colors"
          >
            Training
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
