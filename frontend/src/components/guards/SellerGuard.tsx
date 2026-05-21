import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children?: React.ReactNode
}

export default function SellerGuard({ children }: Props) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm select-none">
            D+
          </div>
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (user?.role !== 'seller') {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
