import NumberFlow, { type Format } from '@number-flow/react'
import { useState, useEffect } from 'react'

export default function Odometer({ value, format, uponly = false, prefix = '', suffix = '', className = '' }: { value?: number, format?: Format, uponly?: boolean, prefix?: string, suffix?: string, className?: string }) {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 0)

  useEffect(() => {
    if (uponly && (value ?? 0) > displayValue) {
      setDisplayValue(value ?? 0)
    } else if (!uponly) {
      setDisplayValue(value ?? 0)
    }
  }, [value, uponly, displayValue, setDisplayValue])

  return <NumberFlow value={displayValue} format={format} prefix={prefix} suffix={suffix} className={className} />
}
