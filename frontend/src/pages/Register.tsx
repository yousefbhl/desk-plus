import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'

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

          <SocialAuthButtons />

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
