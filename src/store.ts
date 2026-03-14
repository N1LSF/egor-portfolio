import { create } from 'zustand'
import type { Lang } from './i18n'

interface AppState {
  loadProgress: number
  isLoaded: boolean
  sphereHovered: boolean
  mouse: { x: number; y: number }
  windowSize: { w: number; h: number }
  lang: Lang
  worksHoveredIndex: number | null
  setLoadProgress: (v: number) => void
  setIsLoaded: () => void
  setSphereHovered: (v: boolean) => void
  setMouse: (x: number, y: number) => void
  setWindowSize: (w: number, h: number) => void
  toggleLang: () => void
  setWorksHoveredIndex: (v: number | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  loadProgress: 0,
  isLoaded: false,
  sphereHovered: false,
  mouse: { x: 0, y: 0 },
  windowSize: { w: window.innerWidth, h: window.innerHeight },
  lang: 'en',
  worksHoveredIndex: null,
  setLoadProgress: (v) => set({ loadProgress: v }),
  setIsLoaded: () => set({ isLoaded: true }),
  setSphereHovered: (v) => set({ sphereHovered: v }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setWindowSize: (w, h) => set({ windowSize: { w, h } }),
  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'ru' : 'en' })),
  setWorksHoveredIndex: (v) => set({ worksHoveredIndex: v }),
}))