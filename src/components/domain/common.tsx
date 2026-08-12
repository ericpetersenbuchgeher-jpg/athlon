import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { Card, Icon } from '../ui'
import type { IconName } from '../ui'

// Small shared building blocks used across the app pages.

// A KPI tile for dashboards.
const StatCardEl = styled(Card)<{ accent?: string }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
  }
  .icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    color: ${(p) => p.accent ?? p.theme.color.accent};
    background: ${(p) => (p.accent ?? p.theme.color.accent) + '22'};
  }
  .value {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 800;
    font-size: ${(p) => p.theme.fontSize.h2};
    line-height: 1;
    letter-spacing: -0.02em;
  }
`
export function StatCard({
  label,
  value,
  icon,
  accent,
  hint,
}: {
  label: string
  value: ReactNode
  icon: IconName
  accent?: string
  hint?: string
}) {
  return (
    <StatCardEl pad={5} accent={accent}>
      <div className="top">
        <span>{label}</span>
        <span className="icon">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="value">{value}</div>
      {hint && <div style={{ color: '#9aa3b2', fontSize: '0.8rem' }}>{hint}</div>}
    </StatCardEl>
  )
}

// Empty state for lists with no results.
const EmptyWrap = styled.div`
  text-align: center;
  padding: clamp(40px, 8vw, 80px) 20px;
  border: 1px dashed ${(p) => p.theme.color.lineStrong};
  border-radius: ${(p) => p.theme.radius.lg};
  color: ${(p) => p.theme.color.fgMuted};
  .icon {
    display: inline-grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 999px;
    background: ${(p) => p.theme.color.surface};
    color: ${(p) => p.theme.color.accent};
    margin-bottom: 16px;
  }
  h3 {
    color: ${(p) => p.theme.color.fg};
    font-size: ${(p) => p.theme.fontSize.lg};
    margin-bottom: 8px;
  }
`
export function EmptyState({
  icon = 'search',
  title,
  children,
}: {
  icon?: IconName
  title: string
  children?: ReactNode
}) {
  return (
    <EmptyWrap>
      <div className="icon">
        <Icon name={icon} size={24} />
      </div>
      <h3>{title}</h3>
      {children && <p style={{ maxWidth: '42ch', margin: '0 auto' }}>{children}</p>}
    </EmptyWrap>
  )
}

// A labelled key/value row (detail pages).
const InfoRowEl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid ${(p) => p.theme.color.line};
  font-size: ${(p) => p.theme.fontSize.body};
  &:last-of-type {
    border-bottom: none;
  }
  .k {
    color: ${(p) => p.theme.color.fgMuted};
  }
  .v {
    font-weight: 600;
    text-align: right;
  }
`
export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <InfoRowEl>
      <span className="k">{label}</span>
      <span className="v">{children}</span>
    </InfoRowEl>
  )
}
