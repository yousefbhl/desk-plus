import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

function strengthLabel(pw: string) {
  if (!pw) return null
  if (pw.length < 6) return { label: 'Too short', w: '20%', color: 'bg-primary' }
  const checks = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length
  if (checks === 0) return { label: 'Weak', w: '35%', color: 'bg-primary' }
  if (checks === 1) return { label: 'Fair', w: '60%', color: 'bg-amber-500' }
  return { label: 'Strong', w: '100%', color: 'bg-green-600' }
}

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '', role: 'customer' as 'customer' | 'seller'
  })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useAuthStore()
  const { show }     = useToastStore()
  const navigate     = useNavigate()
  const strength     = strengthLabel(form.password)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      show('Passwords do not match', 'error'); return
    }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, password_confirmation: form.password_confirmation })
      show('Account created!', 'success')
      navigate('/')
    } catch (err: any) {
      const errors = err?.response?.data?.errors
      const msg = errors ? Object.values(errors).flat().join(' ') : err?.response?.data?.message ?? 'Registration failed'
      show(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ba0a0d 0%, #de2d24 100%)' }}>
        <div className="crosshatch absolute inset-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-9 h-9 rounded-lg bg-white/20 grid place-items-center font-black text-white text-sm">D+</div>
            <span className="font-black text-white tracking-tight text-lg">DESK+</span>
          </div>
          <h1 className="h-display text-5xl text-white mb-6 leading-tight">JOIN THE<br/>COMMUNITY</h1>
          <p className="text-white/80 text-lg max-w-xs leading-relaxed">
            Get access to exclusive office setups, seller tools, and custom workspace design.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          {['Access 500+ premium products', 'Track orders in real-time', 'Custom office space tools'].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 grid place-items-center shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>check</span>
              </div>
              <span className="text-white/80 text-sm">{t}</span>
            </div>
          ))}
        </div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-container-lowest overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
            <span className="font-black tracking-tight">DESK+</span>
          </div>

          <h2 className="h-display text-3xl mb-1">CREATE ACCOUNT</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Full Name</label>
              <input type="text" required className="field" placeholder="Mohamed Youssef" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Email</label>
              <input type="email" required className="field" placeholder="you@company.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Phone (optional)</label>
              <input type="tel" className="field" placeholder="+212 6 XX XX XX XX" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required minLength={8} className="field !pr-10" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.w }} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Confirm Password</label>
              <input type="password" required className="field" placeholder="Repeat password" value={form.password_confirmation} onChange={set('password_confirmation')} />
            </div>

            {/* Account type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-2 text-on-surface-variant">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(['customer', 'seller'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-outline'}`}
                  >
                    <span className={`material-symbols-outlined ${form.role === r ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontSize: 20 }}>
                      {r === 'customer' ? 'shopping_bag' : 'storefront'}
                    </span>
                    <p className={`text-xs font-bold mt-1 capitalize ${form.role === r ? 'text-primary' : ''}`}>{r}</p>
                    <p className="text-xs text-on-surface-variant">{r === 'customer' ? 'Browse & buy' : 'Sell products'}</p>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
