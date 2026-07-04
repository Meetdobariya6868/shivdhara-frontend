import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EditIcon, ShieldIcon, TrashIcon, UserIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { IconButton } from '@/components/ui/IconButton'
import { StateMessage } from '@/components/ui/StateMessage'
import { Switch } from '@/components/ui/Switch'
import type { UserStatus } from '@/features/auth/types'
import { paths } from '@/routes/paths'

import { useSalesman } from '../hooks/useSalesman'
import {
  useDeleteSalesman,
  useUpdateSalesmanPermission,
  useUpdateSalesmanStatus,
} from '../hooks/useSalesmanActions'

/** Which confirmation dialog is open, if any. */
type DialogKind = 'block' | 'unblock' | 'delete' | null

export default function SalesmanDetailPage() {
  const navigate = useNavigate()
  const { salesmanId } = useParams<{ salesmanId: string }>()
  const id = Number(salesmanId)

  const salesmanQuery = useSalesman(id)
  const permissionMutation = useUpdateSalesmanPermission()
  const statusMutation = useUpdateSalesmanStatus()
  const deleteMutation = useDeleteSalesman()

  const [dialog, setDialog] = useState<DialogKind>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const salesman = salesmanQuery.data?.data

  const goBack = (): void => {
    void navigate(-1)
  }

  const handleTogglePermission = (next: boolean): void => {
    setActionError(null)
    setActionSuccess(null)
    permissionMutation.mutate(
      { id, canCreateOrders: next },
      {
        onError: (error) => {
          setActionError(
            error.response?.data?.message ??
              'Could not update the permission. Please try again.',
          )
        },
      },
    )
  }

  const handleStatusConfirm = (): void => {
    const status: UserStatus = dialog === 'unblock' ? 'active' : 'blocked'
    setActionError(null)
    setActionSuccess(null)
    statusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          setDialog(null)
          setActionSuccess(
            status === 'blocked' ? 'Salesman blocked.' : 'Salesman unblocked.',
          )
        },
        onError: (error) => {
          setDialog(null)
          setActionError(
            error.response?.data?.message ??
              'Could not update the account status. Please try again.',
          )
        },
      },
    )
  }

  const handleDeleteConfirm = (): void => {
    setActionError(null)
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDialog(null)
        void navigate(paths.salesmen)
      },
      onError: (error) => {
        setDialog(null)
        setActionError(
          error.response?.data?.message ??
            'Could not delete the salesman. Please try again.',
        )
      },
    })
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (salesmanQuery.isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Salesman" onBack={goBack} />
        <div
          className="flex flex-col gap-5 px-5 py-4"
          aria-busy="true"
          aria-label="Loading salesman"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-full bg-card" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-5 w-32 animate-pulse rounded bg-card" />
              <div className="h-4 w-20 animate-pulse rounded bg-card" />
            </div>
          </div>
          <div className="h-20 animate-pulse rounded-2xl bg-card" />
          <div className="h-32 animate-pulse rounded-2xl bg-card" />
        </div>
      </div>
    )
  }

  // ── Error / not found ────────────────────────────────────────────────────────
  if (salesmanQuery.isError || !salesman) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Salesman" onBack={goBack} />
        <StateMessage
          title="Couldn't load this salesman"
          description="Something went wrong. Please try again."
          action={
            <Button onClick={() => void salesmanQuery.refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  // ── Loaded ───────────────────────────────────────────────────────────────────
  const isBlocked = salesman.status === 'blocked'
  const totalOrders = salesman.orders_count ?? 0

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <PageHeader
        title={salesman.name}
        onBack={goBack}
        right={
          <IconButton
            icon={<EditIcon size={20} />}
            label="Edit salesman"
            onClick={() => void navigate(paths.salesmanEdit(salesman.id))}
          />
        }
      />

      <div className="flex flex-col gap-5 px-5 py-4">
        {actionError && (
          <Alert
            variant="error"
            message={actionError}
            onDismiss={() => setActionError(null)}
          />
        )}
        {actionSuccess && (
          <Alert
            variant="success"
            message={actionSuccess}
            onDismiss={() => setActionSuccess(null)}
          />
        )}

        {/* Profile header */}
        <div className="flex items-center gap-4">
          <Avatar icon={<UserIcon size={28} />} size="md" ring />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-foreground">{salesman.name}</p>
            <p className="text-sm text-muted">
              {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}
            </p>
          </div>
          <StatusBadge blocked={isBlocked} label={salesman.status_label} />
        </div>

        {/* Meta */}
        <div className="rounded-2xl bg-card px-4 py-3 text-sm">
          <p className="text-muted">
            Salesman ID: <span className="font-semibold text-card-foreground">{salesman.id}</span>
          </p>
          <p className="mt-1 text-muted">
            Contact No:{' '}
            <span className="font-semibold text-card-foreground">{salesman.mobile_number}</span>
          </p>
        </div>

        {/* Permissions & access */}
        <section className="rounded-2xl bg-card p-4">
          <div className="flex items-center gap-2">
            <ShieldIcon size={16} className="text-muted" />
            <h2 className="text-sm font-semibold text-foreground">Permissions &amp; access</h2>
          </div>

          {/* Create-orders permission */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <label
                id="perm-create-orders"
                className="block text-sm font-medium text-foreground"
              >
                Allow creating orders
              </label>
              <p className="mt-0.5 text-xs text-muted">
                When off, this salesman can&apos;t create orders.
              </p>
            </div>
            <Switch
              checked={salesman.can_create_orders}
              onChange={handleTogglePermission}
              disabled={permissionMutation.isPending}
              aria-labelledby="perm-create-orders"
            />
          </div>

          {/* Account status / block */}
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Account status</p>
              <p className="mt-0.5 text-xs text-muted">
                {isBlocked
                  ? 'Blocked — cannot log in or use the app.'
                  : 'Active — can log in and use the app.'}
              </p>
            </div>
            {isBlocked ? (
              <button
                type="button"
                onClick={() => setDialog('unblock')}
                className="shrink-0 rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Unblock
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDialog('block')}
                className="shrink-0 rounded-xl border border-error px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Block
              </button>
            )}
          </div>
        </section>

        {/* Danger zone — delete */}
        <button
          type="button"
          onClick={() => setDialog('delete')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-error px-4 py-3 text-sm font-semibold text-error transition-colors hover:bg-error-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TrashIcon size={18} />
          Delete salesman
        </button>
      </div>

      {/* Block / unblock confirmation */}
      <ConfirmDialog
        isOpen={dialog === 'block' || dialog === 'unblock'}
        title={dialog === 'unblock' ? 'Unblock this salesman?' : 'Block this salesman?'}
        message={
          dialog === 'unblock'
            ? 'They will be able to log in and use their account again.'
            : "They will be signed out immediately and won't be able to log in, view, or create orders until you unblock them."
        }
        confirmLabel={dialog === 'unblock' ? 'Unblock' : 'Block'}
        destructive={dialog === 'block'}
        isLoading={statusMutation.isPending}
        onClose={() => setDialog(null)}
        onConfirm={handleStatusConfirm}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={dialog === 'delete'}
        title="Delete this salesman?"
        message={
          totalOrders > 0
            ? `This also deletes their ${totalOrders} order${totalOrders === 1 ? '' : 's'} and signs them out. This action cannot be undone.`
            : "This removes the salesman's account and signs them out. This action cannot be undone."
        }
        confirmLabel="Delete"
        destructive
        isLoading={deleteMutation.isPending}
        onClose={() => setDialog(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

/** Small active/blocked status pill. */
function StatusBadge({ blocked, label }: { blocked: boolean; label: string }) {
  return (
    <span
      className={[
        'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase',
        blocked ? 'bg-error-bg text-error' : 'bg-success/10 text-success',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
