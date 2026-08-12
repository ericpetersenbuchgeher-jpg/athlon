import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3, type Mesh } from 'three'
import { makeCourtTexture } from './courtTexture'

interface Props {
  scrollProgress: MutableRefObject<number>
  reduced: boolean
}

const BL = 11.885 // baseline distance from net
const RALLY = BL - 2 // where the ball turns around
const PLAYER_Z = BL - 0.6

// deterministic landing spot per rally shot (keeps a lively, non-repeating pattern)
const spot = (i: number) => Math.sin(i * 1.7) * 3.2 + Math.sin(i * 0.5) * 0.8

// camera keyframes along the scroll: courtside → behind the baseline → aerial
const CAM: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0.0, pos: [8.5, 1.8, 13], look: [0, 1.1, 0] },
  { p: 0.4, pos: [0.5, 3.2, 18.5], look: [0, 0.7, -1] },
  { p: 0.72, pos: [-7.5, 2.6, 12], look: [0, 0.8, 0] },
  { p: 1.0, pos: [0, 21, 7], look: [0, 0, 0] },
]

const _pos = new Vector3()
const _look = new Vector3()
function sampleCam(p: number, pos: Vector3, look: Vector3) {
  let a = CAM[0]
  let b = CAM[CAM.length - 1]
  for (let i = 0; i < CAM.length - 1; i++) {
    if (p >= CAM[i].p && p <= CAM[i + 1].p) {
      a = CAM[i]
      b = CAM[i + 1]
      break
    }
  }
  const span = b.p - a.p || 1
  const t = MathUtils.clamp((p - a.p) / span, 0, 1)
  const e = t * t * (3 - 2 * t) // smoothstep for a cinematic ease
  pos.set(
    MathUtils.lerp(a.pos[0], b.pos[0], e),
    MathUtils.lerp(a.pos[1], b.pos[1], e),
    MathUtils.lerp(a.pos[2], b.pos[2], e),
  )
  look.set(
    MathUtils.lerp(a.look[0], b.look[0], e),
    MathUtils.lerp(a.look[1], b.look[1], e),
    MathUtils.lerp(a.look[2], b.look[2], e),
  )
}

export function TennisScene({ scrollProgress, reduced }: Props) {
  const { texture, planeW, planeH } = useMemo(() => makeCourtTexture(), [])
  const ball = useRef<Mesh>(null)
  const p1 = useRef<Mesh>(null)
  const p2 = useRef<Mesh>(null)
  const camPos = useRef(new Vector3(8.5, 1.8, 13))
  const camLook = useRef(new Vector3(0, 1.1, 0))

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // --- camera driven by scroll (single owner) ---
    sampleCam(reduced ? 0.15 : scrollProgress.current, _pos, _look)
    const k = reduced ? 1 : 1 - Math.exp(-6 * delta) // framerate-independent smoothing
    camPos.current.lerp(_pos, k)
    camLook.current.lerp(_look, k)
    state.camera.position.copy(camPos.current)
    state.camera.lookAt(camLook.current)

    // --- rally ---
    const T = 2.0 // seconds per net crossing
    const speed = reduced ? 0 : 1
    const tt = t * speed
    const idx = Math.floor(tt / T)
    const u = tt / T - idx
    const dir = idx % 2 === 0 ? 1 : -1
    const startZ = dir > 0 ? -RALLY : RALLY
    const endZ = dir > 0 ? RALLY : -RALLY
    const startX = spot(idx)
    const endX = spot(idx + 1)

    const bx = MathUtils.lerp(startX, endX, u)
    const bz = MathUtils.lerp(startZ, endZ, u)
    const by = 0.16 + Math.sin(u * Math.PI) * 1.7 // single lively arc
    if (ball.current) {
      if (reduced) ball.current.position.set(0.6, 0.16, 1.2)
      else ball.current.position.set(bx, by, bz)
      ball.current.rotation.x += delta * 6
      ball.current.rotation.y += delta * 4
    }

    // --- players track the ball on their own half ---
    const ease = 1 - Math.exp(-4 * delta)
    if (p1.current) {
      const target = bz < 0 ? bx : p1.current.position.x
      p1.current.position.x = reduced ? -1.5 : MathUtils.lerp(p1.current.position.x, target, ease)
      p1.current.position.z = -PLAYER_Z
    }
    if (p2.current) {
      const target = bz > 0 ? bx : p2.current.position.x
      p2.current.position.x = reduced ? 1.5 : MathUtils.lerp(p2.current.position.x, target, ease)
      p2.current.position.z = PLAYER_Z
    }
  })

  return (
    <group>
      <color attach="background" args={['#0a1f16']} />
      <fog attach="fog" args={['#0a1f16', 18, 60]} />
      {/* stadium-ish lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 14, 8]} intensity={1.5} castShadow={false} />
      <directionalLight position={[-8, 10, -6]} intensity={0.5} color="#8db4ff" />

      {/* court + surround */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[planeW, planeH]} />
        <meshStandardMaterial map={texture} roughness={0.85} metalness={0.02} />
      </mesh>

      {/* net body + top band */}
      <mesh position={[0, 0.535, 0]}>
        <boxGeometry args={[planeW - 3, 1.07, 0.04]} />
        <meshStandardMaterial color="#0c1a14" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[planeW - 3, 0.09, 0.07]} />
        <meshStandardMaterial color="#f4f7fb" />
      </mesh>

      {/* ball */}
      <mesh ref={ball}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#d9f24a" roughness={0.75} />
      </mesh>

      {/* players (abstract) */}
      <mesh ref={p1} position={[-1.5, 0.95, -PLAYER_Z]}>
        <capsuleGeometry args={[0.34, 1.0, 8, 16]} />
        <meshStandardMaterial color="#ff6b3d" roughness={0.5} />
      </mesh>
      <mesh ref={p2} position={[1.5, 0.95, PLAYER_Z]}>
        <capsuleGeometry args={[0.34, 1.0, 8, 16]} />
        <meshStandardMaterial color="#4f83ff" roughness={0.5} />
      </mesh>
    </group>
  )
}
