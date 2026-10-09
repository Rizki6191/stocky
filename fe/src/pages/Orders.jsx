import { useMemo, useState } from 'react'
import {
    ChevronDown,
    Search,
} from 'lucide-react'

import { dummyOrders } from '../data/dummyProducts'
import { Link } from 'react-router-dom'

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
        month: 'short',
        year: 'numeric',
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

function Orders() {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase()

        return dummyOrders.filter((order) => {
            const matchesSearch =
                !query ||
                order.order_number.toLowerCase().includes(query) ||
                order.customer.name.toLowerCase().includes(query)

            const matchesStatus =
                status === 'all' ||
                order.status === status

            return matchesSearch && matchesStatus
        })
    }, [search, status])

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
                    Orders
                </h1>

                <p
                    className="
            mt-1
            max-w-xl
            text-sm
            text-[var(--color-text-muted)]
          "
                >
                    Track and manage customer orders.
                </p>
            </div>

            {/* Filters */}
            <div
                className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
            >

                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={16}
                        strokeWidth={1.7}
                        className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[var(--color-text-muted)]
            "
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search orders..."
                        className="
              h-10
              w-full
              rounded-[4px]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              pl-9
              pr-3
              text-sm
              text-[var(--color-text)]
              outline-none
              transition-colors
              placeholder:text-[var(--color-text-muted)]
              focus:border-[var(--color-text-muted)]
            "
                    />
                </div>

                {/* Status */}
                <div className="relative">
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="
              h-10
              w-full
              appearance-none
              rounded-[4px]
              border
              border-[var(--color-border)]
              bg-[var(--color-surface)]
              pl-3
              pr-9
              text-sm
              text-[var(--color-text)]
              outline-none
              transition-colors
              focus:border-[var(--color-text-muted)]
              sm:w-40
            "
                    >
                        <option value="all">All status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <ChevronDown
                        size={15}
                        strokeWidth={1.7}
                        className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-[var(--color-text-muted)]
            "
                    />
                </div>
            </div>

            {/* Results */}
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
                        Orders
                    </span>

                    <h2
                        className="
              mt-1
              text-xl
              font-medium
              tracking-[-0.035em]
              text-[var(--color-text)]
            "
                    >
                        Recent Orders
                    </h2>
                </div>

                <span className="text-xs text-[var(--color-text-muted)]">
                    {filteredOrders.length} orders
                </span>
            </div>

            {/* Empty */}
            {filteredOrders.length === 0 ? (
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
                        No orders found
                    </p>

                    <p
                        className="
              mt-1
              text-xs
              text-[var(--color-text-muted)]
            "
                    >
                        Try another search or status filter.
                    </p>
                </div>
            ) : (
                <div
                    className="
            overflow-hidden
            rounded-[6px]
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
          "
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] border-collapse">

                            {/* Head */}
                            <thead>
                                <tr
                                    className="
                    border-b
                    border-[var(--color-border)]
                  "
                                >
                                    <th
                                        className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                                    >
                                        Order
                                    </th>

                                    <th
                                        className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                                    >
                                        Customer
                                    </th>

                                    <th
                                        className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                                    >
                                        Items
                                    </th>

                                    <th
                                        className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                                    >
                                        Total
                                    </th>

                                    <th
                                        className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                                    >
                                        Status
                                    </th>

                                    <th
                                        className="
                      px-5
                      py-3
                      text-left
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                                    >
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="
                      border-b
                      border-[var(--color-border)]
                      last:border-b-0
                      transition-colors
                      hover:bg-[var(--color-bg)]
                    "
                                    >
                                        <td className="px-5 py-4">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="
      text-sm
      font-medium
      text-[var(--color-text)]
      transition-opacity
      hover:opacity-60
    "
                                            >
                                                #{order.order_number}
                                            </Link>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="
                          text-sm
                          text-[var(--color-text)]
                        "
                                            >
                                                {order.customer.name}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="
                          text-xs
                          text-[var(--color-text-muted)]
                        "
                                            >
                                                {order.items.reduce(
                                                    (total, item) => total + item.quantity,
                                                    0
                                                )}{' '}
                                                items
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="
                          text-sm
                          font-medium
                          text-[var(--color-text)]
                        "
                                            >
                                                {formatPrice(order.total)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="
                          inline-flex
                          rounded-[3px]
                          border
                          border-[var(--color-border)]
                          px-2
                          py-1
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.08em]
                          text-[var(--color-text-muted)]
                        "
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="
                          text-xs
                          text-[var(--color-text-muted)]
                        "
                                            >
                                                {formatDate(order.created_at)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Orders