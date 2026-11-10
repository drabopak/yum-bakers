'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'

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

type OrderRow = {
  id: string
  customer_phone: string
  address: string
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  created_at: string
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerPhone: row.customer_phone,
    address: row.address,
    items: row.items,
    totalAmount: row.total_amount,
    status: row.status,
    createdAt: row.created_at,
  }
}

function calcTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function generateOrderId() {
  return `YUM-${Date.now().toString().slice(-6)}`
}

export type ConnectionStatus = 'connecting' | 'live' | 'offline'

type OrderStoreValue = {
  orders: Order[]
  addOrder: (input: NewOrderInput) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
  getOrder: (id: string) => Order | undefined
  connectionStatus: ConnectionStatus
}

const OrderStoreContext = createContext<OrderStoreValue | null>(null)

export function OrderStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    isSupabaseConfigured ? 'connecting' : 'offline',
  )

  const ordersRef = useRef<Order[]>([])
  ordersRef.current = orders

  const mergeOrder = useCallback((incoming: Order) => {
    setOrders((prev) => {
      const index = prev.findIndex((order) => order.id === incoming.id)
      if (index === -1) {
        return [incoming, ...prev]
      }
      const next = [...prev]
      next[index] = incoming
      return next
    })
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setConnectionStatus('offline')
      return
    }

    let active = true
    let channel: RealtimeChannel | null = null

    async function loadInitialOrders() {
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('[order-store] failed to load orders from Supabase:', error.message)
        return
      }

      setOrders((data as OrderRow[]).map(rowToOrder))
    }

    loadInitialOrders()

    channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          mergeOrder(rowToOrder(payload.new as OrderRow))
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          mergeOrder(rowToOrder(payload.new as OrderRow))
        },
      )
      .subscribe((status) => {
        if (!active) return
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('live')
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('offline')
        }
      })

    return () => {
      active = false
      if (channel) supabase!.removeChannel(channel)
    }
  }, [mergeOrder])

  const addOrder = useCallback(
    (input: NewOrderInput): Order => {
      const order: Order = {
        id: generateOrderId(),
        customerPhone: input.customerPhone,
        address: input.address,
        items: input.items,
        totalAmount: calcTotal(input.items),
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }

      mergeOrder(order)

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('orders')
          .insert({
            id: order.id,
            customer_phone: order.customerPhone,
            address: order.address,
            items: order.items,
            total_amount: order.totalAmount,
            status: order.status,
            created_at: order.createdAt,
          })
          .then(({ error }) => {
            if (error) console.error('[order-store] failed to insert order:', error.message)
          })
      }

      return order
    },
    [mergeOrder],
  )

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      const existing = ordersRef.current.find((order) => order.id === id)
      if (existing) {
        mergeOrder({ ...existing, status })
      }

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.error('[order-store] failed to update order status:', error.message)
          })
      }
    },
    [mergeOrder],
  )

  const getOrder = useCallback((id: string) => orders.find((order) => order.id === id), [orders])

  const value = useMemo<OrderStoreValue>(
    () => ({ orders, addOrder, updateOrderStatus, getOrder, connectionStatus }),
    [orders, addOrder, updateOrderStatus, getOrder, connectionStatus],
  )

  return <OrderStoreContext.Provider value={value}>{children}</OrderStoreContext.Provider>
}

export function useOrderStore() {
  const ctx = useContext(OrderStoreContext)
  if (!ctx) throw new Error('useOrderStore must be used within OrderStoreProvider')
  return ctx
}
