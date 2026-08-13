import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { AuthShell } from './AuthShell'
import { Button, Field, Input, Icon, ChipButton } from '../../components/ui'
import { sportColor } from '../../components/ui'
import { useAuth } from '../../auth/AuthContext'
import { sports } from '../../data/sports'
import type { SportId, UserRole } from '../../data/types'

const Title = styled.h1`
  font-size: clamp(1.9rem, 1.4rem + 1.6vw, 2.5rem);
  margin-bottom: 8px;
`
const Sub = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  margin-bottom: 26px;
`
const Form = styled.form`
  display: grid;
  gap: 18px;
`
const Roles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`
const RoleCard = styled.button<{ active: boolean }>`
  text-align: left;
  cursor: pointer;
  padding: 16px;
  border-radius: ${(p) => p.theme.radius.md};
  background: ${(p) => (p.active ? p.theme.color.accentSoft : p.theme.color.surface)};
  border: 1px solid ${(p) => (p.active ? p.theme.color.accent : p.theme.color.line)};
  color: ${(p) => p.theme.color.fg};
  transition: border-color 0.16s, background 0.16s;
  display: grid;
  gap: 6px;
  strong {
    font-family: ${(p) => p.theme.font.display};
    font-size: 1.05rem;
  }
  span {
    font-size: ${(p) => p.theme.fontSize.small};
    color: ${(p) => p.theme.color.fgMuted};
  }
`
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
const Small = styled.p`
  font-size: ${(p) => p.theme.fontSize.small};
  color: ${(p) => p.theme.color.fgMuted};
  text-align: center;
  margin-top: 22px;
  a {
    color: ${(p) => p.theme.color.accent};
    font-weight: 600;
  }
`

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('atleta')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [position, setPosition] = useState('')
  const [selected, setSelected] = useState<SportId[]>(['basket'])

  function toggleSport(id: SportId) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    register({
      name: name || (role === 'dirigente' ? 'Nuovo Dirigente' : 'Nuovo Atleta'),
      email: email || 'nuovo@convocati.it',
      role,
      city: city || 'Italia',
      sports: selected.length ? selected : ['basket'],
      position: role === 'atleta' ? position : undefined,
    })
    // subito dopo la registrazione si sceglie il piano (gratis o Premium)
    navigate('/app/premium')
  }

  return (
    <AuthShell
      points={[
        'Gratis per atleti e dirigenti',
        'Tutti gli sport, tutte le federazioni',
        'Dal tesseramento allo sponsor',
      ]}
    >
      <Title>Crea il tuo account</Title>
      <Sub>Un profilo, tutto lo sport italiano.</Sub>

      <Form onSubmit={onSubmit}>
        <Roles>
          <RoleCard type="button" active={role === 'atleta'} onClick={() => setRole('atleta')}>
            <Icon name="user" size={18} />
            <strong>Sono un atleta</strong>
            <span>Cerco una squadra o dei compagni</span>
          </RoleCard>
          <RoleCard type="button" active={role === 'dirigente'} onClick={() => setRole('dirigente')}>
            <Icon name="building" size={18} />
            <strong>Sono un dirigente</strong>
            <span>Gestisco una società / A.S.D.</span>
          </RoleCard>
        </Roles>

        <Field label="Nome e cognome" htmlFor="name">
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mario Rossi" />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@email.it" />
          </Field>
          <Field label="Città" htmlFor="city">
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Milano" />
          </Field>
        </div>

        {role === 'atleta' && (
          <Field label="Ruolo (facoltativo)" htmlFor="pos" hint="Es. Playmaker, Attaccante, Schiacciatore…">
            <Input id="pos" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Il tuo ruolo in campo" />
          </Field>
        )}

        <Field label={role === 'dirigente' ? 'Sport che gestisci' : 'Sport che pratichi'}>
          <Chips>
            {sports.map((s) => (
              <ChipButton
                key={s.id}
                type="button"
                active={selected.includes(s.id)}
                accent={sportColor(s.id)}
                onClick={() => toggleSport(s.id)}
              >
                {s.glyph} {s.name}
              </ChipButton>
            ))}
          </Chips>
        </Field>

        <Button type="submit" variant="energy" size="lg" full>
          Crea account <Icon name="arrow-right" size={18} />
        </Button>
      </Form>

      <Small>
        Hai già un account? <Link to="/accedi">Accedi</Link>
      </Small>
    </AuthShell>
  )
}
