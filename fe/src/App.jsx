import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Dashboard from './pages/Dashboard'
import Product from './pages/Product'
import ProductDetail from './pages/ProductDetail'
import Category from './pages/Category'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Info from './pages/Info'
import Settings from './pages/Settings'

import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function PlaceholderPage({ title }) {
  return (
    <div>
      <h1 className="text-2xl font-medium tracking-[-0.04em]">
        {title}
      </h1>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Sidebar />

          <div className="min-h-screen pl-16 bg-[var(--color-bg)]">

            <Header
              storeName="Stocky"
              currentPage="Dashboard"
            />

            <main className="p-6 lg:p-8">
              <Routes>

                {/* Root */}
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/dashboard"
                      replace
                    />
                  }
                />

                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

                {/* Products */}
                <Route
                  path="/products"
                  element={<Product />}
                />

                <Route
                  path="/products/:id"
                  element={<ProductDetail />}
                />

                {/* Auth */}
                <Route
                  path="/auth"
                  element={<Auth />}
                />

                {/* Cart */}
                <Route
                  path="/cart"
                  element={<Cart />}
                />

                {/* Checkout */}
                <Route
                  path="/checkout"
                  element={<Checkout />}
                />

                {/* Categories */}
                <Route
                  path="/categories"
                  element={<Category />}
                />

                {/* Orders */}
                <Route
                  path="/orders"
                  element={<Orders />}
                />

                <Route
                  path="/orders/:id"
                  element={<OrderDetail />}
                />

                {/* Other */}
                <Route
                  path="/info"
                  element={<Info />}
                />

                <Route
                  path="/settings"
                  element={<Settings />}
                />

                <Route
                  path="/profile"
                  element={<Profile />}
                />

              </Routes>
            </main>

          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App