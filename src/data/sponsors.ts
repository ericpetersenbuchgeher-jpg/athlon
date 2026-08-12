import type { Sponsor } from './types'

// Sponsor marketplace: businesses looking to back grassroots teams and ASD.
export const sponsors: Sponsor[] = [
  {
    id: 's-caffe',
    name: 'Caffè Aurora',
    category: 'Ristorazione',
    tier: 'local',
    budgetMin: 500,
    budgetMax: 2000,
    sports: ['basket', 'calcio5', 'pallavolo'],
    city: 'Milano',
    description:
      'Torrefazione artigianale milanese. Sosteniamo squadre di quartiere in cambio di visibilità sulle divise.',
    wants: ['Logo su divisa', 'Post social', 'Striscione a bordo campo'],
  },
  {
    id: 's-tecno',
    name: 'TecnoNord Impianti',
    category: 'Edilizia & Impianti',
    tier: 'regionale',
    budgetMin: 3000,
    budgetMax: 12000,
    sports: ['calcio', 'basket', 'rugby'],
    city: 'Torino',
    description:
      'PMI di impiantistica in tutto il Piemonte. Budget stagionale per title sponsor di squadre agonistiche.',
    wants: ['Title sponsor', 'Naming del settore giovanile', 'Cartellonistica'],
  },
  {
    id: 's-farm',
    name: 'Farmacia San Gennaro',
    category: 'Salute',
    tier: 'local',
    budgetMin: 400,
    budgetMax: 1500,
    sports: ['pallavolo', 'nuoto', 'atletica'],
    city: 'Napoli',
    description:
      'Farmacia di comunità. Offriamo materiale sanitario e un contributo per il settore giovanile.',
    wants: ['Logo su divisa', 'Screening gratuito atleti'],
  },
  {
    id: 's-banca',
    name: 'Banca del Territorio',
    category: 'Finanza',
    tier: 'nazionale',
    budgetMin: 10000,
    budgetMax: 50000,
    sports: ['calcio', 'basket', 'pallavolo', 'atletica'],
    city: 'Roma',
    description:
      'Istituto di credito con programma nazionale di responsabilità sociale dedicato allo sport di base.',
    wants: ['Main sponsor', 'Progetti scuola-sport', 'Eventi territoriali'],
  },
  {
    id: 's-bici',
    name: 'VeloOfficina',
    category: 'Retail sportivo',
    tier: 'local',
    budgetMin: 600,
    budgetMax: 3000,
    sports: ['ciclismo', 'atletica'],
    city: 'Bologna',
    description:
      'Negozio e officina bici. Forniamo materiale tecnico e sconti ai tesserati dei team amatoriali.',
    wants: ['Logo su completo', 'Assistenza tecnica gare'],
  },
  {
    id: 's-app',
    name: 'MangiaBene Delivery',
    category: 'Food tech',
    tier: 'regionale',
    budgetMin: 2000,
    budgetMax: 8000,
    sports: ['calcio5', 'basket', 'pallamano'],
    city: 'Bari',
    description:
      'App di delivery del Sud Italia. Cerchiamo squadre urbane per campagne social e attivazioni.',
    wants: ['Co-branding social', 'Codici sconto tifosi'],
  },
  {
    id: 's-assic',
    name: 'Sicura Assicurazioni',
    category: 'Assicurazioni',
    tier: 'regionale',
    budgetMin: 1500,
    budgetMax: 6000,
    sports: ['calcio', 'rugby', 'pallavolo', 'basket'],
    city: 'Firenze',
    description:
      'Agenzia assicurativa toscana. Polizze tesserati agevolate e contributo alle spese di trasferta.',
    wants: ['Logo su divisa', 'Polizze convenzionate'],
  },
  {
    id: 's-energia',
    name: 'Verde Energia Coop',
    category: 'Energia',
    tier: 'nazionale',
    budgetMin: 8000,
    budgetMax: 30000,
    sports: ['nuoto', 'atletica', 'ciclismo', 'calcio'],
    city: 'Venezia',
    description:
      'Cooperativa di energia rinnovabile. Sponsorizziamo eventi e impianti a basso impatto ambientale.',
    wants: ['Naming eventi', 'Progetti sostenibilità', 'Efficientamento impianti'],
  },
]

export const sponsorById = (id: string): Sponsor | undefined =>
  sponsors.find((s) => s.id === id)
