import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type Step = 1 | 2 | 3

function stepBadge(step: Step, activeStep: Step) {
  if (step === activeStep) return `Step ${step} · Active`
  if (step < activeStep) return `Step ${step} · Done`
  return `Step ${step}`
}

function stepCardClass(step: Step, activeStep: Step) {
  const base = 'rounded-xl p-8 relative transition-all duration-300'
  if (step === activeStep) return `${base} bg-surface-container-lowest shadow-ambient`
  return `${base} bg-surface-container-lowest shadow-ambient`
}

function badgeClass(step: Step, activeStep: Step) {
  if (step <= activeStep) return 'btn-grad text-white'
  return 'bg-surface-container-high text-on-surface'
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const normalizedEmail = email.trim()
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  const passwordLong = newPassword.length >= 12
  const passwordMixed = /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword)
  const passwordHasSymbol = /[^A-Za-z0-9]/.test(newPassword)
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

  const strength = useMemo(() => {
    return [passwordLong, passwordMixed, passwordHasSymbol].filter(Boolean).length
  }, [passwordLong, passwordMixed, passwordHasSymbol])

  const sendResetLink = (event: FormEvent) => {
    event.preventDefault()
    if (!emailValid) {
      setError('Enter a valid email first.')
      return
    }

    setError('')
    setActiveStep(2)
  }

  const openPasswordStep = () => {
    setError('')
    setActiveStep(3)
  }

  const finishReset = (event: FormEvent) => {
    event.preventDefault()
    if (!passwordLong || !passwordMixed || !passwordsMatch) {
      setError('Complete the password rules before signing in.')
      return
    }

    setError('')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md mx-auto">
        {activeStep === 1 && (
        <form onSubmit={sendResetLink} className={stepCardClass(1, activeStep)}>
          <div className={`absolute -top-3 left-8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest-2 rounded-full ${badgeClass(1, activeStep)}`}>
            {stepBadge(1, activeStep)}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest-2 text-primary mt-2">Reset password</div>
          <h2 className="h-display text-3xl mt-2">Forgot it? <span className="italic font-light">Happens.</span></h2>
          <p className="text-sm text-on-surface-variant mt-3">Enter your Gmail or account email. We will move you to the next setup step.</p>

          {error && activeStep === 1 && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Email</label>
            <input
              type="email"
              className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={activeStep !== 1}
            />
          </div>

          <button
            type="submit"
            disabled={activeStep !== 1}
            className="w-full mt-5 btn-grad text-white font-bold py-3.5 rounded-xl uppercase tracking-widest-2 text-sm disabled:opacity-50"
          >
            Send reset link
          </button>

          <div className="my-6 h-px bg-outline-variant"></div>
          <div className="text-sm flex items-center justify-between">
            <Link to="/login" className="text-on-surface-variant">&larr; Back to sign in</Link>
            <Link to="/register" className="text-primary font-semibold underline">Create account</Link>
          </div>
          <div className="mt-6 p-3 rounded-lg bg-surface-container-low text-xs flex gap-2">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>info</span>
            <span className="text-on-surface-variant">Not getting our emails? Add <strong>hello@deskplus.ma</strong> to your contacts.</span>
          </div>
        </form>
        )}

        {activeStep === 2 && (
        <div className={stepCardClass(2, activeStep)}>
          <div className={`absolute -top-3 left-8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest-2 rounded-full ${badgeClass(2, activeStep)}`}>
            {stepBadge(2, activeStep)}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mt-2">Check inbox</div>
          <h2 className="h-display text-3xl mt-2">We sent the link.</h2>
          <p className="text-sm text-on-surface-variant mt-3">Open the reset email for {normalizedEmail}.</p>

          <div className="mt-6 bg-surface-container-lowest rounded-xl p-5 shadow-soft">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">From</div>
            <div className="font-semibold text-sm">Desk+ Atelier &lt;security@deskplus.ma&gt;</div>
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mt-3">Subject</div>
            <div className="font-semibold text-sm">Reset your Desk+ password</div>
            <button
              type="button"
              onClick={openPasswordStep}
              className="w-full mt-4 p-4 rounded-lg btn-grad text-white text-center font-bold text-sm uppercase tracking-widest-2"
            >
              Reset password &rarr;
            </button>
            <div className="text-[11px] text-on-surface-variant mt-3 text-center">Or paste: deskplus.ma/r/a8X2...sQ</div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Didn't get it?</span>
            <button type="button" onClick={() => setActiveStep(1)} className="font-semibold text-primary">Change email</button>
          </div>
        </div>
        )}

        {activeStep === 3 && (
        <form onSubmit={finishReset} className={stepCardClass(3, activeStep)}>
          <div className={`absolute -top-3 left-8 px-3 py-1 text-[10px] font-bold uppercase tracking-widest-2 rounded-full ${badgeClass(3, activeStep)}`}>
            {stepBadge(3, activeStep)}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mt-2">New password</div>
          <h2 className="h-display text-3xl mt-2">Set a new one.</h2>
          <p className="text-sm text-on-surface-variant mt-3">12+ characters. We recommend a passphrase with letters and numbers.</p>

          {error && activeStep === 3 && <p className="text-sm text-red-600 mt-3">{error}</p>}

          <div className="mt-5">
            <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">New password</label>
            <input
              type="password"
              className="w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary disabled:opacity-60"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4].map((bar) => (
                <div key={bar} className={`flex-1 h-1.5 rounded-full ${bar <= strength + 1 ? 'bg-emerald-500' : 'bg-surface-container-high'}`} />
              ))}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">{strength >= 2 ? 'Strong' : 'Keep going'}</div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Confirm new password</label>
            <input
              type="password"
              className={`w-full mt-1 h-12 px-4 rounded-xl bg-surface-container-lowest outline-none disabled:opacity-60 ${passwordsMatch ? 'border-2 border-emerald-500' : 'border border-outline-variant focus:border-primary'}`}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {passwordsMatch && (
              <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                Passwords match
              </div>
            )}
          </div>

          <ul className="mt-5 space-y-1.5 text-xs">
            <li className={`flex items-center gap-2 ${passwordLong ? 'text-emerald-700' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{passwordLong ? 'check' : 'circle'}</span>12+ characters</li>
            <li className={`flex items-center gap-2 ${passwordMixed ? 'text-emerald-700' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{passwordMixed ? 'check' : 'circle'}</span>Mix of letters &amp; numbers</li>
            <li className={`flex items-center gap-2 ${passwordHasSymbol ? 'text-emerald-700' : 'text-on-surface-variant'}`}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{passwordHasSymbol ? 'check' : 'circle'}</span>One symbol (optional)</li>
          </ul>

          <button
            type="submit"
            className="w-full mt-6 btn-grad text-white font-bold py-3.5 rounded-xl uppercase tracking-widest-2 text-sm"
          >
            Update password &amp; sign in
          </button>
        </form>
        )}
      </div>
    </div>
  )
}
