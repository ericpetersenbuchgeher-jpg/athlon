# Athlon

**Lo sport italiano, dal campo alla scrivania.**
Crea la tua società (A.S.D.), trova la tua squadra o dei compagni, trova sponsor — per tutti gli
sport italiani, in un'unica app.

> ⚠️ **Demo / prototipo front-end.** Autenticazione e dati sono simulati (mock + `localStorage`).
> Nessun backend: è pensato per validare il concept e l'esperienza. Il modello dati (`src/data/`)
> è già modellato come la versione reale, così collegare un backend più avanti è un innesto diretto.

## Avvio

```bash
npm install
npm run dev        # server di sviluppo (Vite)
npm run build      # type-check + build di produzione in dist/
npm run preview    # anteprima della build
```

Apri l'URL mostrato da Vite (di default http://localhost:5173).

### Provare l'app velocemente
Dalla pagina **Accedi** usa i pulsanti demo **"Come atleta"** o **"Come dirigente"** per entrare
senza registrarti (qualsiasi email/password funziona comunque).

## Cosa c'è dentro

### 1. Landing page 3D (pubblica)
Hero cinematografico con una **sfera che morfa tra gli sport** allo scroll
(pallacanestro → calcio → tennis → pallavolo), reattiva anche al mouse/tocco. Stack ispirato ai
reference: **Three.js / React Three Fiber (WebGPU + TSL)**, **GSAP + Lenis** per lo scroll,
**Motion** per la UI. Fallback automatico a WebGL2 e poster statico se il 3D non è disponibile.

### 2. Accesso privato
Login e registrazione con **pagine dedicate** e scelta del ruolo (**atleta** o **dirigente**).

### 3. App (dietro l'accesso)
- **Dashboard** — riepilogo su misura per atleta o dirigente.
- **Trova squadre** — cerca per sport, città, livello e ruolo aperto; **candidati** in un tap.
- **Dettaglio squadra** — info + invio candidatura al capitano.
- **Crea una squadra** — form con anteprima live.
- **Le mie candidature** — stato di tutte le richieste inviate.
- **Le mie società** — l'elenco delle A.S.D. gestite, con % pratiche completate.
- **Gestione società (hub burocratico)** — checklist adempimenti (codice fiscale, statuto, RUNTS,
  affiliazioni, assicurazione, rendiconto), documenti, affiliazioni a **federazioni ed enti**
  (FIP, FIGC, FIPAV, FIT, FIR, FIDAL, FIN, FCI, FIGH, UISP, CSI, AICS), tesserati e bilancio.
- **Fonda la tua società** — wizard guidato in 4 passi.
- **Sponsor** — marketplace di aziende filtrabile per sport, budget e territorio.
- **Profilo** — dati dell'atleta/dirigente, modificabili (demo).

## Stack

React 19 · TypeScript · Vite · **Emotion** (stile) · React Router · **Three.js / React Three Fiber
(WebGPU + TSL)** · GSAP + ScrollTrigger · Lenis · Motion.

## Struttura

```
src/
  brand.ts                 nome/claim del prodotto (cambialo qui)
  theme/                   design tokens (Emotion) + stili globali
  canvas/ · scroll/        hero 3D (sfera morphing) + loop scroll unico (Lenis+GSAP)
  components/ui/           kit UI (Button, Card, Badge, Field, Icon, ...)
  components/domain/       componenti di dominio (TeamCard, SponsorCard, ...)
  components/layout/       navbar pubblica, footer, guscio app (sidebar+topbar)
  auth/                    autenticazione demo (Context + rotta protetta)
  data/                    tipi + dati mock (sport, federazioni, squadre, ASD, sponsor)
  pages/landing/           landing + hero + sezioni
  pages/auth/              accedi / registrati
  pages/app/               le 10 pagine dell'area privata
```

## Note tecniche
- **Un solo loop di rendering**: Lenis è pilotato da `gsap.ticker` (nessun RAF concorrente).
- **`prefers-reduced-motion`** rispettato: il 3D passa a una versione calma.
- Il nome "Athlon" è un **segnaposto**: si cambia in un punto solo (`src/brand.ts`).

---
Fatto in Italia 🇮🇹 — demo.
