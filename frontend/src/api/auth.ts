import api from './api'

export async function csrfCookie() {
  await api.get('/sanctum/csrf-cookie')
}

export async function login(email: string, password: string) {
  await csrfCookie()
  const { data } = await api.post('/login', { email, password })
  return data
}

export async function logout() {
  await api.post('/logout')
}

export async function me() {
  const { data } = await api.get('/api/user')
  return data
}
