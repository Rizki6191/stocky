export const dummyCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
  },
  {
    id: 2,
    name: 'Fashion',
    description: 'Clothing and fashion accessories',
  },
  {
    id: 3,
    name: 'Home & Living',
    description: 'Products for your home',
  },
  {
    id: 4,
    name: 'Books',
    description: 'Books and reading materials',
  },
  {
    id: 5,
    name: 'Accessories',
    description: 'Useful everyday accessories',
  },
]

export const dummyProducts = [
  {
    id: 1,
    name: 'Mechanical Keyboard',
    description: 'Compact mechanical keyboard with tactile switches.',
    price: 850000,
    stock: 12,
    is_active: true,

    category_id: 1,

    category: {
      id: 1,
      name: 'Electronics',
    },

    images: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=900&auto=format&fit=crop',
        is_primary: true,
        sort_order: 0,
      },
    ],
  },

  {
    id: 2,
    name: 'Wireless Headphones',
    description: 'Wireless headphones with comfortable over-ear design.',
    price: 1250000,
    stock: 8,
    is_active: true,

    category_id: 1,

    category: {
      id: 1,
      name: 'Electronics',
    },

    images: [
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop',
        is_primary: true,
        sort_order: 0,
      },
    ],
  },

  {
    id: 3,
    name: 'Minimal Backpack',
    description: 'Minimal everyday backpack with multiple compartments.',
    price: 450000,
    stock: 20,
    is_active: true,

    category_id: 2,

    category: {
      id: 2,
      name: 'Fashion',
    },

    images: [
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop',
        is_primary: true,
        sort_order: 0,
      },
    ],
  },

  {
    id: 4,
    name: 'Desk Lamp',
    description: 'Simple adjustable desk lamp for your workspace.',
    price: 280000,
    stock: 15,
    is_active: true,

    category_id: 3,

    category: {
      id: 3,
      name: 'Home & Living',
    },

    images: [
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop',
        is_primary: true,
        sort_order: 0,
      },
    ],
  },

  {
    id: 5,
    name: 'Clean Code',
    description: 'A practical book about writing clean and maintainable software.',
    price: 320000,
    stock: 7,
    is_active: true,

    category_id: 4,

    category: {
      id: 4,
      name: 'Books',
    },

    images: [
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=900&auto=format&fit=crop',
        is_primary: true,
        sort_order: 0,
      },
    ],
  },

  {
    id: 6,
    name: 'Everyday Watch',
    description: 'Minimal watch designed for everyday use.',
    price: 675000,
    stock: 5,
    is_active: true,

    category_id: 5,

    category: {
      id: 5,
      name: 'Accessories',
    },

    images: [
      {
        id: 6,
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop',
        is_primary: true,
        sort_order: 0,
      },
    ],
  },
]

export const dummyOrders = [
  {
    id: 1,
    order_number: 'ORD-001',
    customer: {
      id: 1,
      name: 'John Doe',
    },
    status: 'paid',
    total: 2100000,
    created_at: '2026-10-07T10:30:00Z',
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: 'Mechanical Keyboard',
        quantity: 1,
        price: 850000,
      },
      {
        id: 2,
        product_id: 2,
        product_name: 'Wireless Headphones',
        quantity: 1,
        price: 1250000,
      },
    ],
  },

  {
    id: 2,
    order_number: 'ORD-002',
    customer: {
      id: 2,
      name: 'Jane Doe',
    },
    status: 'pending',
    total: 450000,
    created_at: '2026-10-07T08:15:00Z',
    items: [
      {
        id: 3,
        product_id: 3,
        product_name: 'Minimal Backpack',
        quantity: 1,
        price: 450000,
      },
    ],
  },

  {
    id: 3,
    order_number: 'ORD-003',
    customer: {
      id: 3,
      name: 'Alex Smith',
    },
    status: 'shipped',
    total: 600000,
    created_at: '2026-10-06T14:20:00Z',
    items: [
      {
        id: 4,
        product_id: 4,
        product_name: 'Desk Lamp',
        quantity: 1,
        price: 280000,
      },
      {
        id: 5,
        product_id: 5,
        product_name: 'Clean Code',
        quantity: 1,
        price: 320000,
      },
    ],
  },

  {
    id: 4,
    order_number: 'ORD-004',
    customer: {
      id: 4,
      name: 'Michael Brown',
    },
    status: 'completed',
    total: 675000,
    created_at: '2026-10-05T16:45:00Z',
    items: [
      {
        id: 6,
        product_id: 6,
        product_name: 'Everyday Watch',
        quantity: 1,
        price: 675000,
      },
    ],
  },

  {
    id: 5,
    order_number: 'ORD-005',
    customer: {
      id: 5,
      name: 'Emily Wilson',
    },
    status: 'cancelled',
    total: 850000,
    created_at: '2026-10-04T11:10:00Z',
    items: [
      {
        id: 7,
        product_id: 1,
        product_name: 'Mechanical Keyboard',
        quantity: 1,
        price: 850000,
      },
    ],
  },

  {
    id: 6,
    order_number: 'ORD-006',
    customer: {
      id: 6,
      name: 'David Miller',
    },
    status: 'paid',
    total: 770000,
    created_at: '2026-10-03T09:30:00Z',
    items: [
      {
        id: 8,
        product_id: 4,
        product_name: 'Desk Lamp',
        quantity: 1,
        price: 280000,
      },
      {
        id: 9,
        product_id: 5,
        product_name: 'Clean Code',
        quantity: 1,
        price: 320000,
      },
      {
        id: 10,
        product_id: 3,
        product_name: 'Minimal Backpack',
        quantity: 1,
        price: 450000,
      },
    ],
  },
]
