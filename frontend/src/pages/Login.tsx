import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)

  const { login } = useAuthStore()
  const { show }  = useToastStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = (location.state as { from?: string })?.from ?? '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      const user = useAuthStore.getState().user
      navigate(user?.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT — brand panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ba0a0d 0%, #de2d24 100%)' }}>
        <div className="crosshatch absolute inset-0 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-9 h-9 rounded-lg bg-white/20 grid place-items-center font-black text-white text-sm">D+</div>
            <span className="font-black text-white tracking-tight text-lg">DESK+</span>
          </div>
          <h1 className="h-display text-5xl text-white mb-6 leading-tight">
            WELCOME<br/>BACK
          </h1>
          <p className="text-white/80 text-lg max-w-xs leading-relaxed">
            Your perfect workspace is waiting. Sign in to continue your journey.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {['500+ premium office products', 'Real-time order tracking', 'Custom workspace design'].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 grid place-items-center shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>check</span>
              </div>
              <span className="text-white/80 text-sm">{t}</span>
            </div>
          ))}
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface-container-lowest">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
            <span className="font-black tracking-tight">DESK+</span>
          </div>

          <h2 className="h-display text-3xl mb-1">SIGN IN</h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="field"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest-2 text-on-surface-variant">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="field !pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
