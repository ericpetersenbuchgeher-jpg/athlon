import type { MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { MorphingForm } from './MorphingForm'
import { CourtFloor } from './CourtFloor'
import { Arena } from './Arena'
import type { SceneMode } from './SceneContext'

interface SceneProps {
  scrollProgress: MutableRefObject<number>
  focus: MutableRefObject<number>
  reduced: boolean
  detail: number
  amplitude: number
  mode: SceneMode
}

// When not on the landing (no scroll track to read), gently auto-advance the morph so the ball and
// court keep changing sport on their own — the scene stays alive on every page.
function AmbientDriver({
  progress,
  active,
  reduced,
}: {
  progress: MutableRefObject<number>
  active: boolean
  reduced: boolean
}) {
  useFrame((state) => {
    if (!active) return
    if (reduced) {
      progress.current = 0.15
      return
    }
    const t = state.clock.elapsedTime
    progress.current = Math.sin(t * 0.05) * 0.5 + 0.5 // slow 0..1 loop
  })
  return null
}

// The home hero scene: a real, morphing ball on a court that changes with it, inside a crowd-filled
// arena. Present behind every page (landing / app / auth) via <PersistentScene>.
export function Scene({ scrollProgress, focus, reduced, detail, amplitude, mode }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#05070b']} />
      <fog attach="fog" args={['#05070b', 14, 52]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 16, 8]} intensity={0.7} />
      <directionalLight position={[-6, 6, -5]} intensity={0.28} color="#6f9bff" />

      <AmbientDriver progress={scrollProgress} active={mode !== 'landing'} reduced={reduced} />
      <CameraRig scrollProgress={scrollProgress} focus={focus} reduced={reduced} mode={mode} />
      <Arena />
      <CourtFloor scrollProgress={scrollProgress} reduced={reduced} />
      <MorphingForm
        scrollProgress={scrollProgress}
        reduced={reduced}
        detail={detail}
        amplitude={amplitude}
        y={0.1}
      />
    </>
  )
}
