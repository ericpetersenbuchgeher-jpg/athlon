import type { Application } from './types'

// The logged-in athlete's candidature to teams. Seeded demo state; new ones are added in-memory
// when the user applies (see AuthContext / TeamDetailPage).
export const seedApplications: Application[] = [
  {
    id: 'ap-1',
    teamId: 't-fenice',
    role: 'Playmaker',
    status: 'in valutazione',
    date: '2026-07-14',
    message:
      'Ciao! Gioco play da 8 anni, ultima stagione in Promozione. Disponibile per un provino quando volete.',
  },
  {
    id: 'ap-2',
    teamId: 't-navigli',
    role: 'Terzino destro',
    status: 'accettata',
    date: '2026-07-05',
    message: 'Terzino fluidificante, alleno il martedì e giovedì. Vi seguo da tempo!',
  },
  {
    id: 'ap-3',
    teamId: 't-arno',
    role: '3ª/4ª categoria',
    status: 'rifiutata',
    date: '2026-06-22',
    message: 'Classifica 3.5, disponibile per i doppi del sabato.',
  },
]
