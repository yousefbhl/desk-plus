// frontend/src/pages/OAuthCallback.tsx
//
// Landing page after Google login for EXISTING users.
// Backend redirected here with ?token=xxx.
// We store the token, fetch the user, then route by role.

import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

export default function OAuthCallback() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { show }   = useToastStore()
  const { loginWithToken } = useAuthStore()
  const ran        = useRef(false)   // guard against double-run in StrictMode

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      show('Google sign-in failed. Please try again.', 'error')
      navigate('/login', { replace: true })
      return
    }

    ;(async () => {
      try {
        await loginWithToken(token)
        const user = useAuthStore.getState().user
        show(`Welcome back, ${user?.name?.split(' ')[0] ?? ''}!`, 'success')

        if (user?.role === 'admin')       navigate('/admin', { replace: true })
        else if (user?.role === 'seller') navigate('/seller', { replace: true })
        else                              navigate('/', { replace: true })
      } catch {
        show('Could not complete sign-in.', 'error')
        navigate('/login', { replace: true })
      }
    })()
  }, [])

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-[#E02020]" />
        <p className="text-sm font-medium text-black/60">Signing you in…</p>
      </div>
    </div>
  )
}