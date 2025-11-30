import * as THREE from "three"

export interface MountainsElement {
  object: THREE.Group
  dispose: () => void
}

export function createMountains(): MountainsElement {
  const group = new THREE.Group()

  // TODO: Add mountain geometry

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
