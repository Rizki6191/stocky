import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import ProductGrid from '../components/ProductGrid'
import CategorySection from '../components/CategorySection'

import {
  dummyCategories,
  dummyProducts,
} from '../data/dummyProducts'

import { useCart } from '../context/CartContext'
import { api } from '../services/api'

function Product() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()

  const [categories, setCategories] = useState(dummyCategories)
  const [products, setProducts] = useState(dummyProducts)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          api.getProducts(),
          api.getCategories(),
        ])

        if (isMounted) {
          if (prodRes.status === 'fulfilled' && prodRes.value?.data?.length > 0) {
            setProducts(prodRes.value.data)
          }
          if (catRes.status === 'fulfilled' && catRes.value?.data?.length > 0) {
            setCategories(catRes.value.data)
          }
        }
      } catch {
        // use fallback
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const categoryParam = searchParams.get('category')

  const selectedCategory =
    categoryParam !== null
      ? Number(categoryParam)
      : null

  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) {
      return products
    }

    return products.filter(
      (product) =>
        product.category_id === selectedCategory
    )
  }, [products, selectedCategory])

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
        categories={categories}
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