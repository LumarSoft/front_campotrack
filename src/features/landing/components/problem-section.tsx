'use client'

import { motion, useReducedMotion } from 'motion/react'

import { Reveal } from '@/components/ui/reveal'

type Cell = { v: string; err?: boolean; hdr?: boolean }

type XlsxCard = {
  name: string
  rotate: number
  ty: number
  delay: number
  cols: string[]
  rows: Cell[][]
  sheets: string[]
}

const h = (v: string): Cell => ({ v, hdr: true })
const c = (v: string): Cell => ({ v })
const e = (v: string): Cell => ({ v, err: true })

const CARDS: XlsxCard[] = [
  {
    name: 'campo_norte_v4_FINAL.xlsx',
    rotate: -3,
    ty: 8,
    delay: 0,
    cols: ['A', 'B', 'C', 'D'],
    rows: [
      [h('Lote'), h('Cultivo'), h('Rinde'), h('Año')],
      [c('Norte'), c('Soja'), c('45 tn'), c('2023')],
      [c('Sur'), c('Maíz'), c('38 tn'), c('')],
      [c('Norte A'), e('???'), e('#REF!'), c('')],
    ],
    sheets: ['Norte', 'Sur', 'v3_old'],
  },
  {
    name: 'campaña_soja_23-24.xlsx',
    rotate: 2,
    ty: 24,
    delay: 0.07,
    cols: ['A', 'B', 'C'],
    rows: [
      [h('Fecha'), h('Tarea'), h('Costo')],
      [c('15/09'), c('Siembra'), c('$420k')],
      [c('22/11'), c('Fumig.'), e('???')],
      [c(''), c('TOTAL'), e('#N/A')],
    ],
    sheets: ['Hoja1', 'Hoja2'],
  },
  {
    name: 'costos_cliente_perez.xlsx',
    rotate: -1,
    ty: -4,
    delay: 0.14,
    cols: ['A', 'B', 'C'],
    rows: [
      [h('Campo'), h('Insumo'), h('$ Total')],
      [c('Norte'), c('Glifosato'), c('$38k')],
      [c('Sur'), c('Atrazina'), e('???')],
    ],
    sheets: ['Costos', 'Copia (2)'],
  },
  {
    name: 'rindes_2022_copia.xlsx',
    rotate: 3,
    ty: 16,
    delay: 0.21,
    cols: ['A', 'B', 'C'],
    rows: [
      [h('Camp.'), h('Cultivo'), h('Rinde')],
      [c('21/22'), c('Soja'), c('3.2 tn')],
      [c('22/23'), e('???'), e('#REF!')],
    ],
    sheets: ['2022', '2021', 'old_v2'],
  },
  {
    name: 'fumigaciones (1).xlsx',
    rotate: -2,
    ty: 4,
    delay: 0.28,
    cols: ['A', 'B', 'C', 'D'],
    rows: [
      [h('Fecha'), h('Producto'), h('Dosis'), h('Ha')],
      [c('03/10'), c('Atrazina'), c('2 L/ha'), c('220')],
      [e('???'), c(''), c(''), c('')],
    ],
    sheets: ['Hoja1'],
  },
]

const CELL_W = 52
const ROW_NUM_W = 24
const XL_GREEN = '#1D6F42'
const XL_HEADER_BG = '#E2EFDA'
const XL_COL_BG = '#F2F2F2'
const XL_BORDER = '#D0CECE'
const XL_INNER_BORDER = '#E8E8E8'
const XL_ERR_BG = '#FFF2F2'

function XlsxIcon(): React.JSX.Element {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <rect width="13" height="13" rx="2" fill="white" fillOpacity="0.18" />
      <path
        d="M2.5 2.5L5.1 6.5L2.5 10.5H4.3L6.5 7.4L8.7 10.5H10.5L7.9 6.5L10.5 2.5H8.7L6.5 5.6L4.3 2.5H2.5Z"
        fill="white"
      />
    </svg>
  )
}

export function ProblemSection(): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-bone text-ink">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="kicker text-clay">El problema</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6 lg:pr-8">
            <h2 className="font-display text-section max-w-[14ch] font-semibold">
              Hoy tu información vive en mil pedazos.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:pt-4">
            <p className="measure font-sans text-lg leading-relaxed text-ink/75">
              Un Excel por campo, otro por campaña, otro por cliente. Se pierden fechas, no hay un histórico confiable y
              calcular la rentabilidad es un dolor de cabeza cada cierre.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16 border-t border-hairline-on-bone pt-14">
          <div className="flex flex-wrap items-start justify-center gap-x-3 gap-y-5 sm:justify-start sm:gap-x-5">
            {CARDS.map((card) => (
              <motion.div
                key={card.name}
                initial={reduceMotion ? false : { opacity: 0, y: card.ty + 32, rotate: card.rotate }}
                whileInView={{ opacity: 1, y: card.ty, rotate: card.rotate }}
                whileHover={
                  reduceMotion
                    ? {}
                    : {
                        y: card.ty - 10,
                        rotate: 0,
                        scale: 1.04,
                        zIndex: 20,
                        transition: { duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] },
                      }
                }
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: card.delay, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative cursor-default overflow-hidden rounded-lg"
                style={{
                  boxShadow:
                    '0 4px 20px color-mix(in srgb, var(--ink) 13%, transparent), 0 1px 3px color-mix(in srgb, var(--ink) 8%, transparent)',
                }}
              >
                {/* Excel title bar */}
                <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: XL_GREEN }}>
                  <XlsxIcon />
                  <span
                    className="truncate text-[11px] font-medium text-white"
                    style={{ maxWidth: card.cols.length === 4 ? 176 : 136 }}
                  >
                    {card.name}
                  </span>
                </div>

                {/* Spreadsheet grid */}
                <div className="bg-white text-[10px] leading-none">
                  {/* Column letter headers */}
                  <div className="flex" style={{ borderBottom: `1px solid ${XL_BORDER}` }}>
                    <div
                      className="shrink-0"
                      style={{ width: ROW_NUM_W, background: XL_COL_BG, borderRight: `1px solid ${XL_BORDER}` }}
                    />
                    {card.cols.map((col) => (
                      <div
                        key={col}
                        className="shrink-0 py-1 text-center font-semibold"
                        style={{
                          width: CELL_W,
                          background: XL_COL_BG,
                          borderRight: `1px solid ${XL_BORDER}`,
                          color: '#555',
                        }}
                      >
                        {col}
                      </div>
                    ))}
                  </div>

                  {/* Data rows */}
                  {card.rows.map((row, ri) => (
                    <div key={ri} className="flex" style={{ borderBottom: `1px solid ${XL_INNER_BORDER}` }}>
                      {/* Row number */}
                      <div
                        className="shrink-0 py-1.5 text-center"
                        style={{
                          width: ROW_NUM_W,
                          background: XL_COL_BG,
                          borderRight: `1px solid ${XL_BORDER}`,
                          color: '#999',
                        }}
                      >
                        {ri + 1}
                      </div>

                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className={[
                            'shrink-0 truncate px-1.5 py-1.5',
                            cell.hdr ? 'font-semibold' : '',
                            cell.err ? 'font-medium' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{
                            width: CELL_W,
                            borderRight: `1px solid ${XL_INNER_BORDER}`,
                            background: cell.hdr ? XL_HEADER_BG : cell.err ? XL_ERR_BG : 'white',
                            color: cell.hdr ? XL_GREEN : cell.err ? '#c0392b' : '#1a1a1a',
                          }}
                        >
                          {cell.v || ' '}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Sheet tabs */}
                <div
                  className="flex items-end gap-px overflow-hidden px-1.5 pt-1"
                  style={{ background: XL_COL_BG, borderTop: `1px solid ${XL_BORDER}` }}
                >
                  {card.sheets.map((sheet, i) => (
                    <div
                      key={sheet}
                      className="shrink-0 truncate px-2 py-0.5 text-[9px]"
                      style={{
                        maxWidth: 62,
                        background: i === 0 ? 'white' : 'transparent',
                        color: i === 0 ? XL_GREEN : '#888',
                        borderLeft: i === 0 ? `1px solid ${XL_BORDER}` : 'none',
                        borderRight: i === 0 ? `1px solid ${XL_BORDER}` : 'none',
                        borderTop: i === 0 ? `2px solid ${XL_GREEN}` : 'none',
                        fontWeight: i === 0 ? 500 : 400,
                      }}
                    >
                      {sheet}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <span className="self-center font-sans text-2xl text-stone/50">…</span>
          </div>
        </div>
      </div>
    </section>
  )
}
