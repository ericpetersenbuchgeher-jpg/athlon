import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { AuthShell } from './AuthShell'
import { Button, Field, Input, Divider, Icon } from '../../components/ui'
import { useAuth } from '../../auth/AuthContext'

const Title = styled.h1`
  font-size: clamp(1.9rem, 1.4rem + 1.6vw, 2.5rem);
  margin-bottom: 8px;
`
const Sub = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  margin-bottom: 28px;
`
const Form = styled.form`
  display: grid;
  gap: 16px;
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
const Or = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${(p) => p.theme.color.fgFaint};
  font-size: ${(p) => p.theme.fontSize.micro};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 22px 0;
  hr {
    flex: 1;
  }
`
const DemoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

export function LoginPage() {
  const { login, demoLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/app'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    login(email || 'atleta@convocati.it')
    navigate(from, { replace: true })
  }

  return (
    <AuthShell>
      <Title>Bentornato 👋</Title>
      <Sub>Accedi per continuare sul tuo profilo Athlon.</Sub>

      <Form onSubmit={onSubmit}>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="mario.rossi@email.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" full>
          Accedi <Icon name="arrow-right" size={18} />
        </Button>
      </Form>

      <Or>
        <Divider as="hr" />
        oppure entra in demo
        <Divider as="hr" />
      </Or>
      <DemoRow>
        <Button variant="secondary" onClick={() => { demoLogin('atleta'); navigate('/app') }}>
          <Icon name="user" size={16} /> Come atleta
        </Button>
        <Button variant="secondary" onClick={() => { demoLogin('dirigente'); navigate('/app') }}>
          <Icon name="building" size={16} /> Come dirigente
        </Button>
      </DemoRow>

      <Small>
        Non hai un account? <Link to="/registrati">Registrati gratis</Link>
      </Small>
    </AuthShell>
  )
}
