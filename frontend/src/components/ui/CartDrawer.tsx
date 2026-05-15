import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

interface Props {
  open:    boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, loading, fetchCart, updateItem, removeItem } = useCartStore()
  const { isAuth } = useAuthStore()

  useEffect(() => {
    if (open && isAuth) fetchCart()
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const items = cart?.items ?? []

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-on-surface/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-surface-container-lowest shadow-ambient-lg flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div>
            <h2 className="font-bold text-lg">My Cart</h2>
            <p className="text-xs text-on-surface-variant">{cart?.item_count ?? 0} item{cart?.item_count !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full hover:bg-surface-container-high">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!isAuth ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>shopping_cart</span>
              <p className="text-on-surface-variant text-sm">Sign in to view your cart</p>
              <Link to="/login" onClick={onClose} className="btn-grad px-6 py-2.5 rounded-xl font-semibold text-sm">Sign In</Link>
            </div>
          ) : loading && !items.length ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>shopping_cart</span>
              <p className="font-semibold">Your cart is empty</p>
              <Link to="/products" onClick={onClose} className="btn-grad px-6 py-2.5 rounded-xl font-semibold text-sm">Shop Now</Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-surface-container shrink-0 overflow-hidden">
                    {item.product?.image
                      ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full ph" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{item.product?.name}</p>
                    {item.variant?.color && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {[item.variant.color, item.variant.material].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-primary font-bold mt-1">{item.line_total.toLocaleString()} MAD</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-sm hover:bg-surface-container">−</button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-sm hover:bg-surface-container">+</button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-outline-variant px-6 py-5 bg-surface-container-low">
            <div className="flex justify-between items-center mb-4">
              <span className="text-on-surface-variant text-sm">Subtotal</span>
              <span className="font-black text-lg">{(cart?.subtotal ?? 0).toLocaleString()} MAD</span>
            </div>
            <Link to="/checkout" onClick={onClose} className="btn-grad w-full py-3.5 rounded-xl font-bold text-center block text-sm">
              Proceed to Checkout →
            </Link>
            <Link to="/cart" onClick={onClose} className="block text-center text-sm text-on-surface-variant hover:text-on-surface mt-3">
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
