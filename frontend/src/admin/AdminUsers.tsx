import { useAdminUsers } from '../hooks/useAdmin'

export default function AdminUsers() {
  const { data, isLoading } = useAdminUsers()

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
        <div><h1 className="h-display text-3xl">Users</h1><p className="text-sm text-on-surface-variant">3,247 customers · 142 staff &amp; sellers</p></div>
        <div className="flex gap-2"><button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm">Invite staff</button><button className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2">+ New user</button></div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Customers</div><div className="text-3xl font-black mt-1">3,247</div><div className="text-xs text-emerald-700">+128 this month</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Premium</div><div className="text-3xl font-black mt-1 text-primary">412</div><div className="text-xs text-on-surface-variant">12.7% of total</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Active sellers</div><div className="text-3xl font-black mt-1">28</div><div className="text-xs text-on-surface-variant">4 pending review</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Avg. LTV</div><div className="text-3xl font-black mt-1">8,420</div><div className="text-xs text-emerald-700">MAD · &uarr; 14%</div></div>
      </div>

      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 pt-5 flex items-center gap-1 border-b border-outline-variant">
          <button className="px-4 py-3 text-sm font-bold border-b-2 border-primary text-primary">All <span className="text-xs text-on-surface-variant">3,389</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Customers <span className="text-xs">3,247</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Premium <span className="text-xs">412</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Sellers <span className="text-xs">28</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Staff <span className="text-xs">14</span></button>
        </div>
        <div className="p-5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search by name, email, phone..." /></div>
          <button className="chip border border-outline-variant bg-white">Tag: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="chip border border-outline-variant bg-white">City: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low border-b border-outline-variant"><th className="text-left px-6 py-3">Name</th><th className="text-left py-3">Contact</th><th className="text-left py-3">Role</th><th className="text-right py-3">Orders</th><th className="text-right py-3">Spent</th><th className="text-left py-3">Joined</th><th className="text-left py-3 px-6">Last seen</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center text-xs font-black">AT</div><div><div className="font-bold">Aicha Talbi <span className="material-symbols-outlined text-amber-500 align-middle" style={{fontSize:14}}>verified</span></div><div className="text-xs text-on-surface-variant">Casablanca</div></div></div></td><td><div className="text-xs">aicha@atelier-nord.ma<br /><span className="text-on-surface-variant">+212 6 12 34 56 78</span></div></td><td><span className="chip bg-amber-100 text-amber-700">Premium</span></td><td className="text-right font-bold">12</td><td className="text-right font-black">87,420 MAD</td><td>Jan 2023</td><td className="px-6 text-emerald-700">&#9679; online</td></tr>
            <tr className="bg-surface-container-low/30"><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#5f5e5e] text-white grid place-items-center text-xs font-black">LC</div><div><div className="font-bold">Laila Chraibi</div><div className="text-xs text-on-surface-variant">Casablanca · Studio Anfa</div></div></div></td><td><div className="text-xs">laila@studioanfa.ma<br /><span className="text-on-surface-variant">+212 6 22 33 44 55</span></div></td><td><span className="chip bg-purple-100 text-purple-700">B2B</span></td><td className="text-right font-bold">28</td><td className="text-right font-black">312,500 MAD</td><td>Mar 2022</td><td className="px-6 text-on-surface-variant">2h ago</td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#7c4a3a] text-white grid place-items-center text-xs font-black">YK</div><div><div className="font-bold">Youssef Khalil</div><div className="text-xs text-on-surface-variant">Rabat</div></div></div></td><td><div className="text-xs">youssef.k@gmail.com<br /><span className="text-on-surface-variant">+212 6 55 66 77 88</span></div></td><td><span className="chip bg-blue-100 text-blue-700">Seller</span></td><td className="text-right font-bold">&mdash;</td><td className="text-right font-black">48,200 MAD <span className="text-xs text-on-surface-variant">sold</span></td><td>Jul 2024</td><td className="px-6 text-on-surface-variant">5h ago</td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#1c1b1b] text-white grid place-items-center text-xs font-black">SF</div><div><div className="font-bold">Sofia Filali</div><div className="text-xs text-on-surface-variant">Marrakech</div></div></div></td><td><div className="text-xs">sofia.f@outlook.com<br /><span className="text-on-surface-variant">+212 6 11 22 33 44</span></div></td><td><span className="chip bg-gray-200 text-gray-700">Customer</span></td><td className="text-right font-bold">1</td><td className="text-right font-black">4,780 MAD</td><td>This week</td><td className="px-6 text-on-surface-variant">14m ago</td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center text-xs font-black">RM</div><div><div className="font-bold">Rachid Moubarak <span className="material-symbols-outlined text-amber-500 align-middle" style={{fontSize:14}}>verified</span></div><div className="text-xs text-on-surface-variant">Casablanca</div></div></div></td><td><div className="text-xs">r.moubarak@me.com<br /><span className="text-on-surface-variant">+212 6 99 88 77 66</span></div></td><td><span className="chip bg-amber-100 text-amber-700">Premium</span></td><td className="text-right font-bold">3</td><td className="text-right font-black">42,180 MAD</td><td>Nov 2024</td><td className="px-6 text-emerald-700">&#9679; online</td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#5f5e5e] text-white grid place-items-center text-xs font-black">MB</div><div><div className="font-bold">Mehdi Bensaid</div><div className="text-xs text-on-surface-variant">Tangier</div></div></div></td><td><div className="text-xs">mehdi@bensaid.io<br /><span className="text-on-surface-variant">+212 6 44 55 66 77</span></div></td><td><span className="chip bg-gray-200 text-gray-700">Customer</span></td><td className="text-right font-bold">2</td><td className="text-right font-black">8,490 MAD</td><td>Oct 2024</td><td className="px-6 text-on-surface-variant">Yesterday</td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#7c4a3a] text-white grid place-items-center text-xs font-black">FA</div><div><div className="font-bold">Farah Ait Yacoub</div><div className="text-xs text-on-surface-variant">Casablanca · Staff</div></div></div></td><td><div className="text-xs">farah@deskplus.ma<br /><span className="text-on-surface-variant">Internal</span></div></td><td><span className="chip bg-[#1c1b1b] text-white">Staff · Curator</span></td><td className="text-right">&mdash;</td><td className="text-right">&mdash;</td><td>Founding</td><td className="px-6 text-emerald-700">&#9679; online</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
