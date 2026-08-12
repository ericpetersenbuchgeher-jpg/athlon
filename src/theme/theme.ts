// Design tokens for Athlon — dark, cinematic, editorial (from the reference reels),
// declined onto Italian sport. Azure = identity (the "Azzurri" nod), orange = energy/action.
// One source of truth; consumed via Emotion's ThemeProvider (see GlobalStyles + main.tsx).

export const theme = {
  color: {
    // surfaces (deep, cinematic)
    bg: '#07090d',
    bg2: '#0b0e14',
    bg3: '#10141c',
    surface: 'rgba(255,255,255,0.028)',
    surfaceHover: 'rgba(255,255,255,0.05)',
    surfaceStrong: 'rgba(255,255,255,0.07)',
    line: 'rgba(255,255,255,0.10)',
    lineStrong: 'rgba(255,255,255,0.18)',

    // text
    fg: '#eef1f7',
    fgMuted: '#9aa3b2',
    fgFaint: '#5f6774',

    // brand accents
    accent: '#4f83ff', // azure — identity, links, focus
    accentSoft: 'rgba(79,131,255,0.14)',
    energy: '#ff6b3d', // orange — action, CTA, sport energy
    energySoft: 'rgba(255,107,61,0.14)',
    volt: '#c8ff4d', // highlight / verified accents (used sparingly)

    // status (bureaucracy: bozza / in verifica / attiva)
    success: '#3ddc84',
    successSoft: 'rgba(61,220,132,0.14)',
    warning: '#ffbe4d',
    warningSoft: 'rgba(255,190,77,0.14)',
    danger: '#ff5d6c',
    dangerSoft: 'rgba(255,93,108,0.14)',
    info: '#4f83ff',
  },

  // brand accent per sport — used for ball colors, tags, team logos
  sportColor: {
    basket: '#ff6b3d',
    calcio: '#3ddc84',
    calcio5: '#2fbf71',
    pallavolo: '#4f83ff',
    tennis: '#c8ff4d',
    rugby: '#b06bff',
    atletica: '#ff4d7d',
    nuoto: '#2fd3e0',
    ciclismo: '#ffbe4d',
    pallamano: '#ff8a3d',
  } as Record<string, string>,

  font: {
    display: "'Archivo', 'Arial Narrow', system-ui, sans-serif",
    body: "'Schibsted Grotesk', ui-sans-serif, system-ui, sans-serif",
  },

  // fluid type scale (clamp: min, preferred vw, max)
  fontSize: {
    micro: '0.72rem',
    small: '0.82rem',
    body: '0.95rem',
    lg: '1.08rem',
    xl: 'clamp(1.2rem, 1rem + 0.9vw, 1.6rem)',
    h3: 'clamp(1.4rem, 1.1rem + 1.4vw, 2rem)',
    h2: 'clamp(2rem, 1.4rem + 2.6vw, 3.2rem)',
    h1: 'clamp(2.6rem, 1.6rem + 4.6vw, 5rem)',
    hero: 'clamp(3.2rem, 1.2rem + 9vw, 9.5rem)',
  },

  radius: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '22px',
    xl: '30px',
    pill: '999px',
  },

  space: (n: number) => `${n * 4}px`,

  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.4)',
    md: '0 10px 30px -12px rgba(0,0,0,0.7)',
    lg: '0 30px 80px -24px rgba(0,0,0,0.85)',
    glowAccent: '0 0 0 1px rgba(79,131,255,0.4), 0 12px 40px -12px rgba(79,131,255,0.45)',
    glowEnergy: '0 0 0 1px rgba(255,107,61,0.4), 0 12px 40px -12px rgba(255,107,61,0.5)',
  },

  layout: {
    maxWidth: '1200px',
    wideWidth: '1440px',
    sidebar: '256px',
    topbar: '68px',
    radius: '16px',
  },

  ease: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },

  z: {
    canvas: 0,
    content: 1,
    sticky: 20,
    nav: 30,
    overlay: 40,
    modal: 50,
    toast: 60,
  },
} as const

export type AppTheme = typeof theme
