import * as THREE from "three"
THREE.ColorManagement.enabled = false
import { createBackground, type BackgroundElement } from "./elements/background"
import { createGrid, type GridElement } from "./elements/grid"
import { createCity, type CityElement } from "./elements/city"
import { createY, type YElement } from "./elements/y"
import {
  CAMERA_FOV,
  CAMERA_HEIGHT,
  CAMERA_ORBIT_ANGLE,
  CAMERA_DISTANCE,
  CAMERA_ROLL,
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

  // Perspective camera with orbital positioning around Y
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    width / height,
    0.1,
    1000
  )

  // Original camera target position (preserved from mountains version)
  const targetX = 0
  const targetY = 20
  const targetZ = -100

  // Calculate camera position on orbit circle around target
  const orbitAngleRad = THREE.MathUtils.degToRad(CAMERA_ORBIT_ANGLE)
  const cameraX = targetX + Math.sin(orbitAngleRad) * CAMERA_DISTANCE
  const cameraZ = targetZ + Math.cos(orbitAngleRad) * CAMERA_DISTANCE
  camera.position.set(cameraX, CAMERA_HEIGHT, cameraZ)

  // Look at the target position
  camera.lookAt(targetX, targetY, targetZ)

  // Apply roll (tilt on view axis) after lookAt
  camera.rotateZ(THREE.MathUtils.degToRad(-CAMERA_ROLL))

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Elements
  const background: BackgroundElement = createBackground()
  const grid: GridElement = createGrid()
  const city: CityElement = createCity()
  const y: YElement = createY()

  scene.add(background.object)
  scene.add(grid.object)
  scene.add(city.object)
  scene.add(y.object)

  // Set initial resolution for line materials
  city.onResize(width, height)
  y.onResize(width, height)

  // Resize handler
  const handleResize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    city.onResize(w, h)
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
      background.dispose()
      grid.dispose()
      city.dispose()
      y.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    },
  }
}
