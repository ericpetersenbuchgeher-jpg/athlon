import { useMemo, type ReactElement } from 'react'
import { InstancedMesh, BoxGeometry, Color, Object3D } from 'three'
import { MeshStandardNodeMaterial } from 'three/webgpu'

// A readable indoor sports arena (palazzetto): solid tiered concrete grandstands on all four sides,
// a dense but muted crowd sitting on the treads, courtside boards with an LED ribbon, and a roof
// with light rigs + spotlights on the court. Built so it clearly reads as a venue, not floating dots.

const INNER = 13 // distance of the stand front (courtside boards) from centre
const ROWS = 18
const RISE = 0.66 // step height
const RUN = 0.85 // step depth
const WIDTH = 30 // stand width (covers the side, overlaps corners)
const SEAT = 0.34
const SEAT_GAP = 0.52
const TOP_H = ROWS * RISE // height of the top tread
const CONCRETE = '#3b414c'

// muted, realistic crowd: mostly dark/greys, a minority of team colours
const CROWD_COLORS = ['#232a34', '#2c3542', '#39424f', '#4a5361', '#616b79', '#8b93a0', '#b7bdc7']
const CROWD_POP = ['#ff6b3d', '#4f83ff', '#c8ff4d', '#e23b4e', '#37d17a', '#ffffff']

function buildStandSeats(): InstancedMesh {
  const perRow = Math.floor(WIDTH / SEAT_GAP)
  const count = ROWS * perRow
  const geo = new BoxGeometry(SEAT, SEAT * 1.15, SEAT)
  const mat = new MeshStandardNodeMaterial({ roughness: 0.9, metalness: 0.0 })
  const mesh = new InstancedMesh(geo, mat, count)
  const dummy = new Object3D()
  const color = new Color()
  let i = 0
  for (let r = 0; r < ROWS; r++) {
    const y = (r + 1) * RISE + SEAT * 0.6
    const z = INNER + (r + 0.5) * RUN
    for (let c = 0; c < perRow; c++) {
      const x = c * SEAT_GAP - (perRow * SEAT_GAP) / 2 + SEAT_GAP / 2
      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      // ~78% muted crowd/seat colours, ~22% a team-colour pop
      if (Math.random() < 0.22) color.set(CROWD_POP[(Math.random() * CROWD_POP.length) | 0])
      else color.set(CROWD_COLORS[(Math.random() * CROWD_COLORS.length) | 0])
      color.multiplyScalar(0.72 + Math.random() * 0.4)
      mesh.setColorAt(i, color)
      i++
    }
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  mesh.frustumCulled = false
  return mesh
}

// one grandstand built facing -Z (front toward the court); rotated into place by <Arena>
function StandDeck() {
  const seats = useMemo(() => buildStandSeats(), [])
  const steps: ReactElement[] = []
  for (let r = 0; r < ROWS; r++) {
    const h = (r + 1) * RISE
    steps.push(
      <mesh key={r} position={[0, h / 2, INNER + (r + 0.5) * RUN]} receiveShadow>
        <boxGeometry args={[WIDTH, h, RUN]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.96} metalness={0.02} />
      </mesh>,
    )
  }
  const backZ = INNER + ROWS * RUN
  return (
    <group>
      {steps}
      <primitive object={seats} />
      {/* upper facade wall behind the top row */}
      <mesh position={[0, TOP_H + 3, backZ + 0.4]}>
        <boxGeometry args={[WIDTH, 6, 0.8]} />
        <meshStandardMaterial color="#0d1119" roughness={0.95} />
      </mesh>
    </group>
  )
}

// courtside boards ring + emissive LED ribbon on top (arena signal)
function Boards() {
  const items: ReactElement[] = []
  const half = INNER
  const sides: [number, number, number][] = [
    [0, 0, half],
    [0, 0, -half],
    [half, Math.PI / 2, 0],
    [-half, Math.PI / 2, 0],
  ]
  sides.forEach(([off, yaw], idx) => {
    const pos: [number, number, number] = yaw === 0 ? [0, 0.55, off] : [off, 0.55, 0]
    items.push(
      <group key={idx} position={pos} rotation={[0, yaw, 0]}>
        <mesh>
          <boxGeometry args={[WIDTH - 2, 1.1, 0.35]} />
          <meshStandardMaterial color="#10151d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.62, 0.02]}>
          <boxGeometry args={[WIDTH - 2, 0.16, 0.4]} />
          <meshStandardMaterial color="#2f6df0" emissive="#3f7dff" emissiveIntensity={1.6} />
        </mesh>
      </group>,
    )
  })
  return <>{items}</>
}

function Roof() {
  const roofY = TOP_H + 6
  const rigs: [number, number][] = [
    [-7, -7],
    [7, -7],
    [-7, 7],
    [7, 7],
    [0, 0],
  ]
  const beams = [-12, -6, 0, 6, 12]
  return (
    <group>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roofY, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#070a10" roughness={1} />
      </mesh>
      {/* trusses */}
      {beams.map((x, i) => (
        <mesh key={i} position={[x, roofY - 0.5, 0]}>
          <boxGeometry args={[0.3, 0.3, 60]} />
          <meshStandardMaterial color="#151a22" />
        </mesh>
      ))}
      {/* light rigs + spotlights on the court */}
      {rigs.map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, roofY - 0.9, z]}>
            <boxGeometry args={[3, 0.3, 3]} />
            <meshStandardMaterial color="#eef3ff" emissive="#eef3ff" emissiveIntensity={2.4} />
          </mesh>
          <spotLight
            position={[x, roofY - 0.9, z]}
            angle={0.7}
            penumbra={0.6}
            intensity={180}
            distance={70}
            decay={1.05}
            color="#eef4ff"
          />
        </group>
      ))}
    </group>
  )
}

export function Arena() {
  return (
    <group>
      {/* apron / arena floor around the court (at court level) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.63, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0d13" roughness={1} />
      </mesh>

      {/* the bowl sits ON the court floor (y = -1.6), not floating above it */}
      <group position={[0, -1.6, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <StandDeck />
          </group>
        ))}
        <Boards />
        <Roof />
      </group>
    </group>
  )
}
