
## Fonts
- **Anton** — headings, display text (font-weight: 400)
- **Manrope** — body, descriptions (weights: 300, 400, 500, 700)
- **JetBrains Mono** — labels, monospace UI elements (weight: 400, 500)
- Loaded via Google Fonts in index.html (preconnect) + @import in index.css

## Code Style
- TypeScript strict mode. Always type refs with `useRef<Type>(null!)`.
- Functional components only. No class components.
- CSS in separate `.css` files per component (no CSS-in-JS, no Tailwind).
- Use `clamp()` for responsive font sizes.
- GSAP: always use `gsap.context()` with cleanup via `ctx.revert()` in useEffect return.
- GSAP: register plugins at component level (`gsap.registerPlugin(ScrollTrigger)`).
- R3F: use `useFrame` for per-frame updates, never requestAnimationFrame.
- Shaders: inline as template strings in component files. GLSL precision: `highp float`.
- Zustand: single store in `src/store.ts`, access outside React via `useAppStore.getState()`.

## Key Patterns
- Canvas is `position: fixed` fullscreen at z-index 1. DOM content scrolls over it at z-index 10.
- Lenis handles smooth scroll, synced with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- Preloader uses fake progress (setInterval), animates out on 100%, then sets `isLoaded: true` in store.
- Hero overlay animations trigger only after `isLoaded === true`.
- Mouse position tracked globally in store, used by shaders via `useAppStore.getState()` in useFrame.
- All entrance animations use `visibility: hidden` initially, set to `visible` before animating.

## Anti-Patterns (NEVER do these)
- Never use WordPress, Tilda, Bitrix, or any CMS/constructor.
- Never use CSS frameworks (Tailwind, Bootstrap).
- Never use `requestAnimationFrame` in R3F components.
- Never create FOUC — always hide elements before animating them in.
- Never use cheap/janky animations — everything must be smooth and premium.
- Never add explanatory comments in generated code unless specifically asked.

## Output Rules
- Be concise. Code only unless asked for explanation.
- When creating new files, always show the full file path.
- When modifying existing files, show only the changed parts with clear context.
- Prefer editing minimal code over rewriting entire files.