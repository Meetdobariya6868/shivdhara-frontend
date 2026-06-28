import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import { usersService } from '../services/users.service'
import type { CreateSalesmanPayload, Salesman } from '../types'
import { usersKeys } from './useSalesmen'

/**
 * Mutation for POST /users — create a salesman account.
 * On success, invalidates the salesman roster so the home screen
 * reflects the new entry on the next visit without a manual refresh.
 */
export function useCreateSalesman() {
  const queryClient = useQueryClient()

  return useMutation<{ data: Salesman }, AxiosError<ApiError>, CreateSalesmanPayload>({
    mutationFn: async (payload) => {
      const response = await usersService.create(payload)
      return { data: response.data }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all })
    },
  })
}
