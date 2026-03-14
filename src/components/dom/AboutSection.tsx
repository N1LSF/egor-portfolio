import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store'
import { tr } from '../../i18n'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

const MOBILE_BP = 768

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= MOBILE_BP
}

/* Typewriter that stores original text in data attribute */
function typewrite(el: Element, speed = 30, delay = 0) {
  const stored = el.getAttribute('data-text')
  const text = stored || el.textContent || ''
  if (!stored) el.setAttribute('data-text', text)
  el.textContent = ''

  return gsap.delayedCall(delay, () => {
    let i = 0
    const chars = text.split('')
    const iv = setInterval(() => {
      if (i < chars.length) {
        el.textContent += chars[i]
        i++
      } else {
        clearInterval(iv)
      }
    }, speed)
  })
}

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
  const lang = useAppStore((s) => s.lang)

  /* Store original texts on first render so re-renders don't lose them */
  const textsStored = useRef(false)
  const storeTexts = useCallback(() => {
    if (textsStored.current) return
    const info = infoRef.current
    if (!info) return
    info.querySelectorAll('.about-value').forEach((el) => {
      const isStatus = el.classList.contains('status-value')
      const target = isStatus ? el.querySelector('.status-text') : el
      if (target && !target.getAttribute('data-text')) {
        target.setAttribute('data-text', target.textContent || '')
      }
    })
    textsStored.current = true
  }, [])

  useEffect(() => {
    storeTexts()
  }, [storeTexts])

  useEffect(() => {
    const section = sectionRef.current
    const photoWrapper = photoWrapperRef.current
    const photo = photoRef.current
    const scanLine = scanLineRef.current
    const corners = cornersRef.current
    const info = infoRef.current
    const bio = bioRef.current
    const nameFirst = nameFirstRef.current
    const nameLast = nameLastRef.current
    if (!section || !photo || !scanLine || !corners || !info || !bio) return

    const mobile = isMobile()

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      /* Section fade */
      gsap.set(section, { opacity: 0 })
      tl.to(section, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)

      /* Corners */
      const cornerEls = corners.querySelectorAll('.corner-mark')
      gsap.set(cornerEls, { opacity: 0, scale: 0 })
      tl.to(cornerEls, {
        opacity: 1, scale: 1,
        duration: 0.5, stagger: 0.08, ease: 'back.out(2)',
      }, 0.2)

      /* Photo reveal */
      gsap.set(photo, { clipPath: 'inset(0 0 100% 0)' })
      tl.to(photo, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4, ease: 'power4.inOut',
      }, 0.3)

      /* Scan line entrance */
      gsap.set(scanLine, { top: '0%', opacity: 0 })
      tl.to(scanLine, { opacity: 1, duration: 0.1 }, 0.3)
      tl.to(scanLine, { top: '100%', duration: 1.4, ease: 'power4.inOut' }, 0.3)
      tl.to(scanLine, { opacity: 0, duration: 0.3 }, 1.6)

      /* Glitch */
      tl.call(() => {
        photo.classList.add('glitch-flash')
        setTimeout(() => photo.classList.remove('glitch-flash'), 400)
      }, [], 1.5)

      /* Name */
      gsap.set([nameFirst, nameLast], { yPercent: 110, opacity: 0 })
      tl.to(nameFirst, { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out' }, 0.5)
      tl.to(nameLast, { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out' }, 0.65)

      /* Section label */
      const sectionLabel = info.querySelector('.about-section-label')
      if (sectionLabel) {
        gsap.set(sectionLabel, { opacity: 0, y: -10 })
        tl.to(sectionLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
      }

      /* Separator */
      const separator = info.querySelector('.about-separator')
      if (separator) {
        gsap.set(separator, { scaleX: 0, transformOrigin: 'left center' })
        tl.to(separator, { scaleX: 1, duration: 1, ease: 'power4.out' }, 0.9)
      }

      /* Labels */
      const labels = info.querySelectorAll('.about-label')
      labels.forEach((label, i) => {
        gsap.set(label, { opacity: 0, x: -15 })
        tl.to(label, {
          opacity: 1, x: 0, duration: 0.5, ease: 'power3.out',
        }, 0.8 + i * 0.1)
      })

      /* Values — typewriter with guaranteed visibility */
      const values = info.querySelectorAll('.about-value')
      values.forEach((value, i) => {
        const el = value as HTMLElement
        const isStatus = el.classList.contains('status-value')
        const targetNode = isStatus
          ? el.querySelector('.status-text')
          : el

        if (!targetNode) return

        /* Make visible immediately — text starts empty, fills via typewriter */
        el.style.visibility = 'visible'

        const baseDelay = 1.0 + i * 0.18
        tl.call(() => {
          typewrite(targetNode, isStatus ? 35 : 30, 0)
        }, [], baseDelay)
      })

      /* Status dot */
      const statusDot = info.querySelector('.status-indicator')
      if (statusDot) {
        tl.call(() => statusDot.classList.add('active'), [], 2.2)
      }

      /* Bio lines */
      const bioLines = bio.querySelectorAll('.bio-line')
      bioLines.forEach((line, i) => {
        gsap.set(line, { opacity: 0, y: 20, filter: 'blur(6px)' })
        tl.to(line, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.8, ease: 'power3.out',
        }, 1.4 + i * 0.12)
      })

      /* ── Parallax (desktop only) ── */
      if (!mobile) {
        gsap.to(photoWrapper, {
          yPercent: -15, ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top bottom',
            end: 'bottom top', scrub: 1,
          },
        })

        gsap.fromTo(
          photo.querySelector('.about-photo-img'),
          { scale: 1.15 },
          {
            scale: 1, ease: 'none',
            scrollTrigger: {
              trigger: section, start: 'top bottom',
              end: 'center center', scrub: 1.5,
            },
          },
        )

        const aboutInfo = info.closest('.about-info')
        if (aboutInfo) {
          gsap.to(aboutInfo, {
            yPercent: -8, ease: 'none',
            scrollTrigger: {
              trigger: section, start: 'top bottom',
              end: 'bottom top', scrub: 1.2,
            },
          })
        }

        gsap.to(nameFirst, {
          x: -30, ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top center',
            end: 'bottom top', scrub: 2,
          },
        })

        gsap.to(nameLast, {
          x: 20, ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top center',
            end: 'bottom top', scrub: 2,
          },
        })

        gsap.to(cornerEls, {
          scale: 1.15, ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top center',
            end: 'bottom top', scrub: 2,
          },
        })

        const rows = info.querySelectorAll('.about-row')
        rows.forEach((row, i) => {
          gsap.to(row, {
            y: -(10 + i * 6), ease: 'none',
            scrollTrigger: {
              trigger: section, start: 'top center',
              end: 'bottom top', scrub: 1 + i * 0.3,
            },
          })
        })

        gsap.fromTo(scanLine,
          { top: '0%', opacity: 0.4 },
          {
            top: '100%', ease: 'none',
            scrollTrigger: {
              trigger: section, start: 'top center',
              end: 'bottom center', scrub: 2,
            },
          },
        )
      }

      /* Bio color scroll (all devices) */
      const bioLines2 = bio.querySelectorAll('.bio-line')
      bioLines2.forEach((line) => {
        gsap.to(line, {
          color: 'rgba(255, 255, 255, 0.85)', ease: 'none',
          scrollTrigger: {
            trigger: line, start: 'top 85%',
            end: 'top 55%', scrub: 1,
          },
        })
      })

      /* ── Mouse tilt (desktop only) ── */
      if (!mobile) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = photo.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5
          gsap.to(photo.querySelector('.about-photo-img'), {
            x: x * 25, y: y * 20,
            rotateY: x * 5, rotateX: -y * 5,
            duration: 1, ease: 'power2.out',
          })
          gsap.to(cornerEls, {
            scale: 1.1 + Math.abs(x) * 0.2,
            duration: 0.5, ease: 'power2.out',
          })
        }

        const handleMouseLeave = () => {
          gsap.to(photo.querySelector('.about-photo-img'), {
            x: 0, y: 0, rotateY: 0, rotateX: 0,
            duration: 0.8, ease: 'power2.out',
          })
          gsap.to(cornerEls, {
            scale: 1, duration: 0.6, ease: 'power2.out',
          })
        }

        photo.addEventListener('mousemove', handleMouseMove)
        photo.addEventListener('mouseleave', handleMouseLeave)
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-grid">

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

        <div className="about-info">
          <div ref={infoRef} className="about-data">
            <div className="about-section-label">
              <span className="label-slash">//</span> {tr('about.label', lang)}
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
              <span className="about-label">{tr('about.role.label', lang)}</span>
              <span className="about-value">{tr('about.role.value', lang)}</span>
            </div>
            <div className="about-row">
              <span className="about-label">{tr('about.exp.label', lang)}</span>
              <span className="about-value">{tr('about.exp.value', lang)}</span>
            </div>
            <div className="about-row">
              <span className="about-label">{tr('about.stack.label', lang)}</span>
              <span className="about-value">{tr('about.stack.value', lang)}</span>
            </div>
            <div className="about-row">
              <span className="about-label">{tr('about.approach.label', lang)}</span>
              <span className="about-value">{tr('about.approach.value', lang)}</span>
            </div>
            <div className="about-row">
              <span className="about-label">{tr('about.status.label', lang)}</span>
              <span className="about-value status-value">
                <span className="status-indicator" />
                <span className="status-text">{tr('about.status.value', lang)}</span>
              </span>
            </div>
          </div>

          <div ref={bioRef} className="about-bio">
            <p className="bio-line">{tr('about.bio.1', lang)}</p>
            <p className="bio-line">{tr('about.bio.2', lang)}</p>
            <p className="bio-line">{tr('about.bio.3', lang)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}