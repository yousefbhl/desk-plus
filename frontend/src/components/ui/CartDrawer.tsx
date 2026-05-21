import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'

interface Props {
  open: boolean
  onClose: () => void
}

const fmt = (n: number) => n.toLocaleString('en-US').replace(/,/g, ',')

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQty, total, itemCount } = useCartStore()
  const count = itemCount()
  const subtotal = total()
  const tax = Math.round(subtotal * 0.2)
  const grandTotal = subtotal + tax

  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose}></div>

      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-[440px] bg-surface z-50 shadow-2xl flex flex-col">
        {/* Drawer header */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Your bag</div>
            <div className="font-black text-xl flex items-center gap-2">{count} item{count !== 1 ? 's' : ''} <span className="chip bg-primary-fixed text-primary text-xs">{fmt(subtotal)} MAD</span></div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">close</span></button>
        </div>

        {/* Free shipping bar */}
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-emerald-700 ms-fill" style={{ fontSize: 16 }}>local_shipping</span>{subtotal >= 5000 ? 'You qualify for free Casa delivery' : `${fmt(5000 - subtotal)} MAD away from free delivery`}</span>
            {subtotal >= 5000 && <span className="text-emerald-700 font-black">✓</span>}
          </div>
          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full btn-grad rounded-full" style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}></div></div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-auto px-6">
          {items.length === 0 && (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
              <p className="font-semibold">Your bag is empty</p>
              <Link to="/products" onClick={onClose} className="text-primary text-sm font-semibold mt-2 inline-block">Browse products</Link>
            </div>
          )}
          {items.map((item, idx) => (
            <div key={item.productId} className={`py-5 flex gap-4 ${idx < items.length - 1 ? 'border-b border-outline-variant' : ''}`}>
              <Link to={`/products/${item.slug}`} onClick={onClose} className="w-20 h-20 rounded-lg bg-surface-container-high flex-shrink-0 overflow-hidden">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold leading-tight">{item.name}</div>
                  <button onClick={() => removeItem(item.productId)} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span></button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-surface-container-high rounded-full h-8">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-8 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span></button>
                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-8 h-8 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span></button>
                  </div>
                  <div className="text-right">
                    <div className="font-black">{fmt(item.price * item.quantity)} MAD</div>
                    {item.comparePrice && <div className="text-[10px] text-on-surface-variant line-through">{fmt(item.comparePrice * item.quantity)}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant p-6 bg-surface-container-lowest">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-semibold">{fmt(subtotal)} MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Estimated tax</span>
              <span className="font-semibold">{fmt(tax)} MAD</span>
            </div>
            <div className="flex items-end justify-between mt-3 pt-3 border-t border-outline-variant">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black text-primary">{fmt(grandTotal)} MAD</span>
            </div>
            <Link to="/checkout" onClick={onClose} className="mt-4 block w-full text-center btn-grad text-white font-bold py-4 rounded-xl uppercase tracking-widest-2 text-sm">
              Checkout →
            </Link>
            <Link to="/cart" onClick={onClose} className="mt-2 block text-center text-xs font-semibold text-on-surface-variant hover:text-primary">View full cart</Link>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span>SSL secured</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>restart_alt</span>30-day returns</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
