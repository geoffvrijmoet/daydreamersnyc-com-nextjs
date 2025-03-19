'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 md:px-6">
      <ol className="flex flex-wrap items-center text-sm text-gray-600">
        <li className="flex items-center">
          <Link href="/" className="hover:text-pink-500 transition-colors">
            Home
          </Link>
          {segments.length > 0 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
        </li>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

          return (
            <li key={path} className="flex items-center">
              {isLast ? (
                <span className="text-gray-900 font-medium">{title}</span>
              ) : (
                <>
                  <Link href={path} className="hover:text-pink-500 transition-colors">
                    {title}
                  </Link>
                  <span className="mx-2 text-gray-400">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 