import * as THREE from "three"
import { Line2 } from "three/addons/lines/Line2.js"
import { LineMaterial } from "three/addons/lines/LineMaterial.js"
import { LineGeometry } from "three/addons/lines/LineGeometry.js"
import {
  BG_COLOR,
  MOUNTAINS_COLOR,
  MOUNTAINS_DISTANCE,
  MOUNTAINS_LINE_WIDTH,
  MOUNTAINS_ROTATION,
  MOUNTAINS,
} from "../config"

export interface MountainsElement {
  object: THREE.Group
  onResize: (width: number, height: number) => void
  dispose: () => void
}

function createOctahedronLines(radius: number): number[] {
  // Octahedron vertices
  const top = [0, radius, 0]
  const bottom = [0, -radius, 0]
  const front = [0, 0, radius]
  const back = [0, 0, -radius]
  const left = [-radius, 0, 0]
  const right = [radius, 0, 0]

  // Edges as line segments (each edge: start xyz, end xyz)
  const edges = [
    // Top pyramid
    [...top, ...front],
    [...top, ...right],
    [...top, ...back],
    [...top, ...left],
    // Bottom pyramid
    [...bottom, ...front],
    [...bottom, ...right],
    [...bottom, ...back],
    [...bottom, ...left],
    // Middle square
    [...front, ...right],
    [...right, ...back],
    [...back, ...left],
    [...left, ...front],
  ]

  // Flatten for LineGeometry
  const positions: number[] = []
  for (const edge of edges) {
    positions.push(...edge)
  }
  return positions
}

// Simple shader that outputs exact color with no processing
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

function createMountain(
  config: { x: number; z: number; radius: number; stretchY: number },
  lineMaterial: LineMaterial,
  fillMaterial: THREE.ShaderMaterial
): THREE.Group {
  const { x, z, radius, stretchY } = config

  // Solid fill with raw shader
  const geometry = new THREE.OctahedronGeometry(radius, 0)
  const fill = new THREE.Mesh(geometry, fillMaterial)

  // Wireframe edges
  const positions = createOctahedronLines(radius)
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
  const mountain = new THREE.Group()
  mountain.add(fill)
  mountain.add(linesGroup)

  // Position
  mountain.position.set(x, 0, -(MOUNTAINS_DISTANCE + z))

  // Apply shared rotation
  mountain.rotation.x = THREE.MathUtils.degToRad(MOUNTAINS_ROTATION.x)
  mountain.rotation.y = THREE.MathUtils.degToRad(MOUNTAINS_ROTATION.y)
  mountain.rotation.z = THREE.MathUtils.degToRad(MOUNTAINS_ROTATION.z)

  // Apply vertical stretch
  mountain.scale.y = stretchY

  return mountain
}

export function createMountains(): MountainsElement {
  const group = new THREE.Group()

  // Shared line material for all mountains
  const lineMaterial = new LineMaterial({
    color: MOUNTAINS_COLOR,
    linewidth: MOUNTAINS_LINE_WIDTH,
    worldUnits: false,
  })

  // Shared fill material - raw shader for exact color match
  const fillMaterial = new THREE.ShaderMaterial({
    vertexShader: fillVertexShader,
    fragmentShader: fillFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(BG_COLOR) },
    },
    side: THREE.DoubleSide,
  })

  // Create each mountain from config
  for (const config of MOUNTAINS) {
    const mountain = createMountain(config, lineMaterial, fillMaterial)
    group.add(mountain)
  }

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
