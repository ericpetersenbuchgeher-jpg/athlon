import styled from '@emotion/styled'
import { motion } from 'motion/react'
import { Container, Eyebrow, Icon, ButtonLink, Badge } from '../../components/ui'
import type { IconName } from '../../components/ui'
import { sports } from '../../data/sports'
import { sportColor } from '../../components/ui'
import { useScene } from '../../canvas/SceneContext'

// content sits on a translucent, frosted backdrop so the 3D arena stays visible (but soft +
// readable) behind every section of the landing — not just the hero.
export const ContentBackdrop = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.z.content};
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(6, 8, 13, 0.72) 6%,
    rgba(6, 8, 13, 0.82) 45%,
    rgba(6, 8, 13, 0.86) 100%
  );
  backdrop-filter: blur(6px);
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
    body: 'Crea la tua A.S.D. e tieni la burocrazia in un posto solo: statuto, RUNTS, affiliazioni, tesseramenti e scadenze.',
    bullets: [
      'Statuto e atto costitutivo con modelli guidati',
      'Affiliazione a FIP, FIGC, FIPAV, UISP, CSI…',
      'Scadenze e documenti sempre sott’occhio',
    ],
    accent: '#4f83ff',
    icon: 'building',
  },
  {
    id: 'squadre',
    n: '02',
    eyebrow: 'Per atleti',
    title: 'Trova la tua squadra, o creane una nuova',
    body: 'Cerca squadre che cercano il tuo ruolo, nella tua città e al tuo livello. Oppure fonda la tua e raccogli le candidature.',
    bullets: [
      'Filtra per sport, città e ruolo aperto',
      'Candidati in un tap e segui la risposta',
      'Crea la tua squadra e iscrivila in federazione',
    ],
    accent: '#ff6b3d',
    icon: 'users',
  },
  {
    id: 'sponsor',
    n: '03',
    eyebrow: 'Per far crescere',
    title: 'Trova sponsor per la tua realtà sportiva',
    body: 'Aziende che vogliono sostenere lo sport di base: trova quella giusta per il tuo territorio e chiudi l’accordo nell’app.',
    bullets: [
      'Sponsor locali, regionali e nazionali',
      'Filtri per budget e contropartite',
      'Proposte e accordi dentro l’app',
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

/* Each pillar gets a concrete "slice of app" preview — real labels, statuses and actions
   instead of abstract placeholder bars. */
const Visual = styled.div<{ c: string }>`
  position: relative;
  border-radius: ${(p) => p.theme.radius.xl};
  border: 1px solid ${(p) => p.theme.color.line};
  background:
    radial-gradient(120% 100% at 80% 0%, ${(p) => p.c}1e, transparent 60%),
    ${(p) => p.theme.color.bg2};
  overflow: hidden;
  box-shadow: ${(p) => p.theme.shadow.lg};
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 12px;
`
const VHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2px;
  .t {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 700;
    font-size: ${(p) => p.theme.fontSize.body};
  }
  .s {
    font-size: ${(p) => p.theme.fontSize.micro};
    color: ${(p) => p.theme.color.fgMuted};
  }
`
const VRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.md};
  background: ${(p) => p.theme.color.surface};
  padding: 12px 14px;
  font-size: ${(p) => p.theme.fontSize.small};
  .l {
    color: ${(p) => p.theme.color.fg};
    font-weight: 500;
  }
  .m {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.micro};
  }
  .end {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`
const FakeBtn = styled.span<{ c: string }>`
  display: inline-block;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.fontSize.micro};
  font-weight: 700;
  color: #0a0c10;
  background: ${(p) => p.c};
`

function VisualSocieta({ c }: { c: string }) {
  return (
    <>
      <VHead>
        <Tick c={c}>
          <Icon name="building" size={15} />
        </Tick>
        <div>
          <div className="t">A.S.D. Aurora Basket</div>
          <div className="s">Milano · FIP · 42 tesserati</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Badge tone="success">In regola</Badge>
        </div>
      </VHead>
      <VRow>
        <span className="l">Statuto e atto costitutivo</span>
        <span className="end">
          <Badge tone="success">Depositato</Badge>
        </span>
      </VRow>
      <VRow>
        <span className="l">Iscrizione RUNTS</span>
        <span className="end">
          <Badge tone="success">Attiva</Badge>
        </span>
      </VRow>
      <VRow>
        <span className="l">Affiliazione FIP 2026/27</span>
        <span className="end">
          <Badge tone="warning">Scade tra 30 gg</Badge>
        </span>
      </VRow>
    </>
  )
}

function VisualSquadre({ c }: { c: string }) {
  return (
    <>
      <VHead>
        <Tick c={c}>
          <Icon name="search" size={15} />
        </Tick>
        <div>
          <div className="t">Ala piccola · Milano</div>
          <div className="s">2 squadre cercano il tuo ruolo</div>
        </div>
      </VHead>
      <VRow>
        <div>
          <div className="l">Virtus Navigli · Serie D</div>
          <div className="m">🏀 Pallacanestro · Allenamenti mar/gio</div>
        </div>
        <span className="end">
          <FakeBtn c={c}>Candidati</FakeBtn>
        </span>
      </VRow>
      <VRow>
        <div>
          <div className="l">Olimpia Lambrate · Promozione</div>
          <div className="m">🏀 Pallacanestro · Candidatura inviata</div>
        </div>
        <span className="end">
          <Badge tone="accent">In attesa</Badge>
        </span>
      </VRow>
    </>
  )
}

function VisualSponsor({ c }: { c: string }) {
  return (
    <>
      <VHead>
        <Tick c={c}>
          <Icon name="handshake" size={15} />
        </Tick>
        <div>
          <div className="t">Sponsor per te</div>
          <div className="s">3 aziende compatibili a Milano</div>
        </div>
      </VHead>
      <VRow>
        <div>
          <div className="l">Caffè Aurora</div>
          <div className="m">Locale · €1.500 / stagione · logo su divisa</div>
        </div>
        <span className="end">
          <FakeBtn c={c}>Proponi</FakeBtn>
        </span>
      </VRow>
      <VRow>
        <div>
          <div className="l">Ferramenta Colombo</div>
          <div className="m">Locale · €800 / stagione · striscione a bordo campo</div>
        </div>
        <span className="end">
          <Badge tone="success">Accordo firmato</Badge>
        </span>
      </VRow>
    </>
  )
}

function PillarVisual({ p }: { p: Pillar }) {
  return (
    <Visual c={p.accent} className="visual" aria-hidden="true">
      {p.id === 'societa' && <VisualSocieta c={p.accent} />}
      {p.id === 'squadre' && <VisualSquadre c={p.accent} />}
      {p.id === 'sponsor' && <VisualSponsor c={p.accent} />}
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

/* ------------------------------- Sport teaser -------------------------------- */
/* The full sport picker (grid + immersive court) lives on its own page: /sport. */

const TeaserWrap = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  padding: clamp(32px, 5vw, 56px);
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.xl};
  background:
    radial-gradient(120% 140% at 0% 0%, ${(p) => p.theme.color.accentSoft}, transparent 55%),
    ${(p) => p.theme.color.bg2};
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`
const GlyphCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  @media (max-width: 860px) {
    justify-content: flex-start;
  }
`
const GlyphChip = styled.span<{ c: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.c}44;
  background: ${(p) => p.c}12;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 600;
  color: ${(p) => p.theme.color.fg};
`

function SportTeaser() {
  const { focus } = useScene()
  return (
    <Section id="sport">
      <Container>
        <TeaserWrap
          {...reveal}
          onViewportEnter={() => {
            focus.current = 4
          }}
        >
          <div>
            <Eyebrow tone="energy">Il tuo sport</Eyebrow>
            <H2 style={{ maxWidth: '18ch' }}>Scegli il tuo sport e il sito diventa il tuo campo</H2>
            <p
              style={{
                color: '#aeb8c8',
                margin: '14px 0 26px',
                maxWidth: '46ch',
                fontSize: '1.05rem',
              }}
            >
              Dieci discipline, dal basket al padel. Entra nella pagina del tuo sport e trasformala
              nel tuo campo, con la partita in corso mentre scorri.
            </p>
            <ButtonLink to="/sport" variant="energy" size="lg">
              Esplora gli sport <Icon name="arrow-right" size={18} />
            </ButtonLink>
          </div>
          <GlyphCloud aria-hidden="true">
            {sports.slice(0, 8).map((s) => (
              <GlyphChip key={s.id} c={sportColor(s.id)}>
                {s.glyph} {s.name}
              </GlyphChip>
            ))}
          </GlyphCloud>
        </TeaserWrap>
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

/* ---------------------------------- Piani ----------------------------------- */

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-top: 34px;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`
const PlanBox = styled(motion.div, { shouldForwardProp: (p) => p !== 'featured' })<{
  featured?: boolean
}>`
  border: 1px solid ${(p) => (p.featured ? 'rgba(200,255,77,0.4)' : p.theme.color.line)};
  border-radius: ${(p) => p.theme.radius.xl};
  background: ${(p) =>
    p.featured
      ? `radial-gradient(130% 160% at 50% 0%, rgba(200,255,77,0.1), transparent 60%), ${p.theme.color.bg2}`
      : p.theme.color.bg2};
  padding: clamp(24px, 4vw, 40px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  .price {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 800;
    font-size: 2.6rem;
    letter-spacing: -0.02em;
    span {
      font-size: 1rem;
      color: ${(p) => p.theme.color.fgMuted};
      font-weight: 500;
    }
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 8px;
    display: grid;
    gap: 10px;
    li {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      color: ${(p) => p.theme.color.fg};
      font-size: ${(p) => p.theme.fontSize.body};
      .tick {
        flex: 0 0 auto;
        margin-top: 2px;
        color: ${(p) => (p.featured ? '#c8ff4d' : p.theme.color.accent)};
      }
    }
  }
`

function Pricing() {
  return (
    <Section id="piani">
      <Container>
        <motion.div {...reveal} style={{ textAlign: 'center' }}>
          <Eyebrow>Piani</Eyebrow>
          <H2>Gratis per giocare. Premium per crescere.</H2>
          <p style={{ color: '#aeb8c8', maxWidth: '52ch', margin: '14px auto 0' }}>
            Tutto quello che serve per scendere in campo è gratis. Premium toglie i limiti e
            la burocrazia dalla testa: meno di un caffè a settimana.
          </p>
        </motion.div>
        <PlanGrid>
          <PlanBox {...reveal}>
            <strong style={{ fontSize: '1.1rem' }}>Gratis</strong>
            <div className="price">
              0 € <span>/ per sempre</span>
            </div>
            <ul>
              <li><span className="tick"><Icon name="check" size={15} /></span>1 squadra e 1 società</li>
              <li><span className="tick"><Icon name="check" size={15} /></span>3 candidature al mese</li>
              <li><span className="tick"><Icon name="check" size={15} /></span>Calendario e convocazioni</li>
              <li><span className="tick"><Icon name="check" size={15} /></span>Scadenze e documenti visibili</li>
            </ul>
            <ButtonLink to="/registrati" variant="secondary">
              Inizia gratis
            </ButtonLink>
          </PlanBox>
          <PlanBox {...reveal} featured>
            <strong style={{ fontSize: '1.1rem' }}>⭐ Premium</strong>
            <div className="price">
              5 € <span>/ mese · disdici quando vuoi</span>
            </div>
            <ul>
              <li><span className="tick"><Icon name="check" size={15} /></span>Squadre, società e candidature illimitate</li>
              <li><span className="tick"><Icon name="check" size={15} /></span>Avvisi automatici: certificati, quote, affiliazioni</li>
              <li><span className="tick"><Icon name="check" size={15} /></span>Statistiche presenze e profilo giocatore</li>
              <li><span className="tick"><Icon name="check" size={15} /></span>Proposte sponsor illimitate + in evidenza</li>
            </ul>
            <ButtonLink to="/registrati" variant="energy">
              Prova Premium <Icon name="arrow-right" size={16} />
            </ButtonLink>
          </PlanBox>
        </PlanGrid>
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

export function LandingSections() {
  return (
    <ContentBackdrop>
      <Pillars />
      <SportTeaser />
      <Pricing />
      <FinalCTA />
      {/* i 4 passi chiudono la pagina, subito dopo il "Pronto a scendere in campo?" */}
      <HowItWorks />
    </ContentBackdrop>
  )
}
