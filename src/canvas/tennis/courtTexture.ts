import { CanvasTexture, SRGBColorSpace } from 'three'

// Draws a regulation tennis court (doubles) top-down onto a canvas and returns it as a texture.
// Metric layout (metres, net at centre): baseline ±11.885, doubles sideline ±5.485,
// singles sideline ±4.115, service line ±6.40, centre service line at x=0.
export function makeCourtTexture(): { texture: CanvasTexture; planeW: number; planeH: number } {
  const S = 44 // px per metre
  const margin = 2.4 // metres of run-off around the court
  const courtW = 10.97
  const courtL = 23.77
  const planeW = courtW + margin * 2
  const planeH = courtL + margin * 2

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(planeW * S)
  canvas.height = Math.round(planeH * S)
  const ctx = canvas.getContext('2d')!

  // surround (run-off) + court surface
  ctx.fillStyle = '#1f6f4a' // green surround
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#2f76b3' // blue hard court
  ctx.fillRect(margin * S, margin * S, courtW * S, courtL * S)

  // helpers — origin at court centre, +x right, +z toward the far baseline
  const cx = canvas.width / 2
  const cz = canvas.height / 2
  const px = (x: number) => cx + x * S
  const pz = (z: number) => cz + z * S

  ctx.strokeStyle = '#f4f7fb'
  ctx.lineWidth = Math.max(2, 0.05 * S)
  ctx.lineCap = 'square'
  const line = (x1: number, z1: number, x2: number, z2: number) => {
    ctx.beginPath()
    ctx.moveTo(px(x1), pz(z1))
    ctx.lineTo(px(x2), pz(z2))
    ctx.stroke()
  }

  const bl = 11.885 // baseline
  const dsl = 5.485 // doubles sideline
  const ssl = 4.115 // singles sideline
  const svc = 6.4 // service line

  // doubles rectangle
  line(-dsl, -bl, dsl, -bl)
  line(-dsl, bl, dsl, bl)
  line(-dsl, -bl, -dsl, bl)
  line(dsl, -bl, dsl, bl)
  // singles sidelines
  line(-ssl, -bl, -ssl, bl)
  line(ssl, -bl, ssl, bl)
  // service lines
  line(-ssl, -svc, ssl, -svc)
  line(-ssl, svc, ssl, svc)
  // centre service line
  line(0, -svc, 0, svc)
  // centre marks on baselines
  line(0, -bl, 0, -bl + 0.4)
  line(0, bl - 0.4, 0, bl)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return { texture, planeW, planeH }
}
