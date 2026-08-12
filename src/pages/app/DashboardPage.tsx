import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import {
  Card,
  Badge,
  Icon,
  ButtonLink,
  Grid,
  Row,
  Stack,
  Eyebrow,
  applicationStatusTone,
} from '../../components/ui'
import { StatCard } from '../../components/domain/common'
import { TeamCard } from '../../components/domain/TeamCard'
import { useAuth } from '../../auth/AuthContext'
import { teams, teamById } from '../../data/teams'
import { associations } from '../../data/associations'

const Hero = styled(Card)`
  background:
    radial-gradient(120% 160% at 0% 0%, ${(p) => p.theme.color.accentSoft}, transparent 55%),
    radial-gradient(120% 160% at 100% 100%, ${(p) => p.theme.color.energySoft}, transparent 55%),
    ${(p) => p.theme.color.bg2};
  margin-bottom: 24px;
  h1 {
    font-size: ${(p) => p.theme.fontSize.h2};
    margin: 10px 0 8px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    max-width: 52ch;
  }
`
const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32px 0 16px;
  h2 {
    font-size: ${(p) => p.theme.fontSize.h3};
  }
  a {
    color: ${(p) => p.theme.color.accent};
    font-weight: 600;
    font-size: ${(p) => p.theme.fontSize.small};
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`
const AppRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid ${(p) => p.theme.color.line};
  &:last-child {
    border-bottom: none;
  }
`

export function DashboardPage() {
  const { user, applications } = useAuth()
  const isDirigente = user?.role === 'dirigente'

  const suggested = teams
    .filter((t) => user?.sports.includes(t.sport))
    .slice(0, 3)
  const fallback = teams.slice(0, 3)
  const list = suggested.length ? suggested : fallback

  const myAsd = associations.filter((a) => a.legalRep === user?.name || isDirigente)

  return (
    <div>
      <Hero pad={6}>
        <Eyebrow tone="energy">La tua dashboard</Eyebrow>
        <h1>Bentornato, {user?.name.split(' ')[0]} 🏅</h1>
        <p>
          {isDirigente
            ? 'Gestisci le tue società, i tesseramenti e gli sponsor. Ecco il riepilogo di oggi.'
            : 'Trova la tua prossima squadra, segui le candidature e resta pronto a scendere in campo.'}
        </p>
        <Row gap={2} wrap style={{ marginTop: 18 }}>
          <ButtonLink to="/app/squadre" variant="primary">
            <Icon name="search" size={16} /> Trova squadre
          </ButtonLink>
          {isDirigente ? (
            <ButtonLink to="/app/societa/nuova" variant="secondary">
              <Icon name="plus" size={16} /> Nuova società
            </ButtonLink>
          ) : (
            <ButtonLink to="/app/squadre/nuova" variant="secondary">
              <Icon name="plus" size={16} /> Crea la tua squadra
            </ButtonLink>
          )}
          <ButtonLink to="/app/sponsor" variant="ghost">
            <Icon name="handshake" size={16} /> Sponsor
          </ButtonLink>
        </Row>
      </Hero>

      <Grid min="200px" gap={4}>
        {isDirigente ? (
          <>
            <StatCard label="Società gestite" value={myAsd.length} icon="building" accent="#4f83ff" />
            <StatCard
              label="Tesserati totali"
              value={myAsd.reduce((n, a) => n + a.membersCount, 0)}
              icon="users"
              accent="#37d17a"
            />
            <StatCard label="Affiliazioni attive" value="3" icon="shield" accent="#ff6b3d" hint="FIP · FIPAV · UISP" />
            <StatCard label="Scadenze aperte" value="2" icon="calendar" accent="#ffbe4d" hint="Rendiconto · certificati" />
          </>
        ) : (
          <>
            <StatCard label="Candidature inviate" value={applications.length} icon="send" accent="#4f83ff" />
            <StatCard
              label="Accettate"
              value={applications.filter((a) => a.status === 'accettata').length}
              icon="check"
              accent="#37d17a"
            />
            <StatCard label="Squadre vicine" value={teams.filter((t) => t.city === user?.city).length || teams.length} icon="pin" accent="#ff6b3d" hint={user?.city} />
            <StatCard label="Sport seguiti" value={user?.sports.length ?? 0} icon="trophy" accent="#c8ff4d" />
          </>
        )}
      </Grid>

      <SectionTitle>
        <h2>{isDirigente ? 'Squadre in cerca di giocatori' : 'Squadre per te'}</h2>
        <Link to="/app/squadre">
          Vedi tutte <Icon name="arrow-right" size={14} />
        </Link>
      </SectionTitle>
      <Grid min="300px" gap={4}>
        {list.map((t) => (
          <TeamCard key={t.id} team={t} />
        ))}
      </Grid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginTop: 8 }}>
        <SectionTitle>
          <h2>{isDirigente ? 'Le tue società' : 'Le tue candidature'}</h2>
          <Link to={isDirigente ? '/app/societa' : '/app/candidature'}>
            Gestisci <Icon name="arrow-right" size={14} />
          </Link>
        </SectionTitle>

        <Card pad={5}>
          {isDirigente ? (
            <Stack gap={0}>
              {myAsd.map((a) => (
                <AppRow key={a.id}>
                  <Icon name="building" size={18} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong>{a.name}</strong>
                    <div style={{ color: '#9aa3b2', fontSize: '0.82rem' }}>
                      {a.city} · {a.membersCount} tesserati
                    </div>
                  </div>
                  <Badge tone={a.status === 'attiva' ? 'success' : a.status === 'in verifica' ? 'warning' : 'neutral'}>
                    {a.status}
                  </Badge>
                  <ButtonLink to={`/app/societa/${a.id}`} variant="ghost" size="sm">
                    Apri
                  </ButtonLink>
                </AppRow>
              ))}
            </Stack>
          ) : (
            <Stack gap={0}>
              {applications.map((a) => {
                const team = teamById(a.teamId)
                return (
                  <AppRow key={a.id}>
                    <Icon name="send" size={18} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{team?.name ?? a.teamId}</strong>
                      <div style={{ color: '#9aa3b2', fontSize: '0.82rem' }}>
                        {a.role} · {new Date(a.date).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                    <Badge tone={applicationStatusTone[a.status]}>{a.status}</Badge>
                    {team && (
                      <ButtonLink to={`/app/squadre/${team.id}`} variant="ghost" size="sm">
                        Apri
                      </ButtonLink>
                    )}
                  </AppRow>
                )
              })}
              {applications.length === 0 && (
                <Row justify="space-between">
                  <span style={{ color: '#9aa3b2' }}>Non hai ancora inviato candidature.</span>
                  <ButtonLink to="/app/squadre" variant="primary" size="sm">
                    Trova squadre
                  </ButtonLink>
                </Row>
              )}
            </Stack>
          )}
        </Card>
      </div>
    </div>
  )
}
