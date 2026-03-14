import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Layers, FileCode2, Sparkles, Box,
  Server, Database, Code2, ArrowLeftRight,
} from 'lucide-react'
import { useAppStore } from '../../store'
import { tr } from '../../i18n'
import './ExpertiseSection.css'

gsap.registerPlugin(ScrollTrigger)

const ICONS = [Layers, FileCode2, Sparkles, Box, Server, Database, Code2, ArrowLeftRight]
const TECH_KEYS = ['react', 'ts', 'gsap', 'webgl', 'node', 'cms', 'html', 'api'] as const
const TECH_NAMES = [
  'React / Next.js', 'TypeScript', 'GSAP', 'WebGL / GLSL',
  'Node.js', 'Headless CMS', 'HTML / CSS', 'REST & GraphQL',
]
const TECH_LEVELS = [95, 90, 92, 78, 88, 85, 98, 82]

const POSITIONS = [
  { top: '4%', left: '8%' },
  { top: '2%', left: '55%' },
  { top: '28%', left: '30%' },
  { top: '22%', left: '72%' },
  { top: '52%', left: '12%' },
  { top: '48%', left: '52%' },
  { top: '72%', left: '35%' },
  { top: '66%', left: '75%' },
]

const FLOAT_DELAYS = ['0s', '-1.5s', '-3s', '-2s', '-4s', '-1s', '-3.5s', '-2.5s']
const FLOAT_DURATIONS = ['6s', '5.5s', '6.5s', '5s', '5.8s', '6.2s', '5.2s', '6.8s']

const MOBILE_BREAKPOINT = 768

interface CardPos { top: number; left: number }

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null!)
  const labelRef = useRef<HTMLDivElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const subtitleRef = useRef<HTMLParagraphElement>(null!)
  const pillsContainerRef = useRef<HTMLDivElement>(null!)
  const pillRefs = useRef<(HTMLDivElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null!)

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [cardPos, setCardPos] = useState<CardPos | null>(null)

  const lang = useAppStore((s) => s.lang)
  const isMobile = useIsMobile()

  const activeKey = activeIndex !== null ? TECH_KEYS[activeIndex] : null

  /* ── Desktop: hover-based positioning ── */
  const handlePillEnter = useCallback((i: number) => {
    if (isMobile) return
    const pill = pillRefs.current[i]
    const container = pillsContainerRef.current
    if (!pill || !container) return

    const pRect = pill.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()
    const pillCenterX = pRect.left + pRect.width / 2 - cRect.left
    const containerMid = cRect.width / 2

    let cardLeft: number
    if (pillCenterX < containerMid) {
      cardLeft = pRect.left - cRect.left + pRect.width + 16
    } else {
      cardLeft = pRect.left - cRect.left - 336 - 16
    }

    cardLeft = Math.max(0, Math.min(cardLeft, cRect.width - 336))
    const pillTop = pRect.top - cRect.top
    const cardTop = Math.max(0, Math.min(pillTop - 24, cRect.height - 380))

    setCardPos({ top: cardTop, left: cardLeft })
    setActiveIndex(i)
  }, [isMobile])

  const handlePillLeave = useCallback(() => {
    if (isMobile) return
    setActiveIndex(null)
    setCardPos(null)
  }, [isMobile])

  /* ── Mobile: tap-based toggle ── */
  const handlePillTap = useCallback((i: number) => {
    if (!isMobile) return
    setActiveIndex((prev) => (prev === i ? null : i))
  }, [isMobile])

  /* ── GSAP entrance ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(labelRef.current, { opacity: 0, y: -10, visibility: 'hidden' })
      gsap.set(titleRef.current, {
        yPercent: 100, opacity: 0, filter: 'blur(14px)', visibility: 'hidden',
      })
      gsap.set(subtitleRef.current, {
        yPercent: 50, opacity: 0, filter: 'blur(8px)', visibility: 'hidden',
      })
      pillRefs.current.forEach((pill) => {
        if (pill) gsap.set(pill, {
          opacity: 0, scale: 0.8, filter: 'blur(8px)', visibility: 'hidden',
        })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(labelRef.current, {
        opacity: 1, y: 0, visibility: 'visible', duration: 0.6, ease: 'power3.out',
      }, 0)
      tl.to(titleRef.current, {
        yPercent: 0, opacity: 1, filter: 'blur(0px)',
        visibility: 'visible', duration: 1.2, ease: 'power4.out',
      }, 0.1)
      tl.to(subtitleRef.current, {
        yPercent: 0, opacity: 1, filter: 'blur(0px)',
        visibility: 'visible', duration: 1.0, ease: 'power3.out',
      }, 0.35)

      const pills = pillRefs.current.filter(Boolean)
      tl.to(pills, {
        opacity: 1, scale: 1, filter: 'blur(0px)', visibility: 'visible',
        duration: 0.8, ease: 'power3.out', stagger: 0.1,
      }, 0.5)
    }, section)

    return () => ctx.revert()
  }, [])

  /* ── Bar animation ── */
  useEffect(() => {
    if (!barRef.current) return
    const level = activeIndex !== null ? TECH_LEVELS[activeIndex] : 0
    gsap.to(barRef.current, { width: `${level}%`, duration: 0.8, ease: 'power2.out' })
  }, [activeIndex])

  /* ── Close mobile card on outside tap ── */
  useEffect(() => {
    if (!isMobile || activeIndex === null) return
    const handler = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      if (
        !target.closest('.expertise-pill') &&
        !target.closest('.expertise-mobile-card')
      ) {
        setActiveIndex(null)
      }
    }
    document.addEventListener('touchstart', handler, { passive: true })
    return () => document.removeEventListener('touchstart', handler)
  }, [isMobile, activeIndex])

  return (
    <section ref={sectionRef} className="expertise-section">
      <div className="expertise-bg" />

      <div className="expertise-content">
        <div ref={labelRef} className="about-section-label expertise-label-override">
          <span className="label-slash">//</span> {tr('expertise.label', lang)}
        </div>
        <h2 ref={titleRef} className="expertise-title">
          {tr('expertise.title', lang)}
        </h2>
        <p ref={subtitleRef} className="expertise-subtitle">
          {tr('expertise.subtitle', lang)}
        </p>
      </div>

      {/* ── Desktop: floating pills ── */}
      {!isMobile && (
        <div
          ref={pillsContainerRef}
          className={`expertise-pills-space${activeIndex !== null ? ' pills-frozen' : ''}`}
        >
          {TECH_NAMES.map((name, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={name}
                ref={(el) => { pillRefs.current[i] = el }}
                className={[
                  'expertise-pill',
                  activeIndex === i ? 'expertise-pill--active' : '',
                  activeIndex !== null && activeIndex !== i
                    ? 'expertise-pill--dimmed'
                    : '',
                ].join(' ')}
                style={{
                  top: POSITIONS[i].top,
                  left: POSITIONS[i].left,
                  animationDelay: FLOAT_DELAYS[i],
                  animationDuration: FLOAT_DURATIONS[i],
                }}
                onMouseEnter={() => handlePillEnter(i)}
                onMouseLeave={handlePillLeave}
              >
                <Icon size={14} strokeWidth={1.5} className="expertise-pill-icon" />
                {name}
              </div>
            )
          })}

          {/* Desktop detail card */}
          <div
            className={`expertise-detail-card${
              activeKey && cardPos ? ' expertise-detail-card--visible' : ''
            }`}
            style={
              cardPos
                ? { top: `${cardPos.top}px`, left: `${cardPos.left}px` }
                : undefined
            }
          >
            {activeKey && activeIndex !== null && (
              <>
                <div className="expertise-detail-top">
                  <span className="expertise-detail-category">
                    {tr(`tech.${activeKey}.cat`, lang)}
                  </span>
                  <span className="expertise-detail-level">
                    {TECH_LEVELS[activeIndex]}%
                  </span>
                </div>
                <h3 className="expertise-detail-name">
                  {TECH_NAMES[activeIndex]}
                </h3>
                <div className="expertise-detail-bar-wrap">
                  <div className="expertise-detail-bar-meta">
                    <span className="expertise-detail-bar-label">
                      {tr('expertise.bar', lang)}
                    </span>
                    <span className="expertise-detail-bar-value">
                      {TECH_LEVELS[activeIndex]}%
                    </span>
                  </div>
                  <div className="expertise-detail-bar-track">
                    <div ref={barRef} className="expertise-detail-bar-fill" />
                  </div>
                </div>
                <p className="expertise-detail-desc">
                  {tr(`tech.${activeKey}.desc`, lang)}
                </p>
                <div className="expertise-detail-example">
                  <span className="expertise-detail-example-label">
                    {tr('expertise.example', lang)}
                  </span>
                  <p className="expertise-detail-example-text">
                    {tr(`tech.${activeKey}.ex`, lang)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile: grid pills + bottom card ── */}
      {isMobile && (
        <div className="expertise-mobile-wrap">
          <div className="expertise-mobile-grid">
            {TECH_NAMES.map((name, i) => {
              const Icon = ICONS[i]
              return (
                <div
                  key={name}
                  ref={(el) => { pillRefs.current[i] = el }}
                  className={[
                    'expertise-pill expertise-pill--mobile',
                    activeIndex === i ? 'expertise-pill--active' : '',
                    activeIndex !== null && activeIndex !== i
                      ? 'expertise-pill--dimmed'
                      : '',
                  ].join(' ')}
                  onClick={() => handlePillTap(i)}
                >
                  <Icon
                    size={14}
                    strokeWidth={1.5}
                    className="expertise-pill-icon"
                  />
                  {name}
                </div>
              )
            })}
          </div>

          {/* Mobile detail card */}
          <div
            className={`expertise-mobile-card${
              activeIndex !== null ? ' expertise-mobile-card--visible' : ''
            }`}
          >
            {activeKey && activeIndex !== null && (
              <>
                <div className="expertise-detail-top">
                  <span className="expertise-detail-category">
                    {tr(`tech.${activeKey}.cat`, lang)}
                  </span>
                  <span className="expertise-detail-level">
                    {TECH_LEVELS[activeIndex]}%
                  </span>
                </div>
                <h3 className="expertise-detail-name">
                  {TECH_NAMES[activeIndex]}
                </h3>
                <div className="expertise-detail-bar-wrap">
                  <div className="expertise-detail-bar-meta">
                    <span className="expertise-detail-bar-label">
                      {tr('expertise.bar', lang)}
                    </span>
                    <span className="expertise-detail-bar-value">
                      {TECH_LEVELS[activeIndex]}%
                    </span>
                  </div>
                  <div className="expertise-detail-bar-track">
                    <div ref={barRef} className="expertise-detail-bar-fill" />
                  </div>
                </div>
                <p className="expertise-detail-desc">
                  {tr(`tech.${activeKey}.desc`, lang)}
                </p>
                <div className="expertise-detail-example">
                  <span className="expertise-detail-example-label">
                    {tr('expertise.example', lang)}
                  </span>
                  <p className="expertise-detail-example-text">
                    {tr(`tech.${activeKey}.ex`, lang)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}