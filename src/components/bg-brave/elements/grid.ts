import * as THREE from "three"
import {
  GRID_LINE_COLOR,
  GRID_CELL_SIZE,
  GRID_LINE_WIDTH,
  GRID_DEPTH,
  GRID_WIDTH,
  GRID_SCROLL_SPEED,
} from "../config"

const vertexShader = `
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uLineColor;
  uniform float uCellSize;
  uniform float uLineWidth;
  uniform float uScrollSpeed;

  varying vec3 vWorldPos;

  void main() {
    // Use world XZ coordinates for grid (Y is up)
    vec2 coord = vWorldPos.xz;

    // Scroll animation (moving toward camera = negative Z)
    coord.y -= uTime * uScrollSpeed;

    // Grid coordinates
    vec2 gridCoord = coord / uCellSize;
    vec2 grid = abs(fract(gridCoord - 0.5) - 0.5) * uCellSize;

    // Screen-space derivatives for proper antialiasing
    vec2 dGrid = fwidth(coord);
    vec2 lineAA = dGrid * 1.5; // Antialias width

    // Lines with screen-space antialiasing (no sub-pixel flickering)
    float lineX = 1.0 - smoothstep(uLineWidth - lineAA.x, uLineWidth + lineAA.x, grid.x);
    float lineY = 1.0 - smoothstep(uLineWidth - lineAA.y, uLineWidth + lineAA.y, grid.y);
    float line = max(lineX, lineY);

    // Fade out with distance for cleaner horizon
    float dist = length(vWorldPos.xz);
    float fade = 1.0 - smoothstep(50.0, 150.0, dist);
    line *= fade;

    if (line < 0.01) discard;

    gl_FragColor = vec4(uLineColor, line);
  }
`

export interface GridElement {
  object: THREE.Mesh
  material: THREE.ShaderMaterial
  update: (time: number) => void
  dispose: () => void
}

export function createGrid(): GridElement {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uLineColor: { value: new THREE.Color(GRID_LINE_COLOR) },
      uCellSize: { value: GRID_CELL_SIZE },
      uLineWidth: { value: GRID_LINE_WIDTH },
      uScrollSpeed: { value: GRID_SCROLL_SPEED },
    },
    transparent: true,
    side: THREE.DoubleSide,
  })

  // Large horizontal plane (rotated to be floor)
  const geometry = new THREE.PlaneGeometry(GRID_WIDTH, GRID_DEPTH, 1, 1)
  const mesh = new THREE.Mesh(geometry, material)

  // Rotate to be horizontal (floor)
  mesh.rotation.x = -Math.PI / 2
  // Position so it extends in front of camera
  mesh.position.z = -GRID_DEPTH / 2
  mesh.position.y = 0

  return {
    object: mesh,
    material,
    update: (time: number) => {
      material.uniforms.uTime.value = time
    },
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
