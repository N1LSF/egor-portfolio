import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../store'
import { tr } from '../../i18n'
import './Overlay.css'


export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const isLoaded = useAppStore((s) => s.isLoaded)
  const lang = useAppStore((s) => s.lang)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isLoaded || hasAnimated.current) return
    hasAnimated.current = true

    const container = containerRef.current
    if (!container) return

    const tl = gsap.timeline({ delay: 0.1 })

    const inners = container.querySelectorAll('.reveal-inner')
    inners.forEach((el) => {
      gsap.set(el, { yPercent: 110, visibility: 'visible', filter: 'blur(4px)' })
    })
    inners.forEach((el, i) => {
      tl.to(el, { yPercent: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }, 0.15 * i)
    })

    const desc = container.querySelector('.hero-desc') as HTMLElement
    gsap.set(desc, { opacity: 0, y: 20, visibility: 'visible' })
    tl.to(desc, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

    const stats = container.querySelectorAll('.hero-stat')
    stats.forEach((el) => gsap.set(el, { opacity: 0, y: 20, visibility: 'visible' }))
    tl.to(stats, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4')

    const hint = container.querySelector('.scroll-hint') as HTMLElement
    gsap.set(hint, { opacity: 0, y: 10, visibility: 'visible' })
    tl.to(hint, { opacity: 0.4, y: 0, duration: 1, ease: 'power2.out' }, '-=0.3')
    gsap.to(hint, { y: 6, repeat: -1, yoyo: true, duration: 1.4, ease: 'sine.inOut', delay: 3 })
  }, [isLoaded])

  return (
    <div ref={containerRef} id="hero-overlay" className="hero-container" data-cursor="light">
      <div className="hero">
        <div className="hero-text">
          <div className="reveal-line">
            <h1 className="reveal-inner hero-name">Egor</h1>
          </div>
          <div className="reveal-line">
            <p className="reveal-inner hero-role">{tr('hero.role', lang)}</p>
          </div>
          <div className="reveal-line">
            <h1 className="reveal-inner hero-name">Malakhov</h1>
          </div>
          <p className="hero-desc">{tr('hero.desc', lang)}</p>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">2+</span>
            <span className="hero-stat-label">{tr('hero.years', lang)}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">30+</span>
            <span className="hero-stat-label">{tr('hero.projects', lang)}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">100%</span>
            <span className="hero-stat-label">{tr('hero.code', lang)}</span>
          </div>
        </div>

        <div className="scroll-hint">
          <span>{tr('hero.scroll', lang)}</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="1" y="1" width="12" height="20" rx="6" />
            <line x1="7" y1="5" x2="7" y2="9" />
          </svg>
        </div>
      </div>
    </div>
  )
}