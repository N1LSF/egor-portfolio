import { useRef, useEffect, useState, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppStore } from '../../store'
import { tr } from '../../i18n'
import './PriceCalculator.css'


gsap.registerPlugin(ScrollTrigger)

const PROJECT_TYPES = [
  { id: 'landing', base: 15000 },
  { id: 'multi', base: 35000 },
  { id: 'shop', base: 60000 },
  { id: 'webapp', base: 90000 },
]

const DESIGN_LEVELS = [
  { id: 'basic', mult: 1.0 },
  { id: 'premium', mult: 1.3 },
  { id: 'custom', mult: 1.7 },
]

const BACKEND_OPTIONS = [
  { id: 'none', add: 0 },
  { id: 'cms', add: 8000 },
  { id: 'custom', add: 25000 },
]

const EXTRAS = [
  { id: 'animations', add: 7000 },
  { id: 'webgl', add: 15000 },
  { id: 'seo', add: 5000 },
  { id: 'responsive', add: 3000 },
  { id: 'i18n', add: 6000 },
]

export default function PriceCalculator() {
  const sectionRef = useRef<HTMLElement>(null!)
  const headerRef = useRef<HTMLDivElement>(null!)
  const panelRef = useRef<HTMLDivElement>(null!)
  const receiptRef = useRef<HTMLDivElement>(null!)

  const lang = useAppStore((s) => s.lang)

  const [projectType, setProjectType] = useState(0)
  const [designLevel, setDesignLevel] = useState(0)
  const [pages, setPages] = useState(5)
  const [backend, setBackend] = useState(0)
  const [extras, setExtras] = useState<Set<number>>(new Set())

  const toggleExtra = (idx: number) => {
    setExtras((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const price = useMemo(() => {
    const base = PROJECT_TYPES[projectType].base
    const pageCost = (pages - 1) * 2500
    const designMult = DESIGN_LEVELS[designLevel].mult
    const backendAdd = BACKEND_OPTIONS[backend].add
    let extrasAdd = 0
    extras.forEach((i) => { extrasAdd += EXTRAS[i].add })
    return Math.round((base + pageCost) * designMult + backendAdd + extrasAdd)
  }, [projectType, designLevel, pages, backend, extras])

  const summaryLines = useMemo(() => {
    const lines: { label: string; value: string }[] = []
    lines.push({
      label: tr('calc.type', lang),
      value: tr(`calc.type.${PROJECT_TYPES[projectType].id}`, lang),
    })
    lines.push({
      label: tr('calc.design', lang),
      value: tr(`calc.design.${DESIGN_LEVELS[designLevel].id}`, lang),
    })
    lines.push({
      label: tr('calc.pages', lang),
      value: `${pages}`,
    })
    lines.push({
      label: tr('calc.backend', lang),
      value: tr(`calc.backend.${BACKEND_OPTIONS[backend].id}`, lang),
    })
    extras.forEach((i) => {
      lines.push({
        label: tr(`calc.extra.${EXTRAS[i].id}`, lang),
        value: `+${EXTRAS[i].add.toLocaleString()} ₽`,
      })
    })
    return lines
  }, [projectType, designLevel, pages, backend, extras, lang])

  const priceRef = useRef<HTMLSpanElement>(null!)
  const prevPrice = useRef(price)

  useEffect(() => {
    if (!priceRef.current) return
    const from = prevPrice.current
    const to = price
    prevPrice.current = price

    gsap.fromTo(priceRef.current,
      { scale: 1.08, opacity: 0.6 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
    )

    const obj = { val: from }
    gsap.to(obj, {
      val: to,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        if (priceRef.current) {
          priceRef.current.textContent = `${Math.round(obj.val).toLocaleString()} ₽`
        }
      },
    })
  }, [price])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: -20 })
      gsap.set(panelRef.current, { opacity: 0, x: -30 })
      gsap.set(receiptRef.current, { opacity: 0, x: 30 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      tl.to(headerRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      }, 0)

      tl.to(panelRef.current, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      }, 0.2)

      tl.to(receiptRef.current, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      }, 0.35)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="calc-section">
      <div className="calc-ambient" aria-hidden="true">
        <div className="calc-orb calc-orb--1" />
        <div className="calc-orb calc-orb--2" />
      </div>

      <div className="calc-container">
        <div ref={headerRef} className="calc-header">
          <div className="about-section-label calc-label">
            <span className="label-slash">//</span> {tr('calc.label', lang)}
          </div>
          <h2 className="calc-title">{tr('calc.title', lang)}</h2>
          <p className="calc-subtitle">{tr('calc.subtitle', lang)}</p>
        </div>

        <div className="calc-body">
          <div ref={panelRef} className="calc-panel">

            <div className="calc-group">
              <span className="calc-group-label">{tr('calc.type', lang)}</span>
              <div className="calc-options">
                {PROJECT_TYPES.map((pt, i) => (
                  <button
                    key={pt.id}
                    className={`calc-option${projectType === i ? ' calc-option--active' : ''}`}
                    onClick={() => setProjectType(i)}
                  >
                    {tr(`calc.type.${pt.id}`, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-group">
              <span className="calc-group-label">{tr('calc.design', lang)}</span>
              <div className="calc-options">
                {DESIGN_LEVELS.map((d, i) => (
                  <button
                    key={d.id}
                    className={`calc-option${designLevel === i ? ' calc-option--active' : ''}`}
                    onClick={() => setDesignLevel(i)}
                  >
                    {tr(`calc.design.${d.id}`, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-group">
              <div className="calc-group-top">
                <span className="calc-group-label">{tr('calc.pages', lang)}</span>
                <span className="calc-group-value">{pages}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={pages}
                onChange={(e) => setPages(+e.target.value)}
                className="calc-slider"
              />
              <div className="calc-slider-labels">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            <div className="calc-group">
              <span className="calc-group-label">{tr('calc.backend', lang)}</span>
              <div className="calc-options">
                {BACKEND_OPTIONS.map((b, i) => (
                  <button
                    key={b.id}
                    className={`calc-option${backend === i ? ' calc-option--active' : ''}`}
                    onClick={() => setBackend(i)}
                  >
                    {tr(`calc.backend.${b.id}`, lang)}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-group">
              <span className="calc-group-label">{tr('calc.extras', lang)}</span>
              <div className="calc-checks">
                {EXTRAS.map((ex, i) => (
                  <label key={ex.id} className="calc-check">
                    <input
                      type="checkbox"
                      checked={extras.has(i)}
                      onChange={() => toggleExtra(i)}
                    />
                    <span className="calc-check-box">
                      <svg viewBox="0 0 12 12" className="calc-check-icon">
                        <path d="M2.5 6l2.5 2.5 4.5-5" />
                      </svg>
                    </span>
                    <span className="calc-check-text">
                      {tr(`calc.extra.${ex.id}`, lang)}
                    </span>
                    <span className="calc-check-price">+{ex.add.toLocaleString()} ₽</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div ref={receiptRef} className="calc-receipt">
            <div className="calc-receipt-header">
              <span className="calc-receipt-title">{tr('calc.summary', lang)}</span>
              <div className="calc-receipt-line" />
            </div>

            <div className="calc-receipt-lines">
              {summaryLines.map((line, i) => (
                <div key={i} className="calc-receipt-row">
                  <span className="calc-receipt-row-label">{line.label}</span>
                  <span className="calc-receipt-row-dots" />
                  <span className="calc-receipt-row-value">{line.value}</span>
                </div>
              ))}
            </div>

            <div className="calc-receipt-divider" />

            <div className="calc-receipt-total">
              <span className="calc-receipt-total-label">{tr('calc.total', lang)}</span>
              <span ref={priceRef} className="calc-receipt-total-price">
                {price.toLocaleString()} ₽
              </span>
            </div>

            <p className="calc-receipt-note">{tr('calc.note', lang)}</p>

            <a
              href="https://t.me/Akibayashi"
              target="_blank"
              rel="noopener noreferrer"
              className="calc-receipt-cta"
            >
              {tr('calc.cta', lang)}
              <span className="calc-receipt-cta-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}