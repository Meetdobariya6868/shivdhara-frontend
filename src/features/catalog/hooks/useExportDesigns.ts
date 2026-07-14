import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import { catalogService } from '../services/catalog.service'

/** Fetches the full catalogue as an .xlsx Blob; the caller saves it to disk. */
export function useExportDesigns() {
  return useMutation<Blob, AxiosError<ApiError>>({
    mutationFn: () => catalogService.exportDesigns(),
  })
}
