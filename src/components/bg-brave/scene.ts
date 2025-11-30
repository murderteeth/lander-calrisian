import * as THREE from "three"
THREE.ColorManagement.enabled = false
import { createGrid, type GridElement } from "./elements/grid"
import { createMountains, type MountainsElement } from "./elements/mountains"
import { createY, type YElement } from "./elements/y"
import {
  BG_COLOR,
  CAMERA_FOV,
  CAMERA_HEIGHT,
  HORIZON_POSITION,
} from "./config"

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
  scene.background = new THREE.Color(BG_COLOR)

  // Perspective camera
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    width / height,
    0.1,
    1000
  )
  camera.position.set(0, CAMERA_HEIGHT, 0)

  // Calculate tilt to place horizon at desired screen position
  // HORIZON_POSITION: 0 = bottom, 0.5 = center, 1 = top
  const fovRad = THREE.MathUtils.degToRad(CAMERA_FOV)
  const tilt = (HORIZON_POSITION - 0.5) * fovRad
  camera.rotation.x = tilt

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Elements
  const grid: GridElement = createGrid()
  const mountains: MountainsElement = createMountains()
  const y: YElement = createY()

  scene.add(grid.object)
  scene.add(mountains.object)
  scene.add(y.object)

  // Set initial resolution for line materials
  mountains.onResize(width, height)
  y.onResize(width, height)

  // Resize handler
  const handleResize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    mountains.onResize(w, h)
    y.onResize(w, h)
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
