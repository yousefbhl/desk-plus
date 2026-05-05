import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// ── AuthGuard — requires any authenticated user ───────────────
export function AuthGuard() {
  const { isAuth, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser(); // verify token on mount
  }, [fetchUser]);

  // CRITICAL FIX: show spinner while fetchUser resolves
  // Without this, the guard redirects to /login before the API call finishes
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fff',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid #E5E5E5',
          borderTopColor: '#E63329',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/login" replace />;

  return <Outlet />;
}

