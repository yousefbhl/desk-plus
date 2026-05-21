import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        password_confirmation: password,
        phone: phone || undefined,
      })
      navigate('/')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors
      if (typeof msg === 'object') {
        setError(Object.values(msg).flat().join(' '))
      } else {
        setError(msg || 'Registration failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* Left: Brand */}
      <div className="col-span-5 bg-surface-container-low p-12 flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="font-black text-2xl tracking-tight">Desk+ <span className="italic font-light">/ Mobilier de bureau</span></div>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary">Premium membership</p>
          <h1 className="h-display text-5xl mt-3 leading-none">Join the workspace<br/><span className="italic font-light">of thinkers.</span></h1>
          <p className="italic text-on-surface-variant mt-4 max-w-sm">Member-only pricing, first dibs on new collections, white-glove delivery, and 200 welcome points.</p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full btn-grad text-white grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span></span>Free returns on every order</div>
            <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full btn-grad text-white grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span></span>Early access to limited editions</div>
            <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full btn-grad text-white grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span></span>Personal style consultations</div>
          </div>
        </div>
        {/* Decoration */}
        <svg className="absolute -bottom-20 -right-20 w-[420px] h-[420px] opacity-30" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke="#ba0a0d" strokeWidth="1"/>
          <circle cx="100" cy="100" r="70" stroke="#ba0a0d" strokeWidth="1"/>
          <circle cx="100" cy="100" r="40" stroke="#ba0a0d" strokeWidth="1"/>
        </svg>
        <div className="text-xs text-on-surface-variant relative z-10">&copy; Desk+ Atelier &middot; Casablanca</div>
      </div>

      {/* Right: Form */}
      <div className="col-span-7 p-12 flex items-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Step 1 of 2</div>
          <h2 className="h-display text-4xl mt-2">Create your account</h2>
          <p className="text-sm text-on-surface-variant mt-2">Already have one? <Link to="/login" className="text-primary font-semibold underline">Sign in</Link></p>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 border border-outline-variant rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex-1 border border-outline-variant rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low">
              <svg width="18" height="18" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              Apple
            </button>
          </div>

          <div className="flex items-center gap-3 my-6 text-xs text-on-surface-variant"><div className="flex-1 h-px bg-outline-variant"></div>OR FILL IN BELOW<div className="flex-1 h-px bg-outline-variant"></div></div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-primary text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">First name</label>
                <input className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Last name</label>
                <input className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Email</label>
              <div className="relative">
                <input type="email" className="w-full mt-1 h-12 px-4 pr-12 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="w-full mt-1 h-12 px-4 pr-12 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2"><span className="material-symbols-outlined text-on-surface-variant">{showPw ? 'visibility_off' : 'visibility'}</span></button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Phone (optional, for delivery)</label>
              <div className="flex gap-2 mt-1">
                <button type="button" className="px-3 h-12 rounded-xl bg-surface-container-low border border-outline-variant font-semibold text-sm flex items-center gap-1.5">&#x1F1F2;&#x1F1E6; +212</button>
                <input className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant" value={phone} onChange={(e) => setPhone(e.target.value)}/>
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm mt-4"><span className="ck on mt-0.5"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></span><span>I agree to the <a className="underline">Terms of Service</a> and <a className="underline">Privacy Policy</a>.</span></label>
            <label className="flex items-start gap-2 text-sm"><span className="ck mt-0.5"></span><span>Send me curated style stories and member-only previews. <span className="text-on-surface-variant">(2 emails/month, unsubscribe anytime.)</span></span></label>

            <button type="submit" disabled={submitting} className="w-full mt-6 btn-grad text-white font-bold h-13 py-4 rounded-xl uppercase tracking-widest-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? 'Creating account…' : 'Create account & continue'} <span className="material-symbols-outlined">arrow_forward</span></button>
          </form>

          <div className="mt-6 text-xs text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>Your information is encrypted and never sold. We{"'"}re an independent Moroccan studio — not a marketplace.
          </div>
        </div>
      </div>
    </div>
  )
}
