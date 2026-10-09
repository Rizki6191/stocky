import ProductCard from './ProductCard'

function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onAddToCart,
}) {
  if (loading) {
    return (
      <section>
        <div className="mb-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Store
          </span>

          <h2 className="mt-1 text-xl font-medium tracking-[-0.035em]">
            Products
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="
                overflow-hidden
                rounded-[6px]
                border border-[var(--color-border)]
                bg-[var(--color-surface)]
              "
            >
              <div className="aspect-square animate-pulse bg-[var(--color-bg)]" />

              <div className="space-y-2 p-4">
                <div className="h-2 w-16 animate-pulse rounded bg-[var(--color-border)]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-border)]" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--color-border)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="
          rounded-[6px]
          border border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-8
          text-center
        "
      >
        <p className="text-sm font-medium text-[var(--color-text)]">
          Unable to load products
        </p>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {error}
        </p>
      </section>
    )
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Store
          </span>

          <h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-[var(--color-text)]">
            Products
          </h2>
        </div>

        <span className="text-xs text-[var(--color-text-muted)]">
          {products.length} products
        </span>
      </div>

      {/* Empty */}
      {products.length === 0 ? (
        <div
          className="
            rounded-[6px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-12
            text-center
          "
        >
          <p className="text-sm font-medium text-[var(--color-text)]">
            No products found
          </p>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Try selecting another category.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            sm:gap-4
            lg:grid-cols-4
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductGrid
