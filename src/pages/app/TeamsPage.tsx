import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import {
  ButtonLink,
  Card,
  ChipButton,
  Icon,
  Input,
  Grid,
  Row,
  Muted,
  PageHeader,
  sportColor,
} from '../../components/ui'
import { EmptyState } from '../../components/domain/common'
import { TeamCard } from '../../components/domain/TeamCard'
import { sports } from '../../data/sports'
import { teams } from '../../data/teams'
import type { SportId, TeamLevel } from '../../data/types'

const Filters = styled(Card)`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const SearchWrap = styled.div`
  position: relative;
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${(p) => p.theme.color.fgMuted};
    pointer-events: none;
  }
  input {
    padding-left: 42px;
  }
`
const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  .group-label {
    font-size: ${(p) => p.theme.fontSize.micro};
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${(p) => p.theme.color.fgMuted};
  }
`
const ResultsHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  h2 {
    font-size: ${(p) => p.theme.fontSize.h3};
  }
`

const levels: { id: TeamLevel; label: string }[] = [
  { id: 'amatoriale', label: 'Amatoriale' },
  { id: 'agonistico', label: 'Agonistico' },
  { id: 'giovanile', label: 'Giovanile' },
]

export function TeamsPage() {
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState<SportId | null>(null)
  const [level, setLevel] = useState<TeamLevel | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return teams.filter((t) => {
      const matchesQuery =
        !q || t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q)
      const matchesSport = !sport || t.sport === sport
      const matchesLevel = !level || t.level === level
      return matchesQuery && matchesSport && matchesLevel
    })
  }, [query, sport, level])

  return (
    <div>
      <PageHeader>
        <div>
          <h1>Trova la tua squadra</h1>
          <Muted>
            Società ASD e team amatoriali in cerca di giocatori, tesserati con federazioni ed enti
            di promozione (FIP, FIGC, FIPAV, UISP, CSI).
          </Muted>
        </div>
        <ButtonLink to="/app/squadre/nuova" variant="primary">
          <Icon name="plus" size={16} /> Crea una squadra
        </ButtonLink>
      </PageHeader>

      <Filters pad={5}>
        <SearchWrap>
          <span className="search-icon">
            <Icon name="search" size={18} />
          </span>
          <Input
            id="team-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome squadra o città…"
            aria-label="Cerca squadre"
          />
        </SearchWrap>

        <FilterGroup>
          <span className="group-label">Sport</span>
          <Row gap={2} wrap>
            <ChipButton type="button" active={sport === null} onClick={() => setSport(null)}>
              Tutti
            </ChipButton>
            {sports.map((s) => (
              <ChipButton
                key={s.id}
                type="button"
                active={sport === s.id}
                accent={sportColor(s.id)}
                onClick={() => setSport((cur) => (cur === s.id ? null : s.id))}
              >
                {s.glyph} {s.name}
              </ChipButton>
            ))}
          </Row>
        </FilterGroup>

        <FilterGroup>
          <span className="group-label">Livello</span>
          <Row gap={2} wrap>
            <ChipButton type="button" active={level === null} onClick={() => setLevel(null)}>
              Tutti
            </ChipButton>
            {levels.map((l) => (
              <ChipButton
                key={l.id}
                type="button"
                active={level === l.id}
                onClick={() => setLevel((cur) => (cur === l.id ? null : l.id))}
              >
                {l.label}
              </ChipButton>
            ))}
          </Row>
        </FilterGroup>
      </Filters>

      <ResultsHead>
        <h2>
          {filtered.length} {filtered.length === 1 ? 'squadra' : 'squadre'}
        </h2>
        <Muted>in cerca di giocatori</Muted>
      </ResultsHead>

      {filtered.length > 0 ? (
        <Grid min="320px" gap={4}>
          {filtered.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </Grid>
      ) : (
        <EmptyState icon="search" title="Nessuna squadra trovata">
          Prova a cambiare i filtri o azzera la ricerca: allarga lo sport, cambia livello o cerca
          un'altra città.
        </EmptyState>
      )}
    </div>
  )
}
