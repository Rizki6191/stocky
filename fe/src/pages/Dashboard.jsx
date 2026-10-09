import { useMemo, useState } from 'react'

import Banner from '../components/Banner'
import CategorySection from '../components/CategorySection'
import ProductGrid from '../components/ProductGrid'

import {
  dummyCategories,
  dummyProducts,
} from '../data/dummyProducts'

import { useCart } from '../context/CartContext'

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { addToCart } = useCart()

  const filteredProducts = useMemo(() => {
    if (selectedCategory === null) {
      return dummyProducts
    }

    return dummyProducts.filter(
      (product) =>
        product.category_id === selectedCategory
    )
  }, [selectedCategory])

  return (
    <div className="space-y-10">

      <Banner />

      <CategorySection
        categories={dummyCategories}
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