import { Stage } from './Stage'
import { Scene } from './Scene'
import { Poster } from './Poster'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useQualityTier } from '../hooks/useQualityTier'
import { supportsWebGL } from '../lib/webgl'
import { useScene } from './SceneContext'

// The single 3D canvas for the whole app. Mounted once at the root (outside <Routes>), so it never
// unmounts on navigation — the arena is a continuous living background under every page.
export function PersistentScene() {
  const { scrollProgress, focus, mode } = useScene()
  const reduced = useReducedMotion()
  const { detail, amplitude, dpr } = useQualityTier()
  const webglOk = supportsWebGL()

  return (
    <div className="canvas-layer" aria-hidden="true">
      {webglOk ? (
        <Stage dpr={dpr}>
          <Scene
            scrollProgress={scrollProgress}
            focus={focus}
            reduced={reduced}
            detail={detail}
            amplitude={amplitude}
            mode={mode}
          />
        </Stage>
      ) : (
        <Poster />
      )}
    </div>
  )
}
