import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

export default function Cart() {
  const { cart, loading, fetchCart, updateItem, removeItem, applyCoupon, removeCoupon } = useCartStore()
  const { isAuth } = useAuthStore()
  const { show }   = useToastStore()
  const [couponCode, setCouponCode] = useState('')
  const [applying, setApplying]     = useState(false)

  useEffect(() => { if (isAuth) fetchCart() }, [isAuth])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplying(true)
    try {
      await applyCoupon(couponCode)
      show('Discount applied!', 'success')
      setCouponCode('')
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Invalid coupon code', 'error')
    } finally {
      setApplying(false)
    }
  }

  const items = cart?.items ?? []

  if (!isAuth) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-24 flex flex-col items-center gap-6 text-center">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 64 }}>shopping_cart</span>
        <h2 className="h-display text-3xl">YOUR CART</h2>
        <p className="text-on-surface-variant">Sign in to view and manage your cart</p>
        <Link to="/login" className="btn-grad px-8 py-3.5 rounded-xl font-bold">Sign In</Link>
      </div>
    )
  }

  if (loading && !cart) {
    return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-24 flex flex-col items-center gap-6 text-center">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 64 }}>shopping_cart</span>
        <h2 className="h-display text-3xl">YOUR CART IS EMPTY</h2>
        <p className="text-on-surface-variant max-w-sm">Looks like you haven't added anything yet. Start exploring our collection.</p>
        <Link to="/products" className="btn-grad px-8 py-3.5 rounded-xl font-bold">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="h-display text-4xl">MY CART</h1>
        <p className="text-on-surface-variant mt-1">{cart?.item_count ?? 0} item{cart?.item_count !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Items */}
        <div className="col-span-12 lg:col-span-8">
          {items.map((item, i) => (
            <div key={item.id} className={`flex gap-6 py-6 ${i < items.length - 1 ? 'border-b border-outline-variant/60' : ''}`}>
              <div className="w-24 h-24 rounded-xl bg-surface-container shrink-0 overflow-hidden">
                {item.product?.image
                  ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full ph" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold leading-tight">{item.product?.name}</p>
                    {item.variant && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {[item.variant.color, item.variant.material].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <p className="font-black whitespace-nowrap">{item.line_total.toLocaleString()} MAD</p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
                    <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="w-9 h-9 grid place-items-center hover:bg-surface-container-high text-sm">−</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-9 h-9 grid place-items-center hover:bg-surface-container-high text-sm">+</button>
                  </div>
                  <span className="text-sm text-on-surface-variant">{(item.product?.price ?? 0).toLocaleString()} MAD each</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Coupon */}
          <div className="mt-6 pt-6 border-t border-outline-variant/60">
            <p className="text-xs font-bold uppercase tracking-widest-2 mb-3">Promo Code</p>
            {cart?.discount ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                <span className="material-symbols-outlined text-green-700" style={{ fontSize: 20 }}>check_circle</span>
                <span className="text-sm font-semibold text-green-800">Code <strong>{cart.discount.code}</strong> applied (−{cart.discount.amount.toLocaleString()} MAD)</span>
                <button onClick={() => removeCoupon()} className="ml-auto text-xs text-on-surface-variant hover:text-primary">Remove</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  className="field flex-1"
                  placeholder="Enter discount code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button onClick={handleApplyCoupon} disabled={applying} className="btn-grad px-6 rounded-xl font-bold text-sm shrink-0 disabled:opacity-70">
                  {applying ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Apply'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6 sticky top-24">
            <p className="text-xs font-bold uppercase tracking-widest-2 mb-5">Order Summary</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-semibold">{(cart?.subtotal ?? 0).toLocaleString()} MAD</span></div>
              {cart?.discount && (
                <div className="flex justify-between text-green-700"><span>Discount</span><span>−{cart.discount.amount.toLocaleString()} MAD</span></div>
              )}
              <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span className="text-green-700 font-medium">Free</span></div>
              <div className="border-t border-outline-variant pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="h-display text-xl text-primary">{(cart?.total ?? 0).toLocaleString()} MAD</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 text-sm">
              Proceed to Checkout →
            </Link>
            <Link to="/products" className="block text-center text-sm text-on-surface-variant hover:text-on-surface mt-3">
              Continue Shopping
            </Link>
            <div className="mt-5 pt-4 border-t border-outline-variant/60 flex items-center justify-center gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock</span>
              Secure SSL checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
