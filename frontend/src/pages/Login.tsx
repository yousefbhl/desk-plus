import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'

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

          <SocialAuthButtons />

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
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 text-on-surface-variant">mail</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-primary">Forgot?</Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="w-full mt-1 h-12 px-4 pl-11 pr-12 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 mt-0.5 text-on-surface-variant">lock</span>
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
