import { useEffect, useRef } from "react"
import * as THREE from "three"

// ============================================
// CONFIGURATION
// ============================================
const LINE_COLOR = 0x273e81
const BG_COLOR = 0x0a0a1a
const GRID_SIZE = 20.0
const LINE_WIDTH = 1.5
const SCROLL_SPEED = 0.02
const SCROLL_DIRECTION = { x: 0, y: 1 } // -1 = down/left, 1 = up/right
// ============================================

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

export default function SynthwaveGrid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Scene setup
    const scene = new THREE.Scene()

    // Orthographic camera for full-screen plane
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Shader material with uniforms
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(container.clientWidth, container.clientHeight),
        },
        uLineColor: { value: new THREE.Color(LINE_COLOR) },
        uBgColor: { value: new THREE.Color(BG_COLOR) },
        uGridSize: { value: GRID_SIZE },
        uLineWidth: { value: LINE_WIDTH },
        uScrollSpeed: { value: SCROLL_SPEED },
        uScrollDirection: {
          value: new THREE.Vector2(SCROLL_DIRECTION.x, SCROLL_DIRECTION.y),
        },
      },
    })

    // Full-screen plane
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      material.uniforms.uResolution.value.set(width, height)
    }
    window.addEventListener("resize", handleResize)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      material.uniforms.uTime.value += 0.016
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}
