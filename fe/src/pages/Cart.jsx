import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function Cart() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart()

  const handleQuantityChange = (
    productId,
    quantity
  ) => {
    updateQuantity(productId, quantity)
  }

  const handleRemove = (productId) => {
    removeFromCart(productId)
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <Link
          to="/products"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.7}
          />

          Continue shopping
        </Link>

        <div className="mt-5">
          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[var(--color-text-muted)]
            "
          >
            Store
          </span>

          <h1
            className="
              mt-1
              text-2xl
              font-medium
              tracking-[-0.04em]
              text-[var(--color-text)]
            "
          >
            Cart
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[var(--color-text-muted)]
            "
          >
            {totalItems}{' '}
            {totalItems === 1
              ? 'item'
              : 'items'}{' '}
            in your cart.
          </p>
        </div>
      </div>

      {/* Empty */}
      {items.length === 0 ? (
        <div
          className="
            rounded-[6px]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-12
            text-center
          "
        >
          <ShoppingCart
            size={28}
            strokeWidth={1.5}
            className="
              mx-auto
              text-[var(--color-text-muted)]
            "
          />

          <p className="mt-4 text-sm font-medium">
            Your cart is empty
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            Add some products to get started.
          </p>

          <Link
            to="/products"
            className="
              mt-5
              inline-flex
              h-9
              items-center
              rounded-[4px]
              bg-[var(--color-text)]
              px-4
              text-xs
              font-medium
              text-[var(--color-surface)]
              transition-opacity
              hover:opacity-80
            "
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-4
            lg:grid-cols-[1fr_320px]
          "
        >

          {/* Cart Items */}
          <section
            className="
              rounded-[6px]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              px-5
            "
          >
            <div
              className="
                border-b
                border-[var(--color-border)]
                py-4
              "
            >
              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-[var(--color-text-muted)]
                "
              >
                Cart items
              </span>

              <h2
                className="
                  mt-1
                  text-base
                  font-medium
                  tracking-[-0.025em]
                "
              >
                Your products
              </h2>
            </div>

            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={
                  handleQuantityChange
                }
                onRemove={handleRemove}
              />
            ))}
          </section>

          {/* Summary */}
          <section
            className="
              h-fit
              rounded-[6px]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-5
            "
          >
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[var(--color-text-muted)]
              "
            >
              Summary
            </span>

            <h2
              className="
                mt-1
                text-base
                font-medium
                tracking-[-0.025em]
              "
            >
              Order summary
            </h2>

            <div
              className="
                mt-5
                space-y-3
                border-b
                border-[var(--color-border)]
                pb-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Items
                </span>

                <span className="text-xs font-medium">
                  {totalItems}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Subtotal
                </span>

                <span className="text-sm font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <span
                  className="
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Shipping
                </span>

                <span
                  className="
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Calculated later
                </span>
              </div>
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span className="text-sm font-medium">
                Total
              </span>

              <span
                className="
                  text-lg
                  font-medium
                  tracking-[-0.03em]
                "
              >
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              type="button"
              className="
                mt-5
                h-10
                w-full
                rounded-[4px]
                bg-[var(--color-text)]
                text-xs
                font-medium
                text-[var(--color-surface)]
                transition-opacity
                hover:opacity-80
              "
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/auth?redirect=/checkout')
                } else {
                  navigate('/checkout')
                }
              }}
            >
              Checkout
            </button>

          </section>

        </div>
      )}

    </div>
  )
}

export default Cart