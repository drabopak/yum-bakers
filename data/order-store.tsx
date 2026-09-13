'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase-client'

export type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type OrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'

export type Order = {
  id: string
  customerPhone: string
  address: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

type OrderStoreValue = {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
}

const seedOrders: Order[] = [
  {
    id: 'YUM-1001',
    customerPhone: '0301-2345678',
    address: 'House 12, Street 5, Wah Cantt',
    items: [
      { id: 'celebration-cake', name: 'Celebration Cake', quantity: 1, price: 3200 },
      { id: 'gulab-jamun', name: 'Gulab Jamun', quantity: 2, price: 900 },
    ],
    totalAmount: 5000,
    status: 'Pending',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'YUM-1002',
    customerPhone: '0333-9876543',
    address: 'Flat 4B, Nawababad, Wah',
    items: [
      { id: 'combo-2pc', name: '2-Piece Signature Combo', quantity: 3, price: 650 },
    ],
    totalAmount: 1950,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'YUM-1003',
    customerPhone: '0345-5550192',
    address: 'Bank Road, Main Bazar, Hazro',
    items: [
      { id: 'mixed-barfi', name: 'Mixed Barfi / Mithai', quantity: 1, price: 1400 },
      { id: 'rasgulla', name: 'Rasgulla & Cham Cham', quantity: 1, price: 1000 },
    ],
    totalAmount: 2400,
    status: 'Ready',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'YUM-1004',
    customerPhone: '0321-7778899',
    address: 'Kamra Road, Attock',
    items: [
      { id: 'bucket-8pc', name: '8-Piece Family Bucket', quantity: 1, price: 2100 },
      { id: 'spicy-wings', name: 'Spicy Wings', quantity: 2, price: 560 },
    ],
    totalAmount: 3220,
    status: 'Out for Delivery',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'YUM-1005',
    customerPhone: '0300-1112233',
    address: 'Ameen Plaza, G.T Road, Haripur',
    items: [
      { id: 'organic-honey', name: 'Pure Organic Honey', quantity: 2, price: 850 },
    ],
    totalAmount: 1700,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
]

type DbOrder = {
  id: string
  customer_phone: string
  address: string
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  created_at: string
}

function mapDbOrder(row: DbOrder): Order {
  return {
    id: row.id,
    customerPhone: row.customer_phone,
    address: row.address,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: row.total_amount,
    status: row.status,
    createdAt: row.created_at,
  }
}

const OrderStoreContext = createContext<OrderStoreValue | null>(null)

let orderCounter = 1006

export function OrderStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [useDb, setUseDb] = useState(false)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function init() {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
        if (error) throw error
        if (data && data.length > 0) {
          setOrders(data.map((row: DbOrder) => mapDbOrder(row)))
          setUseDb(true)
        }

        channel = supabase
          .channel('orders-realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setOrders((prev) => {
                  if (prev.some((o) => o.id === (payload.new as DbOrder).id)) return prev
                  return [mapDbOrder(payload.new as DbOrder), ...prev]
                })
              } else if (payload.eventType === 'UPDATE') {
                const updated = mapDbOrder(payload.new as DbOrder)
                setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
              } else if (payload.eventType === 'DELETE') {
                const deleted = payload.old as DbOrder
                setOrders((prev) => prev.filter((o) => o.id !== deleted.id))
              }
            },
          )
          .subscribe()
      } catch {
        // Supabase not reachable — fall back to in-memory seed data
        setUseDb(false)
      }
    }

    init()
    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const addOrder = useCallback(
    (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
      const newId = `YUM-${orderCounter++}`
      const newOrder: Order = {
        ...order,
        id: newId,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }
      setOrders((prev) => [newOrder, ...prev])

      if (useDb) {
        supabase.from('orders').insert({
          id: newId,
          customer_phone: order.customerPhone,
          address: order.address,
          items: order.items,
          total_amount: order.totalAmount,
          status: 'Pending',
        }).then(() => {})
      }
    },
    [useDb],
  )

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
      if (useDb) {
        supabase.from('orders').update({ status }).eq('id', id).then(() => {})
      }
    },
    [useDb],
  )

  return (
    <OrderStoreContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderStoreContext.Provider>
  )
}

export function useOrderStore() {
  const ctx = useContext(OrderStoreContext)
  if (!ctx) throw new Error('useOrderStore must be used within OrderStoreProvider')
  return ctx
}
