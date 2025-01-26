'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { shopifyClient } from '@/lib/shopify'
import { CUSTOMER_LOGIN_MUTATION } from '@/lib/queries'
import type { CustomerAccessTokenCreateResponse } from '@/lib/types'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await shopifyClient.request<CustomerAccessTokenCreateResponse>(
        CUSTOMER_LOGIN_MUTATION,
        {
          input: {
            email,
            password,
          },
        }
      )

      if (response.customerAccessTokenCreate.customerUserErrors.length > 0) {
        setError(response.customerAccessTokenCreate.customerUserErrors[0].message)
        return
      }

      const customerAccessToken = response.customerAccessTokenCreate.customerAccessToken
      if (!customerAccessToken) {
        setError('Failed to create access token')
        return
      }

      const { accessToken, expiresAt } = customerAccessToken
      
      // Store the token (you might want to use a more secure method)
      localStorage.setItem('shopifyCustomerToken', accessToken)
      localStorage.setItem('shopifyTokenExpiry', expiresAt)

      router.push('/account')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-creamsicle/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-quicksand font-bold text-eggplant text-center mb-8">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-quicksand font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-eggplant focus:outline-none focus:ring-eggplant"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-quicksand font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-eggplant focus:outline-none focus:ring-eggplant"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-eggplant text-creamsicle font-quicksand font-bold py-3 px-6 rounded-lg hover:bg-eggplant/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/sign-up" className="text-sm text-eggplant hover:text-eggplant/80">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 