import styled from '@emotion/styled'
import { Badge, Button, Card, Grid, Icon, Muted, PageHeader, Row } from '../../components/ui'
import { useAuth } from '../../auth/AuthContext'

// Piani: Gratis vs Premium (5 €/mese). Demo: l'upgrade è simulato (nessun pagamento reale).

const PlanCard = styled(Card)<{ featured?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-color: ${(p) => (p.featured ? 'rgba(200,255,77,0.4)' : p.theme.color.line)};
  background: ${(p) =>
    p.featured
      ? `radial-gradient(130% 160% at 50% 0%, rgba(200,255,77,0.1), transparent 60%), ${p.theme.color.bg2}`
      : p.theme.color.bg2};
  .price {
    font-family: ${(p) => p.theme.font.display};
    font-weight: 800;
    font-size: 2.4rem;
    letter-spacing: -0.02em;
    span {
      font-size: 1rem;
      color: ${(p) => p.theme.color.fgMuted};
      font-weight: 500;
    }
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
    li {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      font-size: ${(p) => p.theme.fontSize.body};
      color: ${(p) => p.theme.color.fg};
      .tick {
        flex: 0 0 auto;
        margin-top: 2px;
        color: ${(p) => (p.featured ? p.theme.color.volt : p.theme.color.accent)};
      }
      &.off {
        color: ${(p) => p.theme.color.fgFaint};
        .tick {
          color: ${(p) => p.theme.color.fgFaint};
        }
      }
    }
  }
`

const freeFeats = [
  { on: true, t: '1 squadra e 1 società' },
  { on: true, t: '3 candidature al mese' },
  { on: true, t: 'Calendario e convocazioni' },
  { on: true, t: 'Scadenze visibili (senza avvisi)' },
  { on: true, t: '1 proposta sponsor al mese' },
  { on: false, t: 'Avvisi automatici sulle scadenze' },
  { on: false, t: 'Statistiche presenze e profilo' },
  { on: false, t: 'Squadra in evidenza nei risultati' },
]

const proFeats = [
  { on: true, t: 'Squadre e società illimitate' },
  { on: true, t: 'Candidature illimitate' },
  { on: true, t: 'Avvisi automatici: certificati, affiliazioni, quote' },
  { on: true, t: 'Promemoria convocazioni a chi non risponde' },
  { on: true, t: 'Statistiche presenze e profilo giocatore' },
  { on: true, t: 'Proposte sponsor illimitate + in evidenza' },
  { on: true, t: 'Export PDF per il consiglio direttivo' },
  { on: true, t: 'Badge Premium sul profilo' },
]

export function PremiumPage() {
  const { plan, upgrade, downgrade } = useAuth()
  const isPro = plan === 'premium'

  return (
    <div>
      <PageHeader>
        <div>
          <h1>Il tuo piano</h1>
          <Muted>
            Gratis per giocare. Premium per non pensare più a scadenze, solleciti e burocrazia:
            meno di un caffè a settimana.
          </Muted>
        </div>
      </PageHeader>

      <Grid min="300px" gap={4}>
        <PlanCard pad={6}>
          <Row justify="space-between">
            <strong style={{ fontSize: '1.1rem' }}>Gratis</strong>
            {!isPro && <Badge tone="accent">Il tuo piano</Badge>}
          </Row>
          <div className="price">
            0 € <span>/ per sempre</span>
          </div>
          <ul>
            {freeFeats.map((f) => (
              <li key={f.t} className={f.on ? '' : 'off'}>
                <span className="tick">
                  <Icon name={f.on ? 'check' : 'lock'} size={15} />
                </span>
                {f.t}
              </li>
            ))}
          </ul>
          {isPro && (
            <Button variant="ghost" onClick={downgrade}>
              Torna al piano Gratis
            </Button>
          )}
        </PlanCard>

        <PlanCard pad={6} featured>
          <Row justify="space-between">
            <Row gap={2}>
              <Icon name="crown" size={18} style={{ color: '#c8ff4d' }} />
              <strong style={{ fontSize: '1.1rem' }}>Premium</strong>
            </Row>
            {isPro ? <Badge tone="volt">Il tuo piano</Badge> : <Badge tone="energy">Consigliato</Badge>}
          </Row>
          <div className="price">
            5 € <span>/ mese · disdici quando vuoi</span>
          </div>
          <ul>
            {proFeats.map((f) => (
              <li key={f.t}>
                <span className="tick">
                  <Icon name="check" size={15} />
                </span>
                {f.t}
              </li>
            ))}
          </ul>
          {isPro ? (
            <Muted>Premium attivo. Grazie per sostenere lo sport di base 💛</Muted>
          ) : (
            <Button variant="energy" size="lg" onClick={upgrade}>
              Attiva Premium <Icon name="arrow-right" size={16} />
            </Button>
          )}
          <Muted style={{ fontSize: '0.75rem' }}>
            Demo: l’attivazione è simulata, nessun pagamento reale. Nella versione finale:
            carta o addebito SEPA, fattura per le ASD.
          </Muted>
        </PlanCard>
      </Grid>
    </div>
  )
}
