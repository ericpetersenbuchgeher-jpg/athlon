import { useRef } from 'react'
import styled from '@emotion/styled'
import { motion, useScroll, useTransform } from 'motion/react'
import { SmoothScroll } from '../../../scroll/SmoothScroll'
import { ScrollProgressDriver } from '../../../scroll/ScrollProgressDriver'
import { Stage } from '../../../canvas/Stage'
import { Poster } from '../../../canvas/Poster'
import { TennisScene } from '../../../canvas/tennis/TennisScene'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { useQualityTier } from '../../../hooks/useQualityTier'
import { supportsWebGL } from '../../../lib/webgl'
import { ButtonLink, Container, Icon, Logo, Eyebrow } from '../../../components/ui'
import { Footer } from '../../../components/layout/Footer'

const TopBar = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: ${(p) => p.theme.z.nav};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  padding: 0 clamp(20px, 5vw, 48px);
`
const ExitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.color.line};
  background: rgba(7, 9, 13, 0.6);
  backdrop-filter: blur(10px);
  color: ${(p) => p.theme.color.fg};
  font-family: inherit;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.16s, border-color 0.16s;
  &:hover {
    background: ${(p) => p.theme.color.surfaceHover};
    border-color: ${(p) => p.theme.color.lineStrong};
  }
`

const Track = styled.section`
  position: relative;
  height: 320vh;
`
const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
`
const HeroCol = styled(motion.div)`
  max-width: 620px;
`
const Giant = styled.h1`
  font-family: ${(p) => p.theme.font.display};
  font-weight: 900;
  font-size: clamp(4rem, 2rem + 12vw, 12rem);
  line-height: 0.86;
  letter-spacing: -0.05em;
  margin: 8px 0 16px;
  color: ${(p) => p.theme.color.volt};
  text-shadow: 0 8px 60px rgba(200, 255, 77, 0.35), 0 2px 20px rgba(0, 0, 0, 0.6);
`
const Sub = styled.p`
  font-size: clamp(1.05rem, 0.9rem + 0.5vw, 1.35rem);
  color: ${(p) => p.theme.color.fg};
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.75);
  max-width: 34ch;
  margin-bottom: 28px;
`
const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const Backdrop = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.z.content};
  background: linear-gradient(180deg, transparent 0%, ${(p) => p.theme.color.bg} 8%, ${(p) =>
    p.theme.color.bg} 100%);
`
const Section = styled.section`
  padding: clamp(64px, 9vw, 130px) 0;
`
const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 34px;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`
const Feat = styled(motion.div)`
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.lg};
  background: ${(p) => p.theme.color.surface};
  padding: 26px;
  .ic {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    color: ${(p) => p.theme.color.volt};
    background: rgba(200, 255, 77, 0.12);
    margin-bottom: 16px;
  }
  h3 {
    font-size: ${(p) => p.theme.fontSize.lg};
    margin-bottom: 8px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
  }
`
const H2 = styled.h2`
  font-size: clamp(1.9rem, 1.3rem + 2.2vw, 3.2rem);
  max-width: 20ch;
`

const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

const feats = [
  { icon: 'search' as const, t: 'Trova il tuo circolo', d: 'Squadre e circoli FIT che cercano giocatori di 3ª, 4ª categoria e Non Classificati per i campionati a squadre.' },
  { icon: 'users' as const, t: 'Compagno di doppio', d: 'Cerca il partner giusto per il doppio o il misto, per livello e per zona.' },
  { icon: 'trophy' as const, t: 'Tennis & padel', d: 'Dal tennis al padel: iscrizioni, tesseramenti FIT e tornei, gestiti dall’app.' },
]

export function TennisExperience({ onExit }: { onExit: () => void }) {
  const scrollProgress = useRef(0)
  const reduced = useReducedMotion()
  const { dpr } = useQualityTier()
  const webglOk = supportsWebGL()
  const trackRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const heroFade = useTransform(scrollYProgress, [0.55, 0.8], [1, reduced ? 1 : 0])

  return (
    <SmoothScroll>
      <ScrollProgressDriver progress={scrollProgress} trigger="#tennis-track" />

      <div className="canvas-layer" aria-hidden="true">
        {webglOk ? (
          <Stage dpr={dpr}>
            <TennisScene scrollProgress={scrollProgress} reduced={reduced} />
          </Stage>
        ) : (
          <Poster />
        )}
      </div>

      <TopBar>
        <Logo />
        <ExitBtn onClick={onExit}>
          <Icon name="close" size={16} /> Esci dal campo
        </ExitBtn>
      </TopBar>

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Track id="tennis-track" ref={trackRef}>
          <Sticky>
            <Container>
              <HeroCol style={{ opacity: heroFade }}>
                <Eyebrow style={{ color: '#c8ff4d' }}>Campo da tennis · FIT</Eyebrow>
                <Giant>Tennis</Giant>
                <Sub>
                  C’è una partita in corso. Trova il tuo circolo, la tua squadra di Serie D e il tuo
                  compagno di doppio — poi scendi in campo.
                </Sub>
                <Actions>
                  <ButtonLink to="/registrati" variant="energy" size="lg">
                    Trova squadre di tennis <Icon name="arrow-right" size={18} />
                  </ButtonLink>
                  <ButtonLink to="/accedi" variant="secondary" size="lg">
                    Accedi
                  </ButtonLink>
                </Actions>
              </HeroCol>
            </Container>
          </Sticky>
        </Track>

        <Backdrop>
          <Section>
            <Container>
              <motion.div {...reveal}>
                <Eyebrow style={{ color: '#c8ff4d' }}>Il tennis su Athlon</Eyebrow>
                <H2>Dal campo alla scrivania, anche per il tennis</H2>
              </motion.div>
              <Cols>
                {feats.map((f) => (
                  <Feat key={f.t} {...reveal}>
                    <div className="ic">
                      <Icon name={f.icon} size={20} />
                    </div>
                    <h3>{f.t}</h3>
                    <p>{f.d}</p>
                  </Feat>
                ))}
              </Cols>
              <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <ButtonLink to="/registrati" variant="primary" size="lg">
                  Inizia gratis <Icon name="arrow-right" size={18} />
                </ButtonLink>
                <ExitBtn onClick={onExit}>
                  <Icon name="arrow-right" size={16} style={{ transform: 'rotate(180deg)' }} /> Torna
                  a tutti gli sport
                </ExitBtn>
              </div>
            </Container>
          </Section>
          <Footer />
        </Backdrop>
      </main>
    </SmoothScroll>
  )
}
