import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import ToastContainer from '../ui/Toast'

export default function MainLayout() {
  const { pathname } = useLocation()
  // The home page renders its own editorial masthead inside the hero,
  // so we hide the shared sticky navbar there to avoid a duplicate.
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {!isHome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
