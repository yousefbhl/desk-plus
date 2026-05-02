import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const user = useAuth((state) => state.user)

  if (!user?.roles?.includes('admin')) {
    return <Navigate to="/" replace />
  }

  return children
}
