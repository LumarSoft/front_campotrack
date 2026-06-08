import type { ObservationKind, RecordSubtype, YieldUnit } from '@/types/api/records'

export const RECORD_SUBTYPE_LABELS: Record<RecordSubtype, string> = {
  SOWING: 'Siembra',
  FERTILIZATION: 'Fertilización',
  PHYTOSANITARY: 'Fitosanitario',
  OBSERVATION: 'Observación',
  HARVEST: 'Cosecha',
}

export const RECORD_SUBTYPE_ORDER: RecordSubtype[] = [
  'SOWING',
  'FERTILIZATION',
  'PHYTOSANITARY',
  'OBSERVATION',
  'HARVEST',
]

export const RECORD_SUBTYPE_COLOR: Record<RecordSubtype, string> = {
  SOWING: '#2a7a4a',
  FERTILIZATION: '#c89040',
  PHYTOSANITARY: '#2f6f8f',
  OBSERVATION: '#7a5cb0',
  HARVEST: '#1c4a2e',
}

export const OBSERVATION_KIND_LABELS: Record<ObservationKind, string> = {
  PEST: 'Plaga',
  DISEASE: 'Enfermedad',
  WEED: 'Maleza',
  OTHER: 'Otro',
}

export const YIELD_UNIT_LABELS: Record<YieldUnit, string> = {
  QQ_HA: 'qq/ha',
  TN_HA: 'tn/ha',
}

export interface RecordFieldDef {
  key: string
  label: string
  kind: 'text' | 'number' | 'select'
  required: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

/** Minimal fields supported offline per subtype (info.md §8). */
export const RECORD_FIELDS: Record<RecordSubtype, RecordFieldDef[]> = {
  SOWING: [
    { key: 'variety', label: 'Híbrido / variedad', kind: 'text', required: true, placeholder: 'DK 72-10' },
    { key: 'seedDose', label: 'Dosis de semilla', kind: 'text', required: true, placeholder: '70.000 sem/ha' },
    { key: 'ha', label: 'Superficie (ha)', kind: 'number', required: true },
  ],
  FERTILIZATION: [
    { key: 'product', label: 'Producto', kind: 'text', required: true, placeholder: 'Urea' },
    { key: 'dose', label: 'Dosis', kind: 'text', required: true, placeholder: '120 kg/ha' },
  ],
  PHYTOSANITARY: [
    { key: 'product', label: 'Producto', kind: 'text', required: true, placeholder: 'Glifosato' },
    { key: 'dose', label: 'Dosis', kind: 'text', required: true, placeholder: '2,5 l/ha' },
    { key: 'temperature', label: 'Temperatura (°C)', kind: 'number', required: false },
    { key: 'wind', label: 'Viento', kind: 'text', required: false, placeholder: '8 km/h NE' },
    { key: 'humidity', label: 'Humedad (%)', kind: 'number', required: false },
  ],
  OBSERVATION: [
    {
      key: 'kind',
      label: 'Tipo',
      kind: 'select',
      required: true,
      options: [
        { value: 'PEST', label: 'Plaga' },
        { value: 'DISEASE', label: 'Enfermedad' },
        { value: 'WEED', label: 'Maleza' },
        { value: 'OTHER', label: 'Otro' },
      ],
    },
    { key: 'description', label: 'Descripción', kind: 'text', required: true, placeholder: 'Isoca en el lote norte' },
  ],
  HARVEST: [
    { key: 'yield', label: 'Rendimiento', kind: 'number', required: true },
    {
      key: 'yieldUnit',
      label: 'Unidad',
      kind: 'select',
      required: true,
      options: [
        { value: 'QQ_HA', label: 'qq/ha' },
        { value: 'TN_HA', label: 'tn/ha' },
      ],
    },
    { key: 'grainMoisture', label: 'Humedad de grano (%)', kind: 'number', required: false },
  ],
}

/** Short, human summary of a record's data for the bitácora list. */
export function summarizeRecord(subtype: RecordSubtype, data: Record<string, unknown>): string {
  switch (subtype) {
    case 'SOWING':
      return `${data.variety ?? ''} · ${data.seedDose ?? ''} · ${data.ha ?? ''} ha`
    case 'FERTILIZATION':
      return `${data.product ?? ''} · ${data.dose ?? ''}`
    case 'PHYTOSANITARY':
      return `${data.product ?? ''} · ${data.dose ?? ''}`
    case 'OBSERVATION': {
      const kind = OBSERVATION_KIND_LABELS[data.kind as ObservationKind] ?? ''
      return `${kind}: ${data.description ?? ''}`
    }
    case 'HARVEST':
      return `${data.yield ?? ''} ${YIELD_UNIT_LABELS[data.yieldUnit as YieldUnit] ?? ''}`
    default:
      return ''
  }
}
