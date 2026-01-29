import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline } from '@mui/material'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'
import LoadingScreen from './components/LoadingScreen'
import { useLoading } from './context/LoadingContext'

const queryClient = new QueryClient()

function AppWithLoading() {
  const { isLoading } = useLoading()
  
  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      <App />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <LoadingProvider>
            <AuthProvider>
              <CssBaseline />
              <AppWithLoading />
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
