import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children?: React.ReactNode
}

/**
 * Protects the /seller area.
 * Sellers ONLY — admins are blocked (they have their own /admin area).
 * Anyone else (customer, pending, logged-out) is bounced home.
 */
export default function SellerGuard({ children }: Props) {
  const { user } = useAuthStore()

  if (user?.role !== 'seller') {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}