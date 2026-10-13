import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { api } from '../services/api'
import { dummyProducts } from '../data/dummyProducts'

const CartContext = createContext(null)

const initialLocalCart = [
  {
    id: 1,
    product_id: 1,
    quantity: 1,
  },
  {
    id: 2,
    product_id: 3,
    quantity: 2,
  },
]

export function CartProvider({ children }) {
  const [localCart, setLocalCart] = useState(initialLocalCart)
  const [serverCart, setServerCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [productsMap, setProductsMap] = useState({})

  const token = localStorage.getItem('token')

  // Cache products for resolving details
  const refreshProductsMap = useCallback(async () => {
    try {
      const res = await api.getProducts()
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const map = {}
        res.data.forEach((p) => {
          map[p.id] = p
        })
        setProductsMap(map)
        return
      }
    } catch {
      // ignore
    }

    const fallbackMap = {}
    dummyProducts.forEach((p) => {
      fallbackMap[p.id] = p
    })
    setProductsMap(fallbackMap)
  }, [])

  const fetchCart = useCallback(async () => {
    if (!token) {
      setServerCart(null)
      return
    }

    try {
      setLoading(true)
      const res = await api.getCart()
      if (res?.data) {
        setServerCart(res.data)
      }
    } catch {
      setServerCart(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    refreshProductsMap()
  }, [refreshProductsMap])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const items = useMemo(() => {
    if (serverCart && serverCart.items) {
      return serverCart.items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          id: item.product_id,
          name: item.product_name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          images: item.image_url ? [{ url: item.image_url, is_primary: true }] : [],
          ...(productsMap[item.product_id] || {}),
        },
      }))
    }

    return localCart
      .map((item) => ({
        ...item,
        product: productsMap[item.product_id] || dummyProducts.find((p) => p.id === item.product_id),
      }))
      .filter((item) => item.product)
  }, [serverCart, localCart, productsMap])

  const totalItems = useMemo(() => {
    if (serverCart) {
      return serverCart.total_items
    }
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [serverCart, items])

  const subtotal = useMemo(() => {
    if (serverCart) {
      return serverCart.total
    }
    return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
  }, [serverCart, items])

  const addToCart = async (product, quantity = 1) => {
    if (token) {
      try {
        await api.addToCart(product.id, quantity)
        await fetchCart()
        return
      } catch (err) {
        console.error('Failed to add to cart:', err)
      }
    }

    setLocalCart((current) => {
      const existingItem = current.find((item) => item.product_id === product.id)
      if (existingItem) {
        return current.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock ?? 999),
              }
            : item
        )
      }

      return [
        ...current,
        {
          id: Date.now(),
          product_id: product.id,
          quantity: Math.min(quantity, product.stock ?? 999),
        },
      ]
    })
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return

    if (token && serverCart?.items) {
      const serverItem = serverCart.items.find((item) => item.product_id === productId)
      if (serverItem) {
        try {
          await api.updateCartItem(serverItem.id, quantity)
          await fetchCart()
          return
        } catch (err) {
          console.error('Failed to update quantity:', err)
        }
      }
    }

    const product = productsMap[productId] || dummyProducts.find((item) => item.id === productId)
    const maxStock = product?.stock ?? quantity

    setLocalCart((current) =>
      current.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity: Math.min(quantity, maxStock),
            }
          : item
      )
    )
  }

  const removeFromCart = async (productId) => {
    if (token && serverCart?.items) {
      const serverItem = serverCart.items.find((item) => item.product_id === productId)
      if (serverItem) {
        try {
          await api.removeFromCart(serverItem.id)
          await fetchCart()
          return
        } catch (err) {
          console.error('Failed to remove from cart:', err)
        }
      }
    }

    setLocalCart((current) => current.filter((item) => item.product_id !== productId))
  }

  const clearCart = async () => {
    if (token) {
      try {
        await api.clearCart()
        await fetchCart()
        return
      } catch (err) {
        console.error('Failed to clear cart:', err)
      }
    }

    setLocalCart([])
  }

  const value = {
    items,
    totalItems,
    subtotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}