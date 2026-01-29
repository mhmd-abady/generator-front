import { Outlet } from 'react-router-dom'

// TODO: Re-enable authentication check when ready for production
export default function RequireAuth() {
  // Login protection disabled for testing only
  return <Outlet />
}
