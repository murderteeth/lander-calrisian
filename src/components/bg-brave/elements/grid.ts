import * as THREE from "three"
import {
  BG_COLOR,
  GRID_LINE_COLOR,
  GRID_SIZE,
  GRID_LINE_WIDTH,
  GRID_SCROLL_SPEED,
  GRID_SCROLL_DIRECTION,
} from "../config"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uLineColor;
  uniform vec3 uBgColor;
  uniform float uGridSize;
  uniform float uLineWidth;
  uniform float uScrollSpeed;
  uniform vec2 uScrollDirection;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Scroll animation
    uv += uScrollDirection * uTime * uScrollSpeed;

    // Scale to grid
    vec2 gridUv = uv * uGridSize;

    // Calculate pixel size for constant-width lines
    vec2 pixelSize = uGridSize / uResolution;
    float lineThickness = uLineWidth * max(pixelSize.x, pixelSize.y);

    // Grid lines with smoothstep antialiasing
    vec2 grid = abs(fract(gridUv - 0.5) - 0.5);
    float lineX = smoothstep(lineThickness, lineThickness * 0.5, grid.x);
    float lineY = smoothstep(lineThickness, lineThickness * 0.5, grid.y);
    float line = max(lineX, lineY);

    // Mix background and line colors
    vec3 color = mix(uBgColor, uLineColor, line);

    gl_FragColor = vec4(color, 1.0);
  }
`

export interface GridElement {
  object: THREE.Mesh
  material: THREE.ShaderMaterial
  update: (time: number) => void
  onResize: (width: number, height: number) => void
  dispose: () => void
}

export function createGrid(width: number, height: number): GridElement {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uLineColor: { value: new THREE.Color(GRID_LINE_COLOR) },
      uBgColor: { value: new THREE.Color(BG_COLOR) },
      uGridSize: { value: GRID_SIZE },
      uLineWidth: { value: GRID_LINE_WIDTH },
      uScrollSpeed: { value: GRID_SCROLL_SPEED },
      uScrollDirection: {
        value: new THREE.Vector2(GRID_SCROLL_DIRECTION.x, GRID_SCROLL_DIRECTION.y),
      },
    },
  })

  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)

  return {
    object: mesh,
    material,
    update: (time: number) => {
      material.uniforms.uTime.value = time
    },
    onResize: (w: number, h: number) => {
      material.uniforms.uResolution.value.set(w, h)
    },
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
