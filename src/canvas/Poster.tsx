import styled from '@emotion/styled'

// Static fallback when the device cannot create any WebGL context.
// The page must never be blank: a calm gradient "ball" stands in for the 3D hero.
const Wrap = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
`

const Orb = styled.div`
  width: min(56vmin, 460px);
  height: min(56vmin, 460px);
  border-radius: 999px;
  background: conic-gradient(
    from 200deg,
    #ff6b3d,
    #37d17a,
    #c8ff4d,
    #4f83ff,
    #ff6b3d
  );
  filter: blur(2px) saturate(1.1);
  box-shadow: 0 40px 120px -20px rgba(79, 131, 255, 0.5);
  opacity: 0.9;
  animation: spin 26s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export function Poster() {
  return (
    <Wrap role="img" aria-label="Sfera sportiva che cambia colore">
      <Orb />
    </Wrap>
  )
}
