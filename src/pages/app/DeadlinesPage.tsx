import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import {
  Badge,
  Button,
  Card,
  ChipButton,
  Grid,
  Icon,
  Muted,
  PageHeader,
  Row,
} from '../../components/ui'
import { StatCard } from '../../components/domain/common'
import { PremiumGate, UpsellCard } from '../../components/domain/Premium'
import {
  seedDeadlines,
  deadlineStatus,
  daysTo,
  deadlineKindMeta,
} from '../../data/deadlines'
import type { DeadlineKind } from '../../data/types'

// Scadenzario — il motivo per cui le ASD pagano un gestionale (Golee, AssoFacile):
// certificato medico scaduto = atleta non assicurato. Qui è integrato con squadre e società.

const DlRow = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  .ic {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    color: ${(p) => p.theme.color.accent};
    background: ${(p) => p.theme.color.accentSoft};
  }
  .tx {
    flex: 1;
    min-width: 240px;
    .sub {
      color: ${(p) => p.theme.color.fgMuted};
      font-size: ${(p) => p.theme.fontSize.small};
      margin-top: 2px;
    }
  }
  .due {
    text-align: right;
    .date {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .days {
      font-size: ${(p) => p.theme.fontSize.micro};
      color: ${(p) => p.theme.color.fgMuted};
    }
  }
`

type KindFilter = 'tutte' | DeadlineKind
const kinds: { id: KindFilter; label: string }[] = [
  { id: 'tutte', label: 'Tutte' },
  { id: 'certificato', label: 'Certificati medici' },
  { id: 'affiliazione', label: 'Affiliazioni' },
  { id: 'quota', label: 'Quote' },
  { id: 'assicurazione', label: 'Assicurazioni' },
  { id: 'rendiconto', label: 'Rendiconti' },
]

const statusTone = { scaduta: 'danger', 'in scadenza': 'warning', ok: 'success' } as const

export function DeadlinesPage() {
  const [kind, setKind] = useState<KindFilter>('tutte')

  const items = useMemo(() => {
    const all = [...seedDeadlines].sort((a, b) => a.due.localeCompare(b.due))
    return kind === 'tutte' ? all : all.filter((d) => d.kind === kind)
  }, [kind])

  const expired = seedDeadlines.filter((d) => deadlineStatus(d.due) === 'scaduta').length
  const soon = seedDeadlines.filter((d) => deadlineStatus(d.due) === 'in scadenza').length

  return (
    <div>
      <PageHeader>
        <div>
          <h1>Scadenze & documenti</h1>
          <Muted>
            Certificati medici, affiliazioni, assicurazioni, quote e rendiconti delle tue
            squadre e società — tutto in un posto solo, prima che scada.
          </Muted>
        </div>
      </PageHeader>

      <Grid min="200px" gap={4} style={{ marginBottom: 24 }}>
        <StatCard
          label="Scadute"
          value={expired}
          icon="bell"
          accent="#ff5d6c"
          hint="Da sistemare subito"
        />
        <StatCard
          label="Entro 30 giorni"
          value={soon}
          icon="clock"
          accent="#ffbe4d"
        />
        <StatCard
          label="Sotto controllo"
          value={seedDeadlines.length - expired - soon}
          icon="check"
          accent="#37d17a"
        />
      </Grid>

      <Row gap={2} wrap style={{ marginBottom: 18 }}>
        {kinds.map((k) => (
          <ChipButton
            key={k.id}
            type="button"
            active={kind === k.id}
            onClick={() => setKind(k.id)}
          >
            {k.label}
          </ChipButton>
        ))}
      </Row>

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((d) => {
          const st = deadlineStatus(d.due)
          const days = daysTo(d.due)
          const meta = deadlineKindMeta[d.kind]
          return (
            <DlRow key={d.id} pad={5}>
              <span className="ic">
                <Icon name={meta.icon} size={18} />
              </span>
              <div className="tx">
                <strong>{d.label}</strong>
                <div className="sub">
                  {meta.label} · {d.entity}
                  {d.hint ? ` — ${d.hint}` : ''}
                </div>
              </div>
              <div className="due">
                <div className="date">{new Date(d.due).toLocaleDateString('it-IT')}</div>
                <div className="days">
                  {days < 0 ? `${-days} gg fa` : days === 0 ? 'oggi' : `tra ${days} gg`}
                </div>
              </div>
              <Badge tone={statusTone[st]}>{st}</Badge>
            </DlRow>
          )
        })}
      </div>

      <div style={{ display: 'grid', gap: 16, marginTop: 28 }}>
        <PremiumGate
          title="Avvisi automatici 30, 15 e 3 giorni prima"
          hint="Con Premium ogni scadenza manda email + notifica a te e al diretto interessato (l'atleta col certificato in scadenza riceve il promemoria da solo). Più l'export PDF per il consiglio direttivo."
        >
          <Card pad={5}>
            <Row justify="space-between" wrap gap={3}>
              <div>
                <strong>Avvisi automatici</strong>
                <Muted style={{ display: 'block', marginTop: 4 }}>
                  Email + push a −30, −15 e −3 giorni · promemoria diretto all’atleta
                </Muted>
              </div>
              <Badge tone="success">Attivi</Badge>
            </Row>
            <Row gap={3} style={{ marginTop: 16 }} wrap>
              <Button variant="secondary" size="sm">
                <Icon name="file" size={14} /> Esporta PDF per il direttivo
              </Button>
              <Button variant="ghost" size="sm">
                Storico avvisi inviati
              </Button>
            </Row>
          </Card>
        </PremiumGate>
        <UpsellCard text="Il certificato scaduto te lo diciamo noi, prima che diventi un problema: avvisi automatici su ogni scadenza." />
      </div>
    </div>
  )
}
