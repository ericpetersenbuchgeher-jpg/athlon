import styled from '@emotion/styled'

// Frosted surface card. `interactive` adds hover lift for clickable cards.
export const Card = styled.div<{ interactive?: boolean; pad?: number }>`
  position: relative;
  background: ${(p) => p.theme.color.surface};
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.lg};
  padding: ${(p) => p.theme.space(p.pad ?? 6)};
  backdrop-filter: blur(8px);
  transition: transform 0.22s ${(p) => p.theme.ease.out}, border-color 0.22s, background 0.22s,
    box-shadow 0.22s;

  ${(p) =>
    p.interactive &&
    `
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      border-color: ${p.theme.color.lineStrong};
      background: ${p.theme.color.surfaceHover};
      box-shadow: ${p.theme.shadow.lg};
    }
  `}
`

// A subtler nested panel used inside cards / detail pages.
export const Panel = styled.div<{ pad?: number }>`
  background: ${(p) => p.theme.color.bg2};
  border: 1px solid ${(p) => p.theme.color.line};
  border-radius: ${(p) => p.theme.radius.md};
  padding: ${(p) => p.theme.space(p.pad ?? 5)};
`
