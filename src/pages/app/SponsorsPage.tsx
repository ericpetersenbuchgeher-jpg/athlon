import { useState } from 'react'
import styled from '@emotion/styled'
import {
  Card,
  Input,
  Field,
  ChipButton,
  Grid,
  Row,
  Stack,
  Eyebrow,
  Muted,
  PageHeader,
  sportColor,
} from '../../components/ui'
import { EmptyState } from '../../components/domain/common'
import { SponsorCard } from '../../components/domain/SponsorCard'
import { sports } from '../../data/sports'
import { sponsors } from '../../data/sponsors'
import type { SportId, SponsorTier } from '../../data/types'

const Filters = styled(Card)`
  margin: 20px 0 24px;
`
const Count = styled(Muted)`
  font-size: ${(p) => p.theme.fontSize.small};
  font-weight: 600;
`

type TierFilter = 'tutti' | SponsorTier
const tiers: { id: TierFilter; label: string }[] = [
  { id: 'tutti', label: 'Tutti' },
  { id: 'local', label: 'Local' },
  { id: 'regionale', label: 'Regionale' },
  { id: 'nazionale', label: 'Nazionale' },
]

export function SponsorsPage() {
  const [query, setQuery] = useState('')
  const [activeSports, setActiveSports] = useState<SportId[]>([])
  const [tier, setTier] = useState<TierFilter>('tutti')

  const toggleSport = (id: SportId) =>
    setActiveSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  const q = query.trim().toLowerCase()
  const filtered = sponsors.filter((s) => {
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    const matchesSport =
      activeSports.length === 0 || activeSports.some((id) => s.sports.includes(id))
    const matchesTier = tier === 'tutti' || s.tier === tier
    return matchesQuery && matchesSport && matchesTier
  })

  return (
    <div>
      <PageHeader>
        <div>
          <Eyebrow tone="energy">Marketplace sponsor</Eyebrow>
          <h1>Trova sponsor</h1>
          <Muted>
            Aziende del territorio pronte a sostenere ASD e squadre di base: dal logo
            sulla divisa al title sponsor. Filtra per sport e raggio d'azione, poi
            proponi la tua realtà.
          </Muted>
        </div>
      </PageHeader>

      <Filters pad={5}>
        <Stack gap={4}>
          <Field label="Cerca sponsor" htmlFor="sponsor-search" hint="Nome, categoria o città">
            <Input
              id="sponsor-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Es. Caffè Aurora, Assicurazioni, Milano…"
            />
          </Field>

          <div>
            <Eyebrow tone="muted">Sport sostenuti</Eyebrow>
            <Row gap={2} wrap style={{ marginTop: 10 }}>
              {sports.map((sp) => (
                <ChipButton
                  key={sp.id}
                  type="button"
                  active={activeSports.includes(sp.id)}
                  accent={sportColor(sp.id)}
                  onClick={() => toggleSport(sp.id)}
                >
                  {sp.glyph} {sp.name}
                </ChipButton>
              ))}
            </Row>
          </div>

          <div>
            <Eyebrow tone="muted">Raggio d'azione</Eyebrow>
            <Row gap={2} wrap style={{ marginTop: 10 }}>
              {tiers.map((t) => (
                <ChipButton
                  key={t.id}
                  type="button"
                  active={tier === t.id}
                  onClick={() => setTier(t.id)}
                >
                  {t.label}
                </ChipButton>
              ))}
            </Row>
          </div>
        </Stack>
      </Filters>

      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Count>
          {filtered.length} {filtered.length === 1 ? 'sponsor trovato' : 'sponsor trovati'}
        </Count>
      </Row>

      {filtered.length > 0 ? (
        <Grid min="320px" gap={4}>
          {filtered.map((s) => (
            <SponsorCard key={s.id} sponsor={s} />
          ))}
        </Grid>
      ) : (
        <EmptyState icon="handshake" title="Nessuno sponsor corrisponde ai filtri">
          Prova ad allargare la ricerca: rimuovi qualche sport, cambia il raggio
          d'azione o azzera il testo per vedere tutte le aziende disponibili.
        </EmptyState>
      )}
    </div>
  )
}
