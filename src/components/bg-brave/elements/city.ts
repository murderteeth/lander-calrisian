import * as THREE from "three"
import { Line2 } from "three/addons/lines/Line2.js"
import { LineMaterial } from "three/addons/lines/LineMaterial.js"
import { LineGeometry } from "three/addons/lines/LineGeometry.js"
import {
  BG_COLOR,
  CITY_COLOR,
  CITY_ROW_DISTANCES,
  CITY_LINE_WIDTH,
  BUILDINGS,
  BUILDINGS_MID,
  BUILDINGS_FAR,
  CENTRAL_BUILDING,
} from "../config"

export interface CityElement {
  object: THREE.Group
  onResize: (width: number, height: number) => void
  dispose: () => void
}

// Create wireframe edges for a box
function createBoxEdges(width: number, height: number, depth: number): number[] {
  const hw = width / 2
  const hh = height / 2
  const hd = depth / 2

  // 8 vertices of a box
  const v = [
    [-hw, -hh, -hd], // 0: back-bottom-left
    [hw, -hh, -hd],  // 1: back-bottom-right
    [hw, hh, -hd],   // 2: back-top-right
    [-hw, hh, -hd],  // 3: back-top-left
    [-hw, -hh, hd],  // 4: front-bottom-left
    [hw, -hh, hd],   // 5: front-bottom-right
    [hw, hh, hd],    // 6: front-top-right
    [-hw, hh, hd],   // 7: front-top-left
  ]

  // 12 edges of a box (each edge: start xyz, end xyz)
  const edges = [
    // Back face
    [...v[0], ...v[1]],
    [...v[1], ...v[2]],
    [...v[2], ...v[3]],
    [...v[3], ...v[0]],
    // Front face
    [...v[4], ...v[5]],
    [...v[5], ...v[6]],
    [...v[6], ...v[7]],
    [...v[7], ...v[4]],
    // Connecting edges
    [...v[0], ...v[4]],
    [...v[1], ...v[5]],
    [...v[2], ...v[6]],
    [...v[3], ...v[7]],
  ]

  const positions: number[] = []
  for (const edge of edges) {
    positions.push(...edge)
  }
  return positions
}

// Simple shader for exact color output
const fillVertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fillFragmentShader = `
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
`

interface BuildingConfig {
  x: number
  z: number
  width: number
  depth: number
  height: number
}

function createBuilding(
  config: BuildingConfig,
  lineMaterial: LineMaterial,
  fillMaterial: THREE.ShaderMaterial,
  rowDistance: number
): THREE.Group {
  const { x, z, width, depth, height } = config

  // Solid fill box
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const fill = new THREE.Mesh(geometry, fillMaterial)

  // Wireframe edges
  const positions = createBoxEdges(width, height, depth)
  const linesGroup = new THREE.Group()

  for (let i = 0; i < positions.length; i += 6) {
    const lineGeometry = new LineGeometry()
    lineGeometry.setPositions([
      positions[i], positions[i + 1], positions[i + 2],
      positions[i + 3], positions[i + 4], positions[i + 5],
    ])
    const line = new Line2(lineGeometry, lineMaterial)
    line.computeLineDistances()
    linesGroup.add(line)
  }

  // Group them together
  const building = new THREE.Group()
  building.add(fill)
  building.add(linesGroup)

  // Position: base slightly below ground (y=-1), offset into distance
  building.position.set(x, height / 2 - 1, -(rowDistance + z))

  return building
}

export function createCity(): CityElement {
  const group = new THREE.Group()

  // Shared line material for all buildings
  const lineMaterial = new LineMaterial({
    color: CITY_COLOR,
    linewidth: CITY_LINE_WIDTH,
    worldUnits: false,
  })

  // Shared fill material
  const fillMaterial = new THREE.ShaderMaterial({
    vertexShader: fillVertexShader,
    fragmentShader: fillFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(BG_COLOR) },
    },
    side: THREE.DoubleSide,
  })

  // Create far row buildings first (rendered behind everything)
  for (const config of BUILDINGS_FAR) {
    const building = createBuilding(config, lineMaterial, fillMaterial, CITY_ROW_DISTANCES.far)
    group.add(building)
  }

  // Create mid row buildings
  for (const config of BUILDINGS_MID) {
    const building = createBuilding(config, lineMaterial, fillMaterial, CITY_ROW_DISTANCES.mid)
    group.add(building)
  }

  // Create front row buildings
  for (const config of BUILDINGS) {
    const building = createBuilding(config, lineMaterial, fillMaterial, CITY_ROW_DISTANCES.front)
    group.add(building)
  }

  // Create central building (front row)
  const centralBuilding = createBuilding(CENTRAL_BUILDING, lineMaterial, fillMaterial, CITY_ROW_DISTANCES.front)
  group.add(centralBuilding)

  return {
    object: group,
    onResize: (width: number, height: number) => {
      lineMaterial.resolution.set(width, height)
    },
    dispose: () => {
      lineMaterial.dispose()
      fillMaterial.dispose()
      group.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof Line2) {
          child.geometry.dispose()
        }
      })
    },
  }
}
