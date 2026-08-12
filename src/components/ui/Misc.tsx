import styled from '@emotion/styled'
import { sportById } from '../../data/sports'
import type { SportId } from '../../data/types'
import { blockProps } from '../../theme/fwd'

// Initials avatar with an accent ring.
export const Avatar = styled('div', blockProps('size', 'accent'))<{
  size?: number
  accent?: string
}>`
  flex: 0 0 auto;
  width: ${(p) => p.size ?? 40}px;
  height: ${(p) => p.size ?? 40}px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-family: ${(p) => p.theme.font.display};
  font-weight: 700;
  font-size: ${(p) => (p.size ?? 40) * 0.36}px;
  color: #fff;
  background: ${(p) =>
    `linear-gradient(140deg, ${p.accent ?? p.theme.color.accent}, ${p.theme.color.bg3})`};
  border: 1px solid ${(p) => p.theme.color.lineStrong};
`

// A labelled statistic (number + caption).
const StatWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`
const StatValue = styled.div`
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  font-size: ${(p) => p.theme.fontSize.h3};
  line-height: 1;
  letter-spacing: -0.02em;
`
const StatLabel = styled.div`
  font-size: ${(p) => p.theme.fontSize.micro};
  color: ${(p) => p.theme.color.fgMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`
export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <StatWrap>
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
    </StatWrap>
  )
}

// Progress bar (checklist completion, budget usage…).
const Track = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: ${(p) => p.theme.color.surfaceStrong};
  overflow: hidden;
`
const Fill = styled.div<{ pct: number; accent?: string }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.pct))}%;
  border-radius: 999px;
  background: ${(p) => p.accent ?? p.theme.color.accent};
  transition: width 0.5s ${(p) => p.theme.ease.out};
`
export function ProgressBar({ pct, accent }: { pct: number; accent?: string }) {
  return (
    <Track>
      <Fill pct={pct} accent={accent} />
    </Track>
  )
}

// Sport chip with the sport's accent dot + name.
const SportChipEl = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  color: ${(p) => p.theme.color.fg};
`
const Dot = styled.span<{ c: string }>`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${(p) => p.c};
  box-shadow: 0 0 10px ${(p) => p.c}88;
`
export function SportChip({ sport }: { sport: SportId }) {
  const s = sportById(sport)
  return (
    <SportChipEl>
      <Dot c={sportColor(sport)} />
      {s.glyph} {s.name}
    </SportChipEl>
  )
}

export function sportColor(sport: SportId): string {
  const map: Record<string, string> = {
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
  }
  return map[sport] ?? '#4f83ff'
}
