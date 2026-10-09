import { Minus, Plus, Trash2 } from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function CartItem({
  item,
  onQuantityChange,
  onRemove,
}) {
  const primaryImage =
    item.product?.images?.find(
      (image) => image.is_primary
    )?.url ||
    item.product?.images?.[0]?.url

  const quantity = item.quantity
  const stock = item.product?.stock ?? 0

  return (
    <article
      className="
        flex
        gap-4
        border-b
        border-[var(--color-border)]
        py-5
        last:border-b-0
      "
    >
      {/* Image */}
      <div
        className="
          h-24
          w-24
          shrink-0
          overflow-hidden
          rounded-[4px]
          bg-[var(--color-bg)]
          sm:h-28
          sm:w-28
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
              text-[10px]
              text-[var(--color-text-muted)]
            "
          >
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">

            {item.product.category?.name && (
              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-[var(--color-text-muted)]
                "
              >
                {item.product.category.name}
              </span>
            )}

            <h3
              className="
                mt-1
                truncate
                text-sm
                font-medium
                tracking-[-0.02em]
                text-[var(--color-text)]
              "
              title={item.product.name}
            >
              {item.product.name}
            </h3>

          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove?.(item.product.id)}
            aria-label={`Remove ${item.product.name}`}
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-[3px]
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-bg)]
              hover:text-[var(--color-text)]
            "
          >
            <Trash2
              size={15}
              strokeWidth={1.6}
            />
          </button>

        </div>

        {/* Price */}
        <p
          className="
            mt-2
            text-sm
            font-medium
            text-[var(--color-text)]
          "
        >
          {formatPrice(item.product.price)}
        </p>

        {/* Bottom */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
          "
        >

          {/* Quantity */}
          <div
            className="
              flex
              h-8
              items-center
              rounded-[4px]
              border
              border-[var(--color-border)]
            "
          >
            <button
              type="button"
              onClick={() =>
                onQuantityChange?.(
                  item.product.id,
                  quantity - 1
                )
              }
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="
                flex
                h-full
                w-8
                items-center
                justify-center
                text-[var(--color-text-muted)]
                transition-colors
                hover:text-[var(--color-text)]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Minus
                size={13}
                strokeWidth={1.7}
              />
            </button>

            <span
              className="
                min-w-8
                text-center
                text-xs
                font-medium
                text-[var(--color-text)]
              "
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                onQuantityChange?.(
                  item.product.id,
                  quantity + 1
                )
              }
              disabled={quantity >= stock}
              aria-label="Increase quantity"
              className="
                flex
                h-full
                w-8
                items-center
                justify-center
                text-[var(--color-text-muted)]
                transition-colors
                hover:text-[var(--color-text)]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Plus
                size={13}
                strokeWidth={1.7}
              />
            </button>
          </div>

          {/* Subtotal */}
          <p
            className="
              text-sm
              font-medium
              text-[var(--color-text)]
            "
          >
            {formatPrice(
              item.product.price * quantity
            )}
          </p>

        </div>

        {stock > 0 && stock <= 5 && (
          <p
            className="
              mt-2
              text-[10px]
              text-[var(--color-text-muted)]
            "
          >
            Only {stock} left
          </p>
        )}

      </div>
    </article>
  )
}

export default CartItem