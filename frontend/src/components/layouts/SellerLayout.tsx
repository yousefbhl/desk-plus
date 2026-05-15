import { Outlet } from 'react-router-dom'

export default function SellerLayout() {
  return (
    <div className="min-h-screen flex bg-surface-container-low">
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  )
}
