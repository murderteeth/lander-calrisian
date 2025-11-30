import * as THREE from "three"

export interface YElement {
  object: THREE.Group
  dispose: () => void
}

export function createY(): YElement {
  const group = new THREE.Group()

  // TODO: Add Y character geometry

  return {
    object: group,
    dispose: () => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) {
            child.material.dispose()
          }
        }
      })
    },
  }
}
