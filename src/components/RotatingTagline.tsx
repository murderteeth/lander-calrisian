import { useState, useEffect } from "react"
import { useScramble, type UseScrambleProps } from "../hooks/useScramble"

interface RotatingTaglineProps {
  messages: string[]
  interval?: number
  className?: string
  scrambleOptions?: Partial<UseScrambleProps>
}

export default function RotatingTagline({
  messages,
  interval = 6000,
  className = "",
  scrambleOptions = {},
}: RotatingTaglineProps) {
  const [index, setIndex] = useState(0)

  const { ref } = useScramble({
    text: messages[index],
    playOnMount: false,
    speed: 1.4,
    tick: 1,
    step: 1,
    scramble: 8,
    seed: 2,
    range: [0x2580, 0x259F] as unknown as { 0: number; 1: number } & number[],
    ...scrambleOptions,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, interval)
    return () => clearInterval(timer)
  }, [messages.length, interval])

  return <span ref={ref} className={className}>{messages[0]}</span>
}
