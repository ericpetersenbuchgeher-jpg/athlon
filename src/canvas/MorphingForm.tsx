import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Color, Vector3, type Mesh } from 'three'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import {
  uniform,
  positionLocal,
  normalLocal,
  normalize,
  mx_fractal_noise_float,
  vec3,
  float,
  dot,
  abs,
  smoothstep,
  max,
  mix,
} from 'three/tsl'

interface Props {
  scrollProgress: MutableRefObject<number>
  reduced: boolean
  detail: number
  amplitude: number
  /** height of the ball above the court floor */
  y?: number
}

const col = (hex: string) => {
  const c = new Color(hex)
  return vec3(c.r, c.g, c.b)
}
const axis = (x: number, y: number, z: number) => {
  const v = new Vector3(x, y, z).normalize()
  return vec3(v.x, v.y, v.z)
}

// A clean, perfectly round ball that morphs through the sports as you scroll — tennis → basket →
// calcio → volley — with the real seams of each ball. No mushy deformation: the shape stays a true
// sphere; it just spins, floats and pulses on each transition. Seams are computed from the sphere
// normal (great-circle lines + spots) so they map exactly onto the ball.
export function MorphingForm({ scrollProgress, reduced, detail, y = 0 }: Props) {
  const pointer = useThree((s) => s.pointer)
  const meshRef = useRef<Mesh>(null)
  const spin = useRef(0)
  const px = useRef(0)

  const { material, uScroll } = useMemo(() => {
    const uScroll = uniform(0)
    const N = normalize(normalLocal)

    const seam = (ax: ReturnType<typeof axis>, w: number) =>
      float(1).sub(smoothstep(0, w, abs(dot(N, ax))))
    const spot = (ax: ReturnType<typeof axis>, size: number) =>
      smoothstep(1 - size, 1 - size + 0.05, dot(N, ax))

    // TENNIS: yellow-green + white curved seam
    const tennis = mix(col('#c6f24a'), col('#ffffff'), seam(axis(1, 1, 0.4), 0.05))
    // BASKET: orange + dark rings
    const basketSeam = max(
      max(seam(axis(1, 0, 0), 0.04), seam(axis(0, 0, 1), 0.04)),
      max(seam(axis(1, 0, 1), 0.032), seam(axis(1, 0, -1), 0.032)),
    )
    const basket = mix(col('#ff6a2f'), col('#0a0705'), basketSeam)
    // CALCIO: white + dark pentagon-ish spots
    const soccerAxes = [
      axis(0, 1, 0.35),
      axis(0, -1, 0.35),
      axis(1, 0.3, 0.6),
      axis(-1, 0.3, 0.6),
      axis(0.7, -0.4, -1),
      axis(-0.7, -0.4, -1),
      axis(1, -0.2, -0.5),
      axis(-1, -0.2, -0.5),
    ]
    let soc = spot(soccerAxes[0], 0.16)
    for (let i = 1; i < soccerAxes.length; i++) soc = max(soc, spot(soccerAxes[i], 0.16))
    const soccer = mix(col('#f3f5f9'), col('#0e1218'), soc.mul(0.92))
    // VOLLEY: white + blue panel seams
    const volleySeam = max(
      max(seam(axis(0, 1, 0), 0.05), seam(axis(1, 0, 0.5), 0.05)),
      seam(axis(1, 0, -0.5), 0.05),
    )
    const volley = mix(col('#eef2fb'), col('#3f6dff'), volleySeam)

    const balls = [tennis, basket, soccer, volley]
    const phase = uScroll.mul(balls.length - 1) // 0..3
    let colorNode = vec3(0, 0, 0)
    balls.forEach((b, i) => {
      const w = float(1).sub(abs(phase.sub(i))).clamp(0, 1)
      colorNode = colorNode.add(b.mul(w))
    })

    const m = new MeshStandardNodeMaterial({ roughness: 0.45, metalness: 0.05 })
    // subtle surface grain (colour only — the shape stays a clean sphere), fixed to the ball
    const grain = mx_fractal_noise_float(positionLocal.mul(3.2)).mul(0.05).add(0.975)
    m.colorNode = colorNode.mul(grain)
    m.emissiveNode = colorNode.mul(0.05)

    return { material: m, uScroll }
  }, [])

  useFrame((state, delta) => {
    const s = uScroll as unknown as { value: number }
    s.value = MathUtils.damp(s.value, reduced ? 0 : scrollProgress.current, 4, delta)
    px.current = MathUtils.damp(px.current, reduced ? 0 : pointer.x, 5, delta)

    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime

    // spin, with a burst mid-transition so the swap feels dynamic
    const phase = s.value * 3
    const frac = phase - Math.floor(phase)
    const transition = reduced ? 0 : 1 - Math.abs(frac - 0.5) * 2
    spin.current += delta * (0.3 + (reduced ? 0 : 0.7) + transition * 2.0)
    mesh.rotation.y = spin.current
    mesh.rotation.x = 0.28 + (reduced ? 0 : Math.sin(t * 0.3) * 0.12)
    mesh.rotation.z = reduced ? 0 : Math.sin(t * 0.22) * 0.06

    // bounce on the court + gentle pointer follow + a pulse on transitions
    // (rigid transforms only — the sphere is never deformed)
    const bounce = reduced ? 0 : Math.abs(Math.sin(t * 1.05)) * 0.28
    mesh.position.set(reduced ? 0 : px.current * 0.35, y + bounce, 0)
    const pulse = 1 + (reduced ? 0 : transition * 0.05)
    mesh.scale.setScalar(pulse)
  })

  return (
    <mesh ref={meshRef} material={material} position={[0, y, 0]}>
      <icosahedronGeometry args={[1.7, Math.max(detail, 80)]} />
    </mesh>
  )
}
