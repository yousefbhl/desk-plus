import { useParams } from 'react-router-dom'
import { useOrder } from '../hooks/useOrders'

const STATUS_STEPS = ['pending', 'preparing', 'shipping', 'delivered'] as const

function getStepIndex(status: string): number {
  const idx = STATUS_STEPS.indexOf(status.toLowerCase() as typeof STATUS_STEPS[number])
  return idx === -1 ? 0 : idx
}

function getProgressWidth(status: string): string {
  const idx = getStepIndex(status)
  return `${Math.round((idx / (STATUS_STEPS.length - 1)) * 100)}%`
}

const stepIcons = ['check', 'check', 'local_shipping', 'inventory_2']
const stepLabels = ['Order Placed', 'Preparing', 'Shipping', 'Delivered']

export default function OrderTracking() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(Number(id))

  if (isLoading) {
    return (
      <section className="max-w-screen-2xl mx-auto px-8 py-10">
        <div className="flex justify-center py-24">
          <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '48px' }}>progress_activity</span>
        </div>
      </section>
    )
  }

  if (isError || !order) {
    return (
      <section className="max-w-screen-2xl mx-auto px-8 py-10">
        <div className="bg-surface-container-lowest rounded-xl p-10 shadow-ambient text-center">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '48px' }}>error_outline</span>
          <div className="font-bold mt-3 text-lg">Order not found</div>
          <div className="text-on-surface-variant text-sm mt-1">The order you're looking for doesn't exist or you don't have access to it.</div>
        </div>
      </section>
    )
  }

  const currentStep = getStepIndex(order.status)
  const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  const statusClasses: Record<string, string> = {
    pending:    'bg-amber-100 text-amber-700',
    preparing:  'bg-blue-100 text-blue-700',
    processing: 'bg-blue-100 text-blue-700',
    shipping:   'bg-purple-100 text-purple-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-emerald-100 text-emerald-700',
    cancelled:  'bg-red-100 text-red-700',
  }
  const chipClass = statusClasses[order.status.toLowerCase()] ?? 'bg-gray-100 text-gray-700'
  const createdDate = new Date(order.created_at)
  const dateStr = createdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <section className="max-w-screen-2xl mx-auto px-8 py-10">
      {/* Order header card */}
      <div className="bg-surface-container-lowest rounded-xl p-7 shadow-ambient flex items-center gap-10">
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Order</div>
          <div className="text-2xl font-black font-mono mt-1 text-primary">#{order.reference ?? `DK-${String(order.id).padStart(5, '0')}`}</div>
          <div className="text-sm text-on-surface-variant mt-1">Placed {dateStr} · {timeStr}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Items</div>
          <div className="text-3xl font-black">{itemCount}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Total</div>
          <div className="text-3xl font-black">{order.total.toLocaleString()} <span className="text-base">MAD</span></div>
        </div>
        <div><span className={`chip ${chipClass} uppercase tracking-widest-2 px-4 py-2`}>{order.status}</span></div>
      </div>

      {/* Timeline */}
      <div className="bg-surface-container-lowest rounded-xl p-10 shadow-ambient mt-6">
        <h2 className="h-display text-lg mb-8">Progress</h2>
        <div className="relative flex items-start">
          {/* bar */}
          <div className="absolute left-6 right-6 top-6 h-1.5 bg-surface-container-high rounded-full -z-0">
            <div className="h-full bg-primary rounded-full" style={{ width: getProgressWidth(order.status) }}></div>
          </div>
          <div className="relative grid grid-cols-4 w-full">
            {stepLabels.map((label, idx) => {
              const isCompleted = idx <= currentStep
              const isCurrent = idx === currentStep
              return (
                <div key={label} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${isCompleted ? 'btn-grad text-white' : 'bg-surface-container-high text-on-surface-variant'} grid place-items-center${isCurrent ? ' pulse-ring' : ''}`}>
                    <span className="material-symbols-outlined">{isCompleted ? stepIcons[idx] : stepIcons[idx]}</span>
                  </div>
                  <div className={`text-xs ${isCurrent ? 'font-bold mt-3 text-primary' : isCompleted ? 'font-bold mt-3' : 'font-semibold mt-3 text-on-surface-variant'}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Shipment */}
        <div className="col-span-7 bg-surface-container-lowest rounded-xl p-7 shadow-ambient">
          <h3 className="h-display text-lg mb-5">Shipment details</h3>
          <div className="bg-surface-container-low rounded-xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white grid place-items-center font-black tracking-tight">CTM</div>
            <div className="flex-1">
              <div className="font-bold">CTM Express</div>
              <div className="text-xs text-on-surface-variant">Tracking <span className="font-mono">#{order.reference ?? order.id}</span></div>
            </div>
            <button className="border border-outline-variant font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>Track with carrier</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="bg-surface-container-low rounded-xl p-5">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Deliver to</div>
              {order.shipping_address ? (
                <>
                  <div className="font-bold mt-1">{order.shipping_address.first_name} {order.shipping_address.last_name}</div>
                  <div className="text-sm text-on-surface-variant">{order.shipping_address.address_line1}<br />{order.shipping_address.city}{order.shipping_address.postal_code ? ` ${order.shipping_address.postal_code}` : ''}{order.shipping_address.country ? `, ${order.shipping_address.country}` : ''}</div>
                  {order.shipping_address.phone && <div className="text-sm text-on-surface-variant mt-1">{order.shipping_address.phone}</div>}
                </>
              ) : (
                <div className="text-sm text-on-surface-variant mt-1">No shipping address provided</div>
              )}
            </div>
            <div className="bg-surface-container-low rounded-xl p-5">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Payment method</div>
              <div className="font-bold mt-1">{order.payment_method ?? 'N/A'}</div>
              <div className="text-sm text-on-surface-variant">Status: {order.payment_status ?? 'Unknown'}</div>
            </div>
          </div>

          {/* Delivery notes */}
          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-widest-2 mb-2">Delivery notes</div>
            <textarea rows={3} className="w-full p-4 rounded-xl bg-surface-container-high text-sm" placeholder="Add delivery instructions for the courier…" defaultValue={order.notes ?? ''} />
            <button className="mt-3 border border-outline-variant font-semibold px-5 py-2.5 rounded-xl text-sm">Save note</button>
          </div>
        </div>

        {/* Items */}
        <div className="col-span-5 bg-surface-container-lowest rounded-xl p-7 shadow-ambient">
          <h3 className="h-display text-lg mb-5">In this order</h3>
          <div className="space-y-4">
            {(order.items ?? []).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high grid place-items-center text-xs font-bold text-on-surface-variant">{item.product_name.charAt(0)}</div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{item.product_name}</div>
                  <div className="text-xs text-on-surface-variant">Qty {item.quantity}{item.variant_label ? ` · ${item.variant_label}` : ''}</div>
                </div>
                <div className="font-bold">{item.total.toLocaleString()}</div>
              </div>
            ))}
            {(!order.items || order.items.length === 0) && (
              <div className="text-sm text-on-surface-variant">No items</div>
            )}
          </div>
          <div className="my-5 h-px bg-outline-variant"></div>
          <div className="space-y-2 text-sm">
            {order.subtotal != null && <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>{order.subtotal.toLocaleString()} MAD</span></div>}
            {order.discount_amount != null && order.discount_amount > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Discount</span><span className="text-emerald-700">−{order.discount_amount.toLocaleString()} MAD</span></div>}
            {order.shipping_cost != null && <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>{order.shipping_cost.toLocaleString()} MAD</span></div>}
            {order.tax != null && <div className="flex justify-between"><span className="text-on-surface-variant">Tax</span><span>{order.tax.toLocaleString()} MAD</span></div>}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-outline-variant"><span className="font-bold">Total</span><span className="text-2xl font-black text-primary">{order.total.toLocaleString()} MAD</span></div>
          <button className="mt-5 w-full border border-outline-variant font-semibold py-3 rounded-xl text-sm">Download invoice</button>
        </div>
      </div>
    </section>
  )
}
