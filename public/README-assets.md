# Assets del hero y fotos

Reemplazá estos placeholders por los archivos reales cuando estén.

## `hero.mp4` (falta)

- **Concepto:** plano aéreo lento y cenital sobre lotes de la pampa, en hora
  dorada. Cálido, sin texto.
- **Uso:** fondo full-bleed del hero, `autoplay muted loop playsInline`,
  `preload="none"`.
- **Dónde:** `public/hero.mp4`. Referenciado en `components/hero.tsx`.
- Recomendado: H.264/MP4, ~10–20 s en loop, < 4 MB, 1920×1080 o mayor.

## `hero-poster.jpg` (falta)

- Frame representativo del video (mismo encuadre). Sirve de `poster` y de
  fallback cuando el video no carga o con `prefers-reduced-motion`.
- **Dónde:** `public/hero-poster.jpg`. Referenciado en `components/hero.tsx`.

## Fotos del campo (placeholders en la UI)

Los bloques `PhotoPlaceholder` marcan dónde van fotos reales del campo
argentino (no ilustraciones). Ver `components/photo-placeholder.tsx` y su uso
en `components/features-section.tsx`. Reemplazar por `next/image` con el asset
optimizado y mantener la relación de aspecto indicada.
