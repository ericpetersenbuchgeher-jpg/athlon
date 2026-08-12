import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import {
  Badge,
  Button,
  Card,
  Grid,
  Icon,
  Muted,
  PageHeader,
  Row,
} from '../../components/ui'
import { StatCard } from '../../components/domain/common'
import { PremiumGate, UpsellCard } from '../../components/domain/Premium'
import { seedEvents, eventKindMeta } from '../../data/events'
import { teamById } from '../../data/teams'
import type { RsvpStatus } from '../../data/types'

// Calendario & convocazioni — il cuore delle app di team management (Spond, Heja):
// eventi, risposta alla convocazione, presenze. Demo: RSVP in stato locale.

const EventRow = styled(Card)`
  display: flex;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
`
const DateBox = styled.div<{ accent: string }>`
  flex: 0 0 auto;
  width: 62px;
  text-align: center;
  border-radius: ${(p) => p.theme.radius.sm};
  border: 1px solid ${(p) => p.accent}44;
  background: ${(p) => p.accent}14;
  padding: 8px 0 10px;
  .d {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 800;
    font-size: 1.5rem;
    line-height: 1.1;
  }
  .m {
    font-size: ${(p) => p.theme.fontSize.micro};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${(p) => p.theme.color.fgMuted};
  }
`
const EvBody = styled.div`
  flex: 1;
  min-width: 240px;
  .meta {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
    margin-top: 3px;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
`
const Rsvp = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']

export function CalendarPage() {
  // demo: le risposte vivono in memoria di pagina
  const [rsvps, setRsvps] = useState<Record<string, RsvpStatus>>(
    Object.fromEntries(seedEvents.map((e) => [e.id, e.myRsvp])),
  )

  const events = useMemo(
    () => [...seedEvents].sort((a, b) => a.date.localeCompare(b.date)),
    [],
  )

  const confirmedCount = Object.values(rsvps).filter((r) => r === 'presente').length
  const next = events[0]

  const reply = (id: string, r: RsvpStatus) => setRsvps((cur) => ({ ...cur, [id]: r }))

  return (
    <div>
      <PageHeader>
        <div>
          <h1>Calendario & convocazioni</h1>
          <Muted>
            Allenamenti, partite e riunioni delle tue squadre. Rispondi alla convocazione
            con un tap: il mister sa subito su chi contare.
          </Muted>
        </div>
      </PageHeader>

      <Grid min="200px" gap={4} style={{ marginBottom: 24 }}>
        <StatCard
          label="Prossimo impegno"
          value={next ? `${Number(next.date.slice(8, 10))} ${months[Number(next.date.slice(5, 7)) - 1]}` : '—'}
          icon="calendar"
          accent="#4f83ff"
          hint={next?.title}
        />
        <StatCard
          label="Eventi in programma"
          value={events.length}
          icon="clock"
          accent="#c8ff4d"
        />
        <StatCard
          label="Le tue conferme"
          value={`${confirmedCount}/${events.length}`}
          icon="check"
          accent="#37d17a"
          hint="Rispondi a tutte le convocazioni"
        />
      </Grid>

      <div style={{ display: 'grid', gap: 14 }}>
        {events.map((ev) => {
          const meta = eventKindMeta[ev.kind]
          const mine = rsvps[ev.id]
          const team = teamById(ev.teamId)
          return (
            <EventRow key={ev.id} pad={5}>
              <DateBox accent={meta.accent}>
                <div className="d">{Number(ev.date.slice(8, 10))}</div>
                <div className="m">{months[Number(ev.date.slice(5, 7)) - 1]}</div>
              </DateBox>
              <EvBody>
                <Row gap={2} wrap>
                  <strong>{ev.title}</strong>
                  <Badge tone={ev.kind === 'partita' ? 'energy' : ev.kind === 'riunione' ? 'volt' : 'accent'}>
                    {meta.label}
                  </Badge>
                </Row>
                <div className="meta">
                  <Icon name="clock" size={13} /> {ev.time}
                  <span>·</span>
                  <Icon name="pin" size={13} /> {ev.place}
                  {ev.opponent && (
                    <>
                      <span>·</span> vs <strong style={{ color: '#eef1f7' }}>{ev.opponent}</strong>
                    </>
                  )}
                  {team && (
                    <>
                      <span>·</span> {team.name}
                    </>
                  )}
                </div>
                <div className="meta">
                  <Icon name="users" size={13} /> {ev.confirmed}/{ev.called} confermati
                </div>
              </EvBody>
              <Rsvp role="group" aria-label={`Rispondi alla convocazione: ${ev.title}`}>
                <Button
                  size="sm"
                  variant={mine === 'presente' ? 'primary' : 'secondary'}
                  onClick={() => reply(ev.id, 'presente')}
                >
                  <Icon name="check" size={14} /> Ci sono
                </Button>
                <Button
                  size="sm"
                  variant={mine === 'assente' ? 'energy' : 'ghost'}
                  onClick={() => reply(ev.id, 'assente')}
                >
                  Non ci sono
                </Button>
              </Rsvp>
            </EventRow>
          )
        })}
      </div>

      <div style={{ display: 'grid', gap: 16, marginTop: 28 }}>
        <PremiumGate
          title="Promemoria automatici e statistiche presenze"
          hint="Con Premium chi non risponde riceve un sollecito automatico e vedi la percentuale presenze di ogni compagno, come su Spond — ma in italiano e con la burocrazia inclusa."
        >
          <Card pad={5}>
            <Row justify="space-between" wrap gap={3}>
              <div>
                <strong>Promemoria automatici</strong>
                <Muted style={{ display: 'block', marginTop: 4 }}>
                  Sollecito a chi non risponde entro 48h · riepilogo presenze del mese
                </Muted>
              </div>
              <Badge tone="success">Attivi</Badge>
            </Row>
            <Row gap={4} wrap style={{ marginTop: 16 }}>
              <div>
                <strong style={{ fontSize: '1.4rem' }}>92%</strong>
                <Muted style={{ display: 'block' }}>presenze squadra</Muted>
              </div>
              <div>
                <strong style={{ fontSize: '1.4rem' }}>3</strong>
                <Muted style={{ display: 'block' }}>solleciti inviati</Muted>
              </div>
              <div>
                <strong style={{ fontSize: '1.4rem' }}>1º</strong>
                <Muted style={{ display: 'block' }}>sei il più presente 💪</Muted>
              </div>
            </Row>
          </Card>
        </PremiumGate>
        <UpsellCard text="Promemoria automatici a chi non risponde, statistiche presenze e calendario per tutte le tue squadre." />
      </div>
    </div>
  )
}
