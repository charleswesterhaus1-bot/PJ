// React binding around the localStorage estimate archive: exposes the
// current list plus add/delete actions, and keeps state in sync.

import { useCallback, useEffect, useState } from 'react'
import type { SavedEstimate } from '../types'
import { addEstimate, deleteEstimate, loadEstimates } from '../utils/storage'

export function useSavedEstimates() {
  const [estimates, setEstimates] = useState<SavedEstimate[]>([])

  useEffect(() => {
    setEstimates(loadEstimates())
  }, [])

  const save = useCallback((estimate: SavedEstimate) => {
    const { estimates: updated, ok } = addEstimate(estimate)
    setEstimates(updated)
    return ok
  }, [])

  const remove = useCallback((id: string) => {
    setEstimates(deleteEstimate(id))
  }, [])

  return { estimates, save, remove }
}
