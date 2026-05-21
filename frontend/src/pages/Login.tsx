import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      const user = useAuthStore.getState().user
      if (user?.role === 'admin') navigate('/admin')
      else if (user?.role === 'seller') navigate('/seller')
      else navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Left: form */}
      <div className="col-span-7 p-12 flex items-center">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 rounded-lg btn-grad grid place-items-center text-white font-black">D+</div>
            <span className="font-black tracking-tight">DESK+</span>
          </Link>

          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary">Welcome back</p>
          <h1 className="h-display text-5xl mt-2 leading-none">Sign in.</h1>
          <p className="text-sm text-on-surface-variant mt-3">New here? <Link to="/register" className="text-primary font-semibold underline">Create an account</Link></p>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 border border-outline-variant rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <button className="flex-1 border border-outline-variant rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low">
              <svg width="16" height="16" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9z"/></svg>
              Apple
            </button>
          </div>

          <div className="flex items-center gap-3 my-7 text-xs text-on-surface-variant">
            <div className="flex-1 h-px bg-outline-variant"></div>OR USE EMAIL<div className="flex-1 h-px bg-outline-variant"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-primary text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Email</label>
              <div className="relative">
                <input className="w-full mt-1 h-12 px-4 pl-11 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required/>
                <span className="material-symbols-outlined absolute left-3 top-1/2 translate-y-1 text-on-surface-variant">mail</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary">Forgot?</Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="w-full mt-1 h-12 px-4 pl-11 pr-12 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <span className="material-symbols-outlined absolute left-3 top-1/2 translate-y-1 text-on-surface-variant">lock</span>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2"><span className="material-symbols-outlined text-on-surface-variant">{showPw ? 'visibility_off' : 'visibility'}</span></button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm pt-1">
              <span className="ck on"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></span>
              Keep me signed in for 30 days
            </label>

            <button type="submit" disabled={submitting} className="w-full mt-7 btn-grad text-white font-bold py-4 rounded-xl uppercase tracking-widest-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? 'Signing in…' : 'Sign in'} <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
            Secured with 256-bit encryption
          </div>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="col-span-5 bg-[#1c1b1b] text-white p-12 flex flex-col justify-between relative overflow-hidden">
        <Link to="/" className="text-sm text-white/60 hover:text-white flex items-center gap-1 self-end"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>Back to store</Link>

        <div className="relative z-10">
          <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-4">Member workspace</p>
          <h2 className="h-display text-5xl leading-[0.95]">Sign in.<br/>Pick up where<br/><span className="italic font-light">you left off.</span></h2>

          <div className="mt-10 space-y-4 text-sm">
            <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full btn-grad grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>favorite</span></span><div><div className="font-bold">Your wishlist, synced</div><div className="text-white/60 text-xs">8 items waiting in your saved tab</div></div></div>
            <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full btn-grad grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_shipping</span></span><div><div className="font-bold">Track every order</div><div className="text-white/60 text-xs">Live carrier updates from atelier to door</div></div></div>
            <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full btn-grad grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>stars</span></span><div><div className="font-bold">1,842 points earned</div><div className="text-white/60 text-xs">158 to unlock Curator tier</div></div></div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          &copy; Desk+ Atelier &middot; Casablanca &middot; Trusted by 3,247 members
        </div>

        {/* Decorative glyph */}
        <svg className="absolute -right-32 -bottom-32 w-[460px] h-[460px] opacity-10" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="96" stroke="#ba0a0d" strokeWidth="1"/>
          <circle cx="100" cy="100" r="68" stroke="#ba0a0d" strokeWidth="1"/>
          <circle cx="100" cy="100" r="36" stroke="#ba0a0d" strokeWidth="1"/>
          <rect x="80" y="40" width="40" height="120" fill="#ba0a0d"/>
        </svg>
      </div>
    </div>
  )
}
