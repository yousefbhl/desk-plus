type Props = {
  onFilterChange?: (filters: { search?: string }) => void
}

export default function FilterSidebar({ onFilterChange }: Props) {
  return (
    <aside className="panel">
      <h3>Filters</h3>
      <input
        placeholder="Search products"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
    </aside>
  )
}
