import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store'
import { tr } from '../../i18n'
import './WorksSection.css'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  key: string
  year: string
  image: string
  url: string | null
  slug: string
}

const PROJECTS: Project[] = [
  {
    key: '1',
    year: '2025',
    image: '/works/aesthetics.jpg',
    url: 'https://микс-красоты.рф',
    slug: 'aesthetics',
  },
  {
    key: '2',
    year: '2026',
    image: '/works/startup.jpg',
    url: 'https://student-startup-challenge.site',
    slug: 'startup',
  },
  {
    key: '3',
    year: '2026',
    image: '/works/opera.jpg',
    url: 'https://opera-read.ru',
    slug: 'opera',
  },
  {
    key: '4',
    year: '2024',
    image: '/works/bakery.jpg',
    url: null,
    slug: 'bakery',
  },
]

const COLUMNS = [
  { left: '8%', width: 60, delay: 0, height: 45, color: 'rgba(232,224,240,0.04)' },
  { left: '20%', width: 50, delay: 1.5, height: 60, color: 'rgba(212,228,247,0.035)' },
  { left: '35%', width: 70, delay: 0.8, height: 75, color: 'rgba(240,212,232,0.04)' },
  { left: '50%', width: 55, delay: 2.2, height: 55, color: 'rgba(200,224,240,0.035)' },
  { left: '65%', width: 65, delay: 0.4, height: 85, color: 'rgba(232,216,244,0.04)' },
  { left: '80%', width: 45, delay: 1.8, height: 50, color: 'rgba(212,228,247,0.035)' },
  { left: '92%', width: 55, delay: 3.0, height: 65, color: 'rgba(240,220,232,0.03)' },
]

const TOAST_DURATION = 3000

export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lang = useAppStore((s) => s.lang)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [toast, setToast] = useState(false)

  const showToast = useCallback(() => {
    setToast(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(false), TOAST_DURATION)
  }, [])

  const handleCardClick = useCallback(
    (project: Project) => {
      if (project.url === null) {
        showToast()
        return
      }
      window.open(project.url, '_blank', 'noopener,noreferrer')
    },
    [showToast]
  )

// Horizontal scroll — last card centers, then continue
useEffect(() => {
  const section = sectionRef.current
  const pin = pinRef.current
  const track = trackRef.current
  if (!section || !pin || !track) return

  const ctx = gsap.context(() => {
    // Рассчитываем так, чтобы последняя карточка оказалась по центру
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth
      const viewportWidth = window.innerWidth
      const lastCard = cardsRef.current[cardsRef.current.length - 1]
      
      if (!lastCard) return -(trackWidth - viewportWidth)
      
      // Позиция последней карточки относительно track
      const lastCardLeft = lastCard.offsetLeft
      const lastCardWidth = lastCard.offsetWidth
      
      // Центрируем последнюю карточку
      const centerOffset = (viewportWidth - lastCardWidth) / 2
      
      // Итоговое смещение: карточка должна быть по центру
      return -(lastCardLeft - centerOffset)
    }

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: pin,
        scrub: 1.2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${self.progress * 100}%`
          }
        },
      },
    })

    // Per-card entrance animations
    cardsRef.current.forEach((card) => {
      if (!card) return
      gsap.fromTo(
        card,
        { rotateY: 8, scale: 0.9, opacity: 0.4 },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: 'left 90%',
            end: 'left 50%',
            scrub: 1,
          },
        }
      )
      // Убираем exit-анимацию для последней карточки — она остаётся по центру
      gsap.to(card, {
        rotateY: -8,
        scale: 0.9,
        opacity: 0.4,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'right 50%',
          end: 'right 10%',
          scrub: 1,
        },
      })
    })
  }, section)

  return () => ctx.revert()
}, [])

  // Header entrance
  useEffect(() => {
    const section = sectionRef.current
    const label = labelRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    if (!section || !label || !title || !subtitle) return

    const ctx = gsap.context(() => {
      gsap.set(label, { opacity: 0, y: -10, visibility: 'hidden' })
      gsap.set(title, { yPercent: 100, opacity: 0, filter: 'blur(14px)', visibility: 'hidden' })
      gsap.set(subtitle, { yPercent: 50, opacity: 0, filter: 'blur(8px)', visibility: 'hidden' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(label, { opacity: 1, y: 0, visibility: 'visible', duration: 0.6, ease: 'power3.out' }, 0)
      tl.to(title, { yPercent: 0, opacity: 1, filter: 'blur(0px)', visibility: 'visible', duration: 1.2, ease: 'power4.out' }, 0.1)
      tl.to(subtitle, { yPercent: 0, opacity: 1, filter: 'blur(0px)', visibility: 'visible', duration: 1.0, ease: 'power3.out' }, 0.3)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="works-section">
      <div ref={pinRef} className="works-pin">
        <div className="works-columns" aria-hidden="true">
          {COLUMNS.map((col, i) => (
            <div
              key={i}
              className="works-column"
              style={{
                left: col.left,
                width: `${col.width}px`,
                ['--col-height' as string]: `${col.height}vh`,
                ['--col-delay' as string]: `${col.delay}s`,
                ['--col-color' as string]: col.color,
              }}
            />
          ))}
        </div>

        <div className="works-header">
          <div ref={labelRef} className="about-section-label works-label">
            <span className="label-slash">//</span> {tr('works.label', lang)}
          </div>
          <h2 ref={titleRef} className="works-title">{tr('works.title', lang)}</h2>
          <p ref={subtitleRef} className="works-subtitle">{tr('works.subtitle', lang)}</p>
        </div>

        <div className="works-track-area">
          <div ref={trackRef} className="works-track">
            {PROJECTS.map((project, i) => (
              <div
                key={project.key}
                ref={(el) => { cardsRef.current[i] = el }}
                className={`works-card${hoveredIndex === i ? ' works-card--active' : ''}`}
                onPointerEnter={() => setHoveredIndex(i)}
                onPointerLeave={() => setHoveredIndex(null)}
                onClick={() => handleCardClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(project) }}
              >
                <div className="works-card-image">
                  <img src={project.image} alt={tr(`work.${project.key}.title`, lang)} draggable={false} />
                </div>

                <div className="works-card-overlay">
                  <div className="works-card-meta">
                    <span className="works-card-year">{project.year}</span>
                    <span className="works-card-cat">{tr(`work.${project.key}.cat`, lang)}</span>
                  </div>
                  <h3 className="works-card-title">{tr(`work.${project.key}.title`, lang)}</h3>
                  <p className="works-card-desc">{tr(`work.${project.key}.desc`, lang)}</p>
                  <div className="works-card-actions">
                    <span className="works-card-cta">
                      {project.url ? tr('works.visit', lang) : tr('works.unavailable_short', lang)}
                      <span className="works-card-cta-line" />
                    </span>
                  </div>
                </div>

                <div className="works-card-mobile-info">
                  <div className="works-card-meta">
                    <span className="works-card-year">{project.year}</span>
                    <span className="works-card-cat">{tr(`work.${project.key}.cat`, lang)}</span>
                  </div>
                  <h3 className="works-card-title">{tr(`work.${project.key}.title`, lang)}</h3>
                  <p className="works-card-desc">{tr(`work.${project.key}.desc`, lang)}</p>
                  <span className="works-card-cta">
                    {project.url ? tr('works.visit', lang) : tr('works.unavailable_short', lang)}
                    <span className="works-card-cta-line" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="works-progress">
          <div className="works-progress-track">
            <div ref={progressFillRef} className="works-progress-fill" />
          </div>
          <span className="works-progress-text">{tr('works.drag', lang)}</span>
        </div>

        <div className={`works-toast${toast ? ' works-toast--visible' : ''}`}>
          <div className="works-toast-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="rgba(200,180,240,0.6)" strokeWidth="1" />
              <path d="M8 4.5V9" stroke="rgba(200,180,240,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="0.75" fill="rgba(200,180,240,0.8)" />
            </svg>
          </div>
          <span className="works-toast-text">{tr('works.unavailable', lang)}</span>
        </div>
      </div>
    </section>
  )
}