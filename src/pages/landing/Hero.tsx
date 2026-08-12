import styled from '@emotion/styled'
import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ButtonLink, Container, Icon } from '../../components/ui'
import { BRAND } from '../../brand'
import { useScene } from '../../canvas/SceneContext'

// A tall track. The hero content is sticky-pinned and stays centred while the 3D ball morphs
// through four sports; the giant sport word crossfades in sync with the shader's uScroll.
const Track = styled.section`
  position: relative;
  height: 340vh;
`

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  place-items: center;
  text-align: center;
`

// darkens the centre of the bright 3D court so the hero text stays readable over it
const Scrim = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    58% 52% at 50% 52%,
    rgba(4, 6, 10, 0.62) 0%,
    rgba(4, 6, 10, 0.38) 55%,
    transparent 100%
  );
`

// screen-reader / SEO heading (the visible hero title is a decorative morphing word)
const SrHeading = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

const Lead = styled.p`
  font-family: ${(p) => p.theme.font.display};
  font-weight: 700;
  font-size: ${(p) => p.theme.fontSize.h2};
  letter-spacing: -0.02em;
  margin: 0;
  color: ${(p) => p.theme.color.fg};
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.75);
`

// the giant, colour-shifting sport word — the centrepiece, echoing the reference reels
const WordStage = styled.div`
  position: relative;
  height: clamp(3.4rem, 12vw, 11rem);
  width: 100%;
  margin: 4px 0 10px;
`

const Word = styled(motion.span, { shouldForwardProp: (p) => p !== 'c' })<{ c: string }>`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  font-size: ${(p) => p.theme.fontSize.hero};
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: ${(p) => p.c};
  text-shadow: 0 0 60px ${(p) => p.c}55, 0 4px 30px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
`

const Sub = styled.p`
  max-width: 560px;
  margin: 10px auto 0;
  color: ${(p) => p.theme.color.fg};
  font-size: clamp(1rem, 0.9rem + 0.4vw, 1.2rem);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 2px 20px rgba(0, 0, 0, 0.8);
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 26px;
`

const ScrollHint = styled(motion.div)`
  position: absolute;
  bottom: 22px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
  /* on short viewports it would sit on top of the CTA buttons */
  @media (max-height: 640px) {
    display: none;
  }
`

// order must match the balls in MorphingForm: tennis → basket → calcio → volley
const sportsSeq = [
  { label: 'tennis', color: '#c8ff4d' },
  { label: 'basket', color: '#ff6b3d' },
  { label: 'calcio', color: '#37d17a' },
  { label: 'volley', color: '#4f83ff' },
] as const

// One word at a time: each word fully fades out BEFORE the next fades in (a small dead gap
// separates them), so the giant glowing words never pile up on screen. Each word peaks where its
// ball peaks in the shader (phase = progress * 3 → peaks at 0, 1/3, 2/3, 1).
const wordRanges: { stops: number[]; op: number[] }[] = [
  { stops: [0, 0.11, 0.155], op: [1, 1, 0] }, // tennis — starts full, out before basket
  { stops: [0.179, 0.224, 0.443, 0.488], op: [0, 1, 1, 0] }, // basket — peak ~1/3
  { stops: [0.512, 0.557, 0.776, 0.821], op: [0, 1, 1, 0] }, // calcio — peak ~2/3
  { stops: [0.845, 0.89, 1], op: [0, 1, 1] }, // volley — holds to the end
]

function WordItem({
  progress,
  index,
  label,
  color,
  reduced,
}: {
  progress: MotionValue<number>
  index: number
  label: string
  color: string
  reduced: boolean
}) {
  const { stops, op } = wordRanges[index]
  const yStops = op.map((o, i) => (o === 0 ? (i === 0 ? 26 : -26) : 0))
  const opacity = useTransform(progress, stops, op)
  const y = useTransform(progress, stops, yStops)
  return (
    <Word c={color} style={{ opacity: reduced ? (index === 0 ? 1 : 0) : opacity, y: reduced ? 0 : y }}>
      {label}
    </Word>
  )
}

export function Hero({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLElement>(null)
  const { focus } = useScene()
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const fadeAll = useTransform(scrollYProgress, [0.86, 1], [1, reduced ? 1 : 0])

  const anim = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
        }

  return (
    <Track id="scene-track" ref={trackRef}>
      <Sticky>
        <Scrim aria-hidden="true" />
        <motion.div
          style={{ opacity: fadeAll, position: 'relative' }}
          onViewportEnter={() => {
            focus.current = 0
          }}
        >
          <Container>
            <SrHeading>
              Athlon — la piattaforma dello sport italiano: crea la tua società, trova la tua
              squadra, trova sponsor.
            </SrHeading>
            <motion.div {...anim(0)}>
              <Lead>Il tuo posto nel</Lead>
              <WordStage>
                {sportsSeq.map((s, i) => (
                  <WordItem
                    key={s.label}
                    progress={scrollYProgress}
                    index={i}
                    label={s.label}
                    color={s.color}
                    reduced={reduced}
                  />
                ))}
              </WordStage>
              <Sub>
                {BRAND.claim} Uno spazio unico per atleti e dirigenti — dal campo alla burocrazia.
              </Sub>
            </motion.div>
            <Actions as={motion.div} {...anim(0.2)}>
              <ButtonLink to="/registrati" variant="energy" size="lg">
                Inizia gratis <Icon name="arrow-right" size={18} />
              </ButtonLink>
              <ButtonLink to="/accedi" variant="secondary" size="lg">
                Accedi
              </ButtonLink>
            </Actions>
          </Container>
        </motion.div>
        {!reduced && (
          <ScrollHint
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Scorri per vedere la forma cambiare
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <Icon name="chevron-right" size={18} style={{ transform: 'rotate(90deg)' }} />
            </motion.span>
          </ScrollHint>
        )}
      </Sticky>
    </Track>
  )
}
