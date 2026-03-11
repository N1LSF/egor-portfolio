// src/components/dom/AboutSection.tsx

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null!)
  const photoWrapperRef = useRef<HTMLDivElement>(null!)
  const photoRef = useRef<HTMLDivElement>(null!)
  const scanLineRef = useRef<HTMLDivElement>(null!)
  const cornersRef = useRef<HTMLDivElement>(null!)
  const infoRef = useRef<HTMLDivElement>(null!)
  const bioRef = useRef<HTMLDivElement>(null!)
  const nameFirstRef = useRef<HTMLSpanElement>(null!)
  const nameLastRef = useRef<HTMLSpanElement>(null!)

  useEffect(() => {
    const section = sectionRef.current
    const photoWrapper = photoWrapperRef.current
    const photo = photoRef.current
    const scanLine = scanLineRef.current
    const corners = cornersRef.current
    const info = infoRef.current
    const bio = bioRef.current
    if (!section) return

    const ctx = gsap.context(() => {

      // ═══════════════════════════════════
      // PHASE 1: ENTRANCE ANIMATIONS
      // (triggered once on scroll-in)
      // ═══════════════════════════════════

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // Section fade
      gsap.set(section, { opacity: 0 })
      tl.to(section, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)

      // Corner marks pop in
      const cornerEls = corners.querySelectorAll('.corner-mark')
      gsap.set(cornerEls, { opacity: 0, scale: 0 })
      tl.to(cornerEls, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(2)',
      }, 0.2)

      // Photo clipPath reveal
      gsap.set(photo, { clipPath: 'inset(0 0 100% 0)' })
      tl.to(photo, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4,
        ease: 'power4.inOut',
      }, 0.3)

      // Scan line first pass
      gsap.set(scanLine, { top: '0%', opacity: 0 })
      tl.to(scanLine, { opacity: 1, duration: 0.1 }, 0.3)
      tl.to(scanLine, {
        top: '100%',
        duration: 1.4,
        ease: 'power4.inOut',
      }, 0.3)
      tl.to(scanLine, { opacity: 0, duration: 0.3 }, 1.6)

      // RGB glitch flash
      tl.call(() => {
        photo.classList.add('glitch-flash')
        setTimeout(() => photo.classList.remove('glitch-flash'), 400)
      }, [], 1.5)

      // Name reveal — split lines
      const nameFirst = nameFirstRef.current
      const nameLast = nameLastRef.current
      gsap.set([nameFirst, nameLast], { yPercent: 110, opacity: 0 })
      tl.to(nameFirst, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      }, 0.5)
      tl.to(nameLast, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      }, 0.65)

      // Section label
      const sectionLabel = info.querySelector('.about-section-label')
      gsap.set(sectionLabel, { opacity: 0, y: -10 })
      tl.to(sectionLabel, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, 0.4)

      // Separator
      const separator = info.querySelector('.about-separator')
      if (separator) {
        gsap.set(separator, { scaleX: 0, transformOrigin: 'left center' })
        tl.to(separator, {
          scaleX: 1,
          duration: 1,
          ease: 'power4.out',
        }, 0.9)
      }

      // Labels slide in
      const labels = info.querySelectorAll('.about-label')
      labels.forEach((label, i) => {
        gsap.set(label, { opacity: 0, x: -15 })
        tl.to(label, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, 0.8 + i * 0.1)
      })

      // Values typewriter
      const values = info.querySelectorAll('.about-value')
      values.forEach((value, i) => {
        const originalContent = value.innerHTML
        const isStatus = value.classList.contains('status-value')

        if (isStatus) {
          // For status row — keep the dot, type only text
          const textNode = value.querySelector('.status-text')
          if (textNode) {
            const text = textNode.textContent || ''
            textNode.textContent = ''
            gsap.set(value, { visibility: 'visible' })
            tl.call(() => {
              let ci = 0
              const chars = text.split('')
              const iv = setInterval(() => {
                if (ci < chars.length) {
                  textNode.textContent += chars[ci]
                  ci++
                } else clearInterval(iv)
              }, 35)
            }, [], 1.0 + i * 0.18)
          }
        } else {
          const text = value.textContent || ''
          value.textContent = ''
          gsap.set(value, { visibility: 'visible' })
          tl.call(() => {
            let ci = 0
            const chars = text.split('')
            const iv = setInterval(() => {
              if (ci < chars.length) {
                value.textContent += chars[ci]
                ci++
              } else clearInterval(iv)
            }, 30)
          }, [], 1.0 + i * 0.18)
        }
      })

      // Status dot activate
      const statusDot = info.querySelector('.status-indicator')
      if (statusDot) {
        tl.call(() => statusDot.classList.add('active'), [], 2.2)
      }

      // Bio lines entrance
      const bioLines = bio.querySelectorAll('.bio-line')
      bioLines.forEach((line, i) => {
        gsap.set(line, { opacity: 0, y: 20, filter: 'blur(6px)' })
        tl.to(line, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
        }, 1.4 + i * 0.12)
      })

      // ═══════════════════════════════════
      // PHASE 2: SCROLL-DRIVEN MOTION
      // (continuous parallax while scrolling through)
      // ═══════════════════════════════════

      // Photo parallax — moves slower (sticky feel)
      gsap.to(photoWrapper, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Photo scale breathing on scroll
      gsap.fromTo(photo.querySelector('.about-photo-img'), 
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
        }
      )

      // Info block — counter parallax (moves up faster)
      gsap.to(info.closest('.about-info'), {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      // Name horizontal split on scroll
      gsap.to(nameFirst, {
        x: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom top',
          scrub: 2,
        },
      })

      gsap.to(nameLast, {
        x: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // Corner marks breathing — scale pulse on scroll
      gsap.to(cornerEls, {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // Data rows stagger parallax
      const rows = info.querySelectorAll('.about-row')
      rows.forEach((row, i) => {
        gsap.to(row, {
          y: -(10 + i * 6),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom top',
            scrub: 1 + i * 0.3,
          },
        })
      })

      // Bio lines — progressive opacity scrub (highlight on scroll)
      bioLines.forEach((line, i) => {
        gsap.to(line, {
          color: 'rgba(255, 255, 255, 0.85)',
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        })
      })

      // Scan line — scrub-driven second pass (ambient)
      gsap.fromTo(scanLine,
        { top: '0%', opacity: 0.4 },
        {
          top: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: 2,
          },
        }
      )

      // ═══════════════════════════════════
      // PHASE 3: HOVER INTERACTIONS
      // ═══════════════════════════════════

      const handleMouseMove = (e: MouseEvent) => {
        const rect = photo.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5

        gsap.to(photo.querySelector('.about-photo-img'), {
          x: x * 25,
          y: y * 20,
          rotateY: x * 5,
          rotateX: -y * 5,
          duration: 1,
          ease: 'power2.out',
        })

        // Corner marks react to hover
        gsap.to(cornerEls, {
          scale: 1.1 + Math.abs(x) * 0.2,
          duration: 0.5,
          ease: 'power2.out',
        })
      }

      const handleMouseLeave = () => {
        gsap.to(photo.querySelector('.about-photo-img'), {
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
        gsap.to(cornerEls, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      photo.addEventListener('mousemove', handleMouseMove)
      photo.addEventListener('mouseleave', handleMouseLeave)

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-grid">

        {/* ── Photo Block ── */}
        <div ref={photoWrapperRef} className="about-photo-wrapper">
          <div ref={cornersRef} className="corner-marks">
            <span className="corner-mark tl" />
            <span className="corner-mark tr" />
            <span className="corner-mark bl" />
            <span className="corner-mark br" />
          </div>

          <div ref={photoRef} className="about-photo">
            <img
              className="about-photo-img"
              src="/photo.jpg"
              alt="Egor Malakhov"
              draggable={false}
            />
            <div className="photo-scanlines" />
            <div ref={scanLineRef} className="scan-line" />
            <div className="ambient-scan" />
          </div>

          <div className="photo-id-tag">
            <span className="id-tag-dot" />
            <span>IMG_0001.RAW</span>
          </div>
        </div>

        {/* ── Info Block ── */}
        <div className="about-info">
          <div ref={infoRef} className="about-data">
            <div className="about-section-label">
              <span className="label-slash">//</span> IDENTIFICATION
            </div>

            <h2 className="about-name">
              <div className="name-line">
                <span ref={nameFirstRef} className="name-inner">EGOR</span>
              </div>
              <div className="name-line">
                <span ref={nameLastRef} className="name-inner">MALAKHOV</span>
              </div>
            </h2>

            <div className="about-separator" />

            <div className="about-row">
              <span className="about-label">ROLE</span>
              <span className="about-value">Creative Developer</span>
            </div>
            <div className="about-row">
              <span className="about-label">EXPERIENCE</span>
              <span className="about-value">2+ Years</span>
            </div>
            <div className="about-row">
              <span className="about-label">STACK</span>
              <span className="about-value">React / Three.js / GSAP</span>
            </div>
            <div className="about-row">
              <span className="about-label">APPROACH</span>
              <span className="about-value">Code-only, no templates</span>
            </div>
            <div className="about-row">
              <span className="about-label">STATUS</span>
              <span className="about-value status-value">
                <span className="status-indicator" />
                <span className="status-text">Available for work</span>
              </span>
            </div>
          </div>

          <div ref={bioRef} className="about-bio">
            <p className="bio-line">
              I build websites entirely from scratch — no WordPress,
              no page builders, no shortcuts.
            </p>
            <p className="bio-line">
              Every project starts with an empty file and ends with
              pixel-perfect, high-performance code that feels alive.
            </p>
            <p className="bio-line">
              My focus is on premium motion design, 3D experiences
              and interfaces that leave a lasting impression.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}