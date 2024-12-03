import { Navigate, Outlet } from 'react-router-dom'

function isAuthenticated() {
  const token = localStorage.getItem('access_token')
  return Boolean(token) // Verifica se o token está presente
}

export function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/sign-in" />
}
