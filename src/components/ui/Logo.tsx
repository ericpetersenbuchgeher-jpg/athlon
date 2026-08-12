import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { BRAND } from '../../brand'

const Wrap = styled(Link)<{ size?: number }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: lowercase; /* il wordmark Vivaio è minuscolo */
  font-size: ${(p) => ((p.size ?? 20) + 2) / 16}rem;
  color: ${(p) => p.theme.color.fg};
`

const Mark = styled.span<{ size?: number }>`
  position: relative;
  width: ${(p) => p.size ?? 30}px;
  height: ${(p) => p.size ?? 30}px;
  display: grid;
  place-items: center;
  svg {
    width: 100%;
    height: 100%;
  }
`

// Marchio Vivaio: la palla con la fogliolina — lo sport che cresce.
// La gemma-palla è volt (tennis) di default; la foglia è verde linfa.
export function Logo({ size = 30, hideWord = false }: { size?: number; hideWord?: boolean }) {
  return (
    <Wrap to="/" size={size} aria-label={BRAND.name}>
      <Mark size={size}>
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="30" cy="38" r="19" fill="#c8ff4d" />
          <path
            d="M 18 30 Q 30 38 18 46 M 42 30 Q 30 38 42 46"
            stroke="rgba(7,9,13,0.5)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 35 15 Q 37 4 52 2 Q 50 15 37 19 Z" fill="#37d17a" />
        </svg>
      </Mark>
      {!hideWord && <span>{BRAND.name}</span>}
    </Wrap>
  )
}
