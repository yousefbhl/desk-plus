import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToastStore } from '../store/toastStore'

export default function ForgotPassword() {
  const [step,  setStep]  = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [code,  setCode]  = useState('')
  const [pw,    setPw]    = useState('')
  const [pwc,   setPwc]   = useState('')
  const [loading, setLoading] = useState(false)
  const { show } = useToastStore()

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setStep(2)
    show('Reset link sent to your email', 'success')
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 4) { show('Enter the code from your email', 'error'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setStep(3)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pw !== pwc) { show('Passwords do not match', 'error'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    show('Password updated! Please sign in.', 'success')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-ambient p-10">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
          <span className="font-black tracking-tight">DESK+</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold transition-colors ${n < step ? 'bg-primary text-white' : n === step ? 'bg-primary text-white pulse-ring' : 'bg-surface-container-high text-on-surface-variant'}`}>
                {n < step ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span> : n}
              </div>
              {n < 3 && <div className={`flex-1 h-0.5 w-8 rounded-full ${n < step ? 'bg-primary' : 'bg-surface-container-high'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleSendLink} className="space-y-5">
            <div>
              <h2 className="h-display text-2xl mb-1">FORGOT PASSWORD?</h2>
              <p className="text-sm text-on-surface-variant">Enter your email and we'll send a reset link.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Email Address</label>
              <input type="email" required className="field" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Reset Link →'}
            </button>
            <Link to="/login" className="block text-center text-sm text-on-surface-variant hover:text-on-surface">← Back to Sign In</Link>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="w-12 h-12 rounded-full bg-primary/10 grid place-items-center mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>mark_email_read</span>
            </div>
            <div>
              <h2 className="h-display text-2xl mb-1">CHECK INBOX</h2>
              <p className="text-sm text-on-surface-variant">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Verification Code</label>
              <input type="text" maxLength={6} className="field !text-center !font-mono !text-2xl !tracking-widest" placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g,''))} />
            </div>
            <button type="submit" disabled={loading} className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Code →'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="block w-full text-center text-sm text-on-surface-variant hover:text-on-surface">Resend email</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <h2 className="h-display text-2xl mb-1">NEW PASSWORD</h2>
              <p className="text-sm text-on-surface-variant">Choose a strong new password.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">New Password</label>
              <input type="password" required minLength={8} className="field" placeholder="Min. 8 characters" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Confirm Password</label>
              <input type="password" required className="field" placeholder="Repeat password" value={pwc} onChange={(e) => setPwc(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
