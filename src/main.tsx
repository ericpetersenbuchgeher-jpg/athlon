import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@emotion/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { theme } from './theme/theme'
import { GlobalStyles } from './theme/GlobalStyles'
import { AuthProvider } from './auth/AuthContext'
import { DebugBoundary } from './components/DebugBoundary'

// StrictMode double-mounts in dev; useGSAP + ReactLenis handle their own cleanup, so it's fine.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <BrowserRouter>
          <DebugBoundary>
            <App />
          </DebugBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
