import { ArrowUpRight, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product, onAddToCart }) {
  const primaryImage =
    product.images?.find((image) => image.is_primary)?.url ||
    product.images?.[0]?.url

  const isOutOfStock = product.stock <= 0

  return (
    <article
      className="
        group
        min-w-0
        overflow-hidden
        rounded-[6px]
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-[var(--color-text-muted)]
      "
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg)]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="
              h-full w-full
              object-cover
              transition-transform duration-500
              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-[var(--color-text-muted)]">
              No image
            </span>
          </div>
        )}

        {/* Stock status */}
        {isOutOfStock && (
          <div
            className="
              absolute inset-0
              flex items-center justify-center
              bg-black/35
            "
          >
            <span className="text-xs font-medium text-white">
              Out of stock
            </span>
          </div>
        )}

        {/* Quick action */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            aria-label={`Add ${product.name} to cart`}
            className="
              absolute
              bottom-3 right-3
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-[var(--color-surface)]
              text-[var(--color-text)]
              opacity-0
              shadow-sm
              transition-all duration-200
              hover:scale-105
              group-hover:opacity-100
              max-sm:opacity-100
            "
          >
            <ShoppingCart
              size={16}
              strokeWidth={1.7}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category?.name && (
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-[var(--color-text-muted)]
            "
          >
            {product.category.name}
          </span>
        )}

        {/* Product name */}
        <h3
          className="
    mt-1.5
    truncate
    text-sm
    font-medium
    tracking-[-0.02em]
    text-[var(--color-text)]
  "
          title={product.name}
        >
          <Link
            to={`/products/${product.id}`}
            className="transition-opacity hover:opacity-60"
          >
            {product.name}
          </Link>
        </h3>

        {/* Bottom */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {formatPrice(product.price)}
            </p>

            {!isOutOfStock && product.stock <= 5 && (
              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                Only {product.stock} left
              </p>
            )}
          </div>

          <Link
            to={`/products/${product.id}`}
            aria-label={`View ${product.name}`}
            className="
    flex h-7 w-7
    shrink-0
    items-center justify-center
    rounded-[3px]
    text-[var(--color-text-muted)]
    transition-colors
    hover:bg-[var(--color-bg)]
    hover:text-[var(--color-text)]
  "
          >
            <ArrowUpRight
              size={15}
              strokeWidth={1.7}
            />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

