type Props = {
  label: string
  value: string | number
}

export default function StatCard({ label, value }: Props) {
  return (
    <article className="card">
      <small>{label}</small>
      <strong>{value}</strong>
    </article>
  )
}
