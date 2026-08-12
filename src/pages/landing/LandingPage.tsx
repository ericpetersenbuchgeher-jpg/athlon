import { SmoothScroll } from '../../scroll/SmoothScroll'
import { ScrollProgressDriver } from '../../scroll/ScrollProgressDriver'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useScene, useSceneMode } from '../../canvas/SceneContext'
import { PublicNav } from '../../components/layout/PublicNav'
import { Footer } from '../../components/layout/Footer'
import { Hero } from './Hero'
import { LandingSections } from './Sections'

// The landing stays light: hero + pillars + CTA. The sport picker (and the immersive courts)
// lives on its own page, /sport.
export function LandingPage() {
  useSceneMode('landing')
  const { scrollProgress } = useScene() // shared with the persistent 3D arena background
  const reduced = useReducedMotion()

  return (
    <SmoothScroll>
      {/* writes scrollProgress.current from the tall #scene-track inside <Hero/> */}
      <ScrollProgressDriver progress={scrollProgress} trigger="#scene-track" />

      <PublicNav />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero reduced={reduced} />
        <LandingSections />
      </main>

      <Footer />
    </SmoothScroll>
  )
}
