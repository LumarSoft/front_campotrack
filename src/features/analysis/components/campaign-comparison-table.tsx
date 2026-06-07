import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CampaignStats } from '../lib/derive-analysis'

function formatNumber(value: number | null, suffix = ''): string {
  if (value === null) return '—'
  return `${value.toLocaleString('es-AR', { maximumFractionDigits: 1 })}${suffix}`
}

/** Side-by-side metrics across the field's campaigns (info.md §10). */
export function CampaignComparisonTable({ stats }: { stats: CampaignStats[] }): React.JSX.Element {
  return (
    <article className="overflow-hidden rounded-2xl border border-hairline-on-bone">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ciclo</TableHead>
            <TableHead>Cultivo</TableHead>
            <TableHead>Superficie</TableHead>
            <TableHead>Rendimiento</TableHead>
            <TableHead>Humedad</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead>Aplicaciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map(stat => (
            <TableRow key={stat.campaignId}>
              <TableCell className="font-medium text-ink">{stat.cycle}</TableCell>
              <TableCell className="text-stone">{stat.cropName}</TableCell>
              <TableCell className="text-stone">{formatNumber(stat.ha, ' ha')}</TableCell>
              <TableCell className="text-ink">{formatNumber(stat.yieldQqHa, ' qq/ha')}</TableCell>
              <TableCell className="text-stone">{formatNumber(stat.grainMoisture, '%')}</TableCell>
              <TableCell className="text-stone">{stat.observationCount}</TableCell>
              <TableCell className="text-stone">{stat.applicationCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  )
}
