import { useNavigate, useParams } from 'react-router-dom'

import { LayoutIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/StateMessage'

import { VariantRateCard } from '../components/VariantRateCard'
import { useDesign } from '../hooks/useDesign'

/**
 * Design detail (admin): shows the design's company + code and lists all its
 * variants, each with editable purchase / sell rates. Fetches the design with
 * its variants; renders loading / error / empty / success states.
 */
export default function DesignDetailPage() {
  const navigate = useNavigate()
  const { designId } = useParams<{ designId: string }>()
  const id = Number(designId)

  const { data, isLoading, isError, refetch } = useDesign(id)
  const design = data?.data

  const goBack = (): void => {
    void navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Design" onBack={goBack} />
        <div
          className="flex flex-col gap-3 px-5 py-4"
          aria-busy="true"
          aria-label="Loading design"
        >
          <div className="h-16 animate-pulse rounded-2xl bg-card" />
          <div className="h-36 animate-pulse rounded-2xl bg-card" />
          <div className="h-36 animate-pulse rounded-2xl bg-card" />
        </div>
      </div>
    )
  }

  if (isError || !design) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Design" onBack={goBack} />
        <StateMessage
          icon={<LayoutIcon size={40} />}
          title="Couldn't load this design"
          description="Something went wrong. Please try again."
          action={
            <Button onClick={() => void refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <PageHeader title={design.design_name} onBack={goBack} />

      <div className="flex flex-col gap-5 px-5 py-4">
        {/* Design summary */}
        <div className="rounded-2xl bg-card px-4 py-3 text-sm">
          <p className="text-muted">
            Company:{' '}
            <span className="font-semibold text-card-foreground">
              {design.company.company_name}
            </span>
          </p>
        </div>

        {/* Variants */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Variants ({design.variants.length})
          </h2>

          {design.variants.length === 0 ? (
            <StateMessage
              icon={<LayoutIcon size={40} />}
              title="No variants"
              description="This design has no variants yet."
            />
          ) : (
            design.variants.map((variant) => (
              <VariantRateCard key={variant.id} designId={design.id} variant={variant} />
            ))
          )}
        </section>
      </div>
    </div>
  )
}
