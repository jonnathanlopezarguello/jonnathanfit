# JONNATHAN FIT — Design System

Minimalismo monocromo de inspiración japonesa (referencia elegida por el usuario: mikiyakobayashi.com). Blanco, tinta, hairlines y aire; sin radios, sin sombras, sin color decorativo. Modo claro por defecto; modo oscuro = mismo sistema en negro cálido. Una sola página (`index.html`), CSS en variables custom, sin frameworks.

## Color

| Token | Light (defecto) | Dark | Uso |
|---|---|---|---|
| `--bg` / `--surface` | `#FFFFFF` | `#121211` | fondo y tarjetas (planos; separación por hairline) |
| `--surface-2` | `#FAFAF8` | `#1C1C1A` | fondo de la animación de técnica |
| `--line` / `--line-2` | `#E9E9E5` / `#D6D6D0` | `#2A2A28` / `#3D3D3A` | hairlines |
| `--text` | `#161616` | `#F2F2EE` | tinta principal |
| `--text-2` | `#5F5F5C` | `#B9B9B2` | secundario |
| `--text-3` | `#6F6F68` | `#8A8A82` | rótulos (AA ≥4.5:1) |
| `--accent` | = `--text` | = `--text` | **monocromo**: lo interactivo es tinta |
| `--good` | `#3A7237` | `#7FB07A` | SOLO objetivo cumplido (funcional) |
| `--over` | `#A84A28` | `#D26A45` | SOLO exceso/alerta (funcional) |

Regla: cero color decorativo. Verde y terracota son los únicos colores y siempre significan estado.

## Typography

- Una sola familia: **Inter** (300/400/500), stack `"Inter","Helvetica Neue",Helvetica,Arial`.
- Titulares de página: MAYÚSCULAS, peso 400, `clamp(22px,4vw,36px)`, tracking `.14em`. El `em` del saludo va en `--text-3` (no itálica).
- Nombres de ejercicio (h4): mayúsculas 13px, peso 500, tracking `.12em`.
- Rótulos: 11px, peso 500, mayúsculas, tracking ≤`.16em`, `--text-3`.
- KPIs numéricos: Inter 300 grande, `tabular-nums`.

## Shape & Elevation

- **Radios 0 en todo** (tokens `--r*: 0`). Plano absoluto.
- **Sin sombras** (`--sh-1/2: none`); solo el modal conserva una sombra difusa.
- Sin vidrio/blur: barras con fondo casi sólido (`--glass` ≈ 92% opacidad) + hairline.
- Separación por espacio en blanco y líneas de 1px, no por relleno.

## Motion

- Sereno: `--ease cubic-bezier(.22,.61,.36,1)`; `--spring` ya NO rebota (`.25,.46,.45,.94`).
- Subrayado de tab activo: 1px, scaleX.
- Demos de técnica: animaciones SMIL (2.6s, spline suave, alterna A↔B); estáticas si `prefers-reduced-motion`.

## Components

- **Tech panel** (`.tech` en `.train-layout`): columna derecha sticky de 360px en ≥920px (debajo en móvil). Contiene la animación esquemática del ejercicio (figura de líneas, `viewBox 0 0 220 240`), indicaciones del plan y enlace al vídeo real (búsqueda de Shakil Ahmed). 19 arquetipos de movimiento en `POSES`, mapeo en `ARCH`.
- **Card**: blanco + hairline, radio 0, sin sombra.
- **Botones**: primario tinta sólida (hover opacity .82), secundario relleno gris línea, cuadrados.
- **Track**: barra de progreso de 3px.
- **Segmentado Dark/Light**: cuadrado, pastilla deslizante plana.
- **Modal**: cuadrado, hairline, sombra difusa única, Escape cierra, `role=dialog`.
- **Sparklines**: línea tinta con área degradada sutil.

## Layout

- Contenedor 1120px; espaciado 4/8/16/24/36/56/80; secciones con rótulo + hairline.
- `.train-layout`: `minmax(0,1fr) 360px` (≥920px) / una columna (<920px).

## Accesibilidad (mantener)

AA ≥4.5:1 en todo texto; `:focus-visible` tinta; objetivos táctiles ≥44px en controles de serie; `prefers-reduced-motion` respetado (CSS y SMIL); ARIA en tabs/modal/botones de icono.
