import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Gates the private /app area. Not signed in -> bounce to /accedi, remembering where you wanted
// to go so login can send you back.
export function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/accedi" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
