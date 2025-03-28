'use client'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6 text-center">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
} 