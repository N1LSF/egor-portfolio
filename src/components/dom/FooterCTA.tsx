import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store'
import { tr } from '../../i18n'
import './FooterCTA.css'

gsap.registerPlugin(ScrollTrigger)

const MAGNETIC_STRENGTH = 0.35
const MAGNETIC_RADIUS = 120

export default function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null!)
  const titleRef = useRef<HTMLHeadingElement>(null!)
  const labelRef = useRef<HTMLDivElement>(null!)
  const descRef = useRef<HTMLParagraphElement>(null!)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const contactsRef = useRef<HTMLDivElement>(null!)
  const lineRef = useRef<HTMLDivElement>(null!)
  const copyrightRef = useRef<HTMLDivElement>(null!)
  const isInTitleZone = useRef(false)

  const lang = useAppStore((s) => s.lang)

  const titleLine1 = tr('footer.title.1', lang)
  const titleLine2 = tr('footer.title.2', lang)

  // Reset all letters to default
  const resetLetters = useCallback(() => {
    lettersRef.current.forEach((letter) => {
      if (!letter) return
      gsap.to(letter, {
        x: 0, y: 0, scale: 1, rotateZ: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      })
    })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Check if cursor is within the title bounding box (with padding)
    const titleEl = titleRef.current
    if (!titleEl) return

    const rect = titleEl.getBoundingClientRect()
    const padding = MAGNETIC_RADIUS
    const inZone =
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding

    if (!inZone) {
      if (isInTitleZone.current) {
        isInTitleZone.current = false
        resetLetters()
      }
      return
    }

    isInTitleZone.current = true

    lettersRef.current.forEach((letter) => {
      if (!letter) return
      const r = letter.getBoundingClientRect()
      const centerX = r.left + r.width / 2
      const centerY = r.top + r.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MAGNETIC_RADIUS) {
        const force = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH
        gsap.to(letter, {
          x: dx * force,
          y: dy * force,
          scale: 1 + force * 0.15,
          rotateZ: dx * force * 0.08,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      } else {
        gsap.to(letter, {
          x: 0, y: 0, scale: 1, rotateZ: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        })
      }
    })
  }, [resetLetters])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(labelRef.current, { opacity: 0, y: -10 })
      gsap.set(descRef.current, { opacity: 0, y: 20, filter: 'blur(8px)' })
      gsap.set(contactsRef.current, { opacity: 0, y: 20 })
      gsap.set(lineRef.current, { scaleX: 0 })
      gsap.set(copyrightRef.current, { opacity: 0 })

      const letters = lettersRef.current.filter(Boolean)
      letters.forEach((l) => {
        gsap.set(l, { opacity: 0, y: 60, rotateX: -90 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(labelRef.current, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      }, 0)

      tl.to(letters, {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.8, ease: 'power4.out', stagger: 0.03,
      }, 0.15)

      tl.to(descRef.current, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.0, ease: 'power3.out',
      }, 0.5)

      tl.to(lineRef.current, {
        scaleX: 1, duration: 1.2, ease: 'power3.inOut',
      }, 0.7)

      tl.to(contactsRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      }, 0.9)

      tl.to(copyrightRef.current, {
        opacity: 1, duration: 0.6, ease: 'power2.out',
      }, 1.1)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="footer-cta">
      <div className="footer-cta-ambient" aria-hidden="true">
        <div className="footer-cta-orb footer-cta-orb--1" />
        <div className="footer-cta-orb footer-cta-orb--2" />
        <div className="footer-cta-orb footer-cta-orb--3" />
      </div>

      <div className="footer-cta-content">
        <div ref={labelRef} className="about-section-label footer-cta-label">
          <span className="label-slash">//</span> {tr('footer.label', lang)}
        </div>

        <h2 ref={titleRef} className="footer-cta-title">
          <span className="footer-cta-title-line">
            {titleLine1.split('').map((char, i) => (
              <span
                key={`l1-${i}`}
                ref={(el) => { lettersRef.current[i] = el }}
                className={`footer-cta-letter${char === ' ' ? ' footer-cta-space' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
          <span className="footer-cta-title-line">
            {titleLine2.split('').map((char, i) => (
              <span
                key={`l2-${i}`}
                ref={(el) => { lettersRef.current[titleLine1.length + i] = el }}
                className={`footer-cta-letter${char === ' ' ? ' footer-cta-space' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h2>

        <p ref={descRef} className="footer-cta-desc">
          {tr('footer.desc', lang)}
        </p>

        <div ref={lineRef} className="footer-cta-line" />

        <div ref={contactsRef} className="footer-cta-contacts">
          <a href="https://t.me/Akibayashi" target="_blank" rel="noopener noreferrer" className="footer-cta-link">
            <span className="footer-cta-link-icon">↗</span>
            Telegram
          </a>
          <a href="mailto:egormalakhov05@mail.ru" className="footer-cta-link">
            <span className="footer-cta-link-icon">↗</span>
            egormalakhov05@mail.ru
          </a>
        </div>

        <div ref={copyrightRef} className="footer-cta-copyright">
          <span>© {new Date().getFullYear()}</span>
          <span className="footer-cta-dot" />
          <span>{tr('footer.studio', lang)}</span>
          <span className="footer-cta-dot" />
          <span>{tr('footer.made', lang)}</span>
        </div>
      </div>
    </section>
  )
}