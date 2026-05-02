import { createOrder } from '../api/orders'
import useCart from '../hooks/useCart'

export default function Checkout() {
  const items = useCart((state) => state.items)
  const total = useCart((state) => state.total)
  const clear = useCart((state) => state.clear)

  const submit = async () => {
    if (!items.length) return

    await createOrder({
      total: total(),
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        price: item.price,
      })),
    })

    clear()
  }

  return (
    <section>
      <h1>Checkout</h1>
      <button onClick={() => void submit()} disabled={!items.length}>
        Place order (${total().toFixed(2)})
      </button>
    </section>
  )
}
