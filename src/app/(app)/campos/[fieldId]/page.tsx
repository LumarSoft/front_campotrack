import { notFound } from 'next/navigation'
import { FieldDetailView } from '@/features/fields/components/field-detail-view'

interface CampoDetailPageProps {
  params: Promise<{ fieldId: string }>
}

export default async function CampoDetailPage({ params }: CampoDetailPageProps): Promise<React.JSX.Element> {
  const { fieldId } = await params
  const id = Number(fieldId)
  if (!Number.isInteger(id) || id <= 0) notFound()
  return <FieldDetailView fieldId={id} />
}
