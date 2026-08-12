import { useMemo, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { uniform, texture, float, abs, vec3 } from 'three/tsl'
import { makeSportCourts } from './courts'

interface Props {
  scrollProgress: MutableRefObject<number>
  reduced: boolean
}

// A large floor that crossfades between the four sport courts (tennis → basket → calcio → volley)
// in sync with the morphing ball. Same triangular partition-of-unity weights as the ball, so the
// court under your feet always matches the ball above.
export function CourtFloor({ scrollProgress, reduced }: Props) {
  const { textures, planeSize } = useMemo(() => makeSportCourts(), [])

  const { material, uScroll } = useMemo(() => {
    const uScroll = uniform(0)
    const phase = uScroll.mul(textures.length - 1) // 0..3
    let colorNode = vec3(0, 0, 0)
    textures.forEach((tex, i) => {
      const w = float(1).sub(abs(phase.sub(i))).clamp(0, 1)
      colorNode = colorNode.add(texture(tex).rgb.mul(w))
    })
    const m = new MeshStandardNodeMaterial({ roughness: 0.92, metalness: 0.0 })
    m.colorNode = colorNode
    return { material: m, uScroll }
  }, [textures])

  useFrame((_s, delta) => {
    const s = uScroll as unknown as { value: number }
    s.value = MathUtils.damp(s.value, reduced ? 0 : scrollProgress.current, 4, delta)
  })

  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
      <planeGeometry args={[planeSize, planeSize]} />
    </mesh>
  )
}
