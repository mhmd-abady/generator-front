import { Navigate, Outlet } from 'react-router-dom'
import {  useAuth, type Role } from '../context/AuthContext'

export default function RequireRole({ allow }: { allow: Role[] }) {
  const { user } = useAuth()
  return user && allow.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />
}
