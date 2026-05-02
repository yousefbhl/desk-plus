import api from './api'

export async function fetchProducts(filters: Record<string, unknown> = {}) {
  const { data } = await api.get('/api/products', { params: filters })
  return data
}

export async function fetchProduct(id: string | number) {
  const { data } = await api.get(`/api/products/${id}`)
  return data
}
