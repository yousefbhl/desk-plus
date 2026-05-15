import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api'
import { TableRowSkeleton } from '../components/ui/Skeleton'
import { useToastStore } from '../store/toastStore'

const ROLES = ['all', 'admin', 'seller', 'customer']
const ROLE_CLASS: Record<string, string> = { admin: 'bg-primary/10 text-primary', seller: 'bg-blue-50 text-blue-700', customer: 'bg-surface-container-high text-on-surface-variant' }

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState('all')
  const [search, setSearch]         = useState('')
  const qc = useQueryClient()
  const { show } = useToastStore()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, search],
    queryFn: () => adminApi.users({ role: roleFilter === 'all' ? undefined : roleFilter, search: search || undefined }).then((r) => r.data),
  })

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => adminApi.updateUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); show('Role updated', 'success') },
  })

  const deleteUser = useMutation({
    mutationFn: (id: number) => adminApi.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); show('User deleted', 'success') },
  })

  const users = data?.data ?? []

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Manage</p>
        <h1 className="h-display text-4xl">USERS</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>search</span>
          <input className="field !pl-9 !h-10 w-64" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-surface-container-low rounded-xl p-1">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${roleFilter === r ? 'bg-surface-container-lowest shadow-ambient text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant border-b border-outline-variant/60">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Change Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-on-surface-variant">No users found</td></tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="border-b border-outline-variant/40 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center shrink-0">
                      <span className="text-xs font-bold text-primary">{u.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-on-surface-variant">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`chip capitalize ${ROLE_CLASS[u.role] ?? ''}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{u.phone ?? '—'}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                    className="field !h-8 !py-0 !w-auto text-xs cursor-pointer"
                  >
                    {['admin', 'seller', 'customer'].map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { if (confirm(`Delete ${u.name}?`)) deleteUser.mutate(u.id) }}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 grid place-items-center text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
