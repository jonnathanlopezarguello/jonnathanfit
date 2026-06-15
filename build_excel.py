from openpyxl import Workbook
from openpyxl.styles import (PatternFill, Font, Alignment, Border, Side,
                              GradientFill)
from openpyxl.utils import get_column_letter

wb = Workbook()

# ─── PALETA TIERRA ────────────────────────────────────────────────────────────
SAND     = "F5ECD7"   # arena clara  (fondo general)
LINEN    = "FAF3E8"   # lino         (filas alternas)
TERR     = "C98B6B"   # terracota    (headers)
CLAY     = "A0634A"   # arcilla oscura (títulos)
SAGE     = "9DAD8E"   # salvia       (barra fase 1)
WARM     = "C4A882"   # arena dorada (barra fase 2)
RUST     = "C07B5A"   # óxido        (barra fase 3)
MOSS     = "7E9B7B"   # musgo        (barra fase 4)
DUST     = "B89F88"   # polvo        (barra fase 5)
TEXT_D   = "3C2F22"   # texto oscuro
TEXT_L   = "FFFFFF"   # blanco
MUTED    = "8C7B6E"   # gris tierra

def side(style="thin", color="E8DDD0"):
    return Side(style=style, color=color)

def border(all_sides="thin"):
    s = side(all_sides)
    return Border(left=s, right=s, top=s, bottom=s)

def fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

def font(bold=False, size=10, color=TEXT_D, italic=False):
    return Font(name="Calibri", bold=bold, size=size, color=color, italic=italic)

def align(h="left", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)

# ══════════════════════════════════════════════════════════════════════════════
# HOJA 1 — RESUMEN
# ══════════════════════════════════════════════════════════════════════════════
ws1 = wb.active
ws1.title = "Hoja de Ruta"

ws1.sheet_view.showGridLines = False
ws1.column_dimensions["A"].width = 28
ws1.column_dimensions["B"].width = 42
ws1.column_dimensions["C"].width = 18
ws1.column_dimensions["D"].width = 18

# Fondo general
for row in ws1.iter_rows(min_row=1, max_row=80, min_col=1, max_col=8):
    for cell in row:
        cell.fill = fill(LINEN)

# ── Título principal ──
ws1.merge_cells("A1:D1")
c = ws1["A1"]
c.value = "JONNATHAN FIT — Hoja de Ruta hacia App Real"
c.font = font(bold=True, size=15, color=CLAY)
c.fill = fill(SAND)
c.alignment = align("left", "center")
ws1.row_dimensions[1].height = 36

ws1.merge_cells("A2:D2")
c = ws1["A2"]
c.value = "Plan de desarrollo para App Store + Play Store con backend y personalización científica"
c.font = font(size=10, color=MUTED, italic=True)
c.fill = fill(SAND)
c.alignment = align("left", "center")
ws1.row_dimensions[2].height = 20

ws1.row_dimensions[3].height = 10

# ── Sección: Componentes Necesarios ──
def section_header(ws, row, text, col_span="A:D"):
    ws.merge_cells(f"A{row}:D{row}")
    c = ws[f"A{row}"]
    c.value = text.upper()
    c.font = font(bold=True, size=9, color=TEXT_L)
    c.fill = fill(TERR)
    c.alignment = align("left", "center")
    ws.row_dimensions[row].height = 22

def col_headers(ws, row, cols, fills=None):
    for i, (col, text) in enumerate(cols.items()):
        c = ws[f"{col}{row}"]
        c.value = text
        c.font = font(bold=True, size=9, color=TEXT_D)
        c.fill = fill(fills[i] if fills else SAND)
        c.alignment = align("center", "center")
        c.border = border()
    ws.row_dimensions[row].height = 18

def data_row(ws, row, vals, alt=False):
    bg = SAND if alt else LINEN
    cols = list("ABCD")[:len(vals)]
    for col, val in zip(cols, vals):
        c = ws[f"{col}{row}"]
        c.value = val
        c.font = font(size=9)
        c.fill = fill(bg)
        c.alignment = align("left", "center", wrap=True)
        c.border = Border(
            left=side("thin"),  right=side("thin"),
            top=side("hair"),   bottom=side("hair"))
    ws.row_dimensions[row].height = 30

section_header(ws1, 4, "1. Backend y Base de Datos")
col_headers(ws1, 5, {"A":"Componente","B":"Descripción","C":"Tecnología","D":"Costo Estimado"})
backend = [
    ("Base de datos",    "Usuarios, workouts, comidas, perfiles",       "PostgreSQL / Supabase",  "Gratis hasta 500 MB"),
    ("API / Servidor",   "Lógica de negocio, cálculos científicos",     "Node.js / FastAPI",      "$20–100 / mes"),
    ("Autenticación",    "Email, Google, Apple ID con JWT tokens",       "Supabase Auth",          "Incluido"),
    ("Hosting",          "Infraestructura en la nube",                   "AWS / Google Cloud",     "$20–50 / mes"),
]
for i, row_data in enumerate(backend):
    data_row(ws1, 6+i, row_data, alt=bool(i%2))

ws1.row_dimensions[10].height = 8
section_header(ws1, 11, "2. App Store y Play Store")
col_headers(ws1, 12, {"A":"Plataforma","B":"Tecnología Recomendada","C":"Tiempo","D":"Costo"})
stores = [
    ("Play Store (Android)", "TWA (Trusted Web Activity) — usa la PWA actual",     "1–2 semanas",  "$25 único"),
    ("App Store (iOS)",      "React Native (una base de código para ambas plat.)",  "3–6 meses",    "$99 / año"),
    ("Alternativa rápida",   "Flutter — Dart, alto rendimiento nativo",             "3–6 meses",    "Desarrollador"),
]
for i, row_data in enumerate(stores):
    data_row(ws1, 13+i, row_data, alt=bool(i%2))

ws1.row_dimensions[16].height = 8
section_header(ws1, 17, "3. Personalización Científica")
col_headers(ws1, 18, {"A":"Módulo","B":"Descripción","C":"Modelo Científico","D":"Fuente"})
science = [
    ("Calorías TDEE",     "Gasto calórico total según perfil y actividad",        "Mifflin-St Jeor",       "Harris & Benedict 1919"),
    ("Proteína óptima",   "Rango recomendado para hipertrofia o pérdida de grasa","1.6–2.2 g/kg corporal", "Morton et al. 2018"),
    ("Volumen entreno",   "Series semanales por grupo muscular (MEV/MAV/MRV)",    "Modelo Israetel",       "Renaissance Periodization"),
    ("Progresión cargas", "Sube peso cuando RIR real > RIR objetivo 2 sesiones",  "Doble progresión",      "Israetel & Hoffman"),
    ("Periodización",     "Deload automático cada 4–6 semanas",                   "Mesociclo estándar",    "Helms, Morgan & Valdez"),
    ("IA coaching",       "Respuestas personalizadas basadas en historial",        "Claude API (LLM)",      "Anthropic"),
]
for i, row_data in enumerate(science):
    data_row(ws1, 19+i, row_data, alt=bool(i%2))

ws1.row_dimensions[25].height = 8
section_header(ws1, 26, "4. Costos Totales Estimados (Inicio)")
col_headers(ws1, 27, {"A":"Ítem","B":"Detalle","C":"Costo","D":"Tipo"})
costs = [
    ("Supabase Backend",     "Auth + DB hasta 500 MB",            "Gratis",         "Mensual"),
    ("Dominio propio",       "jonnathanfit.com o similar",         "$12",            "Anual"),
    ("Play Store",           "Cuenta desarrollador Google",        "$25",            "Único"),
    ("App Store",            "Cuenta desarrollador Apple",         "$99",            "Anual"),
    ("Hosting escalable",    "Cuando superes el plan gratuito",    "$20–100",        "Mensual"),
    ("Desarrollador",        "React Native (depende del país)",    "$3,000–15,000",  "Por proyecto"),
]
for i, row_data in enumerate(costs):
    data_row(ws1, 28+i, row_data, alt=bool(i%2))


# ══════════════════════════════════════════════════════════════════════════════
# HOJA 2 — GANTT MINIMALISTA
# ══════════════════════════════════════════════════════════════════════════════
ws2 = wb.create_sheet("Gantt")
ws2.sheet_view.showGridLines = False

# Ancho columnas
ws2.column_dimensions["A"].width = 32   # nombre fase
ws2.column_dimensions["B"].width = 14   # duración

MONTHS = ["Sem 1–2","Sem 3–4","Mes 2","Mes 3","Mes 4","Mes 5","Mes 6","Mes 7+"]
BAR_COLS = list("CDEFGHIJ")  # 8 columnas para los meses

for i, col in enumerate(BAR_COLS):
    ws2.column_dimensions[col].width = 10

# Fondo
for row in ws2.iter_rows(min_row=1, max_row=40, min_col=1, max_col=12):
    for cell in row:
        cell.fill = fill(LINEN)

# ── Título Gantt ──
ws2.merge_cells("A1:J1")
c = ws2["A1"]
c.value = "DIAGRAMA DE GANTT — JONNATHAN FIT"
c.font = font(bold=True, size=14, color=CLAY)
c.fill = fill(SAND)
c.alignment = align("left", "center")
ws2.row_dimensions[1].height = 34

ws2.merge_cells("A2:J2")
c = ws2["A2"]
c.value = "Hoja de ruta de desarrollo · Tonos tierra · Mínimo viable → App real"
c.font = font(size=9, color=MUTED, italic=True)
c.fill = fill(SAND)
c.alignment = align("left", "center")
ws2.row_dimensions[2].height = 18

ws2.row_dimensions[3].height = 8

# ── Encabezados columnas ──
ws2["A4"].value = "FASE"
ws2["A4"].font = font(bold=True, size=9, color=TEXT_L)
ws2["A4"].fill = fill(CLAY)
ws2["A4"].alignment = align("left", "center")
ws2["A4"].border = border()

ws2["B4"].value = "DURACIÓN"
ws2["B4"].font = font(bold=True, size=9, color=TEXT_L)
ws2["B4"].fill = fill(CLAY)
ws2["B4"].alignment = align("center", "center")
ws2["B4"].border = border()

for i, (col, month) in enumerate(zip(BAR_COLS, MONTHS)):
    c = ws2[f"{col}4"]
    c.value = month
    c.font = font(bold=True, size=8, color=TEXT_D)
    c.fill = fill(SAND)
    c.alignment = align("center", "center")
    c.border = border()
ws2.row_dimensions[4].height = 22

# ── Datos de las fases ──
# (nombre, detalle, duración_texto, color_bar, col_inicio, col_fin)
phases = [
    ("01  Supabase + Auth",
     "Backend, cuentas, sincronización de datos con la PWA actual",
     "2 semanas", SAGE, "C", "D"),
    ("02  Play Store (TWA)",
     "Publicar la PWA en Google Play sin reescribir código",
     "2 semanas", WARM, "D", "E"),
    ("03  React Native",
     "App nativa para iOS y Android con la misma lógica",
     "2 meses", RUST, "E", "G"),
    ("04  Motor Científico",
     "TDEE, macros, progresión, periodización automática por usuario",
     "2 meses", MOSS, "G", "I"),
    ("05  App Store (iOS)",
     "Publicación en Apple App Store (requiere cuenta $99/año)",
     "1 mes", DUST, "I", "J"),
]

colors = [SAGE, WARM, RUST, MOSS, DUST]

for row_idx, (name, detail, dur, bar_color, col_s, col_e) in enumerate(phases):
    row = 5 + row_idx * 3

    # Fondo de la fila
    alt_bg = SAND if row_idx % 2 == 0 else LINEN

    # Celda nombre
    ws2.merge_cells(f"A{row}:A{row+1}")
    c = ws2[f"A{row}"]
    c.value = name
    c.font = font(bold=True, size=9, color=TEXT_D)
    c.fill = fill(alt_bg)
    c.alignment = align("left", "center", wrap=True)
    c.border = Border(left=side("thin"), right=side("thin"),
                      top=side("thin"), bottom=side("thin"))

    # Celda duración
    ws2.merge_cells(f"B{row}:B{row+1}")
    c = ws2[f"B{row}"]
    c.value = dur
    c.font = font(size=8, color=MUTED, italic=True)
    c.fill = fill(alt_bg)
    c.alignment = align("center", "center")
    c.border = Border(left=side("thin"), right=side("thin"),
                      top=side("thin"), bottom=side("thin"))

    # Detalle fila 2
    # (ya mergeado arriba)

    # Barras de Gantt
    start_i = BAR_COLS.index(col_s)
    end_i   = BAR_COLS.index(col_e)

    for ci, col in enumerate(BAR_COLS):
        for ri in [row, row+1]:
            c = ws2[f"{col}{ri}"]
            if start_i <= ci < end_i:
                c.fill = fill(bar_color)
                if ci == start_i:
                    c.border = Border(left=side("medium", bar_color),
                                      top=side("thin", bar_color),
                                      bottom=side("thin", bar_color),
                                      right=side("hair", "E8DDD0"))
                elif ci == end_i - 1:
                    c.border = Border(right=side("medium", bar_color),
                                      top=side("thin", bar_color),
                                      bottom=side("thin", bar_color),
                                      left=side("hair", "E8DDD0"))
                else:
                    c.border = Border(top=side("thin", bar_color),
                                      bottom=side("thin", bar_color),
                                      left=side("hair", "E8DDD0"),
                                      right=side("hair", "E8DDD0"))
            else:
                c.fill = fill(alt_bg)
                c.border = Border(left=side("hair"), right=side("hair"),
                                  top=side("hair"), bottom=side("hair"))

    # Etiqueta dentro de la barra (fila superior)
    merge_start = f"{col_s}{row}"
    merge_end   = f"{BAR_COLS[end_i-1]}{row}"
    if col_s != BAR_COLS[end_i-1]:
        ws2.merge_cells(f"{merge_start}:{merge_end}")
    c = ws2[merge_start]
    c.value = name.split("  ")[1] if "  " in name else name
    c.font  = font(bold=True, size=8, color=TEXT_L)
    c.fill  = fill(bar_color)
    c.alignment = align("center", "center")

    # Fila de detalle (merge barra)
    merge_start2 = f"{col_s}{row+1}"
    merge_end2   = f"{BAR_COLS[end_i-1]}{row+1}"
    if col_s != BAR_COLS[end_i-1]:
        ws2.merge_cells(f"{merge_start2}:{merge_end2}")
    c = ws2[merge_start2]
    c.value = detail
    c.font  = font(size=7, color=TEXT_L, italic=True)
    c.fill  = fill(bar_color)
    c.alignment = align("center", "center", wrap=True)

    ws2.row_dimensions[row].height   = 20
    ws2.row_dimensions[row+1].height = 24
    ws2.row_dimensions[row+2].height = 6  # espacio entre fases

# ── Leyenda ──
legend_row = 5 + len(phases) * 3 + 1
ws2.merge_cells(f"A{legend_row}:J{legend_row}")
c = ws2[f"A{legend_row}"]
c.value = "LEYENDA"
c.font = font(bold=True, size=8, color=TEXT_L)
c.fill = fill(TERR)
c.alignment = align("left", "center")
ws2.row_dimensions[legend_row].height = 18

legend_items = [
    (SAGE, "Backend / Auth"),
    (WARM, "Play Store"),
    (RUST, "App Nativa"),
    (MOSS, "Motor Científico"),
    (DUST, "App Store iOS"),
]
lr = legend_row + 1
for idx, (color, label) in enumerate(legend_items):
    col_color = BAR_COLS[idx * 2] if idx * 2 < len(BAR_COLS) else "I"
    col_label_idx = idx * 2 + 1
    col_label = BAR_COLS[col_label_idx] if col_label_idx < len(BAR_COLS) else "J"

    c = ws2[f"{col_color}{lr}"]
    c.fill = fill(color)
    c.border = border()

    c2 = ws2[f"{col_label}{lr}"]
    c2.value = label
    c2.font = font(size=8, color=TEXT_D)
    c2.fill = fill(LINEN)
    c2.alignment = align("left", "center")
    c2.border = border()

ws2.row_dimensions[lr].height = 18

# ── Notas al pie ──
note_row = lr + 2
ws2.merge_cells(f"A{note_row}:J{note_row}")
c = ws2[f"A{note_row}"]
c.value = ("Nota: Los tiempos son estimados. La fase 1 (Supabase) puede iniciarse de inmediato con la PWA actual. "
           "Play Store vía TWA es el camino más rápido al mercado. La App Store requiere cuenta Apple y revisión (~1–2 semanas extra).")
c.font = font(size=8, color=MUTED, italic=True)
c.fill = fill(LINEN)
c.alignment = align("left", "center", wrap=True)
ws2.row_dimensions[note_row].height = 30

# ── Guardar ──
path = "/home/user/jonnathanfit/JonnathanFit_HojaDeRuta.xlsx"
wb.save(path)
print(f"Guardado: {path}")
