// frontend/src/pages/ChooseRole.tsx
//
// New Google users land here (backend set role = 'pending' and
// redirected to /choose-role?token=xxx). They pick Customer or
// Seller, we POST it, then send them into the right area.

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

type Role = 'customer' | 'seller'

export default function ChooseRole() {
  const [params]  = useSearchParams()
  const navigate  = useNavigate()
  const { show }  = useToastStore()
  const { loginWithToken, setRole, user } = useAuthStore()

  const [selected, setSelected] = useState<Role | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [ready,    setReady]    = useState(false)
  const ran = useRef(false)

  // On arrival: store the token from the URL and load the user.
  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = params.get('token')

    // If we already have a logged-in user (e.g. refresh), just continue.
    if (!token && user) { setReady(true); return }

    if (!token) {
      show('Session expired. Please sign in again.', 'error')
      navigate('/login', { replace: true })
      return
    }

    ;(async () => {
      try {
        await loginWithToken(token)
        const u = useAuthStore.getState().user
        // Already has a real role? Don't make them choose again.
        if (u && u.role !== 'pending') {
          navigate(u.role === 'seller' ? '/seller' : '/', { replace: true })
          return
        }
        setReady(true)
      } catch {
        show('Could not load your account.', 'error')
        navigate('/login', { replace: true })
      }
    })()
  }, [])

  const handleContinue = async () => {
    if (!selected) { show('Pick how you want to use Desk+.', 'error'); return }
    setSaving(true)
    try {
      await setRole(selected)
      show('All set! Welcome to Desk+.', 'success')
      navigate(selected === 'seller' ? '/seller' : '/', { replace: true })
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Could not set your role.', 'error')
      setSaving(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-[#E02020]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white grid place-items-center px-4">
      <div className="w-full max-w-2xl">
        {/* header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E02020] text-sm font-black text-white">D+</div>
            <span className="text-lg font-black tracking-tight">DESK+</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-2 text-black/60">How do you want to use Desk+?</p>
        </div>

        {/* two cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard
            active={selected === 'customer'}
            onClick={() => setSelected('customer')}
            title="I'm a Customer"
            desc="Browse and buy office furniture and workstation setups."
            icon={<CartIcon />}
          />
          <RoleCard
            active={selected === 'seller'}
            onClick={() => setSelected('seller')}
            title="I'm a Seller"
            desc="List products, manage inventory, and track your sales."
            icon={<StoreIcon />}
          />
        </div>

        {/* continue */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="mt-8 w-full rounded-xl bg-[#E02020] py-3.5 font-bold text-white transition hover:bg-[#ba0a0d] disabled:opacity-60"
        >
          {saving ? 'Setting up…' : 'Continue'}
        </button>

        <p className="mt-4 text-center text-xs text-black/40">
          You can't change this later from your profile — pick what fits you.
        </p>
      </div>
    </div>
  )
}

/* ── card ──────────────────────────────────────────────────── */

function RoleCard({
  active, onClick, title, desc, icon,
}: {
  active: boolean
  onClick: () => void
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group rounded-2xl border-2 p-6 text-left transition',
        active
          ? 'border-[#E02020] bg-[#E02020]/5 shadow-sm'
          : 'border-black/10 hover:border-black/30',
      ].join(' ')}
    >
      <div
        className={[
          'mb-4 grid h-12 w-12 place-items-center rounded-xl transition',
          active ? 'bg-[#E02020] text-white' : 'bg-black/5 text-black/70',
        ].join(' ')}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-black">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-black/55">{desc}</p>
    </button>
  )
}

/* ── icons ─────────────────────────────────────────────────── */

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1-5h16l1 5" /><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}