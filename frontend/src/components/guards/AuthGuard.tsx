import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const user = useAuth((state) => state.user)
  const fetchUser = useAuth((state) => state.fetchUser)

  useEffect(() => {
    if (!user) {
      void fetchUser()
    }
  }, [fetchUser, user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
