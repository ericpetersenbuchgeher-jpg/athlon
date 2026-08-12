import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { SceneProvider } from './canvas/SceneContext'
import { PersistentScene } from './canvas/PersistentScene'
import { LandingPage } from './pages/landing/LandingPage'
import { SportPage } from './pages/landing/SportPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'

import { ProtectedRoute } from './auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'

import { DashboardPage } from './pages/app/DashboardPage'
import { TeamsPage } from './pages/app/TeamsPage'
import { TeamDetailPage } from './pages/app/TeamDetailPage'
import { CreateTeamPage } from './pages/app/CreateTeamPage'
import { ApplicationsPage } from './pages/app/ApplicationsPage'
import { AssociationsPage } from './pages/app/AssociationsPage'
import { AssociationDetailPage } from './pages/app/AssociationDetailPage'
import { CreateAssociationPage } from './pages/app/CreateAssociationPage'
import { SponsorsPage } from './pages/app/SponsorsPage'
import { ProfilePage } from './pages/app/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'

// Reset scroll to top on navigation between app pages (Lenis owns the landing itself).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <SceneProvider>
      <ScrollToTop />
      {/* the one 3D arena canvas, behind every page */}
      <PersistentScene />
      <Routes>
        {/* public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sport" element={<SportPage />} />
        <Route path="/accedi" element={<LoginPage />} />
        <Route path="/registrati" element={<RegisterPage />} />

        {/* private app */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="squadre" element={<TeamsPage />} />
            <Route path="squadre/nuova" element={<CreateTeamPage />} />
            <Route path="squadre/:id" element={<TeamDetailPage />} />
            <Route path="candidature" element={<ApplicationsPage />} />
            <Route path="societa" element={<AssociationsPage />} />
            <Route path="societa/nuova" element={<CreateAssociationPage />} />
            <Route path="societa/:id" element={<AssociationDetailPage />} />
            <Route path="sponsor" element={<SponsorsPage />} />
            <Route path="profilo" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SceneProvider>
  )
}
