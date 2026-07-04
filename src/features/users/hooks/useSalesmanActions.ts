import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { UserStatus } from '@/features/auth/types'
import { ordersKeys } from '@/features/orders/hooks/useOrders'
import type { ApiError, ApiResponse } from '@/types'

import { usersService } from '../services/users.service'
import type { Salesman, UpdateSalesmanPayload } from '../types'
import { usersKeys } from './useSalesmen'

/**
 * Prime the detail cache with the freshly returned salesman and invalidate the
 * roster so every view stays consistent after a mutation. Mirrors the
 * syncOrderDetail helper in the orders feature.
 */
function syncSalesmanDetail(qc: QueryClient, res: ApiResponse<Salesman>): void {
  qc.setQueryData(usersKeys.detail(res.data.id), res)
  void qc.invalidateQueries({ queryKey: usersKeys.list() })
}

/** Update a salesman's profile (name, mobile). */
export function useUpdateSalesman() {
  const qc = useQueryClient()

  return useMutation<
    ApiResponse<Salesman>,
    AxiosError<ApiError>,
    { id: number; payload: UpdateSalesmanPayload }
  >({
    mutationFn: ({ id, payload }) => usersService.update(id, payload),
    onSuccess: (res) => syncSalesmanDetail(qc, res),
  })
}

/** Block or unblock a salesman. */
export function useUpdateSalesmanStatus() {
  const qc = useQueryClient()

  return useMutation<
    ApiResponse<Salesman>,
    AxiosError<ApiError>,
    { id: number; status: UserStatus }
  >({
    mutationFn: ({ id, status }) => usersService.updateStatus(id, status),
    onSuccess: (res) => syncSalesmanDetail(qc, res),
  })
}

/**
 * Grant or revoke the create-orders permission. Optimistically flips the
 * detail cache so the toggle responds instantly, rolling back on error.
 */
export function useUpdateSalesmanPermission() {
  const qc = useQueryClient()

  return useMutation<
    ApiResponse<Salesman>,
    AxiosError<ApiError>,
    { id: number; canCreateOrders: boolean },
    { previous?: ApiResponse<Salesman> }
  >({
    mutationFn: ({ id, canCreateOrders }) =>
      usersService.updatePermissions(id, canCreateOrders),
    onMutate: async ({ id, canCreateOrders }) => {
      await qc.cancelQueries({ queryKey: usersKeys.detail(id) })
      const previous = qc.getQueryData<ApiResponse<Salesman>>(usersKeys.detail(id))

      if (previous) {
        qc.setQueryData<ApiResponse<Salesman>>(usersKeys.detail(id), {
          ...previous,
          data: { ...previous.data, can_create_orders: canCreateOrders },
        })
      }

      return { previous }
    },
    onError: (_err, { id }, context) => {
      if (context?.previous) {
        qc.setQueryData(usersKeys.detail(id), context.previous)
      }
    },
    onSettled: (_res, _err, { id }) => {
      void qc.invalidateQueries({ queryKey: usersKeys.detail(id) })
      void qc.invalidateQueries({ queryKey: usersKeys.list() })
    },
  })
}

/** Soft-delete a salesman. Caller handles navigation on success. */
export function useDeleteSalesman() {
  const qc = useQueryClient()

  return useMutation<ApiResponse<null>, AxiosError<ApiError>, number>({
    mutationFn: (id) => usersService.remove(id),
    onSuccess: (_res, id) => {
      qc.removeQueries({ queryKey: usersKeys.detail(id) })
      void qc.invalidateQueries({ queryKey: usersKeys.all })
      // Deleting a salesman soft-deletes their orders too — refresh the order
      // list and the salesman filter so the removed data disappears at once.
      void qc.invalidateQueries({ queryKey: ordersKeys.all })
    },
  })
}
