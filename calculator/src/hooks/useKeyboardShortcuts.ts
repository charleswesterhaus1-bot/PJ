// Global keyboard shortcuts for power users quoting on the fly.
// Ignores keystrokes while typing in an input/textarea (except Escape).

import { useEffect } from 'react'

export interface ShortcutMap {
  onSave?: () => void
  onCopy?: () => void
  onPrint?: () => void
  onNewEstimate?: () => void
  onToggleHistory?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutMap) {
  useEffect(() => {
    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName.toLowerCase()
      return tag === 'input' || tag === 'textarea' || target.isContentEditable
    }

    function handleKeyDown(event: KeyboardEvent) {
      const cmdOrCtrl = event.metaKey || event.ctrlKey
      if (!cmdOrCtrl) return
      if (isTypingTarget(event.target) && event.key.toLowerCase() !== 's') return

      switch (event.key.toLowerCase()) {
        case 's':
          event.preventDefault()
          handlers.onSave?.()
          break
        case 'k':
          event.preventDefault()
          handlers.onCopy?.()
          break
        case 'p':
          event.preventDefault()
          handlers.onPrint?.()
          break
        case 'n':
          event.preventDefault()
          handlers.onNewEstimate?.()
          break
        case 'h':
          event.preventDefault()
          handlers.onToggleHistory?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
