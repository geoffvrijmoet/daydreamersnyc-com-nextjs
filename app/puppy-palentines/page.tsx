'use client'

import { useEffect, useState, useRef } from 'react'
import Script from 'next/script'
import Image from 'next/image'
import { shopifyClient } from '@/lib/shopify'
import { PRODUCTS_QUERY } from '@/lib/queries'

interface YouTubePlayer {
  destroy: () => void
  playVideo: () => void
  pauseVideo: () => void
}

interface YouTubeEvent {
  target: YouTubePlayer
  data: number
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string | number
          width: string | number
          videoId: string
          playerVars?: {
            autoplay?: number
            controls?: number
            disablekb?: number
            fs?: number
            rel?: number
            modestbranding?: number
          }
          events?: {
            onReady?: (event: YouTubeEvent) => void
            onStateChange?: (event: YouTubeEvent) => void
          }
        }
      ) => YouTubePlayer
      PlayerState: {
        ENDED: number
        PLAYING: number
        PAUSED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  vendor: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    edges: Array<{
      node: {
        id: string
      }
    }>
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
}

interface OrderFormData {
  dogName: string
  knowsAddress: boolean
  // Address fields
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  // Alternative info if address unknown
  ownerInfo: string
  // Order details
  bagPrice: number
  bonusItems: { [id: string]: { quantity: number, price: number } }
  note: string
}

interface GraphQLProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct
    }>
  }
}

const PRESET_VARIANT_IDS = {
  20: '49936312140059',
  25: '49936312172827',
  30: '49936312205595',
  35: '49936312238363',
  40: '49936312271131',
  45: '49936312303899',
  50: '49936312336667'
}

export default function PuppyPalentines() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [bonusProducts, setBonusProducts] = useState<ShopifyProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    dogName: '',
    knowsAddress: true,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    ownerInfo: '',
    bagPrice: 20,
    bonusItems: {},
    note: ''
  })
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  useEffect(() => {
    // Initialize YouTube API
    if (!window.YT) {
      // This function will be called once the YouTube IFrame API is loaded
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    } else {
      initializePlayer()
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    // Fetch bonus products when the modal is opened and we're on step 3
    if (showOrderModal && currentStep === 3) {
      fetchBonusProducts()
    }
  }, [showOrderModal, currentStep])

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: 'b5HyMZdrNLY', // OutKast - Happy Valentine's Day
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          console.log('Player ready')
          setIsPlayerReady(true)
        },
        onStateChange: (event: YouTubeEvent) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            // Loop the video when it ends
            event.target.playVideo()
          } else if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true)
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false)
          }
        }
      }
    })
  }

  const togglePlay = () => {
    if (!playerRef.current || !isPlayerReady) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const fetchBonusProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const data = await shopifyClient.request<GraphQLProductsResponse>(PRODUCTS_QUERY)
      const products = data.products.edges
        .map(edge => edge.node)
        .filter(product => {
          // Extract numeric ID from GraphQL ID (format: gid://shopify/Product/NUMERIC_ID)
          const numericId = product.id.split('/').pop() || ''
          
          // Include the specific Dr. Harvey's product
          if (numericId === '8575818006811') return true
          
          // Exclude specific product IDs
          const excludedProductIds = [
            '9812557234459', '8809947595035', '8809906143515', '8766863671579',
            '8766792532251', '8748938002715', '8587445010715', '8580220682523',
            '8470590095643', '8328765505819', '8474075300123'
          ]
          if (excludedProductIds.includes(numericId)) return false
          
          // Exclude products from specific vendors
          const excludedVendors = [
            "Dr. Harvey's",
            "Sodapup",
            "Evermore Pet Food",
            "Ware of the Dog",
            "Crude Carnivore"
          ]
          return !excludedVendors.includes(product.vendor)
        })
      setBonusProducts(products)
    } catch (error) {
      console.error('Error fetching bonus products:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Who&apos;s the Lucky Pup?</h4>
            <div>
              <label htmlFor="dogName" className="block text-sm font-medium text-gray-700 mb-1">
                Dog&apos;s Name
              </label>
              <input
                type="text"
                id="dogName"
                value={formData.dogName}
                onChange={(e) => setFormData({ ...formData, dogName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextStep}
                disabled={!formData.dogName}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Delivery Details</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData({ ...formData, knowsAddress: true })}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    formData.knowsAddress 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  I know their address
                </button>
                <button
                  onClick={() => setFormData({ ...formData, knowsAddress: false })}
                  className={`flex-1 p-4 rounded-lg border-2 ${
                    !formData.knowsAddress 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  I need help finding them
                </button>
              </div>

              {formData.knowsAddress ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="Street address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required={formData.knowsAddress}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required={formData.knowsAddress}
                      />
                    </div>
                    <div className="col-span-1">
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required={formData.knowsAddress}
                      >
                        <option value="">State</option>
                        <option value="NY">NY</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <input
                        type="text"
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="ZIP"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required={formData.knowsAddress}
                        pattern="[0-9]{5}"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="ownerInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Tell us what you know
                  </label>
                  <textarea
                    id="ownerInfo"
                    value={formData.ownerInfo}
                    onChange={(e) => setFormData({ ...formData, ownerInfo: e.target.value })}
                    placeholder="Owner's name, phone number, Instagram handle, where you usually see them, or any other helpful details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={4}
                    required={!formData.knowsAddress}
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Don&apos;t worry! We&apos;ll use our network in the dog community to track them down. 
                    We&apos;ll contact you if we need more information.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={formData.knowsAddress ? !formData.addressLine1 || !formData.city || !formData.zipCode : !formData.ownerInfo}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Customize Your Gift</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Bag Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[20, 25, 30].map((price) => (
                    <button
                      key={price}
                      onClick={() => setFormData({ ...formData, bagPrice: price })}
                      className={`p-4 rounded-lg border-2 ${
                        formData.bagPrice === price 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 hover:border-pink-200'
                      }`}
                    >
                      ${price}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label htmlFor="customPrice" className="block text-sm text-gray-600 mb-1">
                    Or enter custom amount:
                  </label>
                  <input
                    type="number"
                    id="customPrice"
                    min="20"
                    step="5"
                    value={formData.bagPrice}
                    onChange={(e) => setFormData({ ...formData, bagPrice: parseInt(e.target.value) })}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Bonus Items
                </label>
                {isLoadingProducts ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">Loading bonus items...</p>
                  </div>
                ) : bonusProducts.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {bonusProducts.map((product) => {
                      const productPrice = parseFloat(product.priceRange.minVariantPrice.amount)
                      const isSelected = product.id in formData.bonusItems
                      const quantity = isSelected ? formData.bonusItems[product.id].quantity : 0
                      
                      return (
                        <label
                          key={product.id}
                          className={`flex items-center p-2 rounded-lg border-2 cursor-pointer ${
                            isSelected
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newBonusItems = { ...formData.bonusItems }
                              if (e.target.checked) {
                                newBonusItems[product.id] = { quantity: 1, price: productPrice }
                              } else {
                                delete newBonusItems[product.id]
                              }
                              setFormData({ ...formData, bonusItems: newBonusItems })
                            }}
                            className="mr-2"
                          />
                          {product.images.edges[0]?.node && (
                            <Image
                              src={product.images.edges[0].node.url}
                              alt={product.images.edges[0].node.altText || ''}
                              width={32}
                              height={32}
                              className="rounded-md mr-2 object-cover"
                            />
                          )}
                          <span className="flex-1 truncate text-sm">{product.title}</span>
                          {isSelected && (
                            <div className="flex items-center mr-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  if (quantity > 1) {
                                    setFormData({
                                      ...formData,
                                      bonusItems: {
                                        ...formData.bonusItems,
                                        [product.id]: { quantity: quantity - 1, price: productPrice }
                                      }
                                    })
                                  }
                                }}
                                className="px-1 text-gray-500 hover:text-gray-700"
                              >
                                -
                              </button>
                              <span className="mx-1 text-sm">{quantity}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setFormData({
                                    ...formData,
                                    bonusItems: {
                                      ...formData.bonusItems,
                                      [product.id]: { quantity: quantity + 1, price: productPrice }
                                    }
                                  })
                                }}
                                className="px-1 text-gray-500 hover:text-gray-700"
                              >
                                +
                              </button>
                            </div>
                          )}
                          <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                            ${productPrice.toFixed(2)}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600 py-2">No bonus items available</p>
                )}
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Valentine&apos;s Note
                </label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={4}
                  placeholder="Write your Valentine's message here..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <button
                onClick={handleOrderSubmit}
                disabled={!formData.note}
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout - ${(formData.bagPrice + Object.values(formData.bonusItems).reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2)}
              </button>
            </div>
          </div>
        )
    }
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Check if the amount is a preset amount or custom
      const isPresetAmount = formData.bagPrice in PRESET_VARIANT_IDS
      
      if (isPresetAmount) {
        // Use regular cart checkout for preset amounts
        const variantId = PRESET_VARIANT_IDS[formData.bagPrice as keyof typeof PRESET_VARIANT_IDS]
        
        // Prepare bonus items
        const cartBonusItems = Object.entries(formData.bonusItems)
          .map(([productId, item]) => {
            const product = bonusProducts.find(p => p.id === productId)
            if (!product?.variants?.edges?.[0]?.node?.id) {
              console.error('No variant ID found for product:', productId)
              return null
            }
            return {
              merchandiseId: product.variants.edges[0].node.id,
              quantity: item.quantity
            }
          })
          .filter(Boolean)

        // Create cart with the selected variant
        const cartResponse = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              {
                merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
                quantity: 1,
                attributes: [
                  { key: "Dog Name", value: formData.dogName },
                  { key: "Note", value: formData.note },
                  { key: "Delivery Info", value: formData.knowsAddress 
                    ? `${formData.addressLine1}${formData.addressLine2 ? `, ${formData.addressLine2}` : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                    : `Need to find: ${formData.ownerInfo}`
                  }
                ]
              },
              ...cartBonusItems
            ]
          })
        })

        if (!cartResponse.ok) {
          const error = await cartResponse.json()
          throw new Error(`Failed to create cart: ${JSON.stringify(error)}`)
        }

        const cartData = await cartResponse.json()
        
        // Redirect to checkout
        if (cartData.checkoutUrl) {
          window.location.href = cartData.checkoutUrl
        } else {
          throw new Error('No checkout URL returned')
        }
      } else {
        // Use draft order for custom amount
        const draftOrderBonusItems = Object.entries(formData.bonusItems)
          .map(([productId, item]) => {
            const product = bonusProducts.find(p => p.id === productId)
            if (!product?.variants?.edges?.[0]?.node?.id) {
              console.error('No variant ID found for product:', productId)
              return null
            }
            return {
              variantId: product.variants.edges[0].node.id,
              quantity: item.quantity
            }
          })
          .filter(Boolean)

        // Create draft order
        const response = await fetch('/api/shopify/draft-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bagPrice: formData.bagPrice,
            dogName: formData.dogName,
            note: formData.note,
            deliveryInfo: formData.knowsAddress 
              ? `${formData.addressLine1}${formData.addressLine2 ? `, ${formData.addressLine2}` : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`
              : `Need to find: ${formData.ownerInfo}`,
            bonusItems: draftOrderBonusItems
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(`Failed to create draft order: ${JSON.stringify(error)}`)
        }

        const data = await response.json()
        
        // Redirect to invoice URL
        if (data.invoiceUrl) {
          window.location.href = data.invoiceUrl
        } else {
          throw new Error('No invoice URL returned')
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('An error occurred while creating your order. Please try again.')
    }
  }

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" strategy="beforeInteractive" />
      
      <div className="min-h-screen" style={{ backgroundColor: '#DDD1FF' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hidden YouTube Player */}
          <div id="youtube-player" className="hidden" />

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-pink-600 mb-4">
              Puppy Palentines 
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Spread some puppy love this Valentine&apos;s Day by sending a surprise treat bag to your furry friends!
            </p>

            <div className="flex justify-center mb-8">
              <Image
                src="/images/puppy-palentines.png"
                alt="Puppy Palentines"
                width={500}
                height={500}
                className="w-auto h-auto"
                priority
              />
            </div>

            {/* Audio Controls */}
            <div className="rounded-lg p-4 mb-8 text-center">
              <p className="text-pink-800 mb-2">
                🎵 Valentine&apos;s Day Soundtrack: OutKast - Happy Valentine&apos;s Day 🎵
              </p>
              <button
                onClick={togglePlay}
                disabled={!isPlayerReady}
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isPlayerReady ? 'Loading...' : isPlaying ? '⏸ Pause Music' : '▶️ Play Music'}
              </button>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="font-medium mb-2">Order a Puppy Palentine Bag</h3>
                <p className="text-gray-600">Each bag has $20 of treats hand selected by us</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="font-medium mb-2">Add Your Message</h3>
                <p className="text-gray-600">Write a Valentine&apos;s note for the lucky pup</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="font-medium mb-2">We Deliver to your Pup of Choice!</h3>
                <p className="text-gray-600">These dogs won&apos;t know what hit &apos;em!</p>
              </div>
            </div>
          </div>

          {/* Treat Bag Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">The Puppy Palentine Bag - $20</h2>
            <div className="space-y-6">
              <p className="text-gray-600">
                Each Puppy Palentine bag is uniquely curated with a random selection of premium treats and goodies. Every bag includes:
              </p>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="mr-2">🌹</span>
                  <span>Fresh flowers for the pup to sniff and enjoy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💝</span>
                  <span>A personalized Valentine&apos;s card with your message</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎁</span>
                  <span>A surprise assortment of choice treats, which may include:</span>
                </li>
                <ul className="ml-8 mt-2 space-y-2">
                  <li>• Bully sticks, duck feet, other hard chews</li>
                  <li>• Ostrich jerky</li>
                  <li>• Training treats</li>
                  <li>• Marrow bones</li>
                  <li>• Rope toys</li>
                  <li>• Ice cream?!</li>
                </ul>
              </ul>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors mt-6"
              >
                Order Puppy Palentine Bag - $20
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">When will the treats be delivered?</h3>
                <p className="text-gray-600">Orders placed on or before Valentine&apos;s Day will be delivered February 14th by 5pm. We will continue to accept Valentine&apos;s orders until end of day February 18th; those orders will be delivered within 48 hours of being placed.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What area do you deliver to?</h3>
                <p className="text-gray-600">We deliver to Manhattan, Brooklyn and Queens. Please note that Manhattan deliveries include a $6 delivery fee.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I add a custom message?</h3>
                <p className="text-gray-600">Yes! During checkout, you&apos;ll be able to add a personal message to your Puppy Palentine.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What if my dog has allergies?</h3>
                <p className="text-gray-600">Please note any allergies in the order notes, and we&apos;ll ensure the treats are safe for your pup.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Order Puppy Palentine Bag</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {renderStep()}
            </div>
          </div>
        )}
      </div>
    </>
  )
} 