import * as THREE from "three"
import { BG_GRADIENT_TOP, BG_GRADIENT_BOTTOM } from "../config"

export interface BackgroundElement {
  object: THREE.Mesh
  dispose: () => void
}

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColorTop;
  uniform vec3 uColorBottom;

  varying vec2 vUv;

  void main() {
    vec3 color = mix(uColorBottom, uColorTop, vUv.y);
    gl_FragColor = vec4(color, 1.0);
  }
`

export function createBackground(): BackgroundElement {
  const geometry = new THREE.PlaneGeometry(2, 2)

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColorTop: { value: new THREE.Color(BG_GRADIENT_TOP) },
      uColorBottom: { value: new THREE.Color(BG_GRADIENT_BOTTOM) },
    },
    depthWrite: false,
    depthTest: false,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  mesh.renderOrder = -1000 // Render first (behind everything)

  return {
    object: mesh,
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
