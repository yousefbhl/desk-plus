// frontend/src/components/auth/SocialAuthButtons.tsx
//
// Drop-in replacement for the "Continue with Google / Apple" row
// shown in your login + register screens.
//
// The Google button does a FULL PAGE redirect to the backend, which
// then bounces to Google's account picker. This is intentional —
// OAuth can't run inside an axios/fetch call.

import { authApi } from '../../api'

export default function SocialAuthButtons() {
  const handleGoogle = () => {
    // top-level navigation -> backend -> Google account chooser
    window.location.href = authApi.googleRedirectUrl
  }

  return (
    <div>
      {/* "New here? Create an account" lives in the parent page */}

      <div className="grid grid-cols-2 gap-3">
        {/* Google — live */}
        <button
          type="button"
          onClick={handleGoogle}
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 font-semibold text-black transition hover:border-black/30 hover:shadow-sm"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        {/* Apple — placeholder (not wired). Disabled so users aren't misled. */}
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 font-semibold text-black/40 cursor-not-allowed"
        >
          <AppleIcon />
          <span>Apple</span>
        </button>
      </div>

      
    </div>
  )
}

/* ── icons (inline SVG, no extra deps) ─────────────────────── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
      <path d="M13.3 9.5c0-2 1.6-3 1.7-3.1-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.3 5.7 1 7.6.6.9 1.3 1.9 2.3 1.9.9 0 1.3-.6 2.4-.6s1.4.6 2.4.6 1.6-.9 2.2-1.8c.7-1 1-2 1-2-.1 0-1.9-.8-1.9-2.8zM11.5 3.3c.5-.6.9-1.5.8-2.3-.8 0-1.7.5-2.2 1.1-.5.6-.9 1.4-.8 2.3.8.1 1.7-.4 2.2-1.1z"/>
    </svg>
  )
}