import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useUiStore } from '../store/uiStore'

export default function Cart() {
  const { items, removeItem, updateQty, total, itemCount, clear } = useCartStore()
  const { showToast } = useUiStore()
  const navigate = useNavigate()

  const subtotal = total()
  const tax = Math.round(subtotal * 0.2)
  const grandTotal = subtotal + tax
  const count = itemCount()

  if (items.length === 0) {
    return (
      <section className="max-w-screen-2xl mx-auto px-8 py-10">
        <div className="flex items-end gap-4 mb-8">
          <h1 className="h-display text-4xl">My Cart</h1>
          <span className="text-on-surface-variant">(0 items)</span>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-12 shadow-ambient text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_cart</span>
          <div className="font-bold text-xl mb-2">Your cart is empty</div>
          <div className="text-on-surface-variant mb-6">Looks like you haven't added anything yet.</div>
          <Link to="/products" className="btn-grad text-white font-bold px-8 py-4 rounded-xl uppercase tracking-widest-2 text-sm">Browse Products</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-screen-2xl mx-auto px-8 py-10">
      <div className="flex items-end gap-4 mb-8">
        <h1 className="h-display text-4xl">My Cart</h1>
        <span className="text-on-surface-variant">({count} items)</span>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: Items */}
        <div className="col-span-8 space-y-1">
          {items.map((item, idx) => (
            <div key={item.productId}>
              <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center gap-5 shadow-ambient">
                <div className="w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden bg-surface-container-high">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <Link to={`/products/${item.slug}`} className="font-bold">{item.name}</Link>
                </div>
                <div className="flex items-center bg-surface-container-high rounded-full h-9">
                  <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-9 h-9 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span></button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-9 h-9 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span></button>
                </div>
                <div className="text-right w-28">
                  <div className="font-black">{(item.price * item.quantity).toLocaleString()} MAD</div>
                  {item.comparePrice && item.comparePrice > item.price && (
                    <div className="text-xs text-on-surface-variant line-through">{(item.comparePrice * item.quantity).toLocaleString()} MAD</div>
                  )}
                </div>
                <button onClick={() => removeItem(item.productId)} className="text-on-surface-variant hover:text-primary w-9 h-9 grid place-items-center"><span className="material-symbols-outlined">delete_outline</span></button>
              </div>
              {idx < items.length - 1 && <div className="h-2 bg-surface-container-low rounded-full"></div>}
            </div>
          ))}

          {/* Promo */}
          <div className="mt-6 bg-surface-container-low rounded-xl p-5">
            <div className="text-xs font-bold tracking-widest-2 uppercase mb-3">Promo code</div>
            <div className="flex gap-3">
              <input defaultValue="DESK20" className="field flex-1 font-mono tracking-wider" />
              <button className="px-6 rounded-xl bg-surface-container-high font-bold">Apply</button>
            </div>
            <div className="mt-3 text-sm text-emerald-700 flex items-center gap-2"><span className="material-symbols-outlined ms-fill" style={{ fontSize: 18 }}>check_circle</span>Code DESK20 applied — 20% off your order</div>
          </div>

          {/* Frequently bought together */}
          <div className="mt-10">
            <h2 className="h-display text-xl mb-4">Frequently bought together</h2>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg ph-mesh-chair"></div>
                <span className="material-symbols-outlined text-on-surface-variant">add</span>
                <div className="w-20 h-20 rounded-lg ph-walnut"></div>
                <span className="material-symbols-outlined text-on-surface-variant">add</span>
                <div className="w-20 h-20 rounded-lg ph-dark"></div>
              </div>
              <div className="flex-1 ml-4">
                <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Bundle</div>
                <div className="font-bold">Chair + Desk + Task light</div>
                <div className="text-xs text-on-surface-variant">Save 8% when bought as a set</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-on-surface-variant line-through">14,580 MAD</div>
                <div className="font-black text-primary text-xl">13,420 MAD</div>
              </div>
              <button className="btn-grad text-white font-semibold px-5 py-3 rounded-xl text-sm whitespace-nowrap">Add Bundle</button>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <aside className="col-span-4">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
            <div className="text-xs font-bold tracking-widest-2 uppercase mb-4">Order Summary</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal ({count} items)</span><span className="font-semibold">{subtotal.toLocaleString()} MAD</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span className="font-semibold text-emerald-700">Free</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Tax (20%)</span><span className="font-semibold">{tax.toLocaleString()} MAD</span></div>
            </div>
            <div className="my-5 h-px bg-outline-variant"></div>
            <div className="flex justify-between items-end">
              <span className="font-bold">Total</span>
              <span className="text-3xl font-black text-primary">{grandTotal.toLocaleString()} MAD</span>
            </div>
            <Link to="/checkout" className="mt-5 block w-full text-center btn-grad text-white font-bold py-4 rounded-xl uppercase tracking-widest-2 text-sm">Proceed to Checkout</Link>
            <Link to="/products" className="mt-3 block w-full text-center text-sm text-on-surface-variant font-semibold hover:text-primary">← Continue shopping</Link>
            <div className="mt-5 pt-5 border-t border-outline-variant flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock</span> Secure checkout · SSL encrypted
            </div>
            <div className="mt-2 text-xs text-emerald-700 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_shipping</span> Estimated delivery <strong>Mar 15 – 18</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
