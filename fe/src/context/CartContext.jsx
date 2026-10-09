import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react'

import { dummyProducts } from '../data/dummyProducts'

const CartContext = createContext(null)

function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([
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
    ])

    const items = useMemo(() => {
        return cartItems
            .map((item) => ({
                ...item,
                product: dummyProducts.find(
                    (product) => product.id === item.product_id
                ),
            }))
            .filter((item) => item.product)
    }, [cartItems])

    const totalItems = useMemo(() => {
        return items.reduce(
            (total, item) => total + item.quantity,
            0
        )
    }, [items])

    const subtotal = useMemo(() => {
        return items.reduce(
            (total, item) =>
                total +
                item.product.price * item.quantity,
            0
        )
    }, [items])

    const addToCart = (product, quantity = 1) => {
        setCartItems((current) => {
            const existingItem = current.find(
                (item) => item.product_id === product.id
            )

            if (existingItem) {
                return current.map((item) =>
                    item.product_id === product.id
                        ? {
                            ...item,
                            quantity: Math.min(
                                item.quantity + quantity,
                                product.stock
                            ),
                        }
                        : item
                )
            }

            return [
                ...current,
                {
                    id: Date.now(),
                    product_id: product.id,
                    quantity: Math.min(
                        quantity,
                        product.stock
                    ),
                },
            ]
        })
    }

    const updateQuantity = (
        productId,
        quantity
    ) => {
        if (quantity < 1) {
            return
        }

        const product = dummyProducts.find(
            (item) => item.id === productId
        )

        const maxStock = product?.stock ?? quantity

        setCartItems((current) =>
            current.map((item) =>
                item.product_id === productId
                    ? {
                        ...item,
                        quantity: Math.min(
                            quantity,
                            maxStock
                        ),
                    }
                    : item
            )
        )
    }

    const removeFromCart = (productId) => {
        setCartItems((current) =>
            current.filter(
                (item) => item.product_id !== productId
            )
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const value = {
        items,
        totalItems,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error(
            'useCart must be used inside CartProvider'
        )
    }

    return context
}

export {
    CartProvider,
    useCart,
}