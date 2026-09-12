'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered'

export type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  customerPhone: string
  address: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

export type NewOrderInput = {
  customerPhone: string
  address: string
  items: OrderItem[]
}

type OrderStoreValue = {
  orders: Order[]
  addOrder: (input: NewOrderInput) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
  getOrder: (id: string) => Order | undefined
}

const OrderStoreContext = createContext<OrderStoreValue | null>(null)

function calcTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function seedOrder(
  id: string,
  status: OrderStatus,
  minutesAgo: number,
  customerPhone: string,
  address: string,
  items: OrderItem[],
): Order {
  return {
    id,
    customerPhone,
    address,
    items,
    totalAmount: calcTotal(items),
    status,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  }
}

// Seed data spans every stage of the pipeline, so the chef, delivery and
// owner dashboards each have something real to show on first load.
const seedOrders: Order[] = [
  seedOrder('YUM-1001', 'Pending', 6, '0301-2345678', 'House 12, Street 4, Wah Cantt', [
    { id: 'celebration-cake', name: 'Celebration Cake', quantity: 1, price: 3200 },
    { id: 'fresh-pastries', name: 'Fresh Pastries', quantity: 4, price: 180 },
  ]),
  seedOrder('YUM-1002', 'Preparing', 18, '0333-9876543', 'Flat 3B, Nawababad, Wah', [
    { id: 'gulab-jamun', name: 'Gulab Jamun', quantity: 2, price: 900 },
  ]),
  seedOrder('YUM-1003', 'Ready', 32, '0345-1122334', 'Shop 7, Kamra Road, Attock', [
    { id: 'bucket-8pc', name: '8-Piece Family Bucket', quantity: 1, price: 2100 },
    { id: 'fresh-juices', name: 'Fresh Juices', quantity: 2, price: 320 },
  ]),
  seedOrder('YUM-1004', 'Out for Delivery', 47, '0312-4455667', 'House 88, Lalarukh, Wah', [
    { id: 'red-velvet', name: 'Red Velvet Cake', quantity: 1, price: 2600 },
  ]),
  seedOrder('YUM-1005', 'Delivered', 95, '0300-7788990', 'Ameen Plaza, G.T Road, Haripur', [
    { id: 'zinger-burger', name: 'Crunchy Zinger Burger', quantity: 3, price: 480 },
    { id: 'milkshakes', name: 'Milkshakes & Iced Coffee', quantity: 3, price: 420 },
  ]),
  seedOrder('YUM-1006', 'Delivered', 140, '0321-6543210', 'Bank Road, Main Bazar, Hazro', [
    { id: 'mixed-barfi', name: 'Mixed Barfi / Mithai', quantity: 1, price: 1400 },
    { id: 'desi-ghee-laddu', name: 'Desi Ghee Laddu', quantity: 1, price: 1200 },
  ]),
]

export function OrderStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const sequenceRef = useRef(seedOrders.length)

  const addOrder = useCallback((input: NewOrderInput) => {
    sequenceRef.current += 1
    const order: Order = {
      id: `YUM-${1000 + sequenceRef.current}`,
      customerPhone: input.customerPhone,
      address: input.address,
      items: input.items,
      totalAmount: calcTotal(input.items),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    return order
  }, [])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }, [])

  const getOrder = useCallback(
    (id: string) => orders.find((order) => order.id === id),
    [orders],
  )

  const value = useMemo<OrderStoreValue>(
    () => ({ orders, addOrder, updateOrderStatus, getOrder }),
    [orders, addOrder, updateOrderStatus, getOrder],
  )

  return <OrderStoreContext.Provider value={value}>{children}</OrderStoreContext.Provider>
}

export function useOrderStore() {
  const ctx = useContext(OrderStoreContext)
  if (!ctx) throw new Error('useOrderStore must be used within OrderStoreProvider')
  return ctx
}
