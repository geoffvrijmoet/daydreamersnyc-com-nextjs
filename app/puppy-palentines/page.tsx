'use client'

import { useEffect, useState, useRef } from 'react'
import Script from 'next/script'
import Image from 'next/image'

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

interface OrderFormData {
  dogName: string
  ownerNames: string
  address: string
  note: string
}

export default function PuppyPalentines() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    dogName: '',
    ownerNames: '',
    address: '',
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

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle order submission
    console.log('Order submitted:', formData)
    setShowOrderModal(false)
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
              Puppy Palentines 🐾
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
              
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label htmlFor="dogName" className="block text-sm font-medium text-gray-700 mb-1">
                    Lucky Pup&apos;s Name
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

                <div>
                  <label htmlFor="ownerNames" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name(s)
                  </label>
                  <input
                    type="text"
                    id="ownerNames"
                    value={formData.ownerNames}
                    onChange={(e) => setFormData({ ...formData, ownerNames: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    required
                  />
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

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Place Order - $20
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 