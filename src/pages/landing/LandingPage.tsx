import { useState } from 'react'
import { SmoothScroll } from '../../scroll/SmoothScroll'
import { ScrollProgressDriver } from '../../scroll/ScrollProgressDriver'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useScene, useSceneMode } from '../../canvas/SceneContext'
import { PublicNav } from '../../components/layout/PublicNav'
import { Footer } from '../../components/layout/Footer'
import { Hero } from './Hero'
import { LandingSections } from './Sections'
import { TennisExperience } from './sport/TennisExperience'
import type { SportId } from '../../data/types'

export function LandingPage() {
  useSceneMode('landing')
  const { scrollProgress } = useScene() // shared with the persistent 3D arena background
  const reduced = useReducedMotion()

  // choosing / typing a sport transforms the whole landing into that sport's immersive scene
  const [activeSport, setActiveSport] = useState<SportId | null>(null)
  if (activeSport === 'tennis') {
    return <TennisExperience onExit={() => setActiveSport(null)} />
  }

  return (
    <SmoothScroll>
      {/* writes scrollProgress.current from the tall #scene-track inside <Hero/> */}
      <ScrollProgressDriver progress={scrollProgress} trigger="#scene-track" />

      <PublicNav />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero reduced={reduced} />
        <LandingSections onEnterSport={setActiveSport} />
      </main>

      <Footer />
    </SmoothScroll>
  )
}
