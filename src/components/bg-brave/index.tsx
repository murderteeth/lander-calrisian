import { useEffect, useRef } from "react"
import { createScene, type Scene } from "./scene"

export default function BgBrave() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = createScene(containerRef.current)
    sceneRef.current = scene
    scene.start()

    return () => {
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 -z-10" />
}
