'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  url: string
  altText: string | null
}

interface ProductImagesGridProps {
  images: ProductImage[]
  title: string
}

export function ProductImagesGrid({ images, title }: ProductImagesGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images.length) return null

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
        <Image
          src={images[selectedImageIndex].url}
          alt={images[selectedImageIndex].altText || title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-white ${
                selectedImageIndex === index ? 'ring-2 ring-eggplant' : 'hover:opacity-80'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${title} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 