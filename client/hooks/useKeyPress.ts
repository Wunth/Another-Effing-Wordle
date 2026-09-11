import { useEffect } from 'react'

export function useKeyPress(onKey: (key: string) => void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') return onKey('enter')
      if (e.key === 'Backspace') return onKey('backspace')
      if (/^[a-zA-Z]$/.test(e.key)) return onKey(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKey])
}
