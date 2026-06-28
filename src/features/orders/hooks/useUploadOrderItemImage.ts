import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import { ordersService } from '../services/orders.service'
import type { UploadedImage } from '../types'

/**
 * Mutation for POST /order-item-images — uploads a product photo as soon as the
 * user picks it, so the order payload only carries the returned storage path.
 */
export function useUploadOrderItemImage() {
  return useMutation<UploadedImage, AxiosError<ApiError>, File>({
    mutationFn: async (file) => {
      const response = await ordersService.uploadItemImage(file)
      return response.data
    },
  })
}
