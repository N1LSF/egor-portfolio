import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './SectionDivider.css'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  variant?: 'default' | 'glow' | 'fade'
}

export default function SectionDivider({ variant = 'default' }: Props) {
  const ref = useRef<HTMLDivElement>(null!)
  const lineRef = useRef<HTMLDivElement>(null!)
  const orbRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Line draws in
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Center orb fades in
      if (orbRef.current) {
        gsap.fromTo(orbRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Parallax float on scroll
      gsap.to(el, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={`section-divider section-divider--${variant}`}>
      {/* Ambient glow */}
      <div className="divider-glow" aria-hidden="true" />

      {/* Main line */}
      <div ref={lineRef} className="divider-line">
        <div className="divider-line-inner" />
      </div>

      {/* Center orb */}
      <div ref={orbRef} className="divider-orb">
        <div className="divider-orb-core" />
        <div className="divider-orb-ring" />
      </div>

      {/* Side particles */}
      <div className="divider-particles" aria-hidden="true">
        <span className="divider-particle divider-particle--1" />
        <span className="divider-particle divider-particle--2" />
        <span className="divider-particle divider-particle--3" />
        <span className="divider-particle divider-particle--4" />
      </div>
    </div>
  )
}