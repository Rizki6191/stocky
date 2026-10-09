import { ChevronRight } from 'lucide-react'

function CategorySection({
  categories = [],
  selectedCategory = null,
  onCategoryChange,
}) {
  return (
    <section className="w-full">
      {/* Section header */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Browse
          </span>

          <h2 className="mt-1 text-xl font-medium tracking-[-0.035em] text-[var(--color-text)]">
            Categories
          </h2>
        </div>

        <button
          type="button"
          className="
            group
            flex items-center gap-1
            text-xs font-medium
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          View all

          <ChevronRight
            size={14}
            strokeWidth={1.7}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* All */}
        <button
          type="button"
          onClick={() => onCategoryChange?.(null)}
          className={`
            shrink-0
            rounded-[4px]
            border
            px-4 py-2.5
            text-xs font-medium
            transition-all duration-150
            ${
              selectedCategory === null
                ? `
                  border-[var(--color-accent)]
                  bg-[var(--color-accent)]
                  text-white
                  dark:border-[var(--color-accent)]
                  dark:text-[#141711]
                `
                : `
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                  text-[var(--color-text-muted)]
                  hover:border-[var(--color-text-muted)]
                  hover:text-[var(--color-text)]
                `
            }
          `}
        >
          All products
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.id

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange?.(category.id)}
              className={`
                shrink-0
                rounded-[4px]
                border
                px-4 py-2.5
                text-xs font-medium
                transition-all duration-150
                ${
                  isSelected
                    ? `
                      border-[var(--color-accent)]
                      bg-[var(--color-accent)]
                      text-white
                      dark:text-[#141711]
                    `
                    : `
                      border-[var(--color-border)]
                      bg-[var(--color-surface)]
                      text-[var(--color-text-muted)]
                      hover:border-[var(--color-text-muted)]
                      hover:text-[var(--color-text)]
                    `
                }
              `}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySection

