import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      await api.post('/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="grid grid-cols-3 gap-6 max-w-screen-xl w-full">

        {/* Step 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient relative">
          <div className="absolute -top-3 left-8 px-3 py-1 btn-grad text-white text-[10px] font-bold uppercase tracking-widest-2 rounded-full">Step 1 &middot; Active</div>
          <div className="text-xs font-bold uppercase tracking-widest-2 text-primary mt-2">Reset password</div>
          <h2 className="h-display text-3xl mt-2">Forgot it? <span className="italic font-light">Happens.</span></h2>
          {sent ? (
            <>
              <p className="text-sm text-on-surface-variant mt-3">Check your email! We sent a password reset link to <strong>{email}</strong>. It expires in 30 minutes.</p>
              <div className="my-6 h-px bg-outline-variant"></div>
              <div className="text-sm flex items-center justify-between">
                <Link to="/login" className="text-on-surface-variant">&larr; Back to sign in</Link>
                <Link to="/register" className="text-primary font-semibold underline">Create account</Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant mt-3">Enter the email tied to your account. We'll send you a secure reset link — valid for 30 minutes.</p>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Email</label>
                <input className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <button className="w-full mt-5 btn-grad text-white font-bold py-3.5 rounded-xl uppercase tracking-widest-2 text-sm" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Sending...' : 'Send reset link'}</button>
              <div className="my-6 h-px bg-outline-variant"></div>
              <div className="text-sm flex items-center justify-between">
                <Link to="/login" className="text-on-surface-variant">&larr; Back to sign in</Link>
                <Link to="/register" className="text-primary font-semibold underline">Create account</Link>
              </div>
              <div className="mt-6 p-3 rounded-lg bg-surface-container-low text-xs flex gap-2"><span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>info</span><span className="text-on-surface-variant">Not getting our emails? Add <strong>hello@deskplus.ma</strong> to your contacts.</span></div>
            </>
          )}
        </div>

        {/* Step 2 */}
        <div className="bg-surface-container-low rounded-xl p-8 relative opacity-90">
          <div className="absolute -top-3 left-8 px-3 py-1 bg-surface-container-high text-[10px] font-bold uppercase tracking-widest-2 rounded-full">Step 2</div>
          <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mt-2">Check inbox</div>
          <h2 className="h-display text-3xl mt-2">We sent the link.</h2>
          <p className="text-sm text-on-surface-variant mt-3">Open the email from Desk+ and tap the secure button. The link expires in 30 minutes.</p>

          <div className="mt-6 bg-surface-container-lowest rounded-xl p-5 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">From</div>
            <div className="font-semibold text-sm">Desk+ Atelier &lt;security@deskplus.ma&gt;</div>
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mt-3">Subject</div>
            <div className="font-semibold text-sm">Reset your Desk+ password</div>
            <div className="mt-4 p-4 rounded-lg btn-grad text-white text-center font-bold text-sm uppercase tracking-widest-2">Reset password &rarr;</div>
            <div className="text-[11px] text-on-surface-variant mt-3 text-center">Or paste: deskplus.ma/r/a8X2…sQ</div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Didn't get it?</span>
            <button className="font-semibold text-primary">Resend in 00:42</button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-surface-container-low rounded-xl p-8 relative opacity-90">
          <div className="absolute -top-3 left-8 px-3 py-1 bg-surface-container-high text-[10px] font-bold uppercase tracking-widest-2 rounded-full">Step 3</div>
          <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mt-2">New password</div>
          <h2 className="h-display text-3xl mt-2">Set a new one.</h2>
          <p className="text-sm text-on-surface-variant mt-3">12+ characters. We recommend a passphrase — three short words you'll remember.</p>

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">New password</label>
            <input type="password" className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant" defaultValue="••••••••••••"/>
            <div className="flex gap-1.5 mt-2">
              <div className="flex-1 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="flex-1 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="flex-1 h-1.5 rounded-full bg-emerald-500"></div>
              <div className="flex-1 h-1.5 rounded-full bg-surface-container-high"></div>
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">Strong</div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Confirm new password</label>
            <input type="password" className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-lowest border-2 border-emerald-500" defaultValue="••••••••••••"/>
            <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>Passwords match</div>
          </div>

          <ul className="mt-5 space-y-1.5 text-xs">
            <li className="flex items-center gap-2 text-emerald-700"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>12+ characters</li>
            <li className="flex items-center gap-2 text-emerald-700"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span>Mix of letters &amp; numbers</li>
            <li className="flex items-center gap-2 text-on-surface-variant"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>circle</span>One symbol (optional)</li>
          </ul>

          <button className="w-full mt-6 btn-grad text-white font-bold py-3.5 rounded-xl uppercase tracking-widest-2 text-sm">Update password &amp; sign in</button>
        </div>
      </div>
    </div>
  )
}
