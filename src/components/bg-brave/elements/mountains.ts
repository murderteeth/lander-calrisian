import * as THREE from "three"
import { Line2 } from "three/addons/lines/Line2.js"
import { LineMaterial } from "three/addons/lines/LineMaterial.js"
import { LineGeometry } from "three/addons/lines/LineGeometry.js"
import {
  BG_COLOR,
  MOUNTAINS_COLOR,
  MOUNTAINS_DISTANCE,
  MOUNTAINS_RADIUS,
  MOUNTAINS_LINE_WIDTH,
  MOUNTAINS_ROTATION,
  MOUNTAINS_STRETCH_Y,
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

  // Flatten for LineGeometry (needs continuous points per segment)
  const positions: number[] = []
  for (const edge of edges) {
    positions.push(...edge)
  }
  return positions
}

export function createMountains(): MountainsElement {
  const group = new THREE.Group()

  // Solid fill
  const geometry = new THREE.OctahedronGeometry(MOUNTAINS_RADIUS, 0)
  const fillMaterial = new THREE.MeshBasicMaterial({
    color: BG_COLOR,
    side: THREE.DoubleSide,
  })
  const fill = new THREE.Mesh(geometry, fillMaterial)

  // Fat wireframe lines using Line2
  const lineMaterial = new LineMaterial({
    color: MOUNTAINS_COLOR,
    linewidth: MOUNTAINS_LINE_WIDTH,
    worldUnits: false, // Screen-space pixels
  })

  // Create separate Line2 for each edge (Line2 draws continuous lines)
  const positions = createOctahedronLines(MOUNTAINS_RADIUS)
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

  // Position at horizon
  mountain.position.set(0, 0, -MOUNTAINS_DISTANCE)

  // Apply rotation (convert degrees to radians)
  mountain.rotation.x = THREE.MathUtils.degToRad(MOUNTAINS_ROTATION.x)
  mountain.rotation.y = THREE.MathUtils.degToRad(MOUNTAINS_ROTATION.y)
  mountain.rotation.z = THREE.MathUtils.degToRad(MOUNTAINS_ROTATION.z)

  // Apply vertical stretch
  mountain.scale.y = MOUNTAINS_STRETCH_Y

  group.add(mountain)

  // Clean up source geometry
  geometry.dispose()

  return {
    object: group,
    onResize: (width: number, height: number) => {
      lineMaterial.resolution.set(width, height)
    },
    dispose: () => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof Line2) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) {
            child.material.dispose()
          }
        }
      })
    },
  }
}
