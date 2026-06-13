# Product

## Register

product

## Users

Jonnathan (usuario único, dueño del producto): hombre de ~26 años en lean bulk (hipertrofia 4 días/semana, plan de alimentación ~3010 kcal). Usa la app a diario, sobre todo desde el móvil en el gimnasio (entre series, con prisa y una mano) y desde el PC para revisar progreso y planificar. Habla español; los datos viven en su navegador (localStorage), la app está publicada en GitHub Pages como PWA instalable.

## Product Purpose

Diario personal de entrenamiento y nutrición basado en evidencia. Registra series/pesos con sobrecarga progresiva (precarga de la última sesión), comidas con macros y fibra, peso corporal, cintura, suplementos y actividad diaria. Calcula objetivos (Mifflin-St Jeor → TDEE → kcal/macros) y los ajusta por tendencia real de peso. Éxito = registrar sin fricción cada día y ver progreso real (fuerza, peso, cintura) sin abandonar la app.

## Brand Personality

Sereno, preciso, silencioso. Minimalismo monocromo de inspiración japonesa (referencia explícita del usuario: mikiyakobayashi.com): blanco, tinta, mayúsculas con tracking, hairlines y mucho aire. La "calidez" la ponen el idioma cercano en español y la evidencia científica citada, no el color. Decisión del 2026-06-12 que sustituye la dirección anterior "Apple sobre identidad cálida" (olivo/ámbar).

## Anti-references

- La dirección anterior olivo/crema/ámbar: ya no; el usuario pidió el lenguaje de mikiyakobayashi.com.
- Apps de fitness agresivas (neón, negro+verde eléctrico, badges y confeti, "BEAST MODE"): nada de estética de pre-entreno.
- SaaS genérico de dashboards: tarjetas redondeadas con sombras, icono+título+texto, hero-metrics con degradados.
- Color decorativo de cualquier tipo: solo verde (logrado) y terracota (alerta), siempre con significado.
- Cualquier rediseño que un tercero pueda señalar como "hecho por IA sin criterio".

## Design Principles

1. **Registrar en segundos**: cada flujo frecuente (marcar serie, añadir comida, marcar suplemento) debe resolverse con el mínimo de toques, con una mano, en el gimnasio.
2. **Los números son protagonistas**: kcal, kg y series se muestran grandes, tabulares y legibles; la jerarquía tipográfica (serif display + sans UI) sirve a los datos, no al revés.
3. **Evidencia, no humo**: las recomendaciones citan su fuente (Morton, Iraki, ISSN, ICBF); el tono educa sin sermonear.
4. **Calidez disciplinada**: el ámbar acentúa lo importante (objetivos, sobrecarga); el verde salvia solo marca objetivos cumplidos; el terracota solo excesos/alertas. Nada de color decorativo.
5. **Nunca romper los datos del usuario**: los cambios de diseño jamás comprometen localStorage ni los flujos de respaldo.

## Accessibility & Inclusion

- Contraste objetivo AA (≥4.5:1) en texto de cuerpo y secundario sobre los fondos olivo/crema (ya fue un problema corregido: no volver a textos tenues).
- Objetivos táctiles ≥44px en controles frecuentes (botones de serie, checks).
- Respetar `prefers-reduced-motion` en micro-animaciones.
- Uso bimanual no garantizado: flujos clave alcanzables con el pulgar en móvil 375px.
