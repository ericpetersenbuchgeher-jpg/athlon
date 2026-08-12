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
  Textarea,
  Select,
  Icon,
  Avatar,
  Row,
  Stack,
  Muted,
  Eyebrow,
  PageHeader,
  sportColor,
} from '../../components/ui'
import { EmptyState } from '../../components/domain/common'
import { sports, sportById, federations } from '../../data/sports'
import type { SportId, TeamLevel } from '../../data/types'

const levels: TeamLevel[] = ['amatoriale', 'agonistico', 'giovanile']
const levelTone = { agonistico: 'energy', amatoriale: 'accent', giovanile: 'volt' } as const

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: ${(p) => p.theme.space(6)};
  align-items: start;
  @media (max-width: 940px) {
    grid-template-columns: 1fr;
  }
`

const PreviewCol = styled.div`
  position: sticky;
  top: 24px;
  @media (max-width: 940px) {
    position: static;
  }
`

const SportRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const RemoveBtn = styled.button`
  display: inline-grid;
  place-items: center;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 2px;
  line-height: 0;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`

const PreviewHead = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
`

const PreviewName = styled.h3`
  font-size: ${(p) => p.theme.fontSize.lg};
  line-height: 1.15;
`

const PreviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
  margin-top: 3px;
`

const PreviewFoot = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid ${(p) => p.theme.color.line};
  padding-top: 14px;
  margin-top: 16px;
  color: ${(p) => p.theme.color.fgMuted};
  font-size: ${(p) => p.theme.fontSize.small};
`

const SuccessWrap = styled(Panel)`
  max-width: 560px;
  margin: 40px auto;
  text-align: center;
  .check {
    display: inline-grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 999px;
    margin: 4px auto 18px;
    color: ${(p) => p.theme.color.success};
    background: ${(p) => p.theme.color.successSoft};
  }
  h2 {
    font-size: ${(p) => p.theme.fontSize.h3};
    margin-bottom: 10px;
  }
`

export function CreateTeamPage() {
  const [name, setName] = useState('')
  const [sport, setSport] = useState<SportId>(sports[0].id)
  const [city, setCity] = useState('')
  const [level, setLevel] = useState<TeamLevel>('amatoriale')
  const [federationId, setFederationId] = useState('')
  const [description, setDescription] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [roleDraft, setRoleDraft] = useState('')
  const [created, setCreated] = useState(false)

  const addRole = () => {
    const value = roleDraft.trim()
    if (!value) return
    if (!roles.some((r) => r.toLowerCase() === value.toLowerCase())) {
      setRoles((prev) => [...prev, value])
    }
    setRoleDraft('')
  }

  const removeRole = (role: string) => setRoles((prev) => prev.filter((r) => r !== role))

  const selectedSport = sportById(sport)
  const accent = sportColor(sport)
  const canCreate = name.trim().length > 0

  if (created) {
    return (
      <SuccessWrap pad={7}>
        <div className="check">
          <Icon name="check" size={30} />
        </div>
        <Eyebrow tone="energy">Demo</Eyebrow>
        <h2>Squadra creata 🎉 (demo)</h2>
        <Muted>
          «{name.trim() || 'La tua squadra'}» è pronta. Ricordati di completare il tesseramento e di
          affiliarla a una federazione o a un ente di promozione (UISP, CSI, AICS) per scendere in
          campo ufficialmente.
        </Muted>
        <Row gap={2} justify="center" wrap style={{ marginTop: 24 }}>
          <ButtonLink to="/app/squadre" variant="primary">
            <Icon name="users" size={16} /> Vai alle squadre
          </ButtonLink>
          <ButtonLink to="/app" variant="secondary">
            Torna alla dashboard
          </ButtonLink>
        </Row>
      </SuccessWrap>
    )
  }

  return (
    <div>
      <PageHeader>
        <div>
          <Eyebrow tone="energy">Nuova squadra</Eyebrow>
          <h1>Crea la tua squadra</h1>
          <Muted style={{ maxWidth: '54ch', marginTop: 8 }}>
            Imposta la scheda della tua squadra. È una bozza demo: potrai registrarla più avanti a una
            federazione (FIP, FIGC, FIPAV, FIT…) o a un ente di promozione sportiva e avviare il
            tesseramento.
          </Muted>
        </div>
      </PageHeader>

      <Layout>
        <Card pad={6}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (canCreate) setCreated(true)
            }}
          >
            <Stack gap={5}>
              <Field label="Nome squadra" htmlFor="team-name" hint="Es. ASD Aurora Basket 2015">
                <Input
                  id="team-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome della squadra"
                />
              </Field>

              <Field label="Sport" hint="Scegli la disciplina principale">
                <SportRow>
                  {sports.map((s) => (
                    <ChipButton
                      key={s.id}
                      type="button"
                      active={s.id === sport}
                      accent={sportColor(s.id)}
                      onClick={() => setSport(s.id)}
                    >
                      {s.glyph} {s.name}
                    </ChipButton>
                  ))}
                </SportRow>
              </Field>

              <Row gap={4} align="flex-start" wrap>
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Field label="Città" htmlFor="team-city">
                    <Input
                      id="team-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Es. Bologna"
                    />
                  </Field>
                </div>
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Field label="Livello" htmlFor="team-level">
                    <Select
                      id="team-level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value as TeamLevel)}
                    >
                      {levels.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </Row>

              <Field
                label="Federazione / Ente"
                htmlFor="team-federation"
                hint="Dove intendi affiliare la squadra (facoltativo in bozza)"
              >
                <Select
                  id="team-federation"
                  value={federationId}
                  onChange={(e) => setFederationId(e.target.value)}
                >
                  <option value="">Da definire più avanti</option>
                  {federations.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.id} — {f.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Descrizione" htmlFor="team-desc" hint="Presenta la squadra a chi cerca dove giocare">
                <Textarea
                  id="team-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chi siete, dove vi allenate, che atmosfera si respira in spogliatoio…"
                />
              </Field>

              <Field label="Ruoli cercati" hint="Aggiungi i ruoli che stai cercando (premi Invio o Aggiungi)">
                <Row gap={2} align="stretch">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Input
                      value={roleDraft}
                      onChange={(e) => setRoleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addRole()
                        }
                      }}
                      placeholder="Es. Playmaker, Ala grande, Portiere…"
                    />
                  </div>
                  <Button type="button" variant="secondary" onClick={addRole}>
                    <Icon name="plus" size={16} /> Aggiungi
                  </Button>
                </Row>
                {roles.length > 0 && (
                  <Tags style={{ marginTop: 12 }}>
                    {roles.map((r) => (
                      <Badge key={r} tone="accent">
                        {r}
                        <RemoveBtn
                          type="button"
                          aria-label={`Rimuovi ${r}`}
                          onClick={() => removeRole(r)}
                        >
                          <Icon name="close" size={12} />
                        </RemoveBtn>
                      </Badge>
                    ))}
                  </Tags>
                )}
              </Field>

              <Button type="submit" variant="energy" size="lg" full disabled={!canCreate}>
                <Icon name="check" size={18} /> Crea squadra
              </Button>
            </Stack>
          </form>
        </Card>

        <PreviewCol>
          <Eyebrow tone="accent" style={{ marginBottom: 12 }}>
            Anteprima live
          </Eyebrow>
          {canCreate ? (
            <Card pad={5}>
              <PreviewHead>
                <Avatar accent={accent} size={46}>
                  {selectedSport.glyph}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <PreviewName>{name.trim()}</PreviewName>
                  <PreviewMeta>
                    <span>{selectedSport.name}</span>
                    {city.trim() && (
                      <>
                        ·
                        <span>
                          <Icon name="pin" size={13} /> {city.trim()}
                        </span>
                      </>
                    )}
                  </PreviewMeta>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Badge tone={levelTone[level]}>{level}</Badge>
                </div>
              </PreviewHead>

              {description.trim() && (
                <Muted style={{ fontSize: '0.9rem', margin: '0 0 14px' }}>{description.trim()}</Muted>
              )}

              <Tags>
                {roles.length > 0 ? (
                  roles.map((r) => (
                    <Badge key={r} tone="neutral">
                      {r}
                    </Badge>
                  ))
                ) : (
                  <Badge tone="neutral">Nessun ruolo aperto</Badge>
                )}
              </Tags>

              <PreviewFoot>
                <Icon name="shield" size={14} />
                {federationId ? `Affiliazione: ${federationId}` : 'Affiliazione da definire'}
              </PreviewFoot>
            </Card>
          ) : (
            <EmptyState icon="users" title="Anteprima squadra">
              Inizia dando un nome alla squadra: qui vedrai la scheda aggiornarsi in tempo reale.
            </EmptyState>
          )}
        </PreviewCol>
      </Layout>
    </div>
  )
}
