import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Badge,
  Button,
  ButtonLink,
  Icon,
  Field,
  Input,
  Textarea,
  Avatar,
  SportChip,
  sportColor,
  Row,
  Stack,
  Grid,
  Muted,
  Eyebrow,
  PageHeader,
} from '../../components/ui'
import { StatCard } from '../../components/domain/common'
import { PlanBadge } from '../../components/domain/Premium'
import { useAuth } from '../../auth/AuthContext'

const Name = styled.h2`
  font-size: ${(p) => p.theme.fontSize.h3};
  line-height: 1.1;
`
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  margin: 6px 0 12px;
  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
`
const SectionHead = styled.h2`
  font-size: ${(p) => p.theme.fontSize.h3};
  margin: 32px 0 16px;
`

export function ProfilePage() {
  const { user, applications, logout, plan } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [city, setCity] = useState(user?.city ?? '')
  const [position, setPosition] = useState(user?.position ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [saved, setSaved] = useState(false)

  // Route is already protected, but keep the guard for type-safety.
  if (!user) return null

  const isAtleta = user.role === 'atleta'
  const accent = user.sports[0] ? sportColor(user.sports[0]) : undefined
  const accepted = applications.filter((a) => a.status === 'accettata').length

  function touch<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setSaved(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Eyebrow>Il tuo account</Eyebrow>
          <h1>Il tuo profilo</h1>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <Icon name="logout" size={16} /> Esci
        </Button>
      </PageHeader>

      <Card pad={6}>
        <Row gap={4} align="flex-start" wrap>
          <Avatar size={72} accent={accent}>
            {user.initials}
          </Avatar>
          <div style={{ flex: 1, minWidth: 240 }}>
            <Row gap={2} align="center" wrap>
              <Name>{user.name}</Name>
              <Badge tone={isAtleta ? 'accent' : 'energy'}>
                {isAtleta ? 'Atleta' : 'Dirigente / ASD'}
              </Badge>
            </Row>
            <Meta>
              <span>
                <Icon name="pin" size={14} /> {user.city}
              </span>
              {isAtleta && user.position && <span>· {user.position}</span>}
              <span>· {user.email}</span>
            </Meta>
            {user.bio && <Muted style={{ maxWidth: '60ch' }}>{user.bio}</Muted>}
            <Row gap={3} wrap style={{ marginTop: 14 }}>
              {user.sports.map((s) => (
                <SportChip key={s} sport={s} />
              ))}
            </Row>
          </div>
        </Row>
      </Card>

      <SectionHead>Il tuo piano</SectionHead>
      <Card pad={5}>
        <Row justify="space-between" wrap gap={3}>
          <Row gap={3} align="center">
            <PlanBadge />
            <Muted>
              {plan === 'premium'
                ? 'Hai tutto sbloccato: avvisi automatici, statistiche e nessun limite.'
                : 'Piano Gratis: 1 squadra, 3 candidature/mese, scadenze senza avvisi automatici.'}
            </Muted>
          </Row>
          <ButtonLink to="/app/premium" variant={plan === 'premium' ? 'secondary' : 'energy'} size="sm">
            {plan === 'premium' ? 'Gestisci piano' : 'Passa a Premium — 5 €/mese'}
          </ButtonLink>
        </Row>
      </Card>

      <SectionHead>In sintesi</SectionHead>
      <Grid min="200px" gap={4}>
        {isAtleta ? (
          <>
            <StatCard
              label="Candidature"
              value={applications.length}
              icon="send"
              accent="#4f83ff"
            />
            <StatCard label="Accettate" value={accepted} icon="check" accent="#37d17a" />
            <StatCard
              label="Sport praticati"
              value={user.sports.length}
              icon="trophy"
              accent="#c8ff4d"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Sport gestiti"
              value={user.sports.length}
              icon="trophy"
              accent="#4f83ff"
            />
            <StatCard
              label="Candidature seguite"
              value={applications.length}
              icon="send"
              accent="#37d17a"
              hint="Convocazioni e valutazioni"
            />
            <StatCard label="Sede" value={user.city} icon="pin" accent="#ff6b3d" />
          </>
        )}
      </Grid>

      <SectionHead>Dati personali</SectionHead>
      <Card pad={6}>
        <Stack gap={4}>
          <Grid min="220px" gap={4}>
            <Field label="Nome e cognome" htmlFor="pf-name">
              <Input
                id="pf-name"
                value={name}
                onChange={(e) => touch(setName)(e.target.value)}
                placeholder="Es. Mario Rossi"
              />
            </Field>
            <Field label="Città" htmlFor="pf-city">
              <Input
                id="pf-city"
                value={city}
                onChange={(e) => touch(setCity)(e.target.value)}
                placeholder="Es. Bologna"
              />
            </Field>
            {isAtleta && (
              <Field label="Ruolo in campo" htmlFor="pf-pos" hint="Es. Playmaker, Ala, Portiere">
                <Input
                  id="pf-pos"
                  value={position}
                  onChange={(e) => touch(setPosition)(e.target.value)}
                  placeholder="Il tuo ruolo"
                />
              </Field>
            )}
          </Grid>
          <Field label="Bio" htmlFor="pf-bio" hint="Racconta la tua esperienza sportiva e cosa cerchi">
            <Textarea
              id="pf-bio"
              value={bio}
              onChange={(e) => touch(setBio)(e.target.value)}
              placeholder="Due righe su di te: livello, storia sportiva, obiettivi…"
            />
          </Field>
          <Row gap={3} wrap>
            <Button variant="primary" onClick={() => setSaved(true)}>
              <Icon name="check" size={16} /> Salva modifiche
            </Button>
            {saved && (
              <Badge tone="success">
                <Icon name="check" size={13} /> Modifiche salvate
              </Badge>
            )}
            <Muted style={{ fontSize: '0.8rem' }}>
              Demo: le modifiche restano sul dispositivo e non vengono inviate al server.
            </Muted>
          </Row>
        </Stack>
      </Card>
    </div>
  )
}
