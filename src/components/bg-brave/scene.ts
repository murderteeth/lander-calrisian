import * as THREE from "three"
import { createGrid, type GridElement } from "./elements/grid"
import { createMountains, type MountainsElement } from "./elements/mountains"
import { createY, type YElement } from "./elements/y"

export interface Scene {
  start: () => void
  stop: () => void
  dispose: () => void
}

export function createScene(container: HTMLElement): Scene {
  const width = container.clientWidth
  const height = container.clientHeight

  // Scene
  const scene = new THREE.Scene()

  // Orthographic camera for full-screen plane
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Elements
  const grid: GridElement = createGrid(width, height)
  const mountains: MountainsElement = createMountains()
  const y: YElement = createY()

  scene.add(grid.object)
  scene.add(mountains.object)
  scene.add(y.object)

  // Resize handler
  const handleResize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h)
    grid.onResize(w, h)
  }
  window.addEventListener("resize", handleResize)

  // Animation
  let animationId: number
  let time = 0

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    time += 0.016
    grid.update(time)
    renderer.render(scene, camera)
  }

  return {
    start: () => {
      animate()
    },
    stop: () => {
      cancelAnimationFrame(animationId)
    },
    dispose: () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      grid.dispose()
      mountains.dispose()
      y.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    },
  }
}
