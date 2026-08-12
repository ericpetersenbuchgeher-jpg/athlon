import type { Deadline, DeadlineKind } from './types'

// Scadenzario demo: certificati medici, affiliazioni, assicurazioni, quote e rendiconti.
// È IL motivo per cui le ASD usano un gestionale (vedi Golee/AssoFacile): un certificato
// scaduto = atleta non assicurato in campo.
export const seedDeadlines: Deadline[] = [
  {
    id: 'dl-1',
    kind: 'certificato',
    label: 'Certificato medico agonistico — Marco Rinaldi',
    entity: 'ASD Aurora Basket',
    due: '2026-08-09',
    hint: 'SCADUTO: l’atleta non può scendere in campo',
  },
  {
    id: 'dl-2',
    kind: 'certificato',
    label: 'Certificato medico agonistico — Sara Colombo',
    entity: 'ASD Aurora Basket',
    due: '2026-08-30',
    hint: 'Prenotare visita medico-sportiva',
  },
  {
    id: 'dl-3',
    kind: 'affiliazione',
    label: 'Rinnovo affiliazione FIP 2026/27',
    entity: 'ASD Aurora Basket',
    due: '2026-09-15',
    hint: 'Portale FIP · delibera consiglio + versamento',
  },
  {
    id: 'dl-4',
    kind: 'quota',
    label: 'Quote associative — 2ª rata stagione',
    entity: 'ASD Aurora Basket',
    due: '2026-09-01',
    hint: '14 tesserati su 42 non hanno ancora versato',
  },
  {
    id: 'dl-5',
    kind: 'assicurazione',
    label: 'Polizza infortuni tesserati',
    entity: 'Polisportiva Vesuvio',
    due: '2027-06-30',
    hint: 'Copertura attiva, rinnovo a fine stagione',
  },
  {
    id: 'dl-6',
    kind: 'certificato',
    label: 'Certificato medico non agonistico — Luca Ferri',
    entity: 'Futsal Isola',
    due: '2026-10-12',
  },
  {
    id: 'dl-7',
    kind: 'rendiconto',
    label: 'Rendiconto economico annuale (RUNTS)',
    entity: 'Polisportiva Vesuvio',
    due: '2026-11-30',
    hint: 'Approvazione in assemblea entro fine novembre',
  },
]

export type DeadlineStatus = 'scaduta' | 'in scadenza' | 'ok'

/** < oggi = scaduta · entro 30 giorni = in scadenza · altrimenti ok */
export function deadlineStatus(due: string, today = new Date()): DeadlineStatus {
  const d = new Date(due + 'T23:59:59')
  const days = Math.ceil((d.getTime() - today.getTime()) / 86_400_000)
  if (days < 0) return 'scaduta'
  if (days <= 30) return 'in scadenza'
  return 'ok'
}

export function daysTo(due: string, today = new Date()): number {
  return Math.ceil((new Date(due + 'T23:59:59').getTime() - today.getTime()) / 86_400_000)
}

export const deadlineKindMeta: Record<DeadlineKind, { label: string; icon: 'file' | 'shield' | 'euro' | 'building' }> = {
  certificato: { label: 'Certificato medico', icon: 'file' },
  affiliazione: { label: 'Affiliazione', icon: 'building' },
  assicurazione: { label: 'Assicurazione', icon: 'shield' },
  quota: { label: 'Quote', icon: 'euro' },
  rendiconto: { label: 'Rendiconto', icon: 'file' },
}
