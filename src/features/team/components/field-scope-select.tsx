'use client'

import { Label } from '@/components/ui/label'
import type { FieldListItem } from '@/types/api/fields'

interface FieldScopeSelectProps {
  fields: FieldListItem[]
  selected: number[]
  onChange: (ids: number[]) => void
}

/** Pill multi-select for the fields a member/producer may access (info.md §11). */
export function FieldScopeSelect({ fields, selected, onChange }: FieldScopeSelectProps): React.JSX.Element {
  const toggle = (id: number): void => {
    onChange(selected.includes(id) ? selected.filter(fieldId => fieldId !== id) : [...selected, id])
  }

  return (
    <div className="space-y-2">
      <Label>Campos habilitados</Label>
      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed border-hairline-on-bone px-3 py-2 text-sm text-stone">
          Todavía no hay campos para compartir.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {fields.map(field => {
            const active = selected.includes(field.id)
            return (
              <button
                key={field.id}
                type="button"
                onClick={() => toggle(field.id)}
                className={
                  active
                    ? 'rounded-full bg-clay px-3 py-1 text-xs font-medium text-bone'
                    : 'rounded-full border border-hairline-on-bone px-3 py-1 text-xs text-stone hover:text-ink'
                }
              >
                {field.name}
              </button>
            )
          })}
        </div>
      )}
      <p className="text-xs text-stone">
        Sin campos seleccionados, no verá ninguno hasta que le habilites acceso.
      </p>
    </div>
  )
}
