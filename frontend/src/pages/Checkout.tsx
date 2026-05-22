import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useUiStore } from '../store/uiStore'
import { usePlaceOrder } from '../hooks/useOrders'
import { useAuthStore } from '../store/authStore'

export default function Checkout() {
  const { items, total, itemCount, clear } = useCartStore()
  const { showToast } = useUiStore()
  const navigate = useNavigate()
  const placeOrder = usePlaceOrder()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('cash')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const { isAuth, user } = useAuthStore()

  if (!isAuth) return <Navigate to="/login" replace />

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!firstName.trim() || firstName.trim().length < 2) errs.firstName = 'First name is required (min 2 chars)'
    if (!lastName.trim() || lastName.trim().length < 2) errs.lastName = 'Last name is required (min 2 chars)'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required'
    if (!phone.trim() || !/^[0-9+\s\-]{8,15}$/.test(phone)) errs.phone = 'Invalid phone number'
    if (!addressLine1.trim() || addressLine1.trim().length < 5) errs.addressLine1 = 'Address is required (min 5 chars)'
    if (!city.trim() || city.trim().length < 2) errs.city = 'City is required'
    if (!postalCode.trim() || postalCode.trim().length < 4) errs.postalCode = 'Postal code is required (min 4 chars)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const subtotal = total()
  const shippingCost = subtotal >= 5000 ? 0 : 50
  const grandTotal = subtotal + shippingCost
  const count = itemCount()

  const handleSubmit = async () => {
    if (!validate()) return
    if (items.length === 0) {
      showToast('Cart is empty', 'error')
      return
    }

    setSubmitting(true)
    try {
      const orderItems = items.map((item) => ({
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const order = await placeOrder.mutateAsync({
        items: orderItems,
        shipping_address: {
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          address_line1: addressLine1.trim(),
          city: city.trim(),
          region: region.trim() || undefined,
          postal_code: postalCode.trim() || undefined,
          phone: phone.trim(),
        },
        payment_method: paymentMethod,
        subtotal,
        total: grandTotal,
      })

      clear()
      showToast('Order placed successfully!')
      navigate('/orders/' + order.id)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to place order'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="max-w-screen-2xl mx-auto px-8 py-10">
        <h1 className="h-display text-3xl mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center">
            <div className="flex flex-col items-center gap-2 w-28">
              <div className="w-10 h-10 rounded-full btn-grad text-white grid place-items-center font-bold"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span></div>
              <div className="text-xs font-bold">Delivery</div>
            </div>
            <div className="step-line done"></div>
            <div className="flex flex-col items-center gap-2 w-28">
              <div className="w-10 h-10 rounded-full btn-grad text-white grid place-items-center font-bold pulse-ring">2</div>
              <div className="text-xs font-bold text-primary">Payment</div>
            </div>
            <div className="step-line"></div>
            <div className="flex flex-col items-center gap-2 w-28">
              <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant grid place-items-center font-bold">3</div>
              <div className="text-xs font-semibold text-on-surface-variant">Confirm</div>
            </div>
          </div>
        </div>

        {count === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>shopping_cart</span>
            <p className="mt-4 text-on-surface-variant">Your cart is empty.</p>
            <button onClick={() => navigate('/products')} className="mt-4 btn-grad text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-widest-2">Browse Products</button>
          </div>
        )}

        {count > 0 && (
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="col-span-7">
            {/* Delivery (form) */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient mb-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 ms-fill">check_circle</span>
                  <div className="font-bold">Delivery details</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">First name</label>
                  <input className="field mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Ahmed" />
                  {errors.firstName && <p className="text-xs text-primary mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Last name</label>
                  <input className="field mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Benali" />
                  {errors.lastName && <p className="text-xs text-primary mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Email</label>
                  <input className="field mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  {errors.email && <p className="text-xs text-primary mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Phone</label>
                  <input className="field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6 12 34 56 78" />
                  {errors.phone && <p className="text-xs text-primary mt-1">{errors.phone}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Address</label>
                  <input className="field mt-2" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street address, apartment, suite..." />
                  {errors.addressLine1 && <p className="text-xs text-primary mt-1">{errors.addressLine1}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">City</label>
                  <input className="field mt-2" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Casablanca" />
                  {errors.city && <p className="text-xs text-primary mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Region <span className="text-on-surface-variant font-normal">(optional)</span></label>
                  <input className="field mt-2" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Grand Casablanca" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Postal code</label>
                  <input className="field mt-2" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="e.g. 20000" />
                  {errors.postalCode && <p className="text-xs text-primary mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Country</label>
                  <input className="field mt-2" value="Morocco" disabled />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-surface-container-lowest rounded-xl p-7 shadow-ambient">
              <div className="text-xs font-bold tracking-widest-2 uppercase mb-5">Payment Method</div>
              <div className="flex gap-8 border-b border-outline-variant text-sm font-semibold mb-7">
                <button onClick={() => setPaymentMethod('card')} className={`pb-3 ${paymentMethod === 'card' ? 'red-underline font-bold' : 'text-on-surface-variant'}`}>Card</button>
                <button onClick={() => setPaymentMethod('cash')} className={`pb-3 ${paymentMethod === 'cash' ? 'red-underline font-bold' : 'text-on-surface-variant'}`}>Cash on Delivery</button>
                <button onClick={() => setPaymentMethod('bank_transfer')} className={`pb-3 ${paymentMethod === 'bank_transfer' ? 'red-underline font-bold' : 'text-on-surface-variant'}`}>Bank Transfer</button>
              </div>

              <div className="text-sm text-on-surface-variant">
                {paymentMethod === 'cash' && 'Pay with cash when your order is delivered.'}
                {paymentMethod === 'card' && 'Secure card payment (processed on delivery confirmation).'}
                {paymentMethod === 'bank_transfer' && 'Transfer to our bank account. Order ships after payment confirmation.'}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => navigate('/cart')} className="text-sm font-semibold text-on-surface-variant">← Back to Cart</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || placeOrder.isPending}
                  className="btn-grad text-white font-bold px-8 py-4 rounded-xl uppercase tracking-widest-2 text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {(submitting || placeOrder.isPending) && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {(submitting || placeOrder.isPending) ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT summary */}
          <aside className="col-span-5">
            <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
              <div className="text-xs font-bold tracking-widest-2 uppercase mb-4">Your Order ({count} item{count !== 1 ? 's' : ''})</div>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden relative">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] grid place-items-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1"><div className="font-semibold text-sm">{item.name}</div></div>
                    <div className="text-sm font-bold">{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-semibold">{subtotal.toLocaleString()} MAD</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span className={`font-semibold ${shippingCost === 0 ? 'text-emerald-700' : ''}`}>{shippingCost === 0 ? 'Free' : `${shippingCost} MAD`}</span></div>
              </div>
              {shippingCost > 0 && <div className="text-xs text-on-surface-variant mt-1">Free shipping on orders over 5,000 MAD</div>}
              <div className="my-4 h-px bg-outline-variant"></div>
              <div className="flex justify-between items-end mb-5">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-black text-primary">{grandTotal.toLocaleString()} MAD</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>SSL</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shield_lock</span>3-D Secure</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified_user</span>PCI</span>
              </div>
            </div>
          </aside>
        </div>
        )}
      </section>

      <style>{`
.step-line{height:2px;background:#e5bdb8;position:relative;flex:1;border-radius:2px;}
.step-line.done{background:#ba0a0d;}
      `}</style>
    </>
  )
}
