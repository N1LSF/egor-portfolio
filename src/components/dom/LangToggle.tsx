import { useEffect, useRef } from 'react'
import { useAppStore } from '../../store'
import './LangToggle.css'

export default function LangToggle() {
  const lang = useAppStore((s) => s.lang)
  const toggleLang = useAppStore((s) => s.toggleLang)
  const btnRef = useRef<HTMLButtonElement>(null!)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    // Collect ALL light-background sections
    const lightSelectors = [
      '.expertise-section',
      // Add future light sections here:
      // '.contact-section',
      // '.pricing-section',
    ]

    const lightSections = document.querySelectorAll(lightSelectors.join(','))
    if (!lightSections.length) return

    let rafId: number

    const update = () => {
      const btnRect = btn.getBoundingClientRect()
      const btnTop = btnRect.top
      const btnBottom = btnRect.bottom
      const btnHeight = btnRect.height

      let maxFill = 0

      lightSections.forEach((section) => {
        const sRect = section.getBoundingClientRect()
        if (sRect.top < btnBottom && sRect.bottom > btnTop) {
          const overlapTop = Math.max(sRect.top, btnTop)
          const overlapBottom = Math.min(sRect.bottom, btnBottom)
          const overlap = Math.max(0, overlapBottom - overlapTop)
          const fill = Math.min(1, overlap / btnHeight)
          maxFill = Math.max(maxFill, fill)
        }
      })

      btn.style.setProperty('--light-fill', `${maxFill * 100}%`)

      const f = maxFill

      // Inactive text: white(0.35) → dark(0.35)
      const iR = Math.round(255 - 245 * f)
      const iG = Math.round(255 - 245 * f)
      const iB = Math.round(255 - 215 * f)
      btn.style.setProperty('--text-inactive', `rgba(${iR},${iG},${iB},0.35)`)

      // Active text on slider is ALWAYS white (slider is pearlescent)
      // So --text-active stays white always
      btn.style.setProperty('--text-active', `rgb(0, 0, 0)`)

      // Divider: white(0.12) → dark(0.12)
      btn.style.setProperty('--text-divider', `rgba(${iR},${iG},${iB},0.12)`)

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <button
      ref={btnRef}
      className="lang-toggle"
      onClick={toggleLang}
      aria-label="Toggle language"
    >
      <span className="lang-bg lang-bg--dark" />
      <span className="lang-bg lang-bg--light" />

      <span className={`lang-option${lang === 'en' ? ' lang-option--active' : ''}`}>EN</span>
      <span className="lang-divider">/</span>
      <span className={`lang-option${lang === 'ru' ? ' lang-option--active' : ''}`}>RU</span>

      <span className="lang-slider" style={{ left: lang === 'en' ? '0%' : '50%' }} />
    </button>
  )
}