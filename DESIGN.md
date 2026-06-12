# JONNATHAN FIT — Design System

"Apple sobre identidad cálida": pulido y calma de iOS sobre una identidad editorial propia de olivo, crema y ámbar. Tema oscuro por defecto con modo claro cálido. Una sola página (`index.html`), CSS en variables custom, sin frameworks.

## Color

Tokens reales (CSS custom properties en `:root` / `body.light`):

| Token | Dark | Light | Uso |
|---|---|---|---|
| `--bg` | `#1F1F18` | `#EDE7DA` | fondo de página (olivo casi negro / crema) |
| `--surface` | `#2A2A21` | `#FAF7EF` | tarjetas |
| `--surface-2` | `#33332A` | `#FFFFFF` | superficie elevada |
| `--glass` | `rgba(42,42,33,.62)` | `rgba(250,247,239,.7)` | barras con blur 20px + saturate 160% |
| `--line` / `--line-2` | `#3A3A30` / `#4C4B3F` | `#E0D9C9` / `#CBC2AD` | hairlines |
| `--text` | `#F4EEE0` | `#23231B` | texto principal (contraste AA mínimo) |
| `--text-2` | `#D2CAB6` | `#5A5648` | secundario |
| `--text-3` | `#A39B85` | `#857E6B` | rótulos; nunca más oscuro |
| `--accent` | `#D29453` | `#A66A28` | ámbar: acciones, objetivos de sobrecarga, énfasis itálico |
| `--accent-soft` | ámbar al 14% | ámbar al 12% | relleno de pastillas/opciones activas |
| `--sand` | `#BCA98C` | `#7A6A50` | secundario taupe (carbos, gráfico cintura) |
| `--good` | `#7FB07A` | `#4E8A4A` | SOLO objetivos cumplidos (proteína/fibra ✓, series OK) |
| `--over` | `#C7603C` | — | SOLO exceso/alerta (kcal pasadas, volumen corto) |

Regla: el color es semántico, nunca decorativo. Ámbar = acción/objetivo, salvia = logrado, terracota = aviso.

## Typography

- Display/serif: **Cormorant Garamond** (300–500, itálicas para el acento ámbar: "Buenos *días*"). H1 fluido `clamp(40px, 7vw, 76px)`.
- UI/sans: **Jost** (300–500). Cuerpo 15–16px, line-height 1.6, peso 400.
- Rótulos: 11px, peso 500, mayúsculas, tracking ≤ .16em, color `--text-3`.
- Números: `font-variant-numeric: tabular-nums`, en serif para KPIs grandes.

## Shape & Elevation

- Radios: base 12px (`--r`), tarjetas 20px (`--r-card`), pastillas full (`--r-pill`), inputs 9px (`--r-sm`).
- Sombras en capas suaves (`--sh-1/2/3`), nunca borde duro + sombra ancha a la vez.
- Vidrio esmerilado solo en topbar, tabs y fondo de modal.

## Motion

- Easing estándar `cubic-bezier(.22,.61,.36,1)` (`--ease`); spring sutil `cubic-bezier(.34,1.56,.64,1)` (`--spring`) para toques (botones :active scale .96, check de serie, pastilla del segmentado, barras de progreso).
- Modal: fade + pop (translateY 16px, scale .97). Vistas: fade 0.5s.
- Pendiente conocido: bloque `@media (prefers-reduced-motion: reduce)`.

## Components

- **Topbar**: marca con tracking .42em + segmentado iOS Dark/Light con pastilla deslizante.
- **Tabs**: subrayado ámbar 2px animado con spring (Hoy · Entreno · Comida · Plan · Progreso · Perfil).
- **Card**: superficie + hairline + radio 20px + sh-1; interactiva eleva a sh-2.
- **Botones**: primario crema sólido (hover ámbar), secundario relleno línea 45%, ghost, danger terracota; sm 38px, normal 46px.
- **Track**: barra de progreso pill 6px; relleno ámbar/salvia/terracota según semántica.
- **Set-grid**: filas de series (set/kg/reps/check); check verde salvia al completar.
- **Opt**: opciones seleccionables con borde, activa = borde ámbar + relleno accent-soft.
- **Pill**: etiquetas pequeñas uppercase; `.on` ámbar, `.good` salvia.
- **Modal**: 520px máx, vidrio de fondo, pop spring.
- **Sparkline**: SVG línea + área degradada (ámbar peso, taupe cintura).
- **Onboarding/Lock**: pantalla completa sobre `--bg`, serif display + pasos numerados.

## Layout

- Contenedor `--maxw: 1120px`, padding lateral 36px (24px <560px).
- Escala de espaciado: 4/8/16/24/36/56/80.
- Secciones con `.section-title` (rótulo + hairline que llena el resto).
- Grids: g2/g3/g4 colapsan en móvil (820px y 560px).
