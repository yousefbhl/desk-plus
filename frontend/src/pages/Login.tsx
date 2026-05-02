import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const login = useAuth((state) => state.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@deskplus.local')
  const [password, setPassword] = useState('password123')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
    navigate('/admin')
  }

  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={onSubmit} className="panel">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Sign in</button>
      </form>
    </section>
  )
}
