'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  productId: string
  quantity: number
  price: number
  title: string
  isIceCream?: boolean  // Add this to identify ice cream items
  bulkDiscount?: {
    threshold: number
    pricePerUnit: number
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, title?: string) => void
  resetCart: () => void
  total: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'daydreamers-cart'

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

function loadFromStorage(): CartItem[] {
  try {
    if (typeof window === 'undefined') return []
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return []
  }
}

function findCartItem(items: CartItem[], productId: string, title?: string): CartItem | undefined {
  return items.find(item => {
    if (title) {
      // For variants, match both ID and title
      return item.productId === productId && item.title === title
    }
    // For ice cream products, match only by ID
    return item.productId === productId && item.isIceCream
  })
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart data only once on mount
  useEffect(() => {
    const loadedItems = loadFromStorage()
    setItems(loadedItems)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveToStorage(items)
    }
  }, [items, isLoading])

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = findCartItem(currentItems, newItem.productId, newItem.title)
      return existingItem
        ? currentItems.map(item =>
            (item.productId === newItem.productId && item.title === newItem.title)
              ? { ...item, quantity: newItem.quantity }
              : item
          )
        : [...currentItems, newItem]
    })
  }

  const removeItem = (productId: string, title?: string) => {
    setItems(currentItems => 
      currentItems.filter(item => {
        if (title) {
          return !(item.productId === productId && item.title === title)
        }
        return !(item.productId === productId && item.isIceCream)
      })
    )
  }

  const resetCart = () => {
    setItems([])
    saveToStorage([])
  }

  const total = items.reduce((sum, item) => {
    // Calculate total ice cream quantity
    const totalIceCreamQuantity = items
      .filter(i => i.isIceCream)
      .reduce((total, i) => total + i.quantity, 0)

    // Apply discount pricing for ice cream when total quantity is 2 or more
    if (item.isIceCream && totalIceCreamQuantity >= 2) {
      return sum + (1.50 * item.quantity)
    }

    // Apply bulk discount if available and threshold is met
    if (item.bulkDiscount && item.quantity >= item.bulkDiscount.threshold) {
      return sum + (item.bulkDiscount.pricePerUnit * item.quantity)
    }

    return sum + (item.price * item.quantity)
  }, 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      resetCart,
      total,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 