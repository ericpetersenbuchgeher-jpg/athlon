import styled from '@emotion/styled'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Card,
  Panel,
  Badge,
  Button,
  ButtonLink,
  Field,
  Textarea,
  Select,
  Icon,
  Avatar,
  Stack,
  Row,
  Eyebrow,
  Muted,
  Divider,
  sportColor,
} from '../../components/ui'
import { InfoRow } from '../../components/domain/common'
import { useAuth } from '../../auth/AuthContext'
import { teamById } from '../../data/teams'
import { sportById, federationById } from '../../data/sports'

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 600;
  margin-bottom: ${(p) => p.theme.space(6)};
  .flip {
    display: inline-flex;
    transform: rotate(180deg);
  }
  &:hover {
    color: ${(p) => p.theme.color.fg};
  }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: ${(p) => p.theme.space(6)};
  align-items: start;
  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.space(4)};
  flex-wrap: wrap;
  h1 {
    font-size: ${(p) => p.theme.fontSize.h2};
    line-height: 1.05;
    margin: 4px 0 10px;
  }
`

const Meta = styled(Row)`
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
`

const Desc = styled.p`
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.body};
  line-height: 1.6;
  max-width: 60ch;
`

const Roles = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const ApplyCard = styled(Card)`
  position: sticky;
  top: 24px;
  h2 {
    font-size: ${(p) => p.theme.fontSize.xl};
    margin: 6px 0 4px;
  }
  @media (max-width: 880px) {
    position: static;
  }
`

const Success = styled(Panel)`
  text-align: center;
  border-color: ${(p) => p.theme.color.success}55;
  background: ${(p) => p.theme.color.successSoft};
  .check {
    display: inline-grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 999px;
    background: ${(p) => p.theme.color.success}22;
    color: ${(p) => p.theme.color.success};
    margin-bottom: 12px;
  }
  h3 {
    color: ${(p) => p.theme.color.fg};
    font-size: ${(p) => p.theme.fontSize.lg};
    margin-bottom: 6px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
  }
`

const levelTone = { agonistico: 'energy', amatoriale: 'accent', giovanile: 'volt' } as const

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { applications, applyToTeam } = useAuth()
  const team = id ? teamById(id) : undefined

  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  if (!team) {
    return (
      <div>
        <BackLink to="/app/squadre">
          <span className="flip">
            <Icon name="arrow-right" size={16} />
          </span>
          Tutte le squadre
        </BackLink>
        <Card pad={6}>
          <Stack gap={4} align="flex-start">
            <Eyebrow tone="muted">Errore</Eyebrow>
            <h1 style={{ fontSize: '1.4rem' }}>Squadra non trovata</h1>
            <Muted>La squadra che cerchi non esiste o è stata rimossa.</Muted>
            <ButtonLink to="/app/squadre" variant="primary">
              <Icon name="search" size={16} /> Sfoglia le squadre
            </ButtonLink>
          </Stack>
        </Card>
      </div>
    )
  }

  const sport = sportById(team.sport)
  const accent = sportColor(team.sport)
  const fed = team.federationId ? federationById(team.federationId) : undefined
  const roleNames = team.openRoles.map((r) => r.role)
  const openTotal = team.openRoles.reduce((n, r) => n + r.count, 0)
  const selectedRole = role || roleNames[0] || ''

  const alreadyApplied = applications.some(
    (a) =>
      a.teamId === team.id &&
      (a.status === 'inviata' || a.status === 'in valutazione'),
  )
  const canApply = roleNames.length > 0
  const formDisabled = alreadyApplied || !canApply

  const handleSubmit = () => {
    if (formDisabled) return
    applyToTeam(team.id, selectedRole, message.trim())
    setSent(true)
  }

  return (
    <div>
      <BackLink to="/app/squadre">
        <span className="flip">
          <Icon name="arrow-right" size={16} />
        </span>
        Tutte le squadre
      </BackLink>

      <Layout>
        {/* LEFT — team overview */}
        <Card pad={6}>
          <Head>
            <Avatar accent={accent} size={64}>
              {sport.glyph}
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <Eyebrow tone="accent">{sport.name}</Eyebrow>
              <h1>{team.name}</h1>
              <Meta gap={2} wrap>
                <span>
                  <Icon name="pin" size={13} /> {team.city}
                </span>
                <Badge tone={levelTone[team.level]}>{team.level}</Badge>
                {team.federationId && (
                  <Badge tone="neutral">
                    <Icon name="shield" size={13} /> {team.federationId}
                  </Badge>
                )}
              </Meta>
            </div>
          </Head>

          <Divider style={{ margin: '24px 0' }} />

          <Stack gap={5}>
            <Desc>{team.description}</Desc>

            <div>
              <Eyebrow tone="energy" style={{ marginBottom: 10 }}>
                Ruoli aperti
              </Eyebrow>
              {canApply ? (
                <Roles>
                  {team.openRoles.map((r) => (
                    <Badge key={r.role} tone="accent">
                      {r.count}× {r.role}
                    </Badge>
                  ))}
                </Roles>
              ) : (
                <Muted style={{ fontSize: '0.9rem' }}>
                  Nessun ruolo aperto al momento. Il roster è al completo.
                </Muted>
              )}
            </div>

            <Panel pad={4}>
              <InfoRow label="Capitano">{team.captain}</InfoRow>
              <InfoRow label="Fondata nel">{team.foundedYear}</InfoRow>
              <InfoRow label="Tesserati">{team.membersCount}</InfoRow>
              <InfoRow label="Ruoli aperti">
                {openTotal > 0 ? `${openTotal} posti` : 'Nessuno'}
              </InfoRow>
              <InfoRow label="Federazione / Ente">
                {fed ? `${fed.name} (${fed.id})` : team.federationId ?? 'Non affiliata'}
              </InfoRow>
            </Panel>
          </Stack>
        </Card>

        {/* RIGHT — application form */}
        <ApplyCard pad={5}>
          <Eyebrow tone="energy">Unisciti alla squadra</Eyebrow>
          <h2>Candidati</h2>
          <Muted style={{ fontSize: '0.85rem', marginBottom: 18 }}>
            Invia la tua candidatura al capitano {team.captain.split(' ')[0]}. Ti
            ricontatterà per il tesseramento.
          </Muted>

          {sent ? (
            <Success pad={5}>
              <div className="check">
                <Icon name="check" size={26} />
              </div>
              <h3>Candidatura inviata!</h3>
              <p>
                La tua richiesta per {team.name} è arrivata. La trovi nella sezione
                Candidature.
              </p>
              <div style={{ marginTop: 16 }}>
                <ButtonLink to="/app/candidature" variant="secondary" size="sm" full>
                  Vai alle candidature
                </ButtonLink>
              </div>
            </Success>
          ) : (
            <Stack gap={4}>
              {alreadyApplied && (
                <Badge tone="success">
                  <Icon name="check" size={13} /> Candidatura già inviata
                </Badge>
              )}

              <Field label="Ruolo desiderato" htmlFor="role">
                <Select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={formDisabled}
                >
                  {canApply ? (
                    roleNames.map((rn) => (
                      <option key={rn} value={rn}>
                        {rn}
                      </option>
                    ))
                  ) : (
                    <option value="">Nessun ruolo disponibile</option>
                  )}
                </Select>
              </Field>

              <Field
                label="Messaggio al capitano"
                htmlFor="message"
                hint="Racconta il tuo ruolo, il livello e la tua disponibilità."
              >
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ciao, gioco da anni in questo ruolo e sono in regola con il certificato medico agonistico. Cerco un gruppo serio..."
                  disabled={formDisabled}
                />
              </Field>

              <Button variant="energy" full disabled={formDisabled} onClick={handleSubmit}>
                <Icon name="send" size={16} /> Invia candidatura
              </Button>

              {alreadyApplied && (
                <Muted style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                  Hai già una candidatura in corso per questa squadra.
                </Muted>
              )}
            </Stack>
          )}
        </ApplyCard>
      </Layout>
    </div>
  )
}
