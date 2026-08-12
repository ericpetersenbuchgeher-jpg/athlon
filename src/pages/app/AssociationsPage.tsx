import styled from '@emotion/styled'
import {
  Card,
  Badge,
  Icon,
  ButtonLink,
  ProgressBar,
  SportChip,
  Grid,
  Row,
  Stack,
  Divider,
  Muted,
  PageHeader,
  asdStatusTone,
} from '../../components/ui'
import { InfoRow } from '../../components/domain/common'
import { associations } from '../../data/associations'

const AsdCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  h3 {
    font-size: ${(p) => p.theme.fontSize.lg};
    line-height: 1.2;
  }
  .place {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
    margin-top: 4px;
  }
  .progress .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: ${(p) => p.theme.fontSize.small};
    color: ${(p) => p.theme.color.fgMuted};
  }
  .progress .pct {
    font-weight: 700;
    color: ${(p) => p.theme.color.fg};
  }
  .spacer {
    flex: 1;
  }
`

export function AssociationsPage() {
  return (
    <div>
      <PageHeader>
        <h1>Le mie società</h1>
        <ButtonLink to="/app/societa/nuova" variant="primary">
          <Icon name="plus" size={16} /> Nuova società
        </ButtonLink>
      </PageHeader>

      <Muted style={{ maxWidth: '64ch', marginBottom: 24 }}>
        Il quartier generale burocratico per i dirigenti: statuto, iscrizione al RUNTS,
        affiliazioni a federazioni ed enti di promozione, tesseramenti e rendiconto. Tieni
        ogni ASD in regola da un unico posto.
      </Muted>

      <Grid min="340px" gap={4}>
        {associations.map((a) => {
          const totalTasks = a.checklist.length
          const doneTasks = a.checklist.filter((t) => t.done).length
          const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0
          return (
            <AsdCard key={a.id} pad={5}>
              <div className="head">
                <div>
                  <h3>{a.name}</h3>
                  <div className="place">
                    {a.city} · Fondata nel {a.foundedYear}
                  </div>
                </div>
                <Badge tone={asdStatusTone[a.status]}>{a.status}</Badge>
              </div>

              <Row gap={2} wrap>
                {a.sports.map((s) => (
                  <SportChip key={s} sport={s} />
                ))}
              </Row>

              <Row gap={2} wrap>
                {a.affiliations.length ? (
                  a.affiliations.map((aff) => (
                    <Badge key={aff} tone="accent">
                      {aff}
                    </Badge>
                  ))
                ) : (
                  <Muted style={{ fontSize: '0.85rem' }}>Nessuna affiliazione</Muted>
                )}
              </Row>

              <Divider />

              <Stack gap={0}>
                <InfoRow label="Tesserati">{a.membersCount}</InfoRow>
                <InfoRow label="Saldo cassa">
                  € {a.balanceEur.toLocaleString('it-IT')}
                </InfoRow>
              </Stack>

              <div className="progress">
                <div className="label">
                  <span>Pratiche completate</span>
                  <span className="pct">{pct}%</span>
                </div>
                <ProgressBar pct={pct} />
              </div>

              <div className="spacer" />

              <ButtonLink to={`/app/societa/${a.id}`} variant="secondary" full>
                <Icon name="arrow-right" size={16} /> Gestisci
              </ButtonLink>
            </AsdCard>
          )
        })}
      </Grid>
    </div>
  )
}
