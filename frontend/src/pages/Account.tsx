import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMyOrders } from '../hooks/useOrders'
import { useWishlist, useToggleWishlist } from '../hooks/useWishlist'
import { useWishlistStore } from '../store/wishlistStore'

export default function Account() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const orders: any[] = (ordersData as any)?.data ?? ordersData ?? []
  const { data: wishlistProducts, isLoading: wishlistLoading } = useWishlist()
  const toggleWishlist = useToggleWishlist()
  const wishlistStore = useWishlistStore()

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders')

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const statusClasses: Record<string, string> = {
    pending:    'bg-amber-100 text-amber-700',
    preparing:  'bg-blue-100 text-blue-700',
    processing: 'bg-blue-100 text-blue-700',
    shipping:   'bg-purple-100 text-purple-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-emerald-100 text-emerald-700',
    cancelled:  'bg-red-100 text-red-700',
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <section className="max-w-screen-2xl mx-auto px-8 py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-3">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-surface-container-high border-2 border-primary grid place-items-center font-black text-2xl">{initials}</div>
            <div className="font-bold mt-3">{user?.name ?? 'Guest'}</div>
            <div className="text-xs text-on-surface-variant">{user?.email ?? ''}</div>
            {user?.role && <div className="chip bg-primary-fixed text-primary mt-3 mx-auto inline-flex capitalize">{user.role}</div>}
          </div>
          <nav className="mt-4 bg-surface-container-lowest rounded-xl p-3 shadow-ambient text-sm">
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left ${activeTab === 'orders' ? 'bg-surface-container-high border-l-4 border-primary text-primary font-bold' : 'hover:bg-surface-container-low'}`}><span className="material-symbols-outlined">receipt_long</span>My Orders <span className="ml-auto text-xs text-on-surface-variant">{orders.length}</span></button>
            <button onClick={() => setActiveTab('wishlist')} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left ${activeTab === 'wishlist' ? 'bg-surface-container-high border-l-4 border-primary text-primary font-bold' : 'hover:bg-surface-container-low'}`}><span className="material-symbols-outlined">favorite</span>Wishlist <span className="ml-auto text-xs text-on-surface-variant">{wishlistProducts?.length ?? 0}</span></button>
            <div className="h-px bg-outline-variant my-2"></div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-semibold hover:bg-surface-container-low w-full"><span className="material-symbols-outlined">logout</span>Logout</button>
          </nav>
        </aside>

        {/* Main */}
        <div className="col-span-9">
          <h1 className="h-display text-4xl">Welcome back, {user?.name?.split(' ')[0] ?? 'there'}.</h1>
          <p className="text-on-surface-variant mt-1">Here's what's happening with your account.</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 mt-8">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Total Orders</div>
              <div className="text-4xl font-black mt-2">{orders.length}</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Wishlist Items</div>
              <div className="text-4xl font-black mt-2">{wishlistProducts?.length ?? 0}</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border-2 border-primary">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Total Spent</div>
              <div className="text-4xl font-black mt-2 text-primary">{orders.reduce((sum: number, o: any) => sum + (o.total ?? 0), 0).toLocaleString()}</div>
              <div className="text-xs text-on-surface-variant mt-1">MAD</div>
            </div>
          </div>

          {/* Orders tab */}
          {activeTab === 'orders' && (
          <div className="mt-10 bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="h-display text-lg">My orders</h2>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>progress_activity</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>shopping_bag</span>
                <p className="text-on-surface-variant text-sm mt-3">No orders yet. Start shopping!</p>
                <Link to="/products" className="mt-4 inline-block btn-grad text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-widest-2">Browse Products</Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
                  <tr className="bg-surface-container-low"><th className="text-left px-6 py-3">Order</th><th className="text-left py-3">Items</th><th className="text-left py-3">Status</th><th className="text-left py-3">Date</th><th className="text-right py-3 px-6">Total</th></tr>
                </thead>
                <tbody>
                  {orders.map((order: any, idx: number) => (
                    <tr key={order.id} className={`cursor-pointer hover:bg-surface-container-low/50 ${idx % 2 === 1 ? 'bg-surface-container-low' : ''}`} onClick={() => navigate(`/orders/${order.id}`)}>
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        #{order.reference ?? `DK-${String(order.id).padStart(5, '0')}`}
                      </td>
                      <td>
                        <div className="flex">
                          {(order.items ?? []).slice(0, 3).map((item: any, i: number) => (
                            <div key={item.id} className={`w-9 h-9 rounded-lg bg-surface-container-high border-2 border-white grid place-items-center text-[10px] font-bold text-on-surface-variant${i < 2 ? ' -mr-2' : ''}`}>
                              {item.product_name?.charAt(0) ?? '?'}
                            </div>
                          ))}
                          {(order.items?.length ?? 0) > 3 && (
                            <div className="w-9 h-9 rounded-lg bg-surface-container-high border-2 border-white grid place-items-center text-[10px] font-bold text-on-surface-variant">+{(order.items?.length ?? 0) - 3}</div>
                          )}
                          <span className="ml-2 self-center text-xs text-on-surface-variant">{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td><span className={`chip ${statusClasses[order.status?.toLowerCase()] ?? 'bg-gray-100 text-gray-700'} capitalize`}>{order.status}</span></td>
                      <td className="text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="text-right px-6 font-black">{(order.total ?? 0).toLocaleString()} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          )}

          {/* Wishlist tab */}
          {activeTab === 'wishlist' && (
          <div className="mt-10">
            <h2 className="h-display text-lg mb-5">My Wishlist</h2>
            {wishlistLoading ? (
              <div className="flex justify-center py-12">
                <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>progress_activity</span>
              </div>
            ) : !wishlistProducts || wishlistProducts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl shadow-ambient text-center py-12">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>favorite_border</span>
                <p className="text-on-surface-variant text-sm mt-3">Your wishlist is empty.</p>
                <Link to="/products" className="mt-4 inline-block btn-grad text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-widest-2">Browse Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {wishlistProducts.map((product: any) => (
                  <div key={product.id} className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden group">
                    <div className="relative aspect-square bg-surface-container-high cursor-pointer" onClick={() => navigate(`/products/${product.slug}`)}>
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high"></div>
                      )}
                      <button
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 grid place-items-center shadow-ambient"
                        onClick={(e) => { e.stopPropagation(); toggleWishlist.mutate(product.id) }}
                      >
                        <span className="material-symbols-outlined text-primary ms-fill" style={{ fontSize: 20 }}>favorite</span>
                      </button>
                    </div>
                    <div className="p-4">
                      <Link to={`/products/${product.slug}`} className="font-bold hover:text-primary">{product.name}</Link>
                      {product.category && <div className="text-xs text-on-surface-variant mt-1">{product.category.name}</div>}
                      <div className="font-black text-primary mt-2">{(product.price ?? 0).toLocaleString()} MAD</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-5 mt-8">
            <Link to="/products" className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:-translate-y-0.5 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl btn-grad text-white grid place-items-center"><span className="material-symbols-outlined">shopping_bag</span></div>
              <div><div className="font-bold">Browse Products</div><div className="text-xs text-on-surface-variant">Discover new arrivals</div></div>
            </Link>
            <Link to="/products" className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:-translate-y-0.5 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface grid place-items-center"><span className="material-symbols-outlined">rate_review</span></div>
              <div><div className="font-bold">Write a Review</div><div className="text-xs text-on-surface-variant">Share your experience</div></div>
            </Link>
            <Link to="/spaces" className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:-translate-y-0.5 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface grid place-items-center"><span className="material-symbols-outlined">space_dashboard</span></div>
              <div><div className="font-bold">Explore Spaces</div><div className="text-xs text-on-surface-variant">Get inspired</div></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
