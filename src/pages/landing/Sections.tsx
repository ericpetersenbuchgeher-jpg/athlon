import { useState, type FormEvent } from 'react'
import styled from '@emotion/styled'
import { motion } from 'motion/react'
import {
  Container,
  Eyebrow,
  Icon,
  ButtonLink,
  Button,
  Badge,
  Stat,
  Input,
} from '../../components/ui'
import type { IconName } from '../../components/ui'
import { sports } from '../../data/sports'
import { sportColor } from '../../components/ui'
import type { SportId } from '../../data/types'
import { useScene } from '../../canvas/SceneContext'

// content sits on a translucent, frosted backdrop so the 3D arena stays visible (but soft +
// readable) behind every section of the landing — not just the hero.
export const ContentBackdrop = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.z.content};
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(6, 8, 13, 0.5) 8%,
    rgba(6, 8, 13, 0.62) 55%,
    rgba(6, 8, 13, 0.68) 100%
  );
  backdrop-filter: blur(3px);
`

const Section = styled.section`
  padding: clamp(72px, 10vw, 140px) 0;
`

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
}

// shared section heading size
const H2 = styled.h2`
  font-size: clamp(1.8rem, 1.3rem + 2vw, 3rem);
  margin: 12px 0 0;
`

/* ---------------------------------- Pillars --------------------------------- */

interface Pillar {
  id: string
  n: string
  eyebrow: string
  title: string
  body: string
  bullets: string[]
  accent: string
  icon: IconName
}

const pillars: Pillar[] = [
  {
    id: 'societa',
    n: '01',
    eyebrow: 'Per dirigenti',
    title: 'Fonda e gestisci la tua società sportiva',
    body: 'Crea la tua A.S.D. e tieni in ordine tutta la burocrazia in un posto solo: statuto, codice fiscale, RUNTS, affiliazione a federazione o ente, tesseramenti e rendiconti.',
    bullets: [
      'Modelli guidati per statuto e atto costitutivo',
      'Checklist affiliazione FIP, FIGC, FIPAV, UISP, CSI…',
      'Scadenze, documenti e tesserati sempre sott’occhio',
    ],
    accent: '#4f83ff',
    icon: 'building',
  },
  {
    id: 'squadre',
    n: '02',
    eyebrow: 'Per atleti',
    title: 'Trova la tua squadra, o creane una nuova',
    body: 'Non passare più dai soliti canali. Cerca squadre che cercano il tuo ruolo, invia la tua candidatura, oppure fonda la tua squadra e iscrivila alla federazione direttamente dall’app.',
    bullets: [
      'Cerca per sport, città, livello e ruolo aperto',
      'Candidati in un tap e segui lo stato della richiesta',
      'Crea la tua squadra e raccogli le candidature',
    ],
    accent: '#ff6b3d',
    icon: 'users',
  },
  {
    id: 'sponsor',
    n: '03',
    eyebrow: 'Per far crescere',
    title: 'Trova sponsor per la tua realtà sportiva',
    body: 'Un marketplace di aziende che vogliono sostenere lo sport di base. Filtra per budget, categoria e territorio e proponi la tua squadra o società allo sponsor giusto.',
    bullets: [
      'Sponsor locali, regionali e nazionali',
      'Filtri per budget stagionale e contropartite',
      'Proposte e accordi gestiti dentro l’app',
    ],
    accent: '#37d17a',
    icon: 'handshake',
  },
]

const PillarRow = styled(motion.div, { shouldForwardProp: (p) => p !== 'flip' })<{
  flip?: boolean
}>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
  padding: clamp(32px, 6vw, 64px) 0;
  & > .visual {
    order: ${(p) => (p.flip ? -1 : 0)};
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    & > .visual {
      order: 0;
    }
  }
`

const PillarTitle = styled.h2`
  font-size: ${(p) => p.theme.fontSize.h2};
  margin: 12px 0 16px;
`
const Body = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.lg};
  max-width: 46ch;
`
const Bullets = styled.ul`
  list-style: none;
  padding: 0;
  margin: 22px 0 26px;
  display: grid;
  gap: 12px;
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${(p) => p.theme.color.fg};
    font-size: ${(p) => p.theme.fontSize.body};
  }
`
const Tick = styled.span<{ c: string }>`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: ${(p) => p.c};
  background: ${(p) => p.c}22;
`

// a stylised "app preview" so each pillar has a visual without needing screenshots
const Visual = styled.div<{ c: string }>`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: ${(p) => p.theme.radius.xl};
  border: 1px solid ${(p) => p.theme.color.line};
  background:
    radial-gradient(120% 100% at 80% 0%, ${(p) => p.c}22, transparent 60%),
    ${(p) => p.theme.color.bg2};
  overflow: hidden;
  box-shadow: ${(p) => p.theme.shadow.lg};
  display: flex;
  flex-direction: column;
  padding: 22px;
  gap: 12px;
`
const VBar = styled.div<{ w: string; c?: string; h?: number }>`
  height: ${(p) => p.h ?? 12}px;
  width: ${(p) => p.w};
  border-radius: 999px;
  background: ${(p) => p.c ?? p.theme.color.surfaceStrong};
`
const VCard = styled.div`
  margin-top: auto;
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.md};
  background: ${(p) => p.theme.color.surface};
  padding: 16px;
  display: grid;
  gap: 10px;
`

function PillarVisual({ p }: { p: Pillar }) {
  return (
    <Visual c={p.accent} className="visual" aria-hidden="true">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tick c={p.accent}>
          <Icon name={p.icon} size={16} />
        </Tick>
        <VBar w="46%" h={14} />
        <div style={{ marginLeft: 'auto' }}>
          <Badge tone="neutral">{p.n}</Badge>
        </div>
      </div>
      <VBar w="80%" />
      <VBar w="64%" />
      <VCard>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <VBar w="40px" h={40} c={p.accent} />
          <div style={{ flex: 1, display: 'grid', gap: 8 }}>
            <VBar w="70%" h={10} />
            <VBar w="45%" h={8} />
          </div>
          <VBar w="72px" h={30} c={`${p.accent}55`} />
        </div>
      </VCard>
    </Visual>
  )
}

function Pillars() {
  const { focus } = useScene()
  return (
    <Section>
      <Container>
        <motion.div {...reveal} style={{ textAlign: 'center', marginBottom: 24 }}>
          <Eyebrow>Tre cose, un’unica app</Eyebrow>
          <H2>Tutto lo sport italiano, dal campo alla scrivania</H2>
        </motion.div>
        {pillars.map((p, i) => (
          <PillarRow
            key={p.id}
            id={p.id}
            flip={i % 2 === 1}
            {...reveal}
            onViewportEnter={() => {
              focus.current = i + 1
            }}
          >
            <div>
              <Eyebrow style={{ color: p.accent }}>
                {p.n} · {p.eyebrow}
              </Eyebrow>
              <PillarTitle>{p.title}</PillarTitle>
              <Body>{p.body}</Body>
              <Bullets>
                {p.bullets.map((b) => (
                  <li key={b}>
                    <Tick c={p.accent}>
                      <Icon name="check" size={14} />
                    </Tick>
                    {b}
                  </li>
                ))}
              </Bullets>
              <ButtonLink to="/registrati" variant="secondary">
                Prova adesso <Icon name="arrow-right" size={16} />
              </ButtonLink>
            </div>
            <PillarVisual p={p} />
          </PillarRow>
        ))}
      </Container>
    </Section>
  )
}

/* ---------------------------------- Sports ---------------------------------- */

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

function SportsSection({ onEnterSport }: { onEnterSport: (s: SportId) => void }) {
  const { focus } = useScene()
  const [q, setQ] = useState('')
  const [notice, setNotice] = useState('')

  const pick = (id: SportId, name: string) => {
    if (id === 'tennis') {
      onEnterSport('tennis')
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
    <Section id="sport">
      <Container>
        <motion.div
          {...reveal}
          onViewportEnter={() => {
            focus.current = 4
          }}
        >
          <Eyebrow tone="energy">Tutti gli sport · entra nel campo</Eyebrow>
          <H2 style={{ maxWidth: '20ch' }}>
            Scegli il tuo sport e il sito diventa il tuo campo
          </H2>
          <p style={{ color: '#9aa3b2', marginTop: 12, maxWidth: '52ch' }}>
            Scrivi uno sport (prova <strong style={{ color: '#c8ff4d' }}>tennis</strong>) o tocca una
            disciplina: la landing si trasforma nel campo, con la partita in corso mentre scorri.
          </p>
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
  )
}

/* -------------------------------- How it works ------------------------------ */

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 36px;
  @media (max-width: 860px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`
const Step = styled(motion.div)`
  border-top: 1px solid ${(p) => p.theme.color.lineStrong};
  padding-top: 18px;
  .num {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 800;
    font-size: 2.4rem;
    color: ${(p) => p.theme.color.accent};
    line-height: 1;
  }
  h3 {
    font-size: ${(p) => p.theme.fontSize.lg};
    margin: 14px 0 8px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
  }
`
const steps = [
  { t: 'Registrati', d: 'Crea il profilo come atleta o come dirigente, in un minuto.' },
  { t: 'Scegli cosa fare', d: 'Trova una squadra, fonda una società o cerca sponsor.' },
  { t: 'Candidati o crea', d: 'Invia candidature o pubblica la tua squadra e la tua ASD.' },
  { t: 'Gioca e cresci', d: 'Gestisci tesseramenti, burocrazia e sponsor da un posto solo.' },
]

function HowItWorks() {
  return (
    <Section>
      <Container>
        <motion.div {...reveal}>
          <Eyebrow>Come funziona</Eyebrow>
          <H2>Dallo smartphone al campo in 4 passi</H2>
        </motion.div>
        <Steps>
          {steps.map((s, i) => (
            <Step
              key={s.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Step>
          ))}
        </Steps>
      </Container>
    </Section>
  )
}

/* ---------------------------------- Stats ----------------------------------- */

const StatBand = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: clamp(28px, 4vw, 44px);
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.xl};
  background:
    radial-gradient(120% 140% at 0% 0%, ${(p) => p.theme.color.accentSoft}, transparent 55%),
    radial-gradient(120% 140% at 100% 100%, ${(p) => p.theme.color.energySoft}, transparent 55%),
    ${(p) => p.theme.color.bg2};
  @media (max-width: 760px) {
    grid-template-columns: 1fr 1fr;
  }
`

function Stats() {
  return (
    <Section>
      <Container>
        <StatBand {...reveal}>
          <Stat value="10+" label="Sport supportati" />
          <Stat value="9" label="Federazioni & enti" />
          <Stat value="1" label="App per tutto" />
          <Stat value="🇮🇹" label="Made in Italy" />
        </StatBand>
      </Container>
    </Section>
  )
}

/* -------------------------------- Final CTA --------------------------------- */

const CtaWrap = styled(motion.div)`
  text-align: center;
  padding: clamp(56px, 8vw, 110px) clamp(24px, 5vw, 60px);
  border-radius: ${(p) => p.theme.radius.xl};
  border: 1px solid ${(p) => p.theme.color.line};
  background:
    radial-gradient(100% 120% at 50% 0%, ${(p) => p.theme.color.accentSoft}, transparent 60%),
    ${(p) => p.theme.color.bg2};
  h2 {
    font-size: ${(p) => p.theme.fontSize.h1};
    max-width: 16ch;
    margin: 0 auto 18px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    max-width: 52ch;
    margin: 0 auto 30px;
    font-size: ${(p) => p.theme.fontSize.lg};
  }
`

function FinalCTA() {
  return (
    <Section>
      <Container>
        <CtaWrap {...reveal}>
          <h2>Pronto a scendere in campo?</h2>
          <p>
            Unisciti agli atleti e ai dirigenti che stanno costruendo lo sport italiano di base, un
            tap alla volta.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <ButtonLink to="/registrati" variant="energy" size="lg">
              Crea il tuo account <Icon name="arrow-right" size={18} />
            </ButtonLink>
            <ButtonLink to="/accedi" variant="secondary" size="lg">
              Ho già un account
            </ButtonLink>
          </div>
        </CtaWrap>
      </Container>
    </Section>
  )
}

export function LandingSections({ onEnterSport }: { onEnterSport: (s: SportId) => void }) {
  return (
    <ContentBackdrop>
      <Pillars />
      <SportsSection onEnterSport={onEnterSport} />
      <HowItWorks />
      <Stats />
      <FinalCTA />
    </ContentBackdrop>
  )
}
