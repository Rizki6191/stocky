import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import ProductGrid from '../components/ProductGrid'
import CategorySection from '../components/CategorySection'

import {
  dummyCategories,
  dummyProducts,
} from '../data/dummyProducts'

import { useCart } from '../context/CartContext'

function Product() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { addToCart } = useCart()

  const categoryParam = searchParams.get('category')

  const selectedCategory =
    categoryParam !== null
      ? Number(categoryParam)
      : null

  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) {
      return dummyProducts
    }

    return dummyProducts.filter(
      (product) =>
        product.category_id === selectedCategory
    )
  }, [selectedCategory])

  const handleCategoryChange = (categoryId) => {
    if (categoryId === null) {
      setSearchParams({})
      return
    }

    setSearchParams({
      category: String(categoryId),
    })
  }

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
          Products
        </h1>

        <p
          className="
            mt-1
            max-w-xl
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Browse and manage products available in your store.
        </p>
      </div>

      {/* Categories */}
      <CategorySection
        categories={dummyCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products */}
      <ProductGrid
        products={filteredProducts}
        onAddToCart={addToCart}
      />

    </div>
  )
}

export default Product