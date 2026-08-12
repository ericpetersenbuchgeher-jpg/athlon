import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { blockProps } from '../../theme/fwd'

type Variant = 'primary' | 'energy' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const noFwd = blockProps('variant', 'size', 'full')

interface StyleProps {
  variant?: Variant
  size?: Size
  full?: boolean
}

const base = (size: Size = 'md', full?: boolean) => `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  white-space: nowrap;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), background 0.18s, border-color 0.18s, box-shadow 0.18s, color 0.18s;
  text-decoration: none;
  width: ${full ? '100%' : 'auto'};
  ${
    size === 'sm'
      ? 'padding: 8px 14px; font-size: 0.82rem;'
      : size === 'lg'
        ? 'padding: 15px 26px; font-size: 1rem;'
        : 'padding: 11px 20px; font-size: 0.9rem;'
  }
  &:active { transform: translateY(1px) scale(0.99); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

function variantCss(theme: import('@emotion/react').Theme, variant: Variant = 'primary') {
  switch (variant) {
    case 'energy':
      return `
        background: ${theme.color.energy};
        color: #14060a;
        &:hover:not(:disabled) { box-shadow: ${theme.shadow.glowEnergy}; transform: translateY(-1px); }
      `
    case 'secondary':
      return `
        background: ${theme.color.surfaceStrong};
        color: ${theme.color.fg};
        border-color: ${theme.color.line};
        &:hover:not(:disabled) { background: ${theme.color.surfaceHover}; border-color: ${theme.color.lineStrong}; transform: translateY(-1px); }
      `
    case 'ghost':
      return `
        background: transparent;
        color: ${theme.color.fg};
        border-color: transparent;
        &:hover:not(:disabled) { background: ${theme.color.surface}; }
      `
    case 'primary':
    default:
      return `
        background: ${theme.color.accent};
        color: #fff;
        &:hover:not(:disabled) { box-shadow: ${theme.shadow.glowAccent}; transform: translateY(-1px); }
      `
  }
}

export const Button = styled('button', noFwd)<StyleProps>`
  ${(p) => base(p.size, p.full)}
  ${(p) => variantCss(p.theme, p.variant)}
`

// Router-aware link that looks like a Button.
export const ButtonLink = styled(Link, noFwd)<StyleProps>`
  ${(p) => base(p.size, p.full)}
  ${(p) => variantCss(p.theme, p.variant)}
`

// Plain <a> that looks like a Button (for anchors / external).
export const ButtonAnchor = styled('a', noFwd)<StyleProps>`
  ${(p) => base(p.size, p.full)}
  ${(p) => variantCss(p.theme, p.variant)}
`

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.color.line};
  background: ${(p) => p.theme.color.surface};
  color: ${(p) => p.theme.color.fg};
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
  &:hover {
    background: ${(p) => p.theme.color.surfaceHover};
    border-color: ${(p) => p.theme.color.lineStrong};
  }
`
