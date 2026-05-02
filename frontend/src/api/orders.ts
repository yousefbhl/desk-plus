import api from './api'

export async function fetchOrders() {
  const { data } = await api.get('/api/orders')
  return data
}

export async function createOrder(payload: { total: number; items: Array<{ product_id: number; quantity: number; price: number }> }) {
  const { data } = await api.post('/api/orders', payload)
  return data
}
