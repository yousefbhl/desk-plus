import { useState } from 'react'
import { useAdminUsers, useUpdateUserRole } from '../hooks/useAdmin'
import { useUiStore } from '../store/uiStore'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const ROLE_CHIP: Record<string, string> = {
  admin:    'bg-[#1c1b1b] text-white',
  seller:   'bg-blue-100 text-blue-700',
  customer: 'bg-gray-200 text-gray-700',
}

const AVATAR_BG = ['bg-primary', 'bg-[#5f5e5e]', 'bg-[#7c4a3a]', 'bg-[#1c1b1b]', 'bg-[#5c403c]']

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminUsers({ search: search || undefined, role: roleFilter || undefined, page, per_page: 20 })
  const updateRole = useUpdateUserRole()
  const { showToast } = useUiStore()

  const users: any[] = data?.data ?? []
  const meta = (data as any)?.meta ?? data
  const total = meta?.total ?? users.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="h-display text-3xl">Users</h1><p className="text-sm text-on-surface-variant">{total} user{total !== 1 ? 's' : ''} found</p></div>
        <div className="flex gap-2"><button onClick={() => showToast('Staff invitation coming soon', 'info')} className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm">Invite staff</button><button onClick={() => showToast('New user creation coming soon', 'info')} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2">+ New user</button></div>
      </div>

      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 pt-5 flex items-center gap-1 border-b border-outline-variant">
          <button onClick={() => { setRoleFilter(''); setPage(1) }} className={`px-4 py-3 text-sm font-bold ${!roleFilter ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>All <span className="text-xs text-on-surface-variant">{total}</span></button>
          <button onClick={() => { setRoleFilter('customer'); setPage(1) }} className={`px-4 py-3 text-sm font-semibold ${roleFilter === 'customer' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>Customers</button>
          <button onClick={() => { setRoleFilter('seller'); setPage(1) }} className={`px-4 py-3 text-sm font-semibold ${roleFilter === 'seller' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>Sellers</button>
          <button onClick={() => { setRoleFilter('admin'); setPage(1) }} className={`px-4 py-3 text-sm font-semibold ${roleFilter === 'admin' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>Admin</button>
        </div>
        <div className="p-5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search by name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} /></div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low border-b border-outline-variant"><th className="text-left px-6 py-3">Name</th><th className="text-left py-3">Contact</th><th className="text-left py-3">Role</th><th className="text-right py-3">Orders</th><th className="text-right py-3">Products</th><th className="text-left py-3">Joined</th><th className="text-left py-3 px-6">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {users.map((user: any, i: number) => (
              <tr key={user.id} className={i % 2 === 1 ? 'bg-surface-container-low/30' : ''}>
                <td className="px-6 py-3"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full ${AVATAR_BG[i % AVATAR_BG.length]} text-white grid place-items-center text-xs font-black`}>{initials(user.name ?? 'U')}</div><div><div className="font-bold">{user.name}</div><div className="text-xs text-on-surface-variant">{user.phone ?? ''}</div></div></div></td>
                <td><div className="text-xs">{user.email}</div></td>
                <td>
                  <select
                    className={`chip ${ROLE_CHIP[user.role] ?? 'bg-gray-200 text-gray-700'} cursor-pointer`}
                    value={user.role}
                    onChange={(e) => {
                      updateRole.mutate(
                        { id: user.id, role: e.target.value },
                        {
                          onSuccess: () => showToast('Role updated'),
                          onError: () => showToast('Failed to update role', 'error'),
                        }
                      )
                    }}
                  >
                    <option value="customer">customer</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="text-right font-bold">{user.orders_count ?? '—'}</td>
                <td className="text-right">{user.products_count ?? '—'}</td>
                <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                <td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
