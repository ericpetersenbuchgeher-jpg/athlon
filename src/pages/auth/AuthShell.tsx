import styled from '@emotion/styled'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Logo, Icon } from '../../components/ui'
import { BRAND } from '../../brand'
import { useSceneMode } from '../../canvas/SceneContext'

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  /* transparent: the persistent 3D arena shows behind the auth screen */
  background: transparent;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

// left: brand panel — a light frosted scrim over the live arena
const Aside = styled.aside`
  position: relative;
  overflow: hidden;
  padding: clamp(28px, 5vw, 56px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid ${(p) => p.theme.color.line};
  background: linear-gradient(160deg, rgba(6, 8, 13, 0.32) 0%, rgba(6, 8, 13, 0.56) 100%);
  @media (max-width: 900px) {
    display: none;
  }
`

const Quote = styled.div`
  position: relative;
  z-index: 1;
  max-width: 460px;
  h2 {
    font-size: clamp(1.8rem, 1.3rem + 2vw, 2.8rem);
    line-height: 1.05;
    margin: 0 0 18px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.lg};
  }
`

const Points = styled.ul`
  position: relative;
  z-index: 1;
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${(p) => p.theme.color.fg};
    font-size: ${(p) => p.theme.fontSize.body};
  }
  span {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: ${(p) => p.theme.color.accentSoft};
    color: ${(p) => p.theme.color.accent};
  }
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(24px, 5vw, 64px);
  /* readable scrim over the live arena for the form side */
  background: linear-gradient(180deg, rgba(6, 8, 13, 0.74) 0%, rgba(6, 8, 13, 0.84) 100%);
  backdrop-filter: blur(10px);
`

const FormBox = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`

const Back = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.fontSize.small};
  color: ${(p) => p.theme.color.fgMuted};
  &:hover {
    color: ${(p) => p.theme.color.fg};
  }
`

interface Props {
  children: ReactNode
  points?: string[]
}

export function AuthShell({ children, points }: Props) {
  useSceneMode('auth')
  return (
    <Wrap>
      <Aside>
        <Logo />
        <Quote>
          <h2>Lo sport italiano, dal campo alla scrivania.</h2>
          <p>{BRAND.claim}</p>
        </Quote>
        <Points>
          {(points ?? [
            'Crea e gestisci la tua A.S.D.',
            'Trova la tua squadra o creane una',
            'Trova sponsor per la tua realtà',
          ]).map((pt) => (
            <li key={pt}>
              <span>
                <Icon name="check" size={14} />
              </span>
              {pt}
            </li>
          ))}
        </Points>
      </Aside>

      <Panel>
        <FormBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <TopBar>
            <div style={{ display: 'none' }} />
            <Back href="/">
              <Icon name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }} /> Torna al
              sito
            </Back>
          </TopBar>
          {children}
        </FormBox>
      </Panel>
    </Wrap>
  )
}
