import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Clock3,
  Package,
  Truck,
  X,
} from 'lucide-react'

import { dummyOrders } from '../data/dummyProducts'
import { api } from '../services/api'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    paid: 'Paid',
    shipped: 'Shipped',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  return labels[status] || status
}

function getStatusIcon(status) {
  const icons = {
    pending: Clock3,
    paid: Check,
    shipped: Truck,
    completed: Check,
    cancelled: X,
  }

  return icons[status] || Package
}

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchOrder() {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await api.getMyOrder(id)
          if (res?.data && isMounted) {
            const o = res.data
            setOrder({
              id: o.id,
              order_number: o.order_number,
              status: o.status,
              total: o.total_amount,
              created_at: o.created_at,
              customer: {
                id: o.user_id,
                name: 'My Account',
              },
              items: (o.items || []).map((it) => ({
                id: it.id,
                product_id: it.product_id,
                product_name: it.product_name,
                quantity: it.quantity,
                price: it.price,
              })),
            })
            setLoading(false)
            return
          }
        } catch {
          // Fallback to dummy
        }
      }

      if (isMounted) {
        const found = dummyOrders.find((item) => String(item.id) === String(id))
        setOrder(found || null)
        setLoading(false)
      }
    }

    fetchOrder()

    return () => {
      isMounted = false
    }
  }, [id])

  if (!order) {
    return (
      <div className="space-y-6">

        <Link
          to="/orders"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.7}
          />

          Back to orders
        </Link>

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
          <p className="text-sm font-medium">
            Order not found
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            The order you're looking for does not exist.
          </p>
        </div>

      </div>
    )
  }

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <div className="space-y-8">

      {/* Back */}
      <Link
        to="/orders"
        className="
          inline-flex
          items-center
          gap-2
          text-xs
          text-[var(--color-text-muted)]
          transition-colors
          hover:text-[var(--color-text)]
        "
      >
        <ArrowLeft
          size={15}
          strokeWidth={1.7}
        />

        Back to orders
      </Link>

      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
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
            Order
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
            #{order.order_number}
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[var(--color-text-muted)]
            "
          >
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Status */}
        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-[4px]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3
            py-2
          "
        >
          {(() => {
            const Icon = getStatusIcon(order.status)
            return <Icon size={15} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
          })()}

          <span
            className="
              text-xs
              font-medium
              text-[var(--color-text)]
            "
          >
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* Main */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          lg:grid-cols-[1fr_320px]
        "
      >

        {/* Items */}
        <section
          className="
            overflow-hidden
            rounded-[6px]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
          "
        >
          <div
            className="
              border-b
              border-[var(--color-border)]
              px-5
              py-4
            "
          >
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[var(--color-text-muted)]
              "
            >
              Order items
            </span>

            <h2
              className="
                mt-1
                text-base
                font-medium
                tracking-[-0.025em]
              "
            >
              {totalItems}{' '}
              {totalItems === 1 ? 'item' : 'items'}
            </h2>
          </div>

          <div>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-[var(--color-border)]
                  px-5
                  py-4
                  last:border-b-0
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-[var(--color-text)]
                    "
                  >
                    {item.product_name}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[var(--color-text-muted)]
                    "
                  >
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>

                <p
                  className="
                    shrink-0
                    text-sm
                    font-medium
                    text-[var(--color-text)]
                  "
                >
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-[var(--color-border)]
              bg-[var(--color-bg)]
              px-5
              py-4
            "
          >
            <span
              className="
                text-xs
                text-[var(--color-text-muted)]
              "
            >
              Total
            </span>

            <span
              className="
                text-base
                font-medium
                text-[var(--color-text)]
              "
            >
              {formatPrice(order.total)}
            </span>
          </div>
        </section>

        {/* Customer */}
        <section
          className="
            h-fit
            rounded-[6px]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-5
          "
        >
          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[var(--color-text-muted)]
            "
          >
            Customer
          </span>

          <div className="mt-4 flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[var(--color-bg)]
                text-sm
                font-medium
                text-[var(--color-text)]
              "
            >
              {order.customer.name.charAt(0)}
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-[var(--color-text)]
                "
              >
                {order.customer.name}
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-[var(--color-text-muted)]
                "
              >
                Customer #{order.customer.id}
              </p>
            </div>

          </div>
        </section>

      </div>

    </div>
  )
}

export default OrderDetail