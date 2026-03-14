import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let prx = -100
    let pry = -100

    let isHovering = false
    let isHidden = false

    let ringSize = 32
    let currentRingSize = 32

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (isHidden) {
        isHidden = false
        ring.style.opacity = '1'
      }
    }

    const onMouseLeave = () => {
      isHidden = true
      ring.style.opacity = '0'
    }

    const onMouseDown = () => {
      ringSize = 24
    }

    const onMouseUp = () => {
      ringSize = isHovering ? 56 : 32
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest(
        'a, button, [role="button"], .expertise-pill, .lang-toggle, .about-photo'
      )
      if (interactive) {
        isHovering = true
        ringSize = 56
        ring.classList.add('cursor-ring--hover')
        if (target.closest('.about-photo')) {
          ring.classList.add('cursor-ring--view')
        }
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest(
        'a, button, [role="button"], .expertise-pill, .lang-toggle, .about-photo'
      )
      if (interactive) {
        isHovering = false
        ringSize = 32
        ring.classList.remove('cursor-ring--hover')
        ring.classList.remove('cursor-ring--view')
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    let rafId: number

    const loop = () => {
      const lerpFactor = 0.12
      rx += (mx - rx) * lerpFactor
      ry += (my - ry) * lerpFactor

      const vx = rx - prx
      const vy = ry - pry
      prx = rx
      pry = ry

      const speed = Math.sqrt(vx * vx + vy * vy)
      const angle = Math.atan2(vy, vx) * (180 / Math.PI)
      const stretch = Math.min(speed / 8, 0.5)
      const scaleX = 1 + stretch
      const scaleY = 1 - stretch * 0.4

      currentRingSize += (ringSize - currentRingSize) * 0.15

      const ringHalf = currentRingSize / 2
      ring.style.transform = [
        `translate(${rx - ringHalf}px, ${ry - ringHalf}px)`,
        `rotate(${angle}deg)`,
        `scale(${scaleX}, ${scaleY})`,
      ].join(' ')
      ring.style.width = `${currentRingSize}px`
      ring.style.height = `${currentRingSize}px`

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <div ref={ringRef} className="cursor-ring">
      <span className="cursor-ring-view">VIEW</span>
    </div>
  )
}