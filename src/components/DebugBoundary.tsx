import { Component, type ReactNode } from 'react'

// Top-level safety net: if any render throws, show a branded fallback instead of a white screen.
// The raw stack is only shown during development.
export class DebugBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: 40,
          background: '#07090d',
          color: '#eef1f7',
          fontFamily: "'Schibsted Grotesk', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <div style={{ fontSize: 40 }}>🏟️</div>
          <h1 style={{ fontFamily: "'Archivo', sans-serif", margin: '12px 0 8px' }}>
            Qualcosa è andato storto
          </h1>
          <p style={{ color: '#9aa3b2', marginBottom: 24 }}>
            Si è verificato un errore imprevisto. Ricarica la pagina per tornare in campo.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 22px',
              borderRadius: 999,
              border: 'none',
              background: '#4f83ff',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Ricarica
          </button>
          {import.meta.env.DEV && (
            <pre
              style={{
                marginTop: 24,
                textAlign: 'left',
                color: '#ff8a8a',
                fontSize: 12,
                whiteSpace: 'pre-wrap',
                overflow: 'auto',
                maxHeight: 240,
              }}
            >
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
