import type { Federation, Sport, SportId } from './types'

// Italian national federations + the two big promotional bodies (enti di promozione sportiva)
// that grassroots teams most often register with.
export const federations: Federation[] = [
  { id: 'FIP', name: 'Federazione Italiana Pallacanestro', kind: 'federazione' },
  { id: 'FIGC', name: 'Federazione Italiana Giuoco Calcio', kind: 'federazione' },
  { id: 'FIPAV', name: 'Federazione Italiana Pallavolo', kind: 'federazione' },
  { id: 'FIT', name: 'Federazione Italiana Tennis e Padel', kind: 'federazione' },
  { id: 'FIR', name: 'Federazione Italiana Rugby', kind: 'federazione' },
  { id: 'FIDAL', name: "Federazione Italiana di Atletica Leggera", kind: 'federazione' },
  { id: 'FIN', name: 'Federazione Italiana Nuoto', kind: 'federazione' },
  { id: 'FCI', name: 'Federazione Ciclistica Italiana', kind: 'federazione' },
  { id: 'FIGH', name: 'Federazione Italiana Giuoco Handball', kind: 'federazione' },
  { id: 'UISP', name: 'Unione Italiana Sport Per tutti', kind: 'ente di promozione' },
  { id: 'CSI', name: 'Centro Sportivo Italiano', kind: 'ente di promozione' },
  { id: 'AICS', name: 'Associazione Italiana Cultura Sport', kind: 'ente di promozione' },
]

export const federationById = (id: string): Federation | undefined =>
  federations.find((f) => f.id === id)

export const sports: Sport[] = [
  { id: 'basket', name: 'Pallacanestro', federationId: 'FIP', glyph: '🏀' },
  { id: 'calcio', name: 'Calcio', federationId: 'FIGC', glyph: '⚽' },
  { id: 'calcio5', name: 'Calcio a 5', federationId: 'FIGC', glyph: '🥅' },
  { id: 'pallavolo', name: 'Pallavolo', federationId: 'FIPAV', glyph: '🏐' },
  { id: 'tennis', name: 'Tennis & Padel', federationId: 'FIT', glyph: '🎾' },
  { id: 'rugby', name: 'Rugby', federationId: 'FIR', glyph: '🏉' },
  { id: 'atletica', name: 'Atletica leggera', federationId: 'FIDAL', glyph: '🏃' },
  { id: 'nuoto', name: 'Nuoto', federationId: 'FIN', glyph: '🏊' },
  { id: 'ciclismo', name: 'Ciclismo', federationId: 'FCI', glyph: '🚴' },
  { id: 'pallamano', name: 'Pallamano', federationId: 'FIGH', glyph: '🤾' },
]

export const sportById = (id: SportId): Sport =>
  sports.find((s) => s.id === id) ?? sports[0]

// The four sports the hero morphs through, in order. Names + accent used by the 3D layer poster.
export const heroSports: { id: SportId; label: string }[] = [
  { id: 'tennis', label: 'Tennis' },
  { id: 'basket', label: 'Pallacanestro' },
  { id: 'calcio', label: 'Calcio' },
  { id: 'pallavolo', label: 'Pallavolo' },
]
