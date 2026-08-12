import styled from '@emotion/styled'
import { blockProps } from '../../theme/fwd'

// Layout building blocks. Kept tiny and composable.

export const Container = styled.div<{ wide?: boolean }>`
  width: 100%;
  max-width: ${(p) => (p.wide ? p.theme.layout.wideWidth : p.theme.layout.maxWidth)};
  margin-inline: auto;
  padding-inline: clamp(20px, 5vw, 48px);
`

export const Stack = styled('div', blockProps('gap', 'align'))<{ gap?: number; align?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.space(p.gap ?? 4)};
  align-items: ${(p) => p.align ?? 'stretch'};
  min-width: 0;
`

export const Row = styled(
  'div',
  blockProps('gap', 'align', 'justify', 'wrap'),
)<{ gap?: number; align?: string; justify?: string; wrap?: boolean }>`
  display: flex;
  gap: ${(p) => p.theme.space(p.gap ?? 3)};
  align-items: ${(p) => p.align ?? 'center'};
  justify-content: ${(p) => p.justify ?? 'flex-start'};
  flex-wrap: ${(p) => (p.wrap ? 'wrap' : 'nowrap')};
  min-width: 0;
`

export const Grid = styled('div', blockProps('min', 'gap'))<{ min?: string; gap?: number }>`
  display: grid;
  gap: ${(p) => p.theme.space(p.gap ?? 4)};
  grid-template-columns: repeat(auto-fill, minmax(${(p) => p.min ?? '260px'}, 1fr));
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${(p) => p.theme.color.line};
  margin: 0;
  width: 100%;
`

export const Eyebrow = styled.p<{ tone?: 'accent' | 'energy' | 'muted' }>`
  font-family: ${(p) => p.theme.font.body};
  font-size: ${(p) => p.theme.fontSize.micro};
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0;
  color: ${(p) =>
    p.tone === 'energy'
      ? p.theme.color.energy
      : p.tone === 'muted'
        ? p.theme.color.fgMuted
        : p.theme.color.accent};
`

export const Muted = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  margin: 0;
`

// generic page section spacing for the app area
export const PageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${(p) => p.theme.space(4)};
  margin-bottom: ${(p) => p.theme.space(6)};

  h1 {
    font-size: ${(p) => p.theme.fontSize.h2};
  }
`
