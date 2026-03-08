import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-700">
        Loading…
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

