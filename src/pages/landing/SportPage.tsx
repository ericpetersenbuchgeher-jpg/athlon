import { useState, type FormEvent } from 'react'
import styled from '@emotion/styled'
import { motion } from 'motion/react'
import { SmoothScroll } from '../../scroll/SmoothScroll'
import { useSceneMode, useScene } from '../../canvas/SceneContext'
import { PublicNav } from '../../components/layout/PublicNav'
import { Footer } from '../../components/layout/Footer'
import { Container, Eyebrow, Icon, Button, Input } from '../../components/ui'
import { sports } from '../../data/sports'
import { sportColor } from '../../components/ui'
import type { SportId } from '../../data/types'
import { TennisExperience } from './sport/TennisExperience'

// /sport — the dedicated sport picker page. Choosing (or typing) a sport turns the page into
// that sport's immersive court; the landing stays light and links here.
const Backdrop = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.z.content};
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(6, 8, 13, 0.55) 0%,
    rgba(6, 8, 13, 0.8) 30%,
    rgba(6, 8, 13, 0.86) 100%
  );
  backdrop-filter: blur(6px);
`

const Section = styled.section`
  padding: clamp(120px, 16vh, 180px) 0 clamp(72px, 10vw, 140px);
`

const H1 = styled.h1`
  font-size: clamp(2rem, 1.4rem + 2.6vw, 3.4rem);
  margin: 12px 0 0;
  max-width: 20ch;
`

const Intro = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  margin-top: 12px;
  max-width: 52ch;
  font-size: ${(p) => p.theme.fontSize.lg};
`

const PickForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 460px;
  margin-top: 26px;
`
const Notice = styled.p`
  margin-top: 12px;
  font-size: ${(p) => p.theme.fontSize.small};
  color: ${(p) => p.theme.color.fgMuted};
  min-height: 1.2em;
`

const SportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
  margin-top: 34px;
`
const SportCard = styled(motion.div, { shouldForwardProp: (p) => p !== 'c' && p !== 'live' })<{
  c: string
  live?: boolean
}>`
  position: relative;
  cursor: pointer;
  border: 1px solid ${(p) => (p.live ? `${p.c}66` : p.theme.color.line)};
  border-radius: ${(p) => p.theme.radius.md};
  background: ${(p) => (p.live ? `${p.c}14` : p.theme.color.surface)};
  padding: 20px;
  transition: transform 0.2s ${(p) => p.theme.ease.out}, border-color 0.2s, background 0.2s;
  &:hover {
    transform: translateY(-4px);
    border-color: ${(p) => p.c}66;
    background: ${(p) => p.c}12;
  }
  .glyph {
    font-size: 30px;
  }
  .name {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 700;
    margin-top: 12px;
  }
  .fed {
    font-size: ${(p) => p.theme.fontSize.micro};
    color: ${(p) => p.theme.color.fgMuted};
    margin-top: 3px;
  }
  .enter {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 12px;
    font-size: ${(p) => p.theme.fontSize.micro};
    font-weight: 700;
    color: ${(p) => p.c};
  }
`

export function SportPage() {
  useSceneMode('landing')
  const { focus } = useScene()
  const [activeSport, setActiveSport] = useState<SportId | null>(null)
  const [q, setQ] = useState('')
  const [notice, setNotice] = useState('')

  if (activeSport === 'tennis') {
    return <TennisExperience onExit={() => setActiveSport(null)} />
  }

  const pick = (id: SportId, name: string) => {
    if (id === 'tennis') {
      setActiveSport('tennis')
    } else {
      setNotice(`${name}: il campo immersivo è in arrivo. Per ora prova “tennis”. 🎾`)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const term = q.trim().toLowerCase()
    if (!term) return
    const found = sports.find(
      (s) => s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term),
    )
    if (found) pick(found.id, found.name)
    else setNotice(`Nessuno sport chiamato “${q}”. Prova “tennis”, “basket”, “calcio”…`)
  }

  return (
    <SmoothScroll>
      <PublicNav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Backdrop>
          <Section>
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onViewportEnter={() => {
                  focus.current = 4
                }}
              >
                <Eyebrow tone="energy">Tutti gli sport · entra nel campo</Eyebrow>
                <H1>Scegli il tuo sport e il sito diventa il tuo campo</H1>
                <Intro>
                  Scrivi uno sport (prova <strong style={{ color: '#c8ff4d' }}>tennis</strong>) o
                  tocca una disciplina: la pagina si trasforma nel campo, con la partita in corso
                  mentre scorri.
                </Intro>
                <PickForm onSubmit={onSubmit}>
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Scrivi uno sport… es. tennis"
                    aria-label="Scrivi uno sport"
                  />
                  <Button type="submit" variant="energy">
                    Entra
                  </Button>
                </PickForm>
                <Notice>{notice}</Notice>
              </motion.div>
              <SportsGrid>
                {sports.map((s, i) => (
                  <SportCard
                    key={s.id}
                    c={sportColor(s.id)}
                    live={s.id === 'tennis'}
                    onClick={() => pick(s.id, s.name)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 5) * 0.05 }}
                  >
                    <div className="glyph">{s.glyph}</div>
                    <div className="name">{s.name}</div>
                    <div className="fed">{s.federationId}</div>
                    {s.id === 'tennis' && (
                      <span className="enter">
                        Entra nel campo <Icon name="arrow-right" size={13} />
                      </span>
                    )}
                  </SportCard>
                ))}
              </SportsGrid>
            </Container>
          </Section>
          <Footer />
        </Backdrop>
      </main>
    </SmoothScroll>
  )
}
