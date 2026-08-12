import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { BRAND } from '../../brand'

const Wrap = styled(Link)<{ size?: number }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  letter-spacing: -0.03em;
  font-size: ${(p) => (p.size ?? 20) / 16}rem;
  color: ${(p) => p.theme.color.fg};
`

const Mark = styled.span<{ size?: number }>`
  position: relative;
  width: ${(p) => p.size ?? 30}px;
  height: ${(p) => p.size ?? 30}px;
  border-radius: ${(p) => (p.size ?? 30) * 0.3}px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(155deg, #2c63ff 0%, #0d2a86 60%, #07153f 100%);
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    0 8px 22px -8px rgba(44, 99, 255, 0.75);
  svg {
    width: 100%;
    height: 100%;
  }
`

// Athlon monogram: a bold two-tone "A" — the apex/legs are the mark, an accent bar (volt) cuts
// across as a dynamic "track" line. Ascending, athletic, premium.
export function Logo({ size = 30, hideWord = false }: { size?: number; hideWord?: boolean }) {
  return (
    <Wrap to="/" size={size} aria-label={BRAND.name}>
      <Mark size={size}>
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          {/* soft top-light sheen */}
          <path d="M0 0h32v14C22 8 10 8 0 14Z" fill="rgba(255,255,255,0.10)" />
          {/* A — legs + apex */}
          <path
            d="M8.5 25 16 7l7.5 18"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* accent 'track' crossbar */}
          <path d="M11.6 18.3h8.8" stroke="#c8ff4d" strokeWidth={3} strokeLinecap="round" />
        </svg>
      </Mark>
      {!hideWord && <span>{BRAND.name}</span>}
    </Wrap>
  )
}
