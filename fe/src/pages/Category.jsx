import { useMemo, useState } from 'react'
import { ArrowUpRight, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  dummyCategories,
  dummyProducts,
} from '../data/dummyProducts'

function Category() {
  const [search, setSearch] = useState('')

  const categories = useMemo(() => {
    return dummyCategories.map((category) => {
      const products = dummyProducts.filter(
        (product) => product.category_id === category.id
      )

      return {
        ...category,
        productCount: products.length,
        products,
      }
    })
  }, [])

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return categories
    }

    return categories.filter((category) =>
      `${category.name} ${category.description}`
        .toLowerCase()
        .includes(query)
    )
  }, [categories, search])

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
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
          Categories
        </h1>

        <p
          className="
            mt-1
            max-w-xl
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Organize and browse your products by category.
        </p>
      </div>

      {/* Search */}
      <div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="
            h-10
            w-full
            rounded-[4px]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3
            text-sm
            text-[var(--color-text)]
            outline-none
            transition-colors
            placeholder:text-[var(--color-text-muted)]
            focus:border-[var(--color-text-muted)]
            sm:max-w-sm
          "
        />
      </div>

      {/* Category count */}
      <div className="flex items-center justify-between">
        <div>
          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[var(--color-text-muted)]
            "
          >
            Collection
          </span>

          <h2
            className="
              mt-1
              text-xl
              font-medium
              tracking-[-0.035em]
            "
          >
            All Categories
          </h2>
        </div>

        <span className="text-xs text-[var(--color-text-muted)]">
          {filteredCategories.length} categories
        </span>
      </div>

      {/* Categories */}
      {filteredCategories.length === 0 ? (
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
          <Package
            size={28}
            strokeWidth={1.5}
            className="mx-auto text-[var(--color-text-muted)]"
          />

          <p className="mt-3 text-sm font-medium">
            No categories found
          </p>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Try another search term.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {filteredCategories.map((category) => (
            <article
              key={category.id}
              className="
                group
                rounded-[6px]
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[var(--color-text-muted)]
              "
            >

              {/* Top */}
              <div className="flex items-start justify-between gap-4">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-[4px]
                    bg-[var(--color-bg)]
                    text-[var(--color-text-muted)]
                  "
                >
                  <Package
                    size={17}
                    strokeWidth={1.5}
                  />
                </div>

                <Link
                  to={`/products?category=${category.id}`}
                  aria-label={`View ${category.name} products`}
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
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

              {/* Content */}
              <div className="mt-5">

                <h3
                  className="
                    text-base
                    font-medium
                    tracking-[-0.025em]
                    text-[var(--color-text)]
                  "
                >
                  {category.name}
                </h3>

                <p
                  className="
                    mt-1
                    line-clamp-2
                    text-xs
                    leading-5
                    text-[var(--color-text-muted)]
                  "
                >
                  {category.description}
                </p>

              </div>

              {/* Bottom */}
              <div
                className="
                  mt-5
                  border-t
                  border-[var(--color-border)]
                  pt-4
                "
              >
                <span className="text-xs text-[var(--color-text-muted)]">
                  {category.productCount}{' '}
                  {category.productCount === 1
                    ? 'product'
                    : 'products'}
                </span>
              </div>

            </article>
          ))}
        </div>
      )}

    </div>
  )
}

export default Category