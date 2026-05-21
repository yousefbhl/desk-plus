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
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isAuth } = useAuthStore()

  if (!isAuth) return <Navigate to="/login" replace />

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'First name is required'
    if (!lastName.trim()) errs.lastName = 'Last name is required'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required'
    if (!phone.trim() || !/^[0-9+\s\-]{8,15}$/.test(phone)) errs.phone = 'Invalid phone number'
    if (!address.trim()) errs.address = 'Address is required'
    if (!city.trim()) errs.city = 'City is required'
    if (!postalCode.trim()) errs.postalCode = 'Postal code is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const subtotal = total()
  const tax = Math.round(subtotal * 0.2)
  const grandTotal = subtotal + tax
  const count = itemCount()

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      const order = await placeOrder.mutateAsync({
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          city,
          postal_code: postalCode,
        },
        payment_method: 'cod',
      })
      clear()
      showToast('Order placed!')
      navigate('/orders/' + order.id)
    } catch {
      showToast('Failed to place order', 'error')
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
                  <input className="field mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  {errors.firstName && <p className="text-xs text-primary mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Last name</label>
                  <input className="field mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  {errors.lastName && <p className="text-xs text-primary mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Email</label>
                  <input className="field mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <p className="text-xs text-primary mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Phone</label>
                  <input className="field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  {errors.phone && <p className="text-xs text-primary mt-1">{errors.phone}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Address</label>
                  <input className="field mt-2" value={address} onChange={(e) => setAddress(e.target.value)} />
                  {errors.address && <p className="text-xs text-primary mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">City</label>
                  <input className="field mt-2" value={city} onChange={(e) => setCity(e.target.value)} />
                  {errors.city && <p className="text-xs text-primary mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest-2 uppercase">Postal code</label>
                  <input className="field mt-2" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  {errors.postalCode && <p className="text-xs text-primary mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-surface-container-lowest rounded-xl p-7 shadow-ambient">
              <div className="text-xs font-bold tracking-widest-2 uppercase mb-5">Payment Method</div>
              <div className="flex gap-8 border-b border-outline-variant text-sm font-semibold mb-7">
                <button className="pb-3 text-on-surface-variant">Card</button>
                <button className="pb-3 red-underline font-bold">Cash on Delivery</button>
                <button className="pb-3 text-on-surface-variant">Bank Transfer</button>
              </div>

              <div className="text-sm text-on-surface-variant">
                Pay with cash when your order is delivered.
              </div>

              <div className="mt-8 flex items-center justify-between">
                <a className="text-sm font-semibold text-on-surface-variant">← Back to Delivery</a>
                <button
                  onClick={handleSubmit}
                  disabled={placeOrder.isPending}
                  className="btn-grad text-white font-bold px-8 py-4 rounded-xl uppercase tracking-widest-2 text-sm"
                >
                  {placeOrder.isPending ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT summary */}
          <aside className="col-span-5">
            <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
              <div className="text-xs font-bold tracking-widest-2 uppercase mb-4">Your Order</div>
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

              <div className="flex gap-2 mb-5">
                <input className="field flex-1 !h-10 text-sm" placeholder="Promo code" />
                <button className="px-4 rounded-xl bg-surface-container-high font-bold text-sm">Apply</button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-semibold">{subtotal.toLocaleString()} MAD</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span className="font-semibold text-emerald-700">Free</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Tax (20%)</span><span className="font-semibold">{tax.toLocaleString()} MAD</span></div>
              </div>
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
      </section>

      <style>{`
.step-line{height:2px;background:#e5bdb8;position:relative;flex:1;border-radius:2px;}
.step-line.done{background:#ba0a0d;}
.cc-front{background:linear-gradient(135deg,#1c1b1b,#3a3636);}
.cc-shine{background:linear-gradient(135deg,rgba(255,255,255,.15),transparent 60%);}
      `}</style>
    </>
  )
}
