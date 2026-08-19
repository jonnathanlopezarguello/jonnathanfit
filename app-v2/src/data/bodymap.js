const SKEL = [
  // Head
  'M63 5Q65 0 80 0Q95 0 97 5Q104 16 102 30Q98 46 80 46Q62 46 58 30Q56 16 63 5Z',
  // Neck
  'M74 46L86 46L88 59L72 59Z',
  // Left forearm
  'M46 154Q36 164 30 184Q26 202 28 218Q32 226 42 226Q52 226 56 218Q60 200 56 178Q52 160 48 154Z',
  // Right forearm
  'M114 154Q124 164 130 184Q134 202 132 218Q128 226 118 226Q108 226 104 218Q100 200 104 178Q108 160 112 154Z',
  // Left hand
  'M24 218Q16 224 16 236Q18 246 30 248Q44 248 52 238Q56 230 56 220Z',
  // Right hand
  'M136 218Q144 224 144 236Q142 246 130 248Q116 248 108 238Q104 230 104 220Z',
  // Left kneecap
  'M48 278Q40 284 40 292Q40 302 50 304L74 304Q82 302 82 292Q82 284 74 278Z',
  // Right kneecap
  'M112 278Q120 284 120 292Q120 302 110 304L86 304Q78 302 78 292Q78 284 86 278Z',
  // Left tibialis anterior (shin)
  'M58 306Q54 318 54 338Q54 352 58 356L64 356Q66 350 66 334Q66 316 62 306Z',
  // Right tibialis anterior
  'M102 306Q106 318 106 338Q106 352 102 356L96 356Q94 350 94 334Q94 316 98 306Z',
  // Left foot
  'M36 354Q30 360 40 360L70 360Q76 358 68 354Z',
  // Right foot
  'M124 354Q130 360 120 360L90 360Q84 358 92 354Z',
];

const FM = {
  // Deltoides: caps redondeados en los hombros
  Hombro: [
    { d: 'M52 62Q42 56 22 70Q12 82 16 98Q20 112 36 114Q48 112 52 102L52 62Z' },
    { d: 'M108 62Q118 56 138 70Q148 82 144 98Q140 112 124 114Q112 112 108 102L108 62Z' },
  ],
  // Pectorales: fans desde el esternón hacia las axilas
  Pecho: [
    { d: 'M80 59L73 57Q60 57 52 68Q46 80 48 96Q50 108 60 114Q70 118 80 114L80 59Z' },
    { d: 'M80 59L87 57Q100 57 108 68Q114 80 112 96Q110 108 100 114Q90 118 80 114L80 59Z' },
  ],
  // Bíceps: vientre muscular prominente
  Biceps: [
    { d: 'M50 114Q36 116 22 130Q12 144 14 160Q16 172 28 176Q42 178 52 172Q62 166 64 152Q66 136 58 120Q54 114 50 114Z' },
    { d: 'M110 114Q124 116 138 130Q148 144 146 160Q144 172 132 176Q118 178 108 172Q98 166 96 152Q94 136 102 120Q106 114 110 114Z' },
  ],
  // Abdomen: grid de 6 cuadros + oblicuos laterales
  Abdomen: [
    { d: 'M50 102Q54 112 56 128Q58 152 60 170L62 180L62 118L50 102Z', o: 0.8 },
    { d: 'M110 102Q106 112 104 128Q102 152 100 170L98 180L98 118L110 102Z', o: 0.8 },
    { d: 'M62 118L80 118L80 138Q78 140 62 139Z' },
    { d: 'M62 142L80 142L80 162Q78 164 62 163Z' },
    { d: 'M63 166L80 166L80 178Q76 182 64 180Z' },
    { d: 'M80 118L98 118L98 139Q82 140 80 138Z' },
    { d: 'M80 142L98 142L98 163Q82 164 80 162Z' },
    { d: 'M80 166L97 166Q97 180 90 182Q82 180 80 178Z' },
  ],
  // Cuádriceps: masa del muslo frontal
  Cuadriceps: [
    { d: 'M54 180Q46 194 42 218Q38 248 40 268Q42 278 54 280Q68 282 78 276Q82 268 82 252L80 180Z' },
    { d: 'M106 180Q114 194 118 218Q122 248 120 268Q118 278 106 280Q92 282 82 276Q78 268 78 252L80 180Z' },
  ],
  // Gastrocnemio (gemelos): forma real del músculo
  Gemelo: [
    { d: 'M46 306Q36 318 34 340Q34 356 44 358L64 358Q76 356 80 344Q82 328 78 312Q74 306 68 306Z' },
    { d: 'M114 306Q124 318 126 340Q126 356 116 358L96 358Q84 356 80 344Q78 328 82 312Q86 306 92 306Z' },
  ],
};

const BM = {
  // Deltoides posteriores: misma forma que el frontal
  Hombro: [
    { d: 'M52 62Q42 56 22 70Q12 82 16 98Q20 112 36 114Q48 112 52 102L52 62Z' },
    { d: 'M108 62Q118 56 138 70Q148 82 144 98Q140 112 124 114Q112 112 108 102L108 62Z' },
  ],
  // Espalda: trapecio superior (diamante) + dorsales (V) + lumbar
  Espalda: [
    { d: 'M72 59Q76 52 80 52Q84 52 88 59L110 74Q108 90 108 104L80 92L52 104Q52 90 50 74Z' },
    { d: 'M52 106Q42 116 40 138Q38 162 42 180Q48 194 60 198L80 194L80 104Z', o: 0.9 },
    { d: 'M108 106Q118 116 120 138Q122 162 118 180Q112 194 100 198L80 194L80 104Z', o: 0.9 },
    { d: 'M68 186Q74 190 80 190Q86 190 92 186L94 200Q86 204 80 204Q74 204 66 200Z', o: 0.75 },
  ],
  // Tríceps: parte posterior del brazo
  Triceps: [
    { d: 'M50 114Q36 116 22 130Q12 144 14 160Q16 172 28 176Q42 178 52 172Q62 166 64 152Q66 136 58 120Q54 114 50 114Z' },
    { d: 'M110 114Q124 116 138 130Q148 144 146 160Q144 172 132 176Q118 178 108 172Q98 166 96 152Q94 136 102 120Q106 114 110 114Z' },
  ],
  // Glúteo + isquiotibiales
  'Femoral/Gluteo': [
    { d: 'M58 194Q44 200 42 218Q40 238 52 252Q64 262 80 262Q96 262 108 252Q120 238 118 218Q116 200 102 194Z' },
    { d: 'M52 256Q42 268 40 278Q40 282 54 282L80 282L80 258Z', o: 0.9 },
    { d: 'M108 256Q118 268 120 278Q120 282 106 282L80 282L80 258Z', o: 0.9 },
  ],
  // Gemelos: mismos que el frontal
  Gemelo: [
    { d: 'M46 306Q36 318 34 340Q34 356 44 358L64 358Q76 356 80 344Q82 328 78 312Q74 306 68 306Z' },
    { d: 'M114 306Q124 318 126 340Q126 356 116 358L96 358Q84 356 80 344Q78 328 82 312Q86 306 92 306Z' },
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
