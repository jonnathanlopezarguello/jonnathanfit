const SKEL = [
  'M80 12C90 12 96 20 96 32C96 42 90 48 80 48C70 48 64 42 64 32C64 20 70 12 80 12Z',
  'M66 48L94 48Q104 50 108 58L108 60Q108 62 106 62L54 62Q52 62 52 60L52 58Q56 50 66 48Z',
  'M30 134L26 170Q24 178 28 178L38 176L44 132Z',
  'M130 134L134 170Q136 178 132 178L122 176L116 132Z',
  'M56 306L54 340Q54 348 60 348L68 348Q72 348 72 340L70 306Z',
  'M104 306L106 340Q106 348 100 348L92 348Q88 348 88 340L90 306Z',
];

const FM = {
  Hombro: [
    { d: 'M44 62Q38 64 36 72Q34 82 38 86L52 82L52 62Z' },
    { d: 'M116 62Q122 64 124 72Q126 82 122 86L108 82L108 62Z' },
  ],
  Pecho: [
    { d: 'M54 64Q56 60 80 60Q104 60 106 64L106 90Q100 96 80 96Q60 96 54 90Z' },
  ],
  Biceps: [
    { d: 'M38 88Q34 90 32 100L30 126Q30 132 34 132L44 130Q48 126 46 100Q46 90 44 86Z' },
    { d: 'M122 88Q126 90 128 100L130 126Q130 132 126 132L116 130Q112 126 114 100Q114 90 116 86Z' },
  ],
  Abdomen: [
    { d: 'M62 98L98 98Q100 100 100 104L100 152Q96 160 80 162Q64 160 60 152L60 104Q60 100 62 98Z' },
  ],
  Cuadriceps: [
    { d: 'M58 162Q56 166 54 190L52 230Q52 240 56 244L72 244Q76 240 76 230L78 190Q78 170 76 162Z' },
    { d: 'M102 162Q104 166 106 190L108 230Q108 240 104 244L88 244Q84 240 84 230L82 190Q82 170 84 162Z' },
  ],
  Gemelo: [
    { d: 'M54 248Q50 258 50 274Q50 296 56 304L68 304Q74 296 72 274Q72 258 70 248Z' },
    { d: 'M106 248Q110 258 110 274Q110 296 104 304L92 304Q86 296 88 274Q88 258 90 248Z' },
  ],
};

const BM = {
  Hombro: [
    { d: 'M44 62Q38 64 36 72Q34 82 38 86L52 82L52 62Z' },
    { d: 'M116 62Q122 64 124 72Q126 82 122 86L108 82L108 62Z' },
  ],
  Espalda: [
    { d: 'M54 64Q56 60 80 60Q104 60 106 64L108 98Q104 108 94 112L80 116L66 112Q56 108 52 98Z' },
    { d: 'M58 112Q62 116 80 118Q98 116 102 112L100 148Q96 156 80 158Q64 156 60 148Z', o: 0.7 },
  ],
  Triceps: [
    { d: 'M38 88Q34 90 32 100L30 126Q30 132 34 132L44 130Q48 126 46 100Q46 90 44 86Z' },
    { d: 'M122 88Q126 90 128 100L130 126Q130 132 126 132L116 130Q112 126 114 100Q114 90 116 86Z' },
  ],
  'Femoral/Gluteo': [
    { d: 'M58 152Q56 156 60 162Q68 170 80 170Q92 170 100 162Q104 156 102 152Z', o: 0.85 },
    { d: 'M58 170Q56 176 54 200L52 236Q52 244 58 244L74 244Q78 240 78 230L78 196Q78 178 76 170Z' },
    { d: 'M102 170Q104 176 106 200L108 236Q108 244 102 244L86 244Q82 240 82 230L82 196Q82 178 84 170Z' },
  ],
  Gemelo: [
    { d: 'M54 248Q50 258 50 274Q50 296 56 304L68 304Q74 296 72 274Q72 258 70 248Z' },
    { d: 'M106 248Q110 258 110 274Q110 296 104 304L92 304Q86 296 88 274Q88 258 90 248Z' },
  ],
};

// Rangos de volumen semanal por MÚSCULO INDIVIDUAL (series/semana)
// MEV = Mínimo Efectivo · MAV = Zona Óptima [min, max] · MRV = Máximo Recuperable
// Fuentes: Schoenfeld et al. 2017 (J Sports Sci), Baz-Valle et al. 2022 (J Human Kinetics),
//          Israetel et al. — RP Hypertrophy Training Guide
const VR = {
  'Pectoral Mayor':      { mev: 8,  mav: [12, 20], mrv: 22 },
  'Deltoides Anterior':  { mev: 6,  mav: [12, 18], mrv: 22 },
  'Deltoides Lateral':   { mev: 8,  mav: [16, 22], mrv: 26 },
  'Deltoides Posterior': { mev: 8,  mav: [16, 22], mrv: 26 },
  'Bíceps Braquial':     { mev: 8,  mav: [14, 20], mrv: 26 },
  'Tríceps Braquial':    { mev: 6,  mav: [10, 14], mrv: 20 },
  'Dorsal Ancho':        { mev: 10, mav: [14, 22], mrv: 25 },
  'Trapecio':            { mev: 0,  mav: [12, 20], mrv: 26 },
  'Recto Abdominal':     { mev: 0,  mav: [16, 20], mrv: 25 },
  'Oblicuos':            { mev: 0,  mav: [12, 16], mrv: 20 },
  'Cuádriceps':          { mev: 8,  mav: [12, 18], mrv: 20 },
  'Femoral':             { mev: 6,  mav: [10, 16], mrv: 20 },
  'Glúteo Mayor':        { mev: 0,  mav: [4,  12], mrv: 16 },
  'Gastrocnemio':        { mev: 8,  mav: [12, 16], mrv: 20 },
};

// Mapeo ejercicio.g → músculos con peso de contribución
// 1.0 = músculo primario (series directas)
// 0.5 = músculo secundario (series indirectas)
const MUSCLE_MAP = {
  'Pecho':          [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.5], ['Tríceps Braquial', 0.5]],
  'Hombro':         [['Deltoides Lateral', 1.0], ['Deltoides Anterior', 0.5], ['Deltoides Posterior', 0.5]],
  'Biceps':         [['Bíceps Braquial', 1.0]],
  'Triceps':        [['Tríceps Braquial', 1.0]],
  'Espalda':        [['Dorsal Ancho', 1.0], ['Bíceps Braquial', 0.5], ['Trapecio', 0.5]],
  'Trapecio':       [['Trapecio', 1.0]],
  'Abdomen':        [['Recto Abdominal', 1.0], ['Oblicuos', 0.5]],
  'Cuadriceps':     [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.5]],
  'Femoral/Gluteo': [['Femoral', 1.0], ['Glúteo Mayor', 1.0]],
  'Femoral':        [['Femoral', 1.0]],
  'Gluteo':         [['Glúteo Mayor', 1.0]],
  'Gemelo':         [['Gastrocnemio', 1.0]],
};

// Mapeo por ejercicio individual → músculos exactos con peso
// 1.0 = músculo primario · 0.3–0.5 = músculo secundario
// Permite saber qué cabeza/porción trabaja cada ejercicio
const EXERCISE_MUSCLE_MAP = {
  // ── PECHO ──────────────────────────────────────────────────────────
  'Press inclinado con mancuerna': [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.4], ['Tríceps Braquial', 0.3]],
  'Press plano maquina o barra':   [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.3], ['Tríceps Braquial', 0.3]],
  'Press banca con mancuernas':    [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.3], ['Tríceps Braquial', 0.3]],
  'Press banca declinado':         [['Pectoral Mayor', 1.0], ['Tríceps Braquial', 0.3]],
  'Aperturas / Pec deck':          [['Pectoral Mayor', 1.0]],
  'Cruces en polea / Fondos':      [['Pectoral Mayor', 1.0], ['Tríceps Braquial', 0.3]],
  'Cruces en polea alta':          [['Pectoral Mayor', 1.0]],
  'Fondos en paralelas pecho':     [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.4], ['Tríceps Braquial', 0.4]],

  // ── ESPALDA ────────────────────────────────────────────────────────
  'Dominadas o Jalon al pecho':    [['Dorsal Ancho', 1.0], ['Bíceps Braquial', 0.5]],
  'Remo con barra':                [['Dorsal Ancho', 1.0], ['Trapecio', 0.5], ['Bíceps Braquial', 0.3]],
  'Remo sentado en maquina':       [['Dorsal Ancho', 1.0], ['Trapecio', 0.5], ['Bíceps Braquial', 0.3]],
  'Remo con mancuerna':            [['Dorsal Ancho', 1.0], ['Trapecio', 0.4], ['Bíceps Braquial', 0.3]],
  'Jalon brazo recto / Pullover':  [['Dorsal Ancho', 1.0]],
  'Jalon agarre estrecho':         [['Dorsal Ancho', 1.0], ['Bíceps Braquial', 0.4]],
  'Peso muerto convencional':      [['Dorsal Ancho', 0.5], ['Trapecio', 0.5], ['Femoral', 0.5], ['Glúteo Mayor', 0.5]],
  'Remo en T':                     [['Dorsal Ancho', 1.0], ['Trapecio', 0.5], ['Bíceps Braquial', 0.3]],

  // ── BÍCEPS ─────────────────────────────────────────────────────────
  'Curl con barra':                [['Bíceps Braquial', 1.0]],
  'Curl inclinado mancuerna':      [['Bíceps Braquial', 1.0]],
  'Curl martillo':                 [['Bíceps Braquial', 1.0]],
  'Curl predicador o en polea':    [['Bíceps Braquial', 1.0]],
  'Curl concentrado':              [['Bíceps Braquial', 1.0]],
  'Curl en polea baja':            [['Bíceps Braquial', 1.0]],

  // ── TRÍCEPS ────────────────────────────────────────────────────────
  'Press frances':                 [['Tríceps Braquial', 1.0]],
  'Extension en polea (cuerda)':   [['Tríceps Braquial', 1.0]],
  'Fondos o press cerrado':        [['Tríceps Braquial', 1.0], ['Pectoral Mayor', 0.3]],
  'Extension sobre la cabeza':     [['Tríceps Braquial', 1.0]],
  'Press cerrado banca':           [['Tríceps Braquial', 1.0], ['Pectoral Mayor', 0.3]],
  'Kickback mancuerna':            [['Tríceps Braquial', 1.0]],

  // ── HOMBRO — discriminado por cabeza ───────────────────────────────
  'Press militar de pie':          [['Deltoides Anterior', 1.0], ['Deltoides Lateral', 0.3], ['Tríceps Braquial', 0.3]],
  'Press hombro sentado / Arnold': [['Deltoides Anterior', 1.0], ['Deltoides Lateral', 0.3], ['Tríceps Braquial', 0.3]],
  'Elevacion lateral mancuerna':   [['Deltoides Lateral', 1.0]],
  'Elevacion lateral en polea':    [['Deltoides Lateral', 1.0]],
  'Face pull / posterior polea':   [['Deltoides Posterior', 1.0], ['Trapecio', 0.3]],
  'Reverse pec deck':              [['Deltoides Posterior', 1.0]],
  'Elevacion frontal barra':       [['Deltoides Anterior', 1.0]],

  // ── CUÁDRICEPS ─────────────────────────────────────────────────────
  'Sentadilla libre':              [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.5]],
  'Prensa 45°':                    [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.3]],
  'Hack squat o Bulgara':          [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.3]],
  'Extension de cuadriceps':       [['Cuádriceps', 1.0]],
  'Zancadas con mancuernas':       [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.5]],
  'Sentadilla bulgara split':      [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.5]],
  'Step up con mancuernas':        [['Cuádriceps', 1.0], ['Glúteo Mayor', 0.4]],

  // ── FEMORAL / GLÚTEO ───────────────────────────────────────────────
  'Peso muerto rumano':            [['Femoral', 1.0], ['Glúteo Mayor', 1.0]],
  'Hip thrust':                    [['Glúteo Mayor', 1.0], ['Femoral', 0.3]],
  'Curl femoral tumbado':          [['Femoral', 1.0]],
  'Curl femoral sentado':          [['Femoral', 1.0]],
  'Buenos dias':                   [['Femoral', 1.0], ['Glúteo Mayor', 0.5]],
  'Patada de gluteo en polea':     [['Glúteo Mayor', 1.0]],
  'Sumo deadlift':                 [['Glúteo Mayor', 1.0], ['Femoral', 0.5]],

  // ── GEMELO ─────────────────────────────────────────────────────────
  'Gemelo de pie':                 [['Gastrocnemio', 1.0]],
  'Gemelo en prensa':              [['Gastrocnemio', 1.0]],
  'Gemelo sentado':                [['Gastrocnemio', 0.7]],
  'Gemelo de pie en maquina':      [['Gastrocnemio', 1.0]],
  'Gemelo con mancuerna':          [['Gastrocnemio', 1.0]],

  // ── ABDOMEN ────────────────────────────────────────────────────────
  'Elevacion de piernas colgado':  [['Recto Abdominal', 1.0]],
  'Elevacion de piernas':          [['Recto Abdominal', 1.0]],
  'Crunch en polea arrodillado':   [['Recto Abdominal', 1.0]],
  'Crunch en polea':               [['Recto Abdominal', 1.0]],
  'Crunch lastrado en polea':      [['Recto Abdominal', 1.0]],
  'Rueda abdominal':               [['Recto Abdominal', 1.0], ['Oblicuos', 0.3]],
  'Crunch inverso':                [['Recto Abdominal', 1.0]],
  'Plancha lastrada':              [['Recto Abdominal', 0.5], ['Oblicuos', 0.5]],
  'Rotacion / Pallof press':       [['Oblicuos', 1.0]],
  'Crunch bicicleta':              [['Recto Abdominal', 0.7], ['Oblicuos', 0.7]],
  'Plancha lateral':               [['Oblicuos', 1.0]],
};

module.exports = { SKEL, FM, BM, VR, MUSCLE_MAP, EXERCISE_MUSCLE_MAP };
