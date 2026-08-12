import { CanvasTexture, SRGBColorSpace, type Texture } from 'three'

// Generates four sport-court textures (tennis, basket, calcio, volley) all on the same square
// canvas, so a single floor plane can crossfade between them as the hero ball morphs.

const SIZE = 1024

type Draw = (ctx: CanvasRenderingContext2D) => void

function makeTex(draw: Draw): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  draw(ctx)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// draw helpers that work in metres, centred on the canvas, given a px-per-metre scale
function pen(ctx: CanvasRenderingContext2D, color: string, wMeters: number, scale: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(2, wMeters * scale)
  ctx.lineCap = 'square'
}
function line(ctx: CanvasRenderingContext2D, s: number, x1: number, y1: number, x2: number, y2: number) {
  const c = SIZE / 2
  ctx.beginPath()
  ctx.moveTo(c + x1 * s, c + y1 * s)
  ctx.lineTo(c + x2 * s, c + y2 * s)
  ctx.stroke()
}
function rect(ctx: CanvasRenderingContext2D, s: number, x: number, y: number, w: number, h: number) {
  const c = SIZE / 2
  ctx.strokeRect(c + x * s, c + y * s, w * s, h * s)
}
function circle(ctx: CanvasRenderingContext2D, s: number, x: number, y: number, r: number, fill = false) {
  const c = SIZE / 2
  ctx.beginPath()
  ctx.arc(c + x * s, c + y * s, r * s, 0, Math.PI * 2)
  fill ? ctx.fill() : ctx.stroke()
}
function arc(ctx: CanvasRenderingContext2D, s: number, x: number, y: number, r: number, a0: number, a1: number) {
  const c = SIZE / 2
  ctx.beginPath()
  ctx.arc(c + x * s, c + y * s, r * s, a0, a1)
  ctx.stroke()
}

// ---- Tennis (10.97 x 23.77, portrait) ----
const tennis: Draw = (ctx) => {
  const s = (SIZE * 0.82) / 23.77
  ctx.fillStyle = '#1f6f4a'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#2f76b3'
  const c = SIZE / 2
  ctx.fillRect(c - 5.485 * s, c - 11.885 * s, 10.97 * s, 23.77 * s)
  pen(ctx, '#f4f7fb', 0.05, s)
  const dsl = 5.485, ssl = 4.115, bl = 11.885, svc = 6.4
  rect(ctx, s, -dsl, -bl, dsl * 2, bl * 2)
  line(ctx, s, -ssl, -bl, -ssl, bl)
  line(ctx, s, ssl, -bl, ssl, bl)
  line(ctx, s, -ssl, -svc, ssl, -svc)
  line(ctx, s, -ssl, svc, ssl, svc)
  line(ctx, s, 0, -svc, 0, svc)
  line(ctx, s, -dsl, 0, dsl, 0) // net line
}

// ---- Basket (28 x 15, landscape) ----
const basket: Draw = (ctx) => {
  const s = (SIZE * 0.9) / 28
  ctx.fillStyle = '#0c0906'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#c68a43' // parquet
  const c = SIZE / 2
  ctx.fillRect(c - 14 * s, c - 7.5 * s, 28 * s, 15 * s)
  pen(ctx, '#f4ecd8', 0.05, s)
  rect(ctx, s, -14, -7.5, 28, 15)
  line(ctx, s, 0, -7.5, 0, 7.5) // centre line
  circle(ctx, s, 0, 0, 1.8) // centre circle
  for (const dir of [-1, 1]) {
    const base = dir * 14
    // key (paint) 5.8 long x 4.9 wide
    rect(ctx, s, dir > 0 ? base - 5.8 : base, -2.45, 5.8, 4.9)
    circle(ctx, s, base - dir * 5.8, 0, 1.8) // free-throw circle
    // 3-point arc (radius 6.75 from basket ~1.575m in)
    const bx = base - dir * 1.575
    arc(ctx, s, bx, 0, 6.75, dir > 0 ? Math.PI / 2 : -Math.PI / 2, dir > 0 ? (3 * Math.PI) / 2 : Math.PI / 2)
    line(ctx, s, base, -6.7, base - dir * 4.25, -6.7)
    line(ctx, s, base, 6.7, base - dir * 4.25, 6.7)
  }
}

// ---- Calcio (105 x 68, landscape) ----
const calcio: Draw = (ctx) => {
  const s = (SIZE * 0.94) / 105
  const c = SIZE / 2
  ctx.fillStyle = '#1c5c2c'
  ctx.fillRect(0, 0, SIZE, SIZE)
  // mowing stripes
  const stripes = 12
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 ? '#2f8f43' : '#2a833d'
    ctx.fillRect(c - 52.5 * s + (i * 105 * s) / stripes, c - 34 * s, (105 * s) / stripes, 68 * s)
  }
  pen(ctx, '#eef4f0', 0.14, s)
  rect(ctx, s, -52.5, -34, 105, 68)
  line(ctx, s, 0, -34, 0, 34)
  circle(ctx, s, 0, 0, 9.15)
  ctx.fillStyle = '#eef4f0'
  circle(ctx, s, 0, 0, 0.4, true)
  for (const dir of [-1, 1]) {
    const base = dir * 52.5
    rect(ctx, s, dir > 0 ? base - 16.5 : base, -20.16, 16.5, 40.3) // penalty area
    rect(ctx, s, dir > 0 ? base - 5.5 : base, -9.16, 5.5, 18.32) // goal area
    circle(ctx, s, base - dir * 11, 0, 0.4, true) // penalty spot
    const px = base - dir * 11
    arc(ctx, s, px, 0, 9.15, dir > 0 ? (Math.PI * 0.6) : -Math.PI * 0.4, dir > 0 ? Math.PI * 1.4 : Math.PI * 0.4)
  }
}

// ---- Volley (18 x 9, landscape) ----
const volley: Draw = (ctx) => {
  const s = (SIZE * 0.86) / 18
  const c = SIZE / 2
  ctx.fillStyle = '#0f2233'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#d98a3a'
  ctx.fillRect(c - 9 * s, c - 4.5 * s, 18 * s, 9 * s)
  ctx.fillStyle = '#2f76b3' // attack zones tint near the net
  ctx.fillRect(c - 3 * s, c - 4.5 * s, 6 * s, 9 * s)
  pen(ctx, '#f4f7fb', 0.05, s)
  rect(ctx, s, -9, -4.5, 18, 9)
  line(ctx, s, 0, -4.5, 0, 4.5) // centre line (net)
  line(ctx, s, -3, -4.5, -3, 4.5) // attack lines
  line(ctx, s, 3, -4.5, 3, 4.5)
}

export interface SportCourts {
  textures: [Texture, Texture, Texture, Texture]
  planeSize: number
}

export function makeSportCourts(): SportCourts {
  return {
    textures: [makeTex(tennis), makeTex(basket), makeTex(calcio), makeTex(volley)],
    planeSize: 30,
  }
}
