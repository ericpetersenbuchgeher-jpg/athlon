import styled from '@emotion/styled'
import { useState } from 'react'
import {
  Button,
  ButtonLink,
  Card,
  Panel,
  Badge,
  ChipButton,
  Field,
  Input,
  Select,
  Icon,
  Row,
  Stack,
  Grid,
  Divider,
  Eyebrow,
  Muted,
  PageHeader,
  SportChip,
  sportColor,
} from '../../components/ui'
import { InfoRow, EmptyState } from '../../components/domain/common'
import { sports, federations, federationById } from '../../data/sports'
import type { SportId } from '../../data/types'
import { useAuth } from '../../auth/AuthContext'

const STEPS = ['Anagrafica', 'Sport & Ente', 'Documenti & Statuto', 'Riepilogo'] as const

// The bureaucratic adempimenti a founder can hand off to Vivaio's guided flow.
const DOC_OPTIONS: { id: string; label: string; note: string }[] = [
  { id: 'modello', label: 'Userò il modello guidato di statuto di Vivaio', note: 'Statuto conforme al Codice del Terzo Settore' },
  { id: 'atto', label: 'Atto costitutivo firmato dai soci fondatori', note: 'Minimo 3 soci, verbale di assemblea' },
  { id: 'cf', label: 'Richiesta codice fiscale (Agenzia delle Entrate)', note: 'Modello AA5/6, gratuito' },
  { id: 'runts', label: 'Iscrizione al RUNTS', note: 'Registro Unico Nazionale del Terzo Settore' },
  { id: 'affiliazione', label: "Affiliazione a federazione / ente di promozione", note: 'Abilita il tesseramento atleti' },
  { id: 'assicurazione', label: 'Assicurazione tesserati (RC e infortuni)', note: 'Obbligatoria per l’attività sportiva' },
]

const Stepper = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  margin: 0 0 ${(p) => p.theme.space(6)};
  padding: 0;
`
const StepItem = styled.li<{ state: 'done' | 'active' | 'todo' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 19px;
    left: calc(-50% + 20px);
    right: calc(50% + 20px);
    height: 2px;
    border-radius: 2px;
    background: ${(p) =>
      p.state === 'todo' ? p.theme.color.line : p.theme.color.accent};
  }
  &:first-of-type::before {
    display: none;
  }
`
const StepDot = styled.span<{ state: 'done' | 'active' | 'todo' }>`
  position: relative;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-family: ${(p) => p.theme.font.display};
  font-weight: 800;
  font-size: 0.95rem;
  border: 1px solid
    ${(p) =>
      p.state === 'todo' ? p.theme.color.lineStrong : 'transparent'};
  color: ${(p) => (p.state === 'todo' ? p.theme.color.fgMuted : '#fff')};
  background: ${(p) =>
    p.state === 'active'
      ? p.theme.color.energy
      : p.state === 'done'
        ? p.theme.color.accent
        : p.theme.color.surface};
  box-shadow: ${(p) => (p.state === 'active' ? p.theme.shadow.glowEnergy : 'none')};
  transition: background 0.2s, box-shadow 0.2s;
`
const StepLabel = styled.span<{ state: 'done' | 'active' | 'todo' }>`
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: ${(p) => (p.state === 'active' ? 700 : 500)};
  color: ${(p) =>
    p.state === 'todo' ? p.theme.color.fgMuted : p.theme.color.fg};

  @media (max-width: 560px) {
    font-size: ${(p) => p.theme.fontSize.micro};
  }
`
const Lead = styled.div`
  margin-bottom: ${(p) => p.theme.space(5)};
  h2 {
    font-size: ${(p) => p.theme.fontSize.xl};
    margin-bottom: 6px;
  }
  p {
    color: ${(p) => p.theme.color.fgMuted};
    max-width: 62ch;
  }
`
const SuccessMark = styled.span`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  color: ${(p) => p.theme.color.success};
  background: ${(p) => p.theme.color.successSoft};
  border: 1px solid ${(p) => p.theme.color.success}55;
`

export function CreateAssociationPage() {
  const { user } = useAuth()

  const [step, setStep] = useState<number>(0)
  const [created, setCreated] = useState(false)

  // Step 0 — Anagrafica
  const [name, setName] = useState('')
  const [city, setCity] = useState(user?.city ?? '')
  const [legalRep, setLegalRep] = useState(user?.name ?? '')
  const [taxCode, setTaxCode] = useState('')

  // Step 1 — Sport & Ente
  const [selectedSports, setSelectedSports] = useState<SportId[]>([])
  const [enteId, setEnteId] = useState('')

  // Step 2 — Documenti & Statuto
  const [docs, setDocs] = useState<Record<string, boolean>>({ modello: true })

  const toggleSport = (id: SportId) =>
    setSelectedSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  const toggleDoc = (id: string) =>
    setDocs((prev) => ({ ...prev, [id]: !prev[id] }))

  const selectedDocs = DOC_OPTIONS.filter((d) => docs[d.id])
  const ente = enteId ? federationById(enteId) : undefined

  const canProceed =
    step === 0
      ? name.trim() !== '' && city.trim() !== '' && legalRep.trim() !== ''
      : step === 1
        ? selectedSports.length > 0 && enteId !== ''
        : true

  const stateOf = (i: number): 'done' | 'active' | 'todo' =>
    i < step ? 'done' : i === step ? 'active' : 'todo'

  if (created) {
    return (
      <div>
        <PageHeader>
          <div>
            <Eyebrow tone="energy">Nuova A.S.D.</Eyebrow>
            <h1>Fonda la tua società</h1>
          </div>
        </PageHeader>

        <Panel pad={6}>
          <Row gap={4} align="flex-start" wrap>
            <SuccessMark>
              <Icon name="check" size={26} />
            </SuccessMark>
            <Stack gap={3} style={{ flex: 1, minWidth: 260 }}>
              <div>
                <Eyebrow tone="accent">Fatto</Eyebrow>
                <h2 style={{ margin: '6px 0' }}>Società in creazione!</h2>
                <Muted>
                  Ti guideremo nei prossimi passi (demo). Prepareremo lo statuto, il
                  fascicolo per il codice fiscale e la pratica di affiliazione a{' '}
                  {ente ? ente.id : 'l’ente scelto'} per{' '}
                  <strong>{name || 'la tua A.S.D.'}</strong>.
                </Muted>
              </div>
              <Row gap={2} wrap>
                <Badge tone="accent">
                  <Icon name="building" size={13} /> {name || 'A.S.D.'}
                </Badge>
                <Badge tone="neutral">
                  <Icon name="pin" size={13} /> {city || '—'}
                </Badge>
                <Badge tone="warning">In bozza</Badge>
              </Row>
              <Row gap={2} wrap style={{ marginTop: 4 }}>
                <ButtonLink to="/app/societa" variant="primary">
                  Vai alle società <Icon name="arrow-right" size={16} />
                </ButtonLink>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCreated(false)
                    setStep(0)
                  }}
                >
                  Crea un'altra società
                </Button>
              </Row>
            </Stack>
          </Row>
        </Panel>
      </div>
    )
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Eyebrow tone="energy">Nuova A.S.D.</Eyebrow>
          <h1>Fonda la tua società</h1>
          <Muted style={{ marginTop: 8 }}>
            Un percorso guidato in 4 passi per costituire la tua Associazione
            Sportiva Dilettantistica.
          </Muted>
        </div>
        <Badge tone="accent">
          Passo {step + 1} di {STEPS.length}
        </Badge>
      </PageHeader>

      <Stepper>
        {STEPS.map((label, i) => {
          const st = stateOf(i)
          return (
            <StepItem key={label} state={st}>
              <StepDot state={st}>
                {st === 'done' ? <Icon name="check" size={18} /> : i + 1}
              </StepDot>
              <StepLabel state={st}>{label}</StepLabel>
            </StepItem>
          )
        })}
      </Stepper>

      <Card pad={6}>
        {step === 0 && (
          <div>
            <Lead>
              <h2>Anagrafica dell'associazione</h2>
              <p>
                I dati identificativi dell'A.S.D. così come compariranno su statuto,
                atto costitutivo e tesseramenti.
              </p>
            </Lead>
            <Grid min="240px" gap={4}>
              <Field
                label="Nome A.S.D."
                htmlFor="asd-name"
                hint="La dicitura A.S.D. va inclusa nella denominazione"
              >
                <Input
                  id="asd-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="es. A.S.D. Aurora Basket"
                />
              </Field>
              <Field label="Città" htmlFor="asd-city">
                <Input
                  id="asd-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="es. Bologna"
                />
              </Field>
              <Field
                label="Rappresentante legale"
                htmlFor="asd-rep"
                hint="Il presidente che sottoscrive lo statuto"
              >
                <Input
                  id="asd-rep"
                  value={legalRep}
                  onChange={(e) => setLegalRep(e.target.value)}
                  placeholder="Nome e cognome"
                />
              </Field>
              <Field
                label="Codice fiscale A.S.D."
                htmlFor="asd-cf"
                hint="Rilasciato dall'Agenzia delle Entrate (puoi aggiungerlo dopo)"
              >
                <Input
                  id="asd-cf"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value.toUpperCase())}
                  placeholder="es. 97XXXXXX01F205"
                />
              </Field>
            </Grid>
          </div>
        )}

        {step === 1 && (
          <div>
            <Lead>
              <h2>Discipline ed ente di affiliazione</h2>
              <p>
                Scegli gli sport praticati e l'ente o la federazione a cui affiliare
                l'A.S.D.: è ciò che abilita il tesseramento degli atleti.
              </p>
            </Lead>
            <Stack gap={5}>
              <Field
                label="Discipline sportive"
                hint="Puoi selezionarne più di una"
              >
                <Row gap={2} wrap>
                  {sports.map((s) => (
                    <ChipButton
                      key={s.id}
                      type="button"
                      active={selectedSports.includes(s.id)}
                      accent={sportColor(s.id)}
                      onClick={() => toggleSport(s.id)}
                    >
                      {s.glyph} {s.name}
                    </ChipButton>
                  ))}
                </Row>
              </Field>

              <Field
                label="Ente / Federazione"
                htmlFor="asd-ente"
                hint="Le federazioni (FIP, FIGC, FIPAV…) per l'agonismo, gli enti di promozione (UISP, CSI, AICS) per l'attività di base"
              >
                <Select
                  id="asd-ente"
                  value={enteId}
                  onChange={(e) => setEnteId(e.target.value)}
                >
                  <option value="">Seleziona un ente o una federazione…</option>
                  <optgroup label="Federazioni">
                    {federations
                      .filter((f) => f.kind === 'federazione')
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.id} — {f.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Enti di promozione">
                    {federations
                      .filter((f) => f.kind === 'ente di promozione')
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.id} — {f.name}
                        </option>
                      ))}
                  </optgroup>
                </Select>
              </Field>
            </Stack>
          </div>
        )}

        {step === 2 && (
          <div>
            <Lead>
              <h2>Documenti & Statuto</h2>
              <p>
                Gli adempimenti burocratici per far nascere l'A.S.D. Vivaio ti
                accompagna in ognuno di questi passaggi.
              </p>
            </Lead>
            <Stack gap={5}>
              <Panel pad={5}>
                <Row gap={3} align="flex-start" wrap>
                  <span style={{ color: '#4f83ff', marginTop: 2 }}>
                    <Icon name="file" size={20} />
                  </span>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <strong>Statuto, atto costitutivo e RUNTS</strong>
                    <Muted style={{ marginTop: 6 }}>
                      Per costituire un'A.S.D. servono un <em>atto costitutivo</em> e
                      uno <em>statuto</em> conformi al Codice del Terzo Settore,
                      registrati all'Agenzia delle Entrate. Con l'iscrizione al{' '}
                      <strong>RUNTS</strong> (Registro Unico Nazionale del Terzo
                      Settore) l'associazione ottiene personalità giuridica e i
                      benefici fiscali. Vivaio genera lo statuto dal modello
                      guidato e tiene traccia delle scadenze.
                    </Muted>
                  </div>
                </Row>
              </Panel>

              <Field
                label="Adempimenti"
                hint="Seleziona quelli che vuoi gestire con Vivaio"
              >
                <Row gap={2} wrap>
                  {DOC_OPTIONS.map((d) => (
                    <ChipButton
                      key={d.id}
                      type="button"
                      active={!!docs[d.id]}
                      onClick={() => toggleDoc(d.id)}
                    >
                      {docs[d.id] ? (
                        <Icon name="check" size={14} />
                      ) : (
                        <Icon name="plus" size={14} />
                      )}
                      {d.label}
                    </ChipButton>
                  ))}
                </Row>
              </Field>
            </Stack>
          </div>
        )}

        {step === 3 && (
          <div>
            <Lead>
              <h2>Riepilogo</h2>
              <p>
                Controlla i dati inseriti. Alla conferma prepareremo il fascicolo
                della tua A.S.D. (demo).
              </p>
            </Lead>
            <Stack gap={5}>
              <Panel pad={5}>
                <InfoRow label="Nome A.S.D.">{name || '—'}</InfoRow>
                <InfoRow label="Città">{city || '—'}</InfoRow>
                <InfoRow label="Rappresentante legale">{legalRep || '—'}</InfoRow>
                <InfoRow label="Codice fiscale">{taxCode || 'Da richiedere'}</InfoRow>
                <InfoRow label="Ente / Federazione">
                  {ente ? `${ente.id} — ${ente.name}` : '—'}
                </InfoRow>
              </Panel>

              <div>
                <Muted style={{ fontWeight: 600, marginBottom: 10 }}>
                  Discipline sportive
                </Muted>
                <Row gap={3} wrap>
                  {selectedSports.map((s) => (
                    <SportChip key={s} sport={s} />
                  ))}
                  {selectedSports.length === 0 && (
                    <Badge tone="neutral">Nessuna disciplina</Badge>
                  )}
                </Row>
              </div>

              <div>
                <Muted style={{ fontWeight: 600, marginBottom: 10 }}>
                  Adempimenti selezionati
                </Muted>
                {selectedDocs.length > 0 ? (
                  <Stack gap={2}>
                    {selectedDocs.map((d) => (
                      <Row key={d.id} gap={2} align="flex-start">
                        <span style={{ color: '#3ddc84', marginTop: 2 }}>
                          <Icon name="check" size={16} />
                        </span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{d.label}</div>
                          <Muted style={{ fontSize: '0.8rem' }}>{d.note}</Muted>
                        </div>
                      </Row>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState icon="file" title="Nessun adempimento selezionato">
                    Torna al passo Documenti & Statuto per scegliere cosa gestire con
                    Vivaio.
                  </EmptyState>
                )}
              </div>
            </Stack>
          </div>
        )}

        <Divider style={{ margin: '28px 0 20px' }} />

        <Row justify="space-between">
          <Button
            type="button"
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Indietro
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              variant="primary"
              disabled={!canProceed}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            >
              Continua <Icon name="arrow-right" size={16} />
            </Button>
          ) : (
            <Button
              type="button"
              variant="energy"
              onClick={() => setCreated(true)}
            >
              <Icon name="sparkle" size={16} /> Crea società
            </Button>
          )}
        </Row>
      </Card>
    </div>
  )
}
