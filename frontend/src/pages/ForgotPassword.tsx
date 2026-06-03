import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { passwordApi } from '../api'
import { useToastStore } from '../store/toastStore'

export default function ForgotPassword() {
  const [step,  setStep]  = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [code,  setCode]  = useState('')
  const [pw,    setPw]    = useState('')
  const [pwc,   setPwc]   = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)   // resend timer (seconds)
  const { show } = useToastStore()

  // countdown for the "resend code" button
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (cooldown <= 0) { if (timer.current) clearInterval(timer.current); return }
    timer.current = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [cooldown])

  // ── STEP 1 — request a code ──────────────────────────────────
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await passwordApi.forgot(email)
      show(data.message ?? 'If an account exists, a code has been sent.', 'success')
      setStep(2)
      setCooldown(45) // can resend after 45s
    } catch (err: any) {
      // 429 = throttled; show the server's message
      show(err?.response?.data?.message ?? 'Something went wrong. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // resend from step 2
  const handleResend = async () => {
    if (cooldown > 0) return
    setLoading(true)
    try {
      const { data } = await passwordApi.forgot(email)
      show(data.message ?? 'Code resent.', 'success')
      setCooldown(45)
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Could not resend. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 2 — verify the code ─────────────────────────────────
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) { show('Enter the 6-digit code from your email', 'error'); return }
    setLoading(true)
    try {
      await passwordApi.verify(email, code)
      setStep(3)
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Invalid or expired code.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 3 — set new password ────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.length < 8) { show('Password must be at least 8 characters', 'error'); return }
    if (pw !== pwc)    { show('Passwords do not match', 'error'); return }
    setLoading(true)
    try {
      await passwordApi.reset(email, code, pw, pwc)
      show('Password updated! Please sign in.', 'success')
      setTimeout(() => { window.location.href = '/login' }, 800)
    } catch (err: any) {
      show(err?.response?.data?.message ?? 'Could not reset password.', 'error')
      setLoading(false)
    }
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

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <h2 className="h-display text-2xl mb-1">FORGOT PASSWORD?</h2>
              <p className="text-sm text-on-surface-variant">Enter your email and we'll send a 6-digit code.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Email Address</label>
              <input type="email" required className="field" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Code →'}
            </button>
            <Link to="/login" className="block text-center text-sm text-on-surface-variant hover:text-on-surface">← Back to Sign In</Link>
          </form>
        )}

        {/* STEP 2 */}
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
              <input type="text" inputMode="numeric" maxLength={6} className="field !text-center !font-mono !text-2xl !tracking-widest" placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g,''))} />
            </div>
            <button type="submit" disabled={loading} className="btn-grad w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Code →'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className="block w-full text-center text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
            </button>
          </form>
        )}

        {/* STEP 3 */}
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