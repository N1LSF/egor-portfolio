import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useAppStore } from '../../store'

export default function PreloaderOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const lineRef = useRef<HTMLDivElement>(null!)
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const hasAnimated = useRef(false)

  const name = 'MALAKHOV'

  useEffect(() => {
    gsap.fromTo(
      lettersRef.current,
      {
        opacity: 0,
        filter: 'blur(12px)',
        y: 20,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.2,
      }
    )

    const unsub = useAppStore.subscribe((state) => {
      if (lineRef.current) {
        gsap.to(lineRef.current, {
          scaleX: state.loadProgress / 100,
          duration: 0.3,
          ease: 'power1.out',
        })
      }

      if (state.loadProgress >= 100 && !hasAnimated.current) {
        hasAnimated.current = true

        const tl = gsap.timeline({
          delay: 0.3,
          onComplete: () => {
            useAppStore.getState().setIsLoaded()
          },
        })

        const half = Math.ceil(lettersRef.current.length / 2)

        tl.to(
          lettersRef.current.slice(0, half),
          {
            x: () => -window.innerWidth * 0.4 + Math.random() * -100,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.in',
          },
          0
        )

        tl.to(
          lettersRef.current.slice(half),
          {
            x: () => window.innerWidth * 0.4 + Math.random() * 100,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.in',
          },
          0
        )

        tl.to(
          lineRef.current,
          {
            scaleY: 40,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in',
          },
          0.2
        )

        tl.to(wrapperRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        })

        tl.set(wrapperRef.current, { display: 'none' })
      }
    })

    return () => unsub()
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2vh',
      }}
    >
      <div style={{ display: 'flex', gap: '0.3vw' }}>
        {name.split('').map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            className="pearl-text"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: '7vw',
              fontWeight: 800,
              display: 'inline-block',
              willChange: 'transform, opacity, filter',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Линия прогресса — тоже перламутровая */}
      <div
        style={{
          width: '20vw',
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #d4e4f7, #f0d4e8, #e8d8f4, #c8e0f0)',
            backgroundSize: '300% 100%',
            animation: 'pearlShift 3s ease infinite',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  )
}