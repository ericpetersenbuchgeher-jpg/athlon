import styled from '@emotion/styled'
import type { ReactNode } from 'react'

const controlCss = `
  width: 100%;
  font-family: inherit;
  font-size: 0.95rem;
  color: inherit;
  background: var(--field-bg);
  border: 1px solid var(--field-line);
  border-radius: 12px;
  padding: 12px 14px;
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s;
  &::placeholder { color: var(--field-placeholder); }
  &:focus {
    outline: none;
    border-color: var(--field-focus);
    box-shadow: 0 0 0 3px var(--field-focus-ring);
  }
`

export const Input = styled.input`
  --field-bg: ${(p) => p.theme.color.bg2};
  --field-line: ${(p) => p.theme.color.line};
  --field-placeholder: ${(p) => p.theme.color.fgFaint};
  --field-focus: ${(p) => p.theme.color.accent};
  --field-focus-ring: ${(p) => p.theme.color.accentSoft};
  ${controlCss}
`

export const Textarea = styled.textarea`
  --field-bg: ${(p) => p.theme.color.bg2};
  --field-line: ${(p) => p.theme.color.line};
  --field-placeholder: ${(p) => p.theme.color.fgFaint};
  --field-focus: ${(p) => p.theme.color.accent};
  --field-focus-ring: ${(p) => p.theme.color.accentSoft};
  ${controlCss}
  min-height: 110px;
  resize: vertical;
`

export const Select = styled.select`
  --field-bg: ${(p) => p.theme.color.bg2};
  --field-line: ${(p) => p.theme.color.line};
  --field-placeholder: ${(p) => p.theme.color.fgFaint};
  --field-focus: ${(p) => p.theme.color.accent};
  --field-focus-ring: ${(p) => p.theme.color.accentSoft};
  ${controlCss}
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, ${(p) => p.theme.color.fgMuted} 50%),
    linear-gradient(135deg, ${(p) => p.theme.color.fgMuted} 50%, transparent 50%);
  background-position: calc(100% - 20px) 55%, calc(100% - 15px) 55%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  padding-right: 38px;
  option { color: #111; }
`

const Label = styled.label`
  display: block;
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 600;
  color: ${(p) => p.theme.color.fg};
  margin-bottom: 7px;
`

const Hint = styled.p`
  font-size: ${(p) => p.theme.fontSize.micro};
  color: ${(p) => p.theme.color.fgMuted};
  margin: 6px 0 0;
`

const FieldWrap = styled.div`
  display: block;
`

interface FieldProps {
  label?: string
  htmlFor?: string
  hint?: string
  children: ReactNode
}

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <FieldWrap>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint && <Hint>{hint}</Hint>}
    </FieldWrap>
  )
}
