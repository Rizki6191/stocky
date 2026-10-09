import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react'

import { dummyProducts } from '../data/dummyProducts'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductDetail() {
  const { id } = useParams()

  const [quantity, setQuantity] = useState(1)

  const product = useMemo(() => {
    return dummyProducts.find(
      (item) => String(item.id) === String(id)
    )
  }, [id])

  if (!product) {
    return (
      <div className="space-y-6">

        <Link
          to="/products"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div
          className="
            rounded-[6px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-12
            text-center
          "
        >
          <h1 className="text-lg font-medium">
            Product not found
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            The product you're looking for doesn't exist.
          </p>
        </div>

      </div>
    )
  }

  const primaryImage =
    product.images?.find(
      (image) => image.is_primary
    )?.url ||
    product.images?.[0]?.url

  const isOutOfStock = product.stock <= 0

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(product.stock, current + 1)
    )
  }

  const handleAddToCart = () => {
    console.log('Add to cart:', {
      product,
      quantity,
    })
  }

  return (
    <div className="space-y-8">

      {/* Back */}
      <Link
        to="/products"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-[var(--color-text-muted)]
          transition-colors
          hover:text-[var(--color-text)]
        "
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      {/* Product */}
      <div
        className="
          grid
          grid-cols-1
          gap-6
          lg:grid-cols-[minmax(0,1fr)_380px]
        "
      >

        {/* Image */}
        <section
          className="
            overflow-hidden
            rounded-[6px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
          "
        >
          <div
            className="
              flex
              aspect-square
              max-h-[680px]
              items-center
              justify-center
              bg-[var(--color-bg)]
              p-8
              sm:p-12
            "
          >
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.name}
                className="
                  h-full
                  w-full
                  object-contain
                "
              />
            ) : (
              <span className="text-sm text-[var(--color-text-muted)]">
                No image available
              </span>
            )}
          </div>
        </section>

        {/* Information */}
        <section
          className="
            h-fit
            rounded-[6px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-6
            lg:sticky
            lg:top-24
          "
        >

          {/* Category */}
          {product.category?.name && (
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[var(--color-text-muted)]
              "
            >
              {product.category.name}
            </span>
          )}

          {/* Name */}
          <h1
            className="
              mt-2
              text-3xl
              font-medium
              tracking-[-0.05em]
              text-[var(--color-text)]
            "
          >
            {product.name}
          </h1>

          {/* Price */}
          <p
            className="
              mt-6
              text-2xl
              font-medium
              tracking-[-0.04em]
              text-[var(--color-text)]
            "
          >
            {formatPrice(product.price)}
          </p>

          {/* Description */}
          <div
            className="
              mt-6
              border-t
              border-[var(--color-border)]
              pt-6
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
              Description
            </span>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-[var(--color-text-muted)]
              "
            >
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              border-y
              border-[var(--color-border)]
              py-4
            "
          >
            <span className="text-sm text-[var(--color-text-muted)]">
              Stock
            </span>

            <span
              className={`
                text-sm
                font-medium
                ${
                  isOutOfStock
                    ? 'text-red-500'
                    : 'text-[var(--color-text)]'
                }
              `}
            >
              {isOutOfStock
                ? 'Out of stock'
                : `${product.stock} available`}
            </span>
          </div>

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="mt-6">

              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-[var(--color-text-muted)]
                "
              >
                Quantity
              </span>

              <div
                className="
                  mt-3
                  flex
                  h-10
                  w-fit
                  items-center
                  rounded-[4px]
                  border
                  border-[var(--color-border)]
                "
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="
                    flex
                    h-full
                    w-10
                    items-center
                    justify-center
                    text-[var(--color-text-muted)]
                    transition-colors
                    hover:text-[var(--color-text)]
                    disabled:opacity-30
                  "
                >
                  <Minus size={14} />
                </button>

                <span
                  className="
                    w-10
                    text-center
                    text-sm
                    font-medium
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="
                    flex
                    h-full
                    w-10
                    items-center
                    justify-center
                    text-[var(--color-text-muted)]
                    transition-colors
                    hover:text-[var(--color-text)]
                    disabled:opacity-30
                  "
                >
                  <Plus size={14} />
                </button>
              </div>

            </div>
          )}

          {/* Cart */}
          <button
            type="button"
            disabled={isOutOfStock || !product.is_active}
            onClick={handleAddToCart}
            className="
              mt-6
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-[4px]
              bg-[var(--color-text)]
              px-4
              text-sm
              font-medium
              text-[var(--color-bg)]
              transition-opacity
              hover:opacity-85
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ShoppingCart
              size={16}
              strokeWidth={1.7}
            />

            {isOutOfStock
              ? 'Out of Stock'
              : 'Add to Cart'}
          </button>

        </section>

      </div>
    </div>
  )
}

export default ProductDetail