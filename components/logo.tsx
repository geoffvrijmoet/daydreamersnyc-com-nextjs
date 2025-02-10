import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  showDog?: boolean
}

export function Logo({ className, showDog = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <div className="relative">
        {showDog && (
          <div className="absolute -top-8 -right-8">
            <Image
              src="/images/dog-head.svg"
              alt=""
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
        )}
        <div className="text-4xl text-eggplant font-aloevera">
          daydreamers
        </div>
      </div>
    </Link>
  )
} 