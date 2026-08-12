import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { SceneMode } from './SceneContext'

interface Props {
  scrollProgress: MutableRefObject<number>
  focus: MutableRefObject<number>
  reduced: boolean
  mode: SceneMode
}

// Camera vantage points inside the arena, one per landing zone. As you scroll to a section, that
// section sets `focus` and the camera glides to the matching spot — you "move through the palazzetto".
const ZONES: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 6.4, 15], look: [0, 1.7, -1] }, // 0 · hero / centre court
  { pos: [-10.5, 4.6, 10.5], look: [-2.5, 1.4, -1] }, // 1 · società (left corner)
  { pos: [10.5, 4.3, 10.5], look: [2.5, 1.2, -1] }, // 2 · squadre (right corner)
  { pos: [0, 3.3, 12.5], look: [0, 1.2, -4] }, // 3 · sponsor (courtside boards)
  { pos: [0, 9.5, 17], look: [0, 2, 0] }, // 4 · sport (wide bowl)
]

const _p = new Vector3()
const _l = new Vector3()

export function CameraRig({ scrollProgress, focus, reduced, mode }: Props) {
  const pos = useRef(new Vector3(0, 6.4, 15))
  const look = useRef(new Vector3(0, 1.7, -1))

  useFrame((state, delta) => {
    const cam = state.camera

    if (mode !== 'landing') {
      if (reduced) {
        cam.position.set(14, 8, 17)
        cam.lookAt(0, 1.5, 0)
        return
      }
      const t = state.clock.elapsedTime
      const a = t * 0.05
      cam.position.set(Math.sin(a) * 20, 8.5 + Math.sin(t * 0.12) * 1.1, Math.cos(a) * 20)
      cam.lookAt(0, 1.6, 0)
      return
    }

    // landing: glide toward the focused zone
    const zone = ZONES[Math.max(0, Math.min(ZONES.length - 1, Math.round(focus.current)))]
    _p.set(...zone.pos)
    _l.set(...zone.look)
    if (!reduced) {
      // gentle idle drift + a touch of scroll push-in on the hero
      const t = state.clock.elapsedTime
      _p.x += Math.sin(t * 0.2) * 0.5
      _p.y += Math.sin(t * 0.27) * 0.3
      _p.z -= scrollProgress.current * 1.5
    }
    const k = reduced ? 1 : 1 - Math.exp(-2.2 * delta)
    pos.current.lerp(_p, k)
    look.current.lerp(_l, k)
    cam.position.copy(pos.current)
    cam.lookAt(look.current)
  })

  return null
}
