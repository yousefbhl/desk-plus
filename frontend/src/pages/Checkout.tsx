import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { ordersApi } from '../api'

type Step = 1 | 2 | 3
const STEPS = ['Delivery', 'Payment', 'Confirm']

const DELIVERY_METHODS = [
  { id: 'standard', label: 'Standard', sub: '3–5 business days', price: 0 },
  { id: 'express',  label: 'Express',  sub: '1–2 business days', price: 150 },
]

const PAYMENT_METHODS = [
  { id: 'card',     label: 'Credit Card',       icon: 'credit_card' },
  { id: 'cod',      label: 'Cash on Delivery',   icon: 'payments' },
  { id: 'transfer', label: 'Bank Transfer',       icon: 'account_balance' },
]

const MOROCCO_REGIONS = ['Casablanca-Settat','Rabat-Salé-Kénitra','Marrakech-Safi','Fès-Meknès','Tanger-Tétouan-Al Hoceïma','Oriental','Souss-Massa','Béni Mellal-Khénifra','Drâa-Tafilalet','Guelmim-Oued Noun']

export default function Checkout() {
  const [step, setStep] = useState<Step>(1)
  const [delivery, setDelivery] = useState('standard')
  const [payment, setPayment]   = useState('card')
  const [placing, setPlacing]   = useState(false)

  const [addr, setAddr] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', city: '', postal_code: '', region: '',
  })

  const { cart, clearCart } = useCartStore()
  const { show } = useToastStore()
  const navigate = useNavigate()

  const setA = (k: keyof typeof addr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddr((a) => ({ ...a, [k]: e.target.value }))

  const items     = cart?.items ?? []
  const shipping  = DELIVERY_METHODS.find((d) => d.id === delivery)?.price ?? 0
  const total     = (cart?.total ?? 0) + shipping

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const { data } = await ordersApi.checkout({
        shipping: {
          first_name:  addr.first_name,
          last_name:   addr.last_name,
          email:       addr.email,
          phone:       addr.phone,
          address:     addr.address,
          city:        addr.city,
          postal_code: addr.postal_code,
          country:     'Morocco',
        },
        payment_method:  payment,
        delivery_method: delivery,
        coupon_code:     cart?.coupon_code ?? undefined,
      })
      await clearCart()
      show('Order placed successfully!', 'success')
      navigate(`/orders/${data.id}`)
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Failed to place order', 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-12">
      <div className="mb-10">
        <h1 className="h-display text-4xl mb-6">CHECKOUT</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 max-w-sm">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 ${i + 1 === step ? '' : i + 1 < step ? 'cursor-pointer' : ''}`}
                onClick={() => i + 1 < step && setStep((i + 1) as Step)}>
                <div className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold transition-colors ${i + 1 < step ? 'bg-primary text-white' : i + 1 === step ? 'bg-primary text-white pulse-ring' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  {i + 1 < step ? <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span> : i + 1}
                </div>
                <span className={`text-sm font-medium ${i + 1 === step ? 'text-on-surface' : 'text-on-surface-variant'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 mx-2 rounded-full ${i + 1 < step ? 'bg-primary' : 'bg-surface-container-high'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Form area */}
        <div className="col-span-12 lg:col-span-7">

          {/* ── STEP 1: DELIVERY ── */}
          {step === 1 && (
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8">
              <h2 className="font-bold text-lg mb-6">Delivery Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">First Name</label>
                  <input className="field" value={addr.first_name} onChange={setA('first_name')} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Last Name</label>
                  <input className="field" value={addr.last_name} onChange={setA('last_name')} required />
                </div>
              </div>
              {[['email', 'Email', 'email', 'you@company.com'], ['phone', 'Phone', 'tel', '+212 6 XX XX XX XX'], ['address', 'Address', 'text', 'Street address'], ['city', 'City', 'text', 'Casablanca']].map(([k, label, type, ph]) => (
                <div key={k} className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">{label}</label>
                  <input type={type} className="field" placeholder={ph} value={(addr as any)[k]} onChange={setA(k as keyof typeof addr)} required />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Postal Code</label>
                  <input className="field" value={addr.postal_code} onChange={setA('postal_code')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Region</label>
                  <select className="field cursor-pointer" value={addr.region} onChange={setA('region')}>
                    <option value="">Select region</option>
                    {MOROCCO_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-widest-2 mb-3">Delivery Method</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {DELIVERY_METHODS.map((d) => (
                  <button key={d.id} type="button" onClick={() => setDelivery(d.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${delivery === d.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline'}`}>
                    <p className={`font-bold text-sm ${delivery === d.id ? 'text-primary' : ''}`}>{d.label}</p>
                    <p className="text-xs text-on-surface-variant">{d.sub}</p>
                    <p className={`text-xs font-bold mt-1 ${d.price === 0 ? 'text-green-700' : 'text-on-surface'}`}>{d.price === 0 ? 'Free' : `+${d.price} MAD`}</p>
                  </button>
                ))}
              </div>

              <button onClick={() => setStep(2)} className="btn-grad w-full py-3.5 rounded-xl font-bold">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 2 && (
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8">
              <h2 className="font-bold text-lg mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.id} type="button" onClick={() => setPayment(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${payment === m.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline'}`}>
                    <span className={`material-symbols-outlined ${payment === m.id ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontSize: 24 }}>{m.icon}</span>
                    <span className={`font-semibold ${payment === m.id ? 'text-primary' : ''}`}>{m.label}</span>
                    {payment === m.id && <span className="ml-auto material-symbols-outlined text-primary" style={{ fontSize: 20 }}>check_circle</span>}
                  </button>
                ))}
              </div>

              {payment === 'card' && (
                <div className="space-y-4 mb-6 p-5 bg-surface-container-low rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Card Number</label>
                    <input className="field font-mono" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Expiry</label>
                      <input className="field font-mono" placeholder="MM / YY" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">CVV</label>
                      <input className="field font-mono" placeholder="•••" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl font-bold border-2 border-outline-variant hover:bg-surface-container-high transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 btn-grad py-3.5 rounded-xl font-bold">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: CONFIRM ── */}
          {step === 3 && (
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8">
              <h2 className="font-bold text-lg mb-6">Review & Place Order</h2>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-2">Delivering to</p>
                  <p className="font-semibold">{addr.first_name} {addr.last_name}</p>
                  <p className="text-sm text-on-surface-variant">{addr.address}, {addr.city} {addr.postal_code}</p>
                  <p className="text-sm text-on-surface-variant">{addr.phone}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>
                    {PAYMENT_METHODS.find((m) => m.id === payment)?.icon}
                  </span>
                  <span className="font-semibold">{PAYMENT_METHODS.find((m) => m.id === payment)?.label}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl font-bold border-2 border-outline-variant hover:bg-surface-container-high transition-colors">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placing} className="flex-1 btn-grad py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70">
                  {placing ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Place Order →'}
                </button>
              </div>
              <p className="text-xs text-on-surface-variant text-center mt-3">By placing this order you agree to our Terms of Service</p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6 sticky top-24">
            <p className="text-xs font-bold uppercase tracking-widest-2 mb-4">Order Summary</p>
            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg bg-surface-container shrink-0 overflow-hidden">
                    {item.product_image ? <img src={item.product_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full ph" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product_name}</p>
                    <p className="text-xs text-on-surface-variant">×{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{item.subtotal.toLocaleString()} MAD</p>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>{(cart?.subtotal ?? 0).toLocaleString()} MAD</span></div>
              {cart?.discount_amount ? <div className="flex justify-between text-green-700"><span>Discount</span><span>−{cart.discount_amount.toLocaleString()} MAD</span></div> : null}
              <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>{shipping === 0 ? 'Free' : `${shipping} MAD`}</span></div>
              <div className="flex justify-between font-black pt-1 text-base">
                <span>Total</span>
                <span className="text-primary">{total.toLocaleString()} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
