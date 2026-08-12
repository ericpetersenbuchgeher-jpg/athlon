import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { Logo, ButtonLink, Button, Container, Row } from '../ui'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const Bar = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${(p) => p.theme.z.nav};
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  background: ${(p) => (p.scrolled ? 'rgba(7,9,13,0.72)' : 'transparent')};
  border-bottom: 1px solid ${(p) => (p.scrolled ? p.theme.color.line : 'transparent')};
  backdrop-filter: ${(p) => (p.scrolled ? 'blur(14px)' : 'none')};
`

const Inner = styled(Row)`
  height: 68px;
  justify-content: space-between;
`

const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space(7)};
  @media (max-width: 820px) {
    display: none;
  }
  a {
    font-size: ${(p) => p.theme.fontSize.small};
    color: ${(p) => p.theme.color.fgMuted};
    font-weight: 500;
    transition: color 0.16s;
    &:hover {
      color: ${(p) => p.theme.color.fg};
    }
  }
`

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Bar scrolled={scrolled}>
      <Container>
        <Inner>
          <Logo />
          <Links aria-label="Navigazione principale">
            <a href="/#societa">Società</a>
            <a href="/#squadre">Squadre</a>
            <a href="/#sponsor">Sponsor</a>
            <a href="/#sport">Sport</a>
          </Links>
          <Row gap={2}>
            {user ? (
              <Button size="sm" variant="primary" onClick={() => navigate('/app')}>
                Vai all'app
              </Button>
            ) : (
              <>
                <ButtonLink to="/accedi" variant="ghost" size="sm">
                  Accedi
                </ButtonLink>
                <ButtonLink to="/registrati" variant="primary" size="sm">
                  Inizia gratis
                </ButtonLink>
              </>
            )}
          </Row>
        </Inner>
      </Container>
    </Bar>
  )
}
