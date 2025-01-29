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
  removeItem: (productId: string) => void
  resetCart: () => void
  total: number
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage)

  useEffect(() => {
    saveToStorage(items)
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.productId === newItem.productId)
      const updatedItems = existingItem
        ? currentItems.map(item =>
            item.productId === newItem.productId
              ? { ...item, quantity: newItem.quantity }
              : item
          )
        : [...currentItems, newItem]
      
      // Save to localStorage immediately
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems))
      return updatedItems
    })
  }

  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(item => item.productId !== productId)
      // Save to localStorage immediately
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems))
      return updatedItems
    })
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
    <CartContext.Provider value={{ items, addItem, removeItem, resetCart, total }}>
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