import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Card,
  Badge,
  Icon,
  Button,
  ButtonLink,
  Avatar,
  Grid,
  Row,
  Stack,
  Muted,
  Eyebrow,
  PageHeader,
  ProgressBar,
  sportColor,
  asdStatusTone,
} from '../../components/ui'
import { StatCard, EmptyState, InfoRow } from '../../components/domain/common'
import { associationById } from '../../data/associations'
import { sportById, federationById } from '../../data/sports'
import type { AsdTask, AsdDocument } from '../../data/types'

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.color.fgMuted};
  font-weight: 600;
  font-size: ${(p) => p.theme.fontSize.small};
  margin-bottom: 18px;
  .chev {
    display: inline-flex;
    transform: rotate(180deg);
  }
  &:hover {
    color: ${(p) => p.theme.color.fg};
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
  h1 {
    font-size: ${(p) => p.theme.fontSize.h2};
    line-height: 1.1;
    margin-bottom: 8px;
  }
`

const TwoCol = styled.div`
  display: grid;
  gap: ${(p) => p.theme.space(4)};
  grid-template-columns: 1fr;
  margin-top: ${(p) => p.theme.space(6)};
  @media (min-width: 920px) {
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    align-items: start;
  }
`

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  h2 {
    font-size: ${(p) => p.theme.fontSize.h3};
  }
`

const TaskRow = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${(p) => p.theme.color.line};
  padding: 14px 6px;
  cursor: pointer;
  font-family: inherit;
  color: ${(p) => p.theme.color.fg};
  border-radius: ${(p) => p.theme.radius.sm};
  transition: background 0.16s;
  &:last-of-type {
    border-bottom: none;
  }
  &:hover {
    background: ${(p) => p.theme.color.surface};
  }
  .label {
    font-weight: 600;
  }
  .note {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
    margin-top: 2px;
  }
`

const CheckCircle = styled.span<{ done: boolean }>`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin-top: 1px;
  color: ${(p) => (p.done ? '#fff' : p.theme.color.fgMuted)};
  background: ${(p) => (p.done ? p.theme.color.success : 'transparent')};
  border: 1.5px solid ${(p) => (p.done ? p.theme.color.success : p.theme.color.lineStrong)};
  transition: background 0.16s, border-color 0.16s, color 0.16s;
`

const DocRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 6px;
  border-bottom: 1px solid ${(p) => p.theme.color.line};
  &:last-of-type {
    border-bottom: none;
  }
  .doc-icon {
    flex: 0 0 auto;
    color: ${(p) => p.theme.color.fgMuted};
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-weight: 600;
  }
  .hint {
    color: ${(p) => p.theme.color.fgMuted};
    font-size: ${(p) => p.theme.fontSize.small};
    margin-top: 2px;
  }
`

const AffList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const docTone = {
  valido: 'success',
  'in verifica': 'warning',
  'da caricare': 'neutral',
} as const

const eur = (n: number) => n.toLocaleString('it-IT')

export function AssociationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const a = associationById(id ?? '')
  const [checklist, setChecklist] = useState<AsdTask[]>(a?.checklist ?? [])

  // Resync the local (toggleable) checklist when navigating between società.
  useEffect(() => {
    setChecklist(associationById(id ?? '')?.checklist ?? [])
  }, [id])

  if (!a) {
    return (
      <div>
        <BackLink to="/app/societa">
          <span className="chev">
            <Icon name="chevron-right" size={16} />
          </span>
          Società
        </BackLink>
        <Card pad={6}>
          <Stack gap={4} align="center">
            <EmptyState icon="building" title="Società non trovata">
              Nessuna A.S.D. corrisponde a questo identificativo. Potrebbe essere stata rimossa
              o non ancora registrata.
            </EmptyState>
            <ButtonLink to="/app/societa" variant="primary">
              <Icon name="arrow-right" size={16} /> Torna alle società
            </ButtonLink>
          </Stack>
        </Card>
      </div>
    )
  }

  const total = checklist.length
  const doneCount = checklist.filter((t) => t.done).length
  const pct = total ? Math.round((doneCount / total) * 100) : 0
  const primarySport = a.sports[0]

  const toggleTask = (index: number) =>
    setChecklist((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t)),
    )

  return (
    <div>
      <BackLink to="/app/societa">
        <span className="chev">
          <Icon name="chevron-right" size={16} />
        </span>
        Società
      </BackLink>

      <PageHeader>
        <HeaderLeft>
          <Avatar size={54} accent={sportColor(primarySport)}>
            {sportById(primarySport).glyph}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <Eyebrow tone="accent">Gestione società · ASD</Eyebrow>
            <h1>{a.name}</h1>
            <Row gap={2} wrap>
              <Badge tone={asdStatusTone[a.status]}>{a.status}</Badge>
              <Muted style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="pin" size={14} /> {a.city} · dal {a.foundedYear}
              </Muted>
            </Row>
          </div>
        </HeaderLeft>
        <Row gap={2} wrap>
          <Button variant="secondary">
            <Icon name="file" size={16} /> Esporta pratiche
          </Button>
          <Button variant="primary">
            <Icon name="plus" size={16} /> Carica documento
          </Button>
        </Row>
      </PageHeader>

      <Grid min="210px" gap={4}>
        <StatCard label="Tesserati" value={a.membersCount} icon="users" accent="#4f83ff" />
        <StatCard
          label="Affiliazioni"
          value={a.affiliations.length}
          icon="shield"
          accent="#ff6b3d"
          hint={a.affiliations.join(' · ') || 'Nessuna'}
        />
        <StatCard label="Bilancio" value={`€ ${eur(a.balanceEur)}`} icon="euro" accent="#37d17a" />
        <StatCard
          label="Pratiche"
          value={`${doneCount}/${total}`}
          icon="file"
          accent="#ffbe4d"
          hint={`${pct}% completato`}
        />
      </Grid>

      <TwoCol>
        <Stack gap={4}>
          <Card pad={5}>
            <SectionHead>
              <h2>Pratiche burocratiche</h2>
              <Badge tone={pct === 100 ? 'success' : 'warning'}>
                {doneCount}/{total} completate
              </Badge>
            </SectionHead>
            <div style={{ marginBottom: 6 }}>
              <ProgressBar pct={pct} accent="#37d17a" />
            </div>
            <Muted style={{ fontSize: '0.82rem', marginBottom: 10 }}>
              {pct}% degli adempimenti evasi. Tocca una voce per aggiornarne lo stato.
            </Muted>
            <div>
              {checklist.map((task, i) => (
                <TaskRow key={task.label} type="button" onClick={() => toggleTask(i)}>
                  <CheckCircle done={task.done}>
                    {task.done && <Icon name="check" size={14} />}
                  </CheckCircle>
                  <div style={{ minWidth: 0 }}>
                    <div className="label">{task.label}</div>
                    {task.note && <div className="note">{task.note}</div>}
                  </div>
                </TaskRow>
              ))}
            </div>
          </Card>

          <Card pad={5}>
            <SectionHead>
              <h2>Documenti</h2>
              <Muted style={{ fontSize: '0.82rem' }}>{a.documents.length} pratiche</Muted>
            </SectionHead>
            <div>
              {a.documents.map((doc: AsdDocument) => (
                <DocRow key={doc.name}>
                  <span className="doc-icon">
                    <Icon name="file" size={18} />
                  </span>
                  <div className="info">
                    <div className="name">{doc.name}</div>
                    {doc.hint && <div className="hint">{doc.hint}</div>}
                  </div>
                  <Badge tone={docTone[doc.status]}>{doc.status}</Badge>
                  {doc.status === 'da caricare' && (
                    <Button variant="secondary" size="sm">
                      <Icon name="plus" size={14} /> Carica
                    </Button>
                  )}
                </DocRow>
              ))}
            </div>
          </Card>
        </Stack>

        <Stack gap={4}>
          <Card pad={5}>
            <SectionHead>
              <h2>Affiliazioni</h2>
            </SectionHead>
            {a.affiliations.length === 0 ? (
              <EmptyState icon="shield" title="Nessuna affiliazione">
                Affilia la società a una federazione (FIP, FIGC, FIPAV…) o a un ente di
                promozione (UISP, CSI) per tesserare gli atleti.
              </EmptyState>
            ) : (
              <AffList>
                {a.affiliations.map((fed) => {
                  const f = federationById(fed)
                  return (
                    <Badge key={fed} tone="accent">
                      <Icon name="shield" size={13} /> {f ? f.name : fed}
                    </Badge>
                  )
                })}
              </AffList>
            )}
          </Card>

          <Card pad={5}>
            <SectionHead>
              <h2>Anagrafica</h2>
            </SectionHead>
            <div>
              <InfoRow label="Rappresentante legale">{a.legalRep}</InfoRow>
              <InfoRow label="Codice fiscale">{a.taxCode}</InfoRow>
              <InfoRow label="Sede">{a.city}</InfoRow>
              <InfoRow label="Sport">
                {a.sports.map((s) => sportById(s).name).join(' · ')}
              </InfoRow>
              <InfoRow label="Fondata nel">{a.foundedYear}</InfoRow>
            </div>
          </Card>
        </Stack>
      </TwoCol>
    </div>
  )
}
