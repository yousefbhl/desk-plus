import useCart from '../../hooks/useCart'

export default function CartDrawer() {
  const items = useCart((state) => state.items)
  const total = useCart((state) => state.total)

  return (
    <section className="panel">
      <h3>Cart</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.qty}
          </li>
        ))}
      </ul>
      <strong>Total: ${total().toFixed(2)}</strong>
    </section>
  )
}
