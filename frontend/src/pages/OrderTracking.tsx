import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api'

const STATUS_STEPS = ['pending', 'preparing', 'shipped', 'delivered']
const STATUS_LABELS: Record<string, string> = { pending: 'Order Confirmed', preparing: 'Being Prepared', shipped: 'Shipped', delivered: 'Delivered' }
const STATUS_ICONS:  Record<string, string> = { pending: 'check_circle', preparing: 'inventory', shipped: 'local_shipping', delivered: 'home' }

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.show(Number(id)).then((r) => r.data),
    enabled: !!id,
  })

  if (isLoading) {
    return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }
  if (!order) return null

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link to="/account" className="hover:text-on-surface">My Account</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        <span className="text-on-surface font-semibold">Order #DK-{String(order.id).padStart(5, '0')}</span>
      </div>

      {/* Header card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono font-black text-xl text-primary">#DK-{String(order.id).padStart(5, '0')}</p>
            <p className="text-sm text-on-surface-variant mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className={`chip capitalize ${order.status === 'delivered' ? 'badge-delivered' : order.status === 'shipped' ? 'badge-shipped' : order.status === 'preparing' ? 'badge-preparing' : 'badge-pending'}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest-2 mb-8">Order Progress</p>
        <div className="flex items-start justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-surface-container-high">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: currentStep < 0 ? '0%' : `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {STATUS_STEPS.map((s, i) => {
            const done    = i <= currentStep
            const active  = i === currentStep
            return (
              <div key={s} className="flex flex-col items-center gap-3 z-10 flex-1">
                <div className={`w-10 h-10 rounded-full grid place-items-center transition-all ${done ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'} ${active ? 'pulse-ring' : ''}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: active ? 22 : 18 }}>
                    {done && !active ? 'check' : STATUS_ICONS[s]}
                  </span>
                </div>
                <p className={`text-xs font-semibold text-center ${done ? 'text-on-surface' : 'text-on-surface-variant'}`}>{STATUS_LABELS[s]}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Items */}
        <div className="col-span-12 md:col-span-7">
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6">
            <p className="text-xs font-bold uppercase tracking-widest-2 mb-4">Order Items</p>
            <div className="space-y-4">
              {(order.items ?? []).map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface-container shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product_name}</p>
                    {item.variant_label && <p className="text-xs text-on-surface-variant">{item.variant_label}</p>}
                    <p className="text-xs text-on-surface-variant">×{item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">{item.total.toLocaleString()} MAD</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary + address */}
        <div className="col-span-12 md:col-span-5 space-y-4">
          {order.shipping_address && (
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5">
              <p className="text-xs font-bold uppercase tracking-widest-2 mb-3">Delivering to</p>
              <p className="font-semibold text-sm">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {order.shipping_address.address}<br/>
                {order.shipping_address.city} {order.shipping_address.postal_code}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">{order.shipping_address.phone}</p>
            </div>
          )}

          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5">
            <p className="text-xs font-bold uppercase tracking-widest-2 mb-3">Price Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>{(order.subtotal ?? order.total).toLocaleString()} MAD</span></div>
              {order.discount_amount ? <div className="flex justify-between text-green-700"><span>Discount</span><span>−{order.discount_amount.toLocaleString()} MAD</span></div> : null}
              <div className="flex justify-between font-black pt-2 border-t border-outline-variant"><span>Total</span><span className="text-primary">{order.total.toLocaleString()} MAD</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
