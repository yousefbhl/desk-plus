import { useMemo } from 'react'
import type { SellerOrder } from '../types'
import { useSellerOrders, useUpdateSellerOrderStatus } from '../hooks/useSeller'
import { useUiStore } from '../store/uiStore'

const STATUS_CHIP: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-primary',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  preparing: 'Confirmed',
  shipping: 'Shipping',
  shipped: 'Shipping',
  delivered: 'Delivered',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
}

function formatMoney(amount: number | undefined) {
  return `${(amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function trackingText(status: string) {
  if (status === 'cancelled') return 'Cancelled by support request'
  if (status === 'delivered') return 'Order delivered to the customer'
  if (status === 'shipping' || status === 'shipped') return 'Order is out for delivery'
  if (status === 'preparing' || status === 'confirmed') return 'Order confirmed and queued for fulfillment'
  return 'Waiting for seller confirmation'
}

function downloadOrderPdf(order: SellerOrder) {
  const items = order.items?.map((item) =>
    `<tr><td>${item.product_name}</td><td>${item.quantity}</td><td>${formatMoney(item.total)}</td></tr>`
  ).join('') || ''

  const html = `
    <html>
      <head>
        <title>${order.reference ?? `Order-${order.id}`}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #1c1b1b; }
          h1 { margin: 0 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
          th { font-size: 12px; text-transform: uppercase; color: #666; }
          .total { margin-top: 24px; font-size: 20px; font-weight: 800; }
        </style>
      </head>
      <body>
        <h1>${order.reference ?? `#${order.id}`}</h1>
        <div>Client: ${order.customer?.name ?? 'Client'}</div>
        <div>Date: ${formatDate(order.created_at)}</div>
        <div>Status: ${STATUS_LABEL[order.status] ?? order.status}</div>
        <table>
          <thead><tr><th>Produit</th><th>Quantite</th><th>Total</th></tr></thead>
          <tbody>${items}</tbody>
        </table>
        <div class="total">Montant seller: ${formatMoney(order.seller_total)}</div>
      </body>
    </html>
  `

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  win.print()
}

export default function SellerOrders() {
  const { data, isLoading } = useSellerOrders({ per_page: 20 })
  const updateStatus = useUpdateSellerOrderStatus()
  const { showToast } = useUiStore()

  const orders = useMemo(() => data?.data ?? [], [data])

  const changeStatus = (order: SellerOrder, status: string) => {
    updateStatus.mutate(
      { id: order.id, status, note: status === 'cancelled' ? 'Cancelled by seller.' : 'Confirmed by seller.' },
      {
        onSuccess: () => showToast(status === 'cancelled' ? 'Commande annulee.' : 'Commande confirmee.', 'success'),
        onError: () => showToast('Impossible de modifier la commande.', 'error'),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="h-display text-3xl">Commandes</h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
          Superviser l'etat des commandes, le suivi des livraisons et les actions de confirmation ou d'annulation sensibles aux clients.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h2 className="h-display text-lg">Dernieres commandes</h2>
          <p className="text-sm text-on-surface-variant mt-2">Cette file lit maintenant la vraie table de commandes.</p>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs text-on-surface-variant border-b border-outline-variant">
            <tr>
              <th className="text-left px-8 py-4 font-medium">Commande</th>
              <th className="text-left py-4 font-medium">Client</th>
              <th className="text-left py-4 font-medium">Statut</th>
              <th className="text-left py-4 font-medium">Suivi de la livraison</th>
              <th className="text-left py-4 font-medium">Montant</th>
              <th className="text-right px-8 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-8 py-3">
                  <div className="font-mono font-bold text-on-surface">#{order.reference ?? `SK-${String(order.id).padStart(5, '0')}`}</div>
                  <div className="text-xs text-on-surface-variant mt-1">{formatDate(order.created_at)}</div>
                </td>
                <td className="py-3">
                  <div className="font-medium">{order.customer?.name ?? 'Client'}</div>
                  <div className="text-xs text-on-surface-variant mt-1">{order.items_count} article{order.items_count > 1 ? 's' : ''}</div>
                </td>
                <td className="py-3">
                  <span className={`chip ${STATUS_CHIP[order.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_shipping</span>
                    </span>
                    <span className="text-on-surface-variant">{trackingText(order.status)}</span>
                  </div>
                </td>
                <td className="py-3 font-black">{formatMoney(order.seller_total)}</td>
                <td className="px-8 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => changeStatus(order, 'preparing')}
                      disabled={updateStatus.isPending || order.status === 'cancelled' || order.status === 'delivered'}
                      className="bg-[#00c853] text-black font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                      Confirmer
                    </button>
                    <button
                      onClick={() => downloadOrderPdf(order)}
                      className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                      PDF
                    </button>
                    <button
                      onClick={() => changeStatus(order, 'cancelled')}
                      disabled={updateStatus.isPending || order.status === 'cancelled' || order.status === 'delivered'}
                      className="border border-red-200 bg-white text-primary font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>cancel</span>
                      Annuler
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-on-surface-variant">
                  Aucune commande pour vos produits pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
