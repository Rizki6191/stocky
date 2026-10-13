const BASE_URL = ''

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  // Auth
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  refresh: (refreshToken) =>
    request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
  logout: (refreshToken) =>
    request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
  getMe: () => request('/api/auth/me'),
  updateProfile: (body) => request('/api/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/api/auth/password', { method: 'PUT', body: JSON.stringify(body) }),

  // Products
  getProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),

  // Categories
  getCategories: () => request('/api/categories'),
  getCategory: (id) => request(`/api/categories/${id}`),

  // Banners
  getBanners: () => request('/api/banners'),
  getBanner: (id) => request(`/api/banners/${id}`),

  // Cart
  getCart: () => request('/api/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: Number(productId), quantity }),
    }),
  updateCartItem: (itemId, quantity) =>
    request(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (itemId) =>
    request(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    }),
  clearCart: () =>
    request('/api/cart', {
      method: 'DELETE',
    }),

  // Orders
  checkout: () => request('/api/orders/checkout', { method: 'POST' }),
  getMyOrders: () => request('/api/orders'),
  getMyOrder: (id) => request(`/api/orders/${id}`),
}
