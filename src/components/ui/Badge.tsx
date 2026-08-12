import styled from '@emotion/styled'
import type { AsdStatus, ApplicationStatus } from '../../data/types'

type Tone = 'accent' | 'energy' | 'success' | 'warning' | 'danger' | 'neutral' | 'volt'

const toneMap = (theme: import('@emotion/react').Theme, tone: Tone) => {
  const m: Record<Tone, { fg: string; bg: string }> = {
    accent: { fg: theme.color.accent, bg: theme.color.accentSoft },
    energy: { fg: theme.color.energy, bg: theme.color.energySoft },
    success: { fg: theme.color.success, bg: theme.color.successSoft },
    warning: { fg: theme.color.warning, bg: theme.color.warningSoft },
    danger: { fg: theme.color.danger, bg: theme.color.dangerSoft },
    volt: { fg: theme.color.volt, bg: 'rgba(200,255,77,0.12)' },
    neutral: { fg: theme.color.fgMuted, bg: theme.color.surfaceStrong },
  }
  return m[tone]
}

export const Badge = styled.span<{ tone?: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.fontSize.micro};
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;
  color: ${(p) => toneMap(p.theme, p.tone ?? 'neutral').fg};
  background: ${(p) => toneMap(p.theme, p.tone ?? 'neutral').bg};
  border: 1px solid currentColor;
  border-color: ${(p) => toneMap(p.theme, p.tone ?? 'neutral').fg}44;
  white-space: nowrap;
`

// A soft outlined chip (filters, sport tags, roles).
export const Chip = styled.span<{ active?: boolean; accent?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  cursor: ${(p) => (p.onClick ? 'pointer' : 'default')};
  color: ${(p) => (p.active ? '#fff' : p.theme.color.fgMuted)};
  background: ${(p) => (p.active ? p.accent ?? p.theme.color.accent : p.theme.color.surface)};
  border: 1px solid ${(p) => (p.active ? 'transparent' : p.theme.color.line)};
  transition: background 0.16s, color 0.16s, border-color 0.16s;
  &:hover {
    border-color: ${(p) => (p.active ? 'transparent' : p.theme.color.lineStrong)};
    color: ${(p) => (p.active ? '#fff' : p.theme.color.fg)};
  }
`

// Interactive chip rendered as a real <button> (accessible toggles, filters).
export const ChipButton = styled.button<{ active?: boolean; accent?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-family: inherit;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 500;
  cursor: pointer;
  color: ${(p) => (p.active ? '#fff' : p.theme.color.fgMuted)};
  background: ${(p) => (p.active ? p.accent ?? p.theme.color.accent : p.theme.color.surface)};
  border: 1px solid ${(p) => (p.active ? 'transparent' : p.theme.color.line)};
  transition: background 0.16s, color 0.16s, border-color 0.16s;
  &:hover {
    border-color: ${(p) => (p.active ? 'transparent' : p.theme.color.lineStrong)};
    color: ${(p) => (p.active ? '#fff' : p.theme.color.fg)};
  }
`

export const asdStatusTone: Record<AsdStatus, Tone> = {
  bozza: 'neutral',
  'in verifica': 'warning',
  attiva: 'success',
}

export const applicationStatusTone: Record<ApplicationStatus, Tone> = {
  inviata: 'accent',
  'in valutazione': 'warning',
  accettata: 'success',
  rifiutata: 'danger',
}
