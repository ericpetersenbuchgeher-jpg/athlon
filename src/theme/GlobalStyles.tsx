import { Global, css, useTheme } from '@emotion/react'

// Global reset + base typography + Lenis rules + the fixed 3D canvas layer.
// Emotion replaces the old styles.css; the theme provides the tokens.
export function GlobalStyles() {
  const t = useTheme()
  return (
    <Global
      styles={css`
        /* --- Lenis base rules (smooth scroll wrapping / anchors / stop) --- */
        html.lenis,
        html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          min-height: 100%;
        }

        body {
          background: ${t.color.bg};
          color: ${t.color.fg};
          font-family: ${t.font.body};
          font-size: ${t.fontSize.body};
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
        }

        h1,
        h2,
        h3,
        h4 {
          font-family: ${t.font.display};
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 0;
        }

        p {
          margin: 0;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font-family: inherit;
        }

        img,
        svg {
          display: block;
          max-width: 100%;
        }

        ::selection {
          background: ${t.color.accent};
          color: #fff;
        }

        /* consistent, visible keyboard focus */
        :focus-visible {
          outline: 2px solid ${t.color.accent};
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* thin, dark scrollbar to match the cinematic shell */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${t.color.line};
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${t.color.lineStrong};
        }

        /* fixed full-screen 3D layer behind the landing content */
        .canvas-layer {
          position: fixed;
          inset: 0;
          z-index: ${t.z.canvas};
        }
        .canvas-layer canvas {
          display: block;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}
    />
  )
}
