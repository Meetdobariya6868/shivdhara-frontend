import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import type { ApiResponse } from '@/types'

import { ordersService } from '../services/orders.service'
import type {
  CreateOrderItemPayload,
  OrderDetail,
  OrderStatus,
  UpdateOrderDetailsPayload,
  UpdateOrderItemPayload,
} from '../types'
import { ordersKeys } from './useOrders'

/**
 * Prime the detail cache with the freshly returned graph and invalidate the
 * affected lists so every view of this order stays consistent after a mutation.
 */
function syncOrderDetail(qc: QueryClient, res: ApiResponse<OrderDetail>): void {
  const order = res.data
  qc.setQueryData(ordersKeys.detail(order.id), res)
  void qc.invalidateQueries({ queryKey: ordersKeys.list() })
}

/** Change an order's workflow status (Confirm Order). */
export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Edit customer name/contact, category, type and order date. */
export function useUpdateOrderDetails() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOrderDetailsPayload }) =>
      ordersService.updateDetails(id, payload),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Soft-delete an order. Caller handles navigation on success. */
export function useDeleteOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersService.remove(id),
    onSuccess: (_res, id) => {
      qc.removeQueries({ queryKey: ordersKeys.detail(id) })
      void qc.invalidateQueries({ queryKey: ordersKeys.all })
    },
  })
}

/** Add a new, empty room to an order. */
export function useAddRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, roomName }: { orderId: number; roomName: string }) =>
      ordersService.addRoom(orderId, roomName),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Rename a room within an order. */
export function useRenameRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roomId, roomName }: { roomId: number; roomName: string }) =>
      ordersService.renameRoom(roomId, roomName),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Delete an empty room. The API refuses (409) if the room still has items. */
export function useDeleteRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (roomId: number) => ordersService.deleteRoom(roomId),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Add a new item to an existing room. */
export function useAddOrderItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ roomId, payload }: { roomId: number; payload: CreateOrderItemPayload }) =>
      ordersService.addItem(roomId, payload),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Update mutable fields of a single order item. */
export function useUpdateOrderItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOrderItemPayload }) =>
      ordersService.updateItem(id, payload),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Soft-delete a single order item. Caller handles navigation on success. */
export function useDeleteOrderItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersService.deleteItem(id),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}

/** Move an item to another room of the same order. */
export function useMoveOrderItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, roomId }: { itemId: number; roomId: number }) =>
      ordersService.moveItem(itemId, roomId),
    onSuccess: (res) => syncOrderDetail(qc, res),
  })
}
