import { createContext, useContext, useMemo, useState } from 'react'

export type Role = 'ADMIN' | 'EMPLOYEE' | 'COLLECTOR'

type AuthUser = {
  id: number
  role: Role
  username?: string
  email?: string
}

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (accessToken: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  })

  const login = (accessToken: string, user: AuthUser) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(user)
  )
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
