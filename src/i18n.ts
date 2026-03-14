// src/i18n.ts

export type Lang = 'en' | 'ru'

interface Translations {
  [key: string]: { en: string; ru: string }
}

export const t: Translations = {
  // Hero
  'hero.role': {
    en: 'Creative Developer',
    ru: 'Креативный разработчик',
  },
  'hero.desc': {
    en: 'Crafting immersive digital experiences with clean code, thoughtful design and obsessive attention to detail.',
    ru: 'Создаю цифровые продукты с чистым кодом, продуманным дизайном и маниакальным вниманием к деталям.',
  },
  'hero.years': { en: 'Years Experience', ru: 'Лет опыта' },
  'hero.projects': { en: 'Projects Done', ru: 'Проектов' },
  'hero.code': { en: 'Clean Code', ru: 'Чистый код' },
  'hero.scroll': { en: 'Scroll', ru: 'Листай' },

  // About
  'about.label': { en: 'IDENTIFICATION', ru: 'ИДЕНТИФИКАЦИЯ' },
  'about.role.label': { en: 'ROLE', ru: 'РОЛЬ' },
  'about.role.value': { en: 'Creative Developer', ru: 'Креативный разработчик' },
  'about.exp.label': { en: 'EXPERIENCE', ru: 'ОПЫТ' },
  'about.exp.value': { en: '2+ Years', ru: '2+ Года' },
  'about.stack.label': { en: 'STACK', ru: 'СТЕК' },
  'about.stack.value': { en: 'React / Three.js / GSAP', ru: 'React / Three.js / GSAP' },
  'about.approach.label': { en: 'APPROACH', ru: 'ПОДХОД' },
  'about.approach.value': { en: 'Code-only, no templates', ru: 'Только код, без шаблонов' },
  'about.status.label': { en: 'STATUS', ru: 'СТАТУС' },
  'about.status.value': { en: 'Available for work', ru: 'Открыт к работе' },
  'about.bio.1': {
    en: 'I build websites entirely from scratch — no WordPress, no page builders, no shortcuts.',
    ru: 'Я создаю сайты полностью с нуля — без WordPress, без конструкторов, без компромиссов.',
  },
  'about.bio.2': {
    en: 'Every project starts with an empty file and ends with pixel-perfect, high-performance code that feels alive.',
    ru: 'Каждый проект начинается с пустого файла и заканчивается pixel-perfect кодом, который живёт.',
  },
  'about.bio.3': {
    en: 'My focus is on premium motion design, 3D experiences and interfaces that leave a lasting impression.',
    ru: 'Мой фокус — премиальная анимация, 3D-опыт и интерфейсы, которые запоминаются.',
  },

  // Expertise
  'expertise.label': { en: 'EXPERTISE', ru: 'ЭКСПЕРТИЗА' },
  'expertise.title': { en: 'TECH STACK', ru: 'ТЕХ-СТЕК' },
  'expertise.subtitle': {
    en: 'I write logic that makes complex backends invisible and frontends — flawless.',
    ru: 'Пишу логику, которая делает сложный бэкенд незаметным, а фронтенд — безупречным.',
  },
  'expertise.bar': { en: 'Proficiency', ru: 'Владение' },
  'expertise.example': { en: 'APPLIED IN', ru: 'ПРИМЕНЕНИЕ' },

  // Tech cards
  'tech.react.cat': { en: 'Frontend Framework', ru: 'Frontend-фреймворк' },
  'tech.react.desc': {
    en: 'Building complex SPAs and SSR/SSG applications with server components, API routes, and seamless page transitions.',
    ru: 'Сложные SPA и SSR/SSG приложения с серверными компонентами, API-маршрутами и бесшовными переходами.',
  },
  'tech.react.ex': {
    en: 'This portfolio — built entirely on Next.js with custom GLSL shaders and zero CMS dependency.',
    ru: 'Это портфолио — собрано на Next.js с кастомными GLSL-шейдерами и без единой CMS.',
  },
  'tech.ts.cat': { en: 'Language', ru: 'Язык' },
  'tech.ts.desc': {
    en: 'Strict typing across full stack — from React components to Node.js APIs. Catches bugs before they exist.',
    ru: 'Строгая типизация на всём стеке — от React-компонентов до Node.js API. Баги ловятся до продакшена.',
  },
  'tech.ts.ex': {
    en: 'Every project uses TS. Type-safe API contracts between frontend and backend.',
    ru: 'Каждый проект на TS. Типобезопасные контракты между фронтом и бэком.',
  },
  'tech.gsap.cat': { en: 'Animation Engine', ru: 'Анимации' },
  'tech.gsap.desc': {
    en: 'Premium scroll-driven animations, page transitions, and micro-interactions that feel Apple-level smooth.',
    ru: 'Премиальные scroll-анимации, переходы страниц и микро-интеракции уровня Apple.',
  },
  'tech.gsap.ex': {
    en: 'Every animation on this page — entrances, parallax, reveals — is powered by GSAP.',
    ru: 'Каждая анимация на этой странице — появления, параллакс, ревилы — это GSAP.',
  },
  'tech.webgl.cat': { en: '3D & Shaders', ru: '3D и шейдеры' },
  'tech.webgl.desc': {
    en: 'Custom fragment shaders, procedural backgrounds, and interactive 3D scenes using Three.js and raw GLSL.',
    ru: 'Кастомные фрагментные шейдеры, процедурные фоны и интерактивные 3D-сцены на Three.js.',
  },
  'tech.webgl.ex': {
    en: 'The hero background — a real-time GLSL noise shader reacting to your cursor.',
    ru: 'Фон на главном экране — GLSL noise-шейдер, реагирующий на курсор в реальном времени.',
  },
  'tech.node.cat': { en: 'Backend Runtime', ru: 'Бэкенд' },
  'tech.node.desc': {
    en: 'REST APIs, WebSocket servers, auth systems, and database integrations. The invisible engine behind every project.',
    ru: 'REST API, WebSocket-серверы, системы авторизации и интеграции с базами данных.',
  },
  'tech.node.ex': {
    en: 'Custom booking systems, real-time dashboards, Telegram bot integrations.',
    ru: 'Системы бронирования, realtime-дашборды, интеграции с Telegram-ботами.',
  },
  'tech.cms.cat': { en: 'Content Architecture', ru: 'Контент' },
  'tech.cms.desc': {
    en: 'Strapi, Sanity, or custom solutions — so clients edit content easily while code stays clean.',
    ru: 'Strapi, Sanity или кастомные решения — клиент редактирует контент, код остаётся чистым.',
  },
  'tech.cms.ex': {
    en: 'Blog and portfolio sites where client updates content without touching code.',
    ru: 'Блоги и портфолио, где клиент управляет контентом без единой строчки кода.',
  },
  'tech.html.cat': { en: 'Core Foundation', ru: 'Основа' },
  'tech.html.desc': {
    en: 'Pixel-perfect responsive layouts, CSS Grid, custom properties, container queries, and zero-framework styling.',
    ru: 'Pixel-perfect адаптивная вёрстка, CSS Grid, кастомные свойства, container queries. Без фреймворков.',
  },
  'tech.html.ex': {
    en: 'This entire UI — no Bootstrap, no Tailwind. Pure handwritten CSS.',
    ru: 'Весь этот интерфейс — без Bootstrap, без Tailwind. Чистый рукописный CSS.',
  },
  'tech.api.cat': { en: 'API Design', ru: 'API' },
  'tech.api.desc': {
    en: 'Designing clean, documented APIs. REST for simplicity, GraphQL when data relationships get complex.',
    ru: 'Чистые документированные API. REST для простоты, GraphQL для сложных графов данных.',
  },
  'tech.api.ex': {
    en: 'E-commerce backends with product filtering, cart logic, and payment webhooks.',
    ru: 'Бэкенды e-commerce с фильтрацией, корзиной и платёжными вебхуками.',
  },

  // Works section
  'works.label': { en: 'PORTFOLIO', ru: 'ПОРТФОЛИО' },
  'works.title': { en: 'SELECTED WORKS', ru: 'ИЗБРАННЫЕ РАБОТЫ' },
  'works.subtitle': {
    en: 'Each project is built from scratch with obsessive attention to detail.',
    ru: 'Каждый проект создан с нуля с маниакальным вниманием к деталям.',
  },
  'works.view': { en: 'VIEW PROJECT', ru: 'СМОТРЕТЬ ПРОЕКТ' },
  'works.drag': { en: 'SCROLL TO EXPLORE', ru: 'СКРОЛЛЬ ДЛЯ ПРОСМОТРА' },

  // Project data
  'work.1.title': { en: 'AESTHETICS STUDIO', ru: 'СТУДИЯ ЭСТЕТИКИ' },
  'work.1.cat': { en: 'Body Aesthetics', ru: 'Эстетика тела' },
  'work.1.desc': {
    en: 'Premium website for a body aesthetics studio. Elegant animations, booking system, and mobile-first approach.',
    ru: 'Премиальный сайт для студии эстетики тела. Элегантные анимации, система бронирования и mobile-first подход.',
  },
  'work.2.title': { en: 'STUDENT STARTUP', ru: 'СТУДЕНЧЕСКИЙ СТАРТАП' },
  'work.2.cat': { en: 'Startup / SaaS', ru: 'Стартап / SaaS' },
  'work.2.desc': {
    en: 'Landing page for a student startup. Clean UI, conversion-focused design with interactive product demos.',
    ru: 'Лендинг для студенческого стартапа. Чистый UI, конверсионный дизайн с интерактивными демо продукта.',
  },
  'work.3.title': { en: 'OPERA BLOG', ru: 'БЛОГ ОБ ОПЕРЕ' },
  'work.3.cat': { en: 'Blog / Custom CMS', ru: 'Блог / Кастомная CMS' },
  'work.3.desc': {
    en: 'Personal opera blog with a custom admin panel built specifically for the client. Headless CMS, zero templates.',
    ru: 'Личный блог об опере с кастомной админ-панелью, разработанной под заказчицу. Headless CMS, без шаблонов.',
  },
  'work.4.title': { en: 'BAKERY', ru: 'КОНДИТЕРСКАЯ' },
  'work.4.cat': { en: 'Food & Beverage', ru: 'Еда и напитки' },
  'work.4.desc': {
    en: 'Showcase website for a bakery. Warm palette, smooth scroll animations, and mouth-watering product gallery.',
    ru: 'Витринный сайт для кондитерской. Тёплая палитра, плавные scroll-анимации и аппетитная галерея продуктов.',
  },

  // Footer CTA
  'footer.label': { en: 'CONTACT', ru: 'КОНТАКТ' },
  'footer.title.1': { en: 'START A', ru: 'НАЧАТЬ' },
  'footer.title.2': { en: 'PROJECT', ru: 'ПРОЕКТ' },
  'footer.desc': {
    en: 'Have a task for non-standard interactivity or need a turnkey website from a strong team? Let\'s discuss.',
    ru: 'Есть задача на нестандартный интерактив или нужен сайт под ключ от сильной команды? Давай обсудим.',
  },
  'footer.studio': { en: 'Egor & Valeria', ru: 'Егор & Валерия' },
  'footer.made': { en: 'Handcrafted with code', ru: 'Сделано руками' },

  // Calculator
  'calc.label': { en: 'PRICING', ru: 'СТОИМОСТЬ' },
  'calc.title': { en: 'PROJECT CALCULATOR', ru: 'КАЛЬКУЛЯТОР ПРОЕКТА' },
  'calc.subtitle': {
    en: 'Configure your project and get an instant estimate. Final price is discussed individually.',
    ru: 'Настройте проект и получите мгновенную оценку. Финальная цена обсуждается индивидуально.',
  },
  'calc.type': { en: 'PROJECT TYPE', ru: 'ТИП ПРОЕКТА' },
  'calc.type.landing': { en: 'Landing page', ru: 'Лендинг' },
  'calc.type.multi': { en: 'Multi-page', ru: 'Многостраничный' },
  'calc.type.shop': { en: 'Online store', ru: 'Интернет-магазин' },
  'calc.type.webapp': { en: 'Web app', ru: 'Веб-приложение' },
  'calc.design': { en: 'DESIGN LEVEL', ru: 'УРОВЕНЬ ДИЗАЙНА' },
  'calc.design.basic': { en: 'Basic', ru: 'Базовый' },
  'calc.design.premium': { en: 'Premium', ru: 'Премиум' },
  'calc.design.custom': { en: 'Custom + Animations', ru: 'Кастом + Анимации' },
  'calc.pages': { en: 'PAGES', ru: 'СТРАНИЦЫ' },
  'calc.backend': { en: 'BACKEND', ru: 'БЭКЕНД' },
  'calc.backend.none': { en: 'Not needed', ru: 'Не нужен' },
  'calc.backend.cms': { en: 'Headless CMS', ru: 'Headless CMS' },
  'calc.backend.custom': { en: 'Custom backend', ru: 'Кастомный бэкенд' },
  'calc.extras': { en: 'EXTRAS', ru: 'ДОПОЛНИТЕЛЬНО' },
  'calc.extra.animations': { en: 'Premium animations', ru: 'Премиум анимации' },
  'calc.extra.webgl': { en: '3D / WebGL', ru: '3D / WebGL' },
  'calc.extra.seo': { en: 'SEO optimization', ru: 'SEO оптимизация' },
  'calc.extra.responsive': { en: 'Advanced responsive', ru: 'Расширенный адаптив' },
  'calc.extra.i18n': { en: 'Multi-language', ru: 'Мультиязычность' },
  'calc.summary': { en: 'ESTIMATE', ru: 'ОЦЕНКА' },
  'calc.total': { en: 'TOTAL FROM', ru: 'ИТОГО ОТ' },
  'calc.note': {
    en: 'This is a rough estimate. The final cost depends on the project complexity and is discussed personally.',
    ru: 'Это приблизительная оценка. Финальная стоимость зависит от сложности и обсуждается лично.',
  },
  'calc.cta': { en: 'DISCUSS PROJECT', ru: 'ОБСУДИТЬ ПРОЕКТ' },
}

export function tr(key: string, lang: Lang): string {
  const entry = t[key]
  if (!entry) return key
  return entry[lang] || entry.en
}