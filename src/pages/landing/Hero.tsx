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

const Eyebrow = styled(motion.p)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: ${(p) => p.theme.fontSize.small};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${(p) => p.theme.color.fgMuted};
  margin: 0 0 18px;
  padding: 7px 14px;
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: 999px;
  background: rgba(7, 9, 13, 0.4);
  backdrop-filter: blur(8px);
`

const Lead = styled.p`
  font-family: ${(p) => p.theme.font.display};
  font-weight: 700;
  font-size: ${(p) => p.theme.fontSize.h2};
  letter-spacing: -0.02em;
  margin: 0;
  color: ${(p) => p.theme.color.fg};
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.55);
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
  text-shadow: 0 0 60px ${(p) => p.c}55;
  white-space: nowrap;
`

const Sub = styled(motion.p)`
  max-width: 560px;
  margin: 10px auto 0;
  color: ${(p) => p.theme.color.fg};
  font-size: clamp(1rem, 0.9rem + 0.4vw, 1.2rem);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.7);
`

const Actions = styled(motion.div)`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 26px;
`

const ScrollHint = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: ${(p) => p.theme.color.fgFaint};
  font-size: ${(p) => p.theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const sportsSeq = [
  { label: 'tennis', color: '#c8ff4d' },
  { label: 'basket', color: '#ff6b3d' },
  { label: 'calcio', color: '#37d17a' },
  { label: 'volley', color: '#4f83ff' },
] as const

// each word peaks at its segment centre; input ranges stay within [0,1] (Motion/WAAPI requires it)
const wordRanges: { stops: [number, number, number]; op: [number, number, number] }[] = [
  { stops: [0, 0.16, 0.32], op: [1, 1, 0] }, // basket — starts full, fades out
  { stops: [0.17, 0.33, 0.5], op: [0, 1, 0] }, // calcio
  { stops: [0.5, 0.66, 0.82], op: [0, 1, 0] }, // tennis
  { stops: [0.68, 0.84, 1], op: [0, 1, 1] }, // volley — holds to the end
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
  const opacity = useTransform(progress, stops, op)
  const y = useTransform(progress, stops, [26, 0, -26])
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
        <motion.div
          style={{ opacity: fadeAll }}
          onViewportEnter={() => {
            focus.current = 0
          }}
        >
          <Container>
            <SrHeading>
              Athlon — la piattaforma dello sport italiano: crea la tua società, trova la tua
              squadra, trova sponsor.
            </SrHeading>
            <Eyebrow {...anim(0)}>
              <Icon name="sparkle" size={14} /> La piattaforma dello sport italiano
            </Eyebrow>
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
            <Sub {...anim(0.15)}>
              {BRAND.claim} Uno spazio unico per atleti e dirigenti — dal campo alla burocrazia.
            </Sub>
            <Actions {...anim(0.25)}>
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
