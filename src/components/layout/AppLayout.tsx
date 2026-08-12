import styled from '@emotion/styled'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo, Icon, Avatar, IconButton, Badge } from '../ui'
import type { IconName } from '../ui'
import { useAuth } from '../../auth/AuthContext'
import { blockProps } from '../../theme/fwd'
import { useSceneMode } from '../../canvas/SceneContext'

interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}
interface NavGroup {
  section: string | null
  items: NavItem[]
}

const nav: NavGroup[] = [
  { section: null, items: [{ to: '/app', label: 'Dashboard', icon: 'grid', end: true }] },
  {
    section: 'Gioca',
    items: [
      { to: '/app/calendario', label: 'Calendario', icon: 'calendar' },
      { to: '/app/squadre', label: 'Trova squadre', icon: 'search' },
      { to: '/app/candidature', label: 'Le mie candidature', icon: 'send' },
      { to: '/app/squadre/nuova', label: 'Crea una squadra', icon: 'plus' },
    ],
  },
  {
    section: 'Gestisci',
    items: [
      { to: '/app/societa', label: 'Le mie società', icon: 'building' },
      { to: '/app/scadenze', label: 'Scadenze', icon: 'bell' },
      { to: '/app/sponsor', label: 'Sponsor', icon: 'handshake' },
    ],
  },
  {
    section: 'Account',
    items: [
      { to: '/app/profilo', label: 'Profilo', icon: 'user' },
      { to: '/app/premium', label: 'Premium', icon: 'crown' },
    ],
  },
]

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${(p) => p.theme.layout.sidebar} 1fr;
  /* translucent so the persistent 3D arena keeps living behind the app content */
  background: linear-gradient(180deg, rgba(5, 7, 11, 0.52) 0%, rgba(5, 7, 11, 0.7) 100%);
  backdrop-filter: blur(2px);
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const SidebarEl = styled('aside', blockProps('open'))<{ open: boolean }>`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space(2)};
  padding: ${(p) => p.theme.space(6)} ${(p) => p.theme.space(4)};
  border-right: 1px solid ${(p) => p.theme.color.line};
  background: rgba(9, 12, 18, 0.72);
  backdrop-filter: blur(16px);
  overflow-y: auto;

  @media (max-width: 960px) {
    position: fixed;
    z-index: ${(p) => p.theme.z.modal};
    width: 280px;
    transform: translateX(${(p) => (p.open ? '0' : '-105%')});
    transition: transform 0.3s ${(p) => p.theme.ease.out};
    box-shadow: ${(p) => p.theme.shadow.lg};
  }
`

const Scrim = styled('div', blockProps('open'))<{ open: boolean }>`
  display: none;
  @media (max-width: 960px) {
    display: ${(p) => (p.open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    z-index: ${(p) => p.theme.z.overlay};
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
  }
`

const GroupLabel = styled.div`
  font-size: ${(p) => p.theme.fontSize.micro};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.color.fgFaint};
  padding: ${(p) => p.theme.space(3)} ${(p) => p.theme.space(3)} ${(p) => p.theme.space(1)};
`

const NavItemEl = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  transition: background 0.16s, color 0.16s;
  &:hover {
    background: ${(p) => p.theme.color.surface};
    color: ${(p) => p.theme.color.fg};
  }
  &.active {
    background: ${(p) => p.theme.color.accentSoft};
    color: ${(p) => p.theme.color.fg};
    box-shadow: inset 0 0 0 1px ${(p) => p.theme.color.accent}55;
  }
`

// same look as a nav item, but a real button (for logout)
const NavButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${(p) => p.theme.color.fgMuted};
  font-family: inherit;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  transition: background 0.16s, color 0.16s;
  &:hover {
    background: ${(p) => p.theme.color.surface};
    color: ${(p) => p.theme.color.fg};
  }
`

const Main = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const TopbarEl = styled.header`
  position: sticky;
  top: 0;
  z-index: ${(p) => p.theme.z.sticky};
  height: ${(p) => p.theme.layout.topbar};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.space(3)};
  padding: 0 clamp(16px, 4vw, 40px);
  border-bottom: 1px solid ${(p) => p.theme.color.line};
  background: rgba(7, 9, 13, 0.72);
  backdrop-filter: blur(14px);
`

const Content = styled.div`
  padding: clamp(20px, 4vw, 44px) clamp(16px, 4vw, 44px) 80px;
  flex: 1;
`

const Hi = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  strong {
    font-family: ${(p) => p.theme.font.display};
    font-size: 1rem;
  }
  span {
    font-size: ${(p) => p.theme.fontSize.micro};
    color: ${(p) => p.theme.color.fgMuted};
  }
`

const Burger = styled(IconButton)`
  display: none;
  @media (max-width: 960px) {
    display: inline-flex;
  }
`

const UserBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${(p) => p.theme.color.fg};
  padding: 4px;
  border-radius: 999px;
  &:hover {
    background: ${(p) => p.theme.color.surface};
  }
`

export function AppLayout() {
  useSceneMode('app')
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const roleLabel = user?.role === 'dirigente' ? 'Dirigente / ASD' : 'Atleta'

  return (
    <Shell>
      <Scrim open={open} onClick={() => setOpen(false)} />
      <SidebarEl open={open} aria-label="Menu applicazione">
        <div style={{ padding: '4px 8px 16px' }}>
          <Logo />
        </div>
        {nav.map((group) => (
          <div key={group.section ?? 'main'}>
            {group.section && <GroupLabel>{group.section}</GroupLabel>}
            {group.items.map((item) => (
              <NavItemEl
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </NavItemEl>
            ))}
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <NavButton onClick={() => { logout(); navigate('/') }}>
            <Icon name="logout" size={18} />
            Esci
          </NavButton>
        </div>
      </SidebarEl>

      <Main>
        <TopbarEl>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Burger aria-label="Apri menu" onClick={() => setOpen(true)}>
              <Icon name="menu" />
            </Burger>
            <Hi>
              <strong>Ciao, {user?.name.split(' ')[0] ?? 'atleta'} 👋</strong>
              <span>{roleLabel} · {user?.city}</span>
            </Hi>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <IconButton aria-label="Notifiche">
                <Icon name="bell" size={18} />
              </IconButton>
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: '#ff6b3d',
                }}
              />
            </div>
            <UserBtn onClick={() => navigate('/app/profilo')} aria-label="Il tuo profilo">
              <Avatar size={36}>{user?.initials}</Avatar>
            </UserBtn>
          </div>
        </TopbarEl>
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  )
}

// exported for pages that want to show the demo role pill
export function RolePill({ children }: { children: React.ReactNode }) {
  return <Badge tone="accent">{children}</Badge>
}
