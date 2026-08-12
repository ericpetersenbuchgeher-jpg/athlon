// Domain model for Athlon. Demo data only (front-end prototype), but shaped like the real thing
// so wiring a backend later is a drop-in.

export type SportId =
  | 'basket'
  | 'calcio'
  | 'calcio5'
  | 'pallavolo'
  | 'tennis'
  | 'rugby'
  | 'atletica'
  | 'nuoto'
  | 'ciclismo'
  | 'pallamano'

export interface Sport {
  id: SportId
  name: string
  /** national federation acronym (FIP, FIGC, FIPAV, FIT…) */
  federationId: string
  /** short glyph used where an icon set is overkill */
  glyph: string
}

export interface Federation {
  /** FIP, FIGC, FIPAV, FIT, FIR, FIDAL, FIN, FCI, FIGH — or promotional bodies UISP, CSI, AICS */
  id: string
  name: string
  kind: 'federazione' | 'ente di promozione'
}

export type UserRole = 'atleta' | 'dirigente'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  city: string
  /** athlete: sports played; dirigente: sports managed */
  sports: SportId[]
  /** self-declared playing role, e.g. "Playmaker", "Ala", "Portiere" */
  position?: string
  bio?: string
  initials: string
}

export type TeamLevel = 'amatoriale' | 'agonistico' | 'giovanile'

export interface OpenRole {
  role: string
  count: number
}

export interface Team {
  id: string
  name: string
  sport: SportId
  city: string
  level: TeamLevel
  foundedYear: number
  membersCount: number
  /** roles the team is actively recruiting for */
  openRoles: OpenRole[]
  /** affiliated body if the team already registered */
  federationId?: string
  captain: string
  description: string
  /** how many applications are pending, for the captain view */
  pendingApplications?: number
}

export type AsdStatus = 'bozza' | 'in verifica' | 'attiva'

export interface AsdDocument {
  name: string
  status: 'da caricare' | 'in verifica' | 'valido'
  hint?: string
}

export interface AsdTask {
  label: string
  done: boolean
  /** short bureaucratic note */
  note?: string
}

export interface Association {
  id: string
  name: string
  sports: SportId[]
  city: string
  legalRep: string
  /** codice fiscale of the ASD (masked demo value) */
  taxCode: string
  status: AsdStatus
  membersCount: number
  foundedYear: number
  affiliations: string[] // federation / ente ids
  documents: AsdDocument[]
  checklist: AsdTask[]
  /** monthly running summary shown on the ASD card */
  balanceEur: number
}

export type SponsorTier = 'local' | 'regionale' | 'nazionale'

export interface Sponsor {
  id: string
  name: string
  category: string
  tier: SponsorTier
  /** budget range in euros, per season */
  budgetMin: number
  budgetMax: number
  sports: SportId[]
  city: string
  description: string
  /** what they want in return */
  wants: string[]
}

/** freemium: Premium costa 5 €/mese */
export type Plan = 'free' | 'premium'

/* ------------------------- Calendario & convocazioni ------------------------- */

export type EventKind = 'allenamento' | 'partita' | 'riunione'

export type RsvpStatus = 'convocato' | 'presente' | 'assente'

export interface TeamEvent {
  id: string
  teamId: string
  kind: EventKind
  title: string
  /** ISO date */
  date: string
  time: string
  place: string
  /** opponent, only for kind = 'partita' */
  opponent?: string
  /** how many members confirmed / called up */
  confirmed: number
  called: number
  /** the signed-in user's reply (demo: local) */
  myRsvp: RsvpStatus
}

/* ------------------------------- Scadenzario -------------------------------- */

export type DeadlineKind = 'certificato' | 'affiliazione' | 'assicurazione' | 'quota' | 'rendiconto'

export interface Deadline {
  id: string
  kind: DeadlineKind
  /** what expires, e.g. "Certificato medico — Marco Rinaldi" */
  label: string
  /** which team/ASD it belongs to */
  entity: string
  /** ISO due date */
  due: string
  /** short action hint */
  hint?: string
}

export type ApplicationStatus = 'inviata' | 'in valutazione' | 'accettata' | 'rifiutata'

export interface Application {
  id: string
  teamId: string
  role: string
  status: ApplicationStatus
  /** ISO date */
  date: string
  message: string
}
