import * as THREE from "three"
import { SVGLoader } from "three/addons/loaders/SVGLoader.js"
import { Line2 } from "three/addons/lines/Line2.js"
import { LineMaterial } from "three/addons/lines/LineMaterial.js"
import { LineGeometry } from "three/addons/lines/LineGeometry.js"
import {
  BG_COLOR,
  Y_COLOR,
  Y_POSITION,
  Y_SCALE,
  Y_ROTATION,
  Y_LINE_WIDTH,
  Y_DEPTH,
} from "../config"

export interface YElement {
  object: THREE.Group
  onResize: (width: number, height: number) => void
  dispose: () => void
}

// Y polygon points (pre-centered around 0,0)
const Y_POINTS = [
  [-30, -120],
  [31, -120],
  [31, -24],
  [135, 78],
  [92, 120],
  [0, 30],
  [-92, 120],
  [-135, 78],
  [-30, -24],
]

// SVG path for the curved bottom part only
const ARC_SVG = `<svg xmlns="http://www.w3.org/2000/svg"><path d="M288.19,138.27l-46.65,45.56c2.56,8.33,3.89,17.07,3.89,26.01,0,24.01-9.57,46.59-26.96,63.57-17.38,16.98-40.5,26.33-65.08,26.33s-47.7-9.35-65.08-26.33c-17.38-16.98-26.96-39.55-26.96-63.57,0-8.94,1.33-17.68,3.89-26.01l-46.65-45.56C6.74,159.54,0,183.93,0,209.85c0,82.75,68.68,149.83,153.4,149.83s153.4-67.08,153.4-149.83c0-25.92-6.74-50.31-18.6-71.57Z"/></svg>`

// Helper to create wireframe edges from ExtrudeGeometry
function addEdgeLines(
  geometry: THREE.BufferGeometry,
  group: THREE.Group,
  lineMaterial: LineMaterial,
  geometries: THREE.BufferGeometry[]
) {
  const edges = new THREE.EdgesGeometry(geometry, 15)
  const positions = edges.getAttribute("position")

  for (let i = 0; i < positions.count; i += 2) {
    const lineGeometry = new LineGeometry()
    lineGeometry.setPositions([
      positions.getX(i), positions.getY(i), positions.getZ(i),
      positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1),
    ])
    geometries.push(lineGeometry)
    const line = new Line2(lineGeometry, lineMaterial)
    line.computeLineDistances()
    group.add(line)
  }

  edges.dispose()
}

export function createY(): YElement {
  const group = new THREE.Group()
  const geometries: THREE.BufferGeometry[] = []

  // Line material
  const lineMaterial = new LineMaterial({
    color: Y_COLOR,
    linewidth: Y_LINE_WIDTH,
    worldUnits: false,
  })

  // Fill material
  const fillMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(BG_COLOR) },
    },
    side: THREE.DoubleSide,
  })

  // Extrusion settings
  const extrudeSettings = {
    depth: Y_DEPTH,
    bevelEnabled: false,
  }

  // Center offset for SVG content
  const centerX = 153
  const centerY = 180

  // Offset Y polygon up from arc
  const yOffset = 32

  // === Y POLYGON (extruded) ===
  const yShape = new THREE.Shape()
  yShape.moveTo(Y_POINTS[0][0], Y_POINTS[0][1])
  for (let i = 1; i < Y_POINTS.length; i++) {
    yShape.lineTo(Y_POINTS[i][0], Y_POINTS[i][1])
  }
  yShape.closePath()

  const yGeometry = new THREE.ExtrudeGeometry(yShape, extrudeSettings)
  geometries.push(yGeometry)
  const yMesh = new THREE.Mesh(yGeometry, fillMaterial)
  yMesh.position.y = yOffset
  yMesh.position.z = -Y_DEPTH / 2 // Center the extrusion
  group.add(yMesh)

  // Y wireframe edges
  const yEdgeGroup = new THREE.Group()
  yEdgeGroup.position.y = yOffset
  yEdgeGroup.position.z = -Y_DEPTH / 2
  addEdgeLines(yGeometry, yEdgeGroup, lineMaterial, geometries)
  group.add(yEdgeGroup)

  // === ARC PATH (extruded) ===
  const loader = new SVGLoader()
  const svgData = loader.parse(ARC_SVG)

  for (const path of svgData.paths) {
    const shapes = SVGLoader.createShapes(path)

    for (const shape of shapes) {
      const arcGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      geometries.push(arcGeometry)

      // Center and flip
      arcGeometry.translate(-centerX, -centerY, -Y_DEPTH / 2)
      arcGeometry.scale(1, -1, 1)

      const arcMesh = new THREE.Mesh(arcGeometry, fillMaterial)
      group.add(arcMesh)

      // Arc wireframe edges
      addEdgeLines(arcGeometry, group, lineMaterial, geometries)
    }
  }

  // Apply transforms
  group.scale.set(Y_SCALE, Y_SCALE, Y_SCALE)
  group.position.set(Y_POSITION.x, Y_POSITION.y, Y_POSITION.z)
  group.rotation.x = THREE.MathUtils.degToRad(Y_ROTATION.x)
  group.rotation.y = THREE.MathUtils.degToRad(Y_ROTATION.y)
  group.rotation.z = THREE.MathUtils.degToRad(Y_ROTATION.z)

  return {
    object: group,
    onResize: (width: number, height: number) => {
      lineMaterial.resolution.set(width, height)
    },
    dispose: () => {
      fillMaterial.dispose()
      lineMaterial.dispose()
      geometries.forEach((g) => g.dispose())
    },
  }
}
