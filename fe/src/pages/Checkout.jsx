import { useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  ShoppingBag,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useCart } from '../context/CartContext'

import { api } from '../services/api'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function Checkout() {
  const navigate = useNavigate()

  const {
    items,
    totalItems,
    subtotal,
    clearCart,
  } = useCart()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'bank_transfer',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const shipping = 15000
  const total = subtotal + shipping

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const token = localStorage.getItem('token')
    if (token) {
      try {
        const res = await api.checkout()
        clearCart()
        const orderId = res?.data?.id
        if (orderId) {
          navigate(`/orders/${orderId}`)
        } else {
          navigate('/orders')
        }
        return
      } catch (err) {
        console.error('Checkout error:', err)
        setErrorMessage(err.message || 'Gagal melakukan checkout')
        setIsSubmitting(false)
        return
      }
    }

    // Local / Guest fallback
    setTimeout(() => {
      clearCart()
      setIsSubmitting(false)
      navigate('/orders')
    }, 700)
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          className="
            rounded-[6px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-12
            text-center
          "
        >
          <div
            className="
              mx-auto
              flex h-12 w-12
              items-center justify-center
              rounded-full
              bg-[var(--color-bg)]
              text-[var(--color-text-muted)]
            "
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.6}
            />
          </div>

          <h1
            className="
              mt-4
              text-xl
              font-medium
              tracking-[-0.035em]
              text-[var(--color-text)]
            "
          >
            Your cart is empty
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[var(--color-text-muted)]
            "
          >
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="
              mt-6
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
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-6xl"
    >
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.7}
          />

          Back to cart
        </Link>

        <span
          className="
            mt-5
            block
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
          Checkout
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Complete your information to place the order.
        </p>

        {errorMessage && (
          <div
            className="
              mt-4
              rounded-[4px]
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-2.5
              text-xs
              text-red-500
            "
          >
            {errorMessage}
          </div>
        )}
      </div>

      <div
        className="
          grid
          gap-6
          lg:grid-cols-[minmax(0,1fr)_360px]
        "
      >
        {/* Left */}
        <div className="space-y-6">

          {/* Customer information */}
          <section
            className="
              rounded-[6px]
              border border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-5
              sm:p-6
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-[4px]
                  bg-[var(--color-bg)]
                  text-[var(--color-text-muted)]
                "
              >
                <ShoppingBag
                  size={15}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <h2
                  className="
                    text-sm
                    font-medium
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  Customer information
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Your contact information
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="name"
                  className="
                    mb-1.5
                    block
                    text-[11px]
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="
                    input-krauq
                    h-9
                    w-full
                    px-3
                    text-xs
                    placeholder:text-[var(--color-text-muted)]
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="
                    mb-1.5
                    block
                    text-[11px]
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+62 812 3456 7890"
                  required
                  className="
                    input-krauq
                    h-9
                    w-full
                    px-3
                    text-xs
                    placeholder:text-[var(--color-text-muted)]
                  "
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="
                    mb-1.5
                    block
                    text-[11px]
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="
                    input-krauq
                    h-9
                    w-full
                    px-3
                    text-xs
                    placeholder:text-[var(--color-text-muted)]
                  "
                />
              </div>

            </div>
          </section>

          {/* Shipping */}
          <section
            className="
              rounded-[6px]
              border border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-5
              sm:p-6
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-[4px]
                  bg-[var(--color-bg)]
                  text-[var(--color-text-muted)]
                "
              >
                <MapPin
                  size={15}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <h2
                  className="
                    text-sm
                    font-medium
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  Shipping address
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">

              <div>
                <label
                  htmlFor="address"
                  className="
                    mb-1.5
                    block
                    text-[11px]
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address, building, apartment, etc."
                  rows={3}
                  required
                  className="
                    input-krauq
                    min-h-[84px]
                    w-full
                    resize-none
                    px-3
                    py-2.5
                    text-xs
                    placeholder:text-[var(--color-text-muted)]
                  "
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="city"
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Jakarta"
                    required
                    className="
                      input-krauq
                      h-9
                      w-full
                      px-3
                      text-xs
                      placeholder:text-[var(--color-text-muted)]
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    Postal code
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                    required
                    className="
                      input-krauq
                      h-9
                      w-full
                      px-3
                      text-xs
                      placeholder:text-[var(--color-text-muted)]
                    "
                  />
                </div>

              </div>
            </div>
          </section>

          {/* Payment */}
          <section
            className="
              rounded-[6px]
              border border-[var(--color-border)]
              bg-[var(--color-surface)]
              p-5
              sm:p-6
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-[4px]
                  bg-[var(--color-bg)]
                  text-[var(--color-text-muted)]
                "
              >
                <CreditCard
                  size={15}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <h2
                  className="
                    text-sm
                    font-medium
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  Payment method
                </h2>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Select your preferred payment method.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-[4px]
                  border
                  border-[var(--color-border)]
                  p-3
                  transition-colors
                  has-[:checked]:border-[var(--color-text)]
                "
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={
                    form.paymentMethod === 'bank_transfer'
                  }
                  onChange={handleChange}
                  className="accent-[var(--color-text)]"
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    Bank transfer
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-[var(--color-text-muted)]
                    "
                  >
                    Pay via bank transfer
                  </p>
                </div>
              </label>

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-[4px]
                  border
                  border-[var(--color-border)]
                  p-3
                  transition-colors
                  has-[:checked]:border-[var(--color-text)]
                "
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={
                    form.paymentMethod === 'cash_on_delivery'
                  }
                  onChange={handleChange}
                  className="accent-[var(--color-text)]"
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    Cash on delivery
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-[var(--color-text-muted)]
                    "
                  >
                    Pay when your order arrives
                  </p>
                </div>
              </label>

            </div>
          </section>
        </div>

        {/* Right - Order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section
            className="
              overflow-hidden
              rounded-[6px]
              border border-[var(--color-border)]
              bg-[var(--color-surface)]
            "
          >
            <div className="border-b border-[var(--color-border)] p-5">
              <h2
                className="
                  text-sm
                  font-medium
                  tracking-[-0.02em]
                  text-[var(--color-text)]
                "
              >
                Order summary
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-[var(--color-text-muted)]
                "
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Items */}
            <div className="divide-y divide-[var(--color-border)]">
              {items.map((item) => {
                const primaryImage =
                  item.product?.images?.find(
                    (image) => image.is_primary
                  )?.url ||
                  item.product?.images?.[0]?.url

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-4"
                  >
                    <div
                      className="
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-[4px]
                        bg-[var(--color-bg)]
                      "
                    >
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={item.product.name}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            text-[9px]
                            text-[var(--color-text-muted)]
                          "
                        >
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          text-xs
                          font-medium
                          text-[var(--color-text)]
                        "
                        title={item.product.name}
                      >
                        {item.product.name}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-[var(--color-text-muted)]
                        "
                      >
                        {item.quantity} ×{' '}
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <p
                      className="
                        shrink-0
                        text-xs
                        font-medium
                        text-[var(--color-text)]
                      "
                    >
                      {formatPrice(
                        item.product.price * item.quantity
                      )}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-[var(--color-border)] p-5">

              <div className="flex items-center justify-between">
                <span
                  className="
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  Subtotal
                </span>

                <span
                  className="
                    text-xs
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
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
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  {formatPrice(shipping)}
                </span>
              </div>

              <div
                className="
                  my-4
                  border-t
                  border-[var(--color-border)]
                "
              />

              <div className="flex items-center justify-between">
                <span
                  className="
                    text-sm
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-base
                    font-medium
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-5
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-[4px]
                  bg-[var(--color-text)]
                  px-4
                  text-xs
                  font-medium
                  text-[var(--color-surface)]
                  transition-opacity
                  hover:opacity-80
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSubmitting
                  ? 'Processing...'
                  : 'Place order'}
              </button>

              <p
                className="
                  mt-3
                  text-center
                  text-[9px]
                  leading-relaxed
                  text-[var(--color-text-muted)]
                "
              >
                By placing this order, you agree to the
                terms and conditions.
              </p>

            </div>
          </section>
        </aside>
      </div>
    </form>
  )
}

export default Checkout