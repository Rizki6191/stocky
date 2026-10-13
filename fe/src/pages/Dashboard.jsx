import { useEffect, useMemo, useState } from 'react'

import Banner from '../components/Banner'
import CategorySection from '../components/CategorySection'
import ProductGrid from '../components/ProductGrid'

import {
  dummyCategories,
  dummyProducts,
} from '../data/dummyProducts'

import { useCart } from '../context/CartContext'
import { api } from '../services/api'

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categories, setCategories] = useState(dummyCategories)
  const [products, setProducts] = useState(dummyProducts)

  const { addToCart } = useCart()

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
        // fallback
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) {
      return products
    }

    return products.filter(
      (product) =>
        product.category_id === selectedCategory
    )
  }, [products, selectedCategory])

  return (
    <div className="space-y-10">

      <Banner />

      <CategorySection
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ProductGrid
        products={filteredProducts}
        onAddToCart={addToCart}
      />

    </div>
  )
}

export default Dashboard