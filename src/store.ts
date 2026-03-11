import { create } from 'zustand'

interface AppState {
  loadProgress: number
  isLoaded: boolean
  sphereHovered: boolean
  mouse: { x: number; y: number }
  windowSize: { w: number; h: number }
  setLoadProgress: (v: number) => void
  setIsLoaded: () => void
  setSphereHovered: (v: boolean) => void
  setMouse: (x: number, y: number) => void
  setWindowSize: (w: number, h: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  loadProgress: 0,
  isLoaded: false,
  sphereHovered: false,
  mouse: { x: 0, y: 0 },
  windowSize: { w: window.innerWidth, h: window.innerHeight },
  setLoadProgress: (v) => set({ loadProgress: v }),
  setIsLoaded: () => set({ isLoaded: true }),
  setSphereHovered: (v) => set({ sphereHovered: v }),
  setMouse: (x, y) => set({ mouse: { x, y } }),
  setWindowSize: (w, h) => set({ windowSize: { w, h } }),
}))