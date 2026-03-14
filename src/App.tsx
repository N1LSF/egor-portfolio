import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Scene from './components/canvas/Scene'
import Overlay from './components/dom/Overlay'
import AboutSection from './components/dom/AboutSection'
import ExpertiseSection from './components/dom/ExpertiseSection'
import WorksSection from './components/dom/WorksSection'
import PreloaderOverlay from './components/dom/PreloaderOverlay'
import LangToggle from './components/dom/LangToggle'
import FooterCTA from './components/dom/FooterCTA'
import CustomCursor from './components/dom/CustomCursor'
import SectionDivider from './components/dom/SectionDivider'
import PriceCalculator from './components/dom/PriceCalculator'
import { useAppStore } from './store'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const setMouse = useAppStore((s) => s.setMouse)
  const setWindowSize = useAppStore((s) => s.setWindowSize)
  const setLoadProgress = useAppStore((s) => s.setLoadProgress)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMouse(e.clientX, e.clientY)
    const handleResize = () => setWindowSize(window.innerWidth, window.innerHeight)

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('resize', handleResize)

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setLoadProgress(progress)
    }, 200)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', handleResize)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <>
      <PreloaderOverlay />
      <Scene />
      <LangToggle />
      <CustomCursor />
      <div className="content-layer">
        <Overlay />
        <AboutSection />
        <ExpertiseSection />
        <WorksSection />
        <PriceCalculator />
        <FooterCTA />
      </div>
    </>
  )
}