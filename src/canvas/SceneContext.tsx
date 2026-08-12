import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'

// The 3D arena is a single, persistent background that lives behind the WHOLE site (landing + app +
// auth). This context shares the scroll-progress ref (which drives the ball/court morph) and the
// current "mode", so each route can tell the scene how to behave without remounting the canvas.
export type SceneMode = 'landing' | 'app' | 'auth'

interface SceneCtx {
  scrollProgress: MutableRefObject<number>
  /** which arena zone the camera should look at (0 = court/hero, then società/squadre/sponsor/sport…) */
  focus: MutableRefObject<number>
  mode: SceneMode
  setMode: (m: SceneMode) => void
}

const Ctx = createContext<SceneCtx | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const scrollProgress = useRef(0)
  const focus = useRef(0)
  const [mode, setMode] = useState<SceneMode>('landing')
  const value = useMemo(() => ({ scrollProgress, focus, mode, setMode }), [mode])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useScene(): SceneCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useScene must be used within <SceneProvider>')
  return c
}

// Call inside a route/layout to declare how the persistent scene should behave there.
export function useSceneMode(mode: SceneMode) {
  const { setMode } = useScene()
  useEffect(() => {
    setMode(mode)
  }, [mode, setMode])
}
