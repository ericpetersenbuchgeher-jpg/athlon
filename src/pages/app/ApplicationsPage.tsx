import styled from '@emotion/styled'
import { useState } from 'react'
import {
  Card,
  Badge,
  ButtonLink,
  Icon,
  ChipButton,
  Avatar,
  Stack,
  Row,
  Grid,
  Muted,
  PageHeader,
  sportColor,
  applicationStatusTone,
} from '../../components/ui'
import { StatCard, EmptyState } from '../../components/domain/common'
import { useAuth } from '../../auth/AuthContext'
import { teamById } from '../../data/teams'
import { sportById } from '../../data/sports'
import type { ApplicationStatus } from '../../data/types'

type Filter = 'tutte' | ApplicationStatus

const FILTERS: { key: Filter; label: string; accent: string }[] = [
  { key: 'tutte', label: 'Tutte', accent: '#4f83ff' },
  { key: 'inviata', label: 'Inviata', accent: '#4f83ff' },
  { key: 'in valutazione', label: 'In valutazione', accent: '#ffbe4d' },
  { key: 'accettata', label: 'Accettata', accent: '#3ddc84' },
  { key: 'rifiutata', label: 'Rifiutata', accent: '#ff5d6c' },
]

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0 24px;
`
const Head = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`
const Name = styled.h3`
  font-size: ${(p) => p.theme.fontSize.lg};
  line-height: 1.15;
`
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  margin-top: 3px;
`
const Message = styled(Muted)`
  border-left: 2px solid ${(p) => p.theme.color.line};
  padding-left: 12px;
  margin: 14px 0 16px;
  font-size: ${(p) => p.theme.fontSize.body};
  line-height: 1.5;
`
const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  border-top: 1px solid ${(p) => p.theme.color.line};
  padding-top: 14px;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
`

export function ApplicationsPage() {
  const { applications } = useAuth()
  const [filter, setFilter] = useState<Filter>('tutte')

  const countFor = (key: Filter) =>
    key === 'tutte' ? applications.length : applications.filter((a) => a.status === key).length

  const filtered =
    filter === 'tutte' ? applications : applications.filter((a) => a.status === filter)

  return (
    <div>
      <PageHeader>
        <div>
          <h1>Le mie candidature</h1>
          <Muted style={{ marginTop: 6 }}>
            Tieni traccia delle richieste inviate alle squadre e del loro stato.
          </Muted>
        </div>
        <ButtonLink to="/app/squadre" variant="primary">
          <Icon name="search" size={16} /> Trova squadre
        </ButtonLink>
      </PageHeader>

      <Grid min="165px" gap={4}>
        <StatCard label="Candidature totali" value={applications.length} icon="send" accent="#4f83ff" />
        <StatCard
          label="In valutazione"
          value={countFor('in valutazione')}
          icon="calendar"
          accent="#ffbe4d"
        />
        <StatCard label="Accettate" value={countFor('accettata')} icon="check" accent="#3ddc84" />
        <StatCard label="Rifiutate" value={countFor('rifiutata')} icon="close" accent="#ff5d6c" />
      </Grid>

      <FilterBar style={{ marginTop: 24 }}>
        {FILTERS.map((f) => (
          <ChipButton
            key={f.key}
            type="button"
            active={filter === f.key}
            accent={f.accent}
            onClick={() => setFilter(f.key)}
          >
            {f.label} ({countFor(f.key)})
          </ChipButton>
        ))}
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon="send" title="Nessuna candidatura">
          {filter === 'tutte'
            ? 'Non hai ancora inviato candidature. Trova una squadra della tua zona e proponi la tua disponibilità.'
            : 'Nessuna candidatura con questo stato al momento. Prova a cambiare filtro o candidati a una nuova squadra.'}
          <div style={{ marginTop: 18 }}>
            <ButtonLink to="/app/squadre" variant="primary">
              <Icon name="search" size={16} /> Esplora le squadre
            </ButtonLink>
          </div>
        </EmptyState>
      ) : (
        <Stack gap={3}>
          {filtered.map((app) => {
            const team = teamById(app.teamId)
            const sport = team ? sportById(team.sport) : undefined
            const accent = team ? sportColor(team.sport) : '#4f83ff'
            return (
              <Card key={app.id} pad={5}>
                <Head>
                  <Avatar accent={accent} size={46}>
                    {sport?.glyph ?? '🏅'}
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <Name>{team?.name ?? app.teamId}</Name>
                    <Meta>
                      {sport && <span>{sport.name}</span>}
                      {sport && team && <span>·</span>}
                      {team && (
                        <span>
                          <Icon name="pin" size={13} /> {team.city}
                        </span>
                      )}
                    </Meta>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <Badge tone={applicationStatusTone[app.status]}>{app.status}</Badge>
                  </div>
                </Head>

                <Row gap={2} wrap style={{ marginTop: 12 }}>
                  <Badge tone="neutral">Ruolo: {app.role}</Badge>
                  {team?.federationId && <Badge tone="accent">{team.federationId}</Badge>}
                </Row>

                <Message>“{app.message}”</Message>

                <Foot>
                  <span>
                    <Icon name="calendar" size={14} /> Inviata il{' '}
                    {new Date(app.date).toLocaleDateString('it-IT')}
                  </span>
                  <ButtonLink to={`/app/squadre/${app.teamId}`} variant="ghost" size="sm">
                    Apri squadra <Icon name="arrow-right" size={15} />
                  </ButtonLink>
                </Foot>
              </Card>
            )
          })}
        </Stack>
      )}
    </div>
  )
}
