import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Application, SportId, User, UserRole } from '../data/types'
import { seedApplications } from '../data/applications'
import { teamById } from '../data/teams'

// DEMO auth only — front-end prototype. Any email/password works; the "user" is persisted to
// localStorage so a refresh keeps you signed in. Swap this provider for a real API later; the
// surface (user, login, register, logout, applications) is intentionally backend-shaped.

const STORAGE_KEY = 'convocati.auth.v1'

interface RegisterInput {
  name: string
  email: string
  role: UserRole
  city: string
  sports: SportId[]
  position?: string
}

interface AuthState {
  user: User | null
  applications: Application[]
}

interface AuthContextValue extends AuthState {
  login: (email: string) => void
  register: (input: RegisterInput) => void
  logout: () => void
  demoLogin: (role: UserRole) => void
  applyToTeam: (teamId: string, role: string, message: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CV'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'atleta'
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

const demoUsers: Record<UserRole, User> = {
  atleta: {
    id: 'u-demo-atleta',
    name: 'Alessandro Moretti',
    email: 'alessandro.moretti@example.it',
    role: 'atleta',
    city: 'Milano',
    sports: ['basket', 'calcio5'],
    position: 'Playmaker',
    bio: 'Play/guardia, 8 anni di agonismo. Cerco una squadra competitiva ma con un bel gruppo.',
    initials: 'AM',
  },
  dirigente: {
    id: 'u-demo-dirigente',
    name: 'Giulia Esposito',
    email: 'giulia.esposito@example.it',
    role: 'dirigente',
    city: 'Napoli',
    sports: ['pallavolo', 'pallamano'],
    bio: 'Presidente e rappresentante legale della A.S.D. Vesuvio Sport.',
    initials: 'GE',
  },
}

function loadInitial(): AuthState {
  const fallback: AuthState = { user: null, applications: seedApplications }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as AuthState
    return {
      user: parsed.user ?? null,
      applications: parsed.applications?.length ? parsed.applications : seedApplications,
    }
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hydrate synchronously so a page reload on a protected route doesn't bounce to /accedi
  // before an effect can run (ProtectedRoute reads `user` on the first render).
  const [state, setState] = useState<AuthState>(loadInitial)

  const persist = useCallback((next: AuthState) => {
    setState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage may be unavailable */
    }
  }, [])

  const login = useCallback(
    (email: string) => {
      const user: User = {
        ...demoUsers.atleta,
        id: 'u-' + email,
        name: nameFromEmail(email),
        email,
        initials: initials(nameFromEmail(email)),
      }
      persist({ user, applications: state.applications })
    },
    [persist, state.applications],
  )

  const demoLogin = useCallback(
    (role: UserRole) => {
      persist({ user: demoUsers[role], applications: state.applications })
    },
    [persist, state.applications],
  )

  const register = useCallback(
    (input: RegisterInput) => {
      const user: User = {
        id: 'u-' + input.email,
        name: input.name,
        email: input.email,
        role: input.role,
        city: input.city,
        sports: input.sports,
        position: input.position,
        initials: initials(input.name),
      }
      persist({ user, applications: state.applications })
    },
    [persist, state.applications],
  )

  const logout = useCallback(() => {
    persist({ user: null, applications: state.applications })
  }, [persist, state.applications])

  const applyToTeam = useCallback(
    (teamId: string, role: string, message: string) => {
      const team = teamById(teamId)
      const app: Application = {
        id: 'ap-' + teamId + '-' + Math.max(1, state.applications.length + 1),
        teamId,
        role: role || team?.openRoles[0]?.role || 'Giocatore',
        status: 'inviata',
        date: '2026-07-21',
        message,
      }
      // newest first, avoid duplicate pending applications to the same team
      const withoutDup = state.applications.filter(
        (a) => !(a.teamId === teamId && (a.status === 'inviata' || a.status === 'in valutazione')),
      )
      persist({ user: state.user, applications: [app, ...withoutDup] })
    },
    [persist, state.applications, state.user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, demoLogin, applyToTeam }),
    [state, login, register, logout, demoLogin, applyToTeam],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
