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
  'Tríceps Cabeza Larga':   { mev: 6, mav: [10, 14], mrv: 20 },
  'Tríceps Cabeza Lateral': { mev: 6, mav: [10, 14], mrv: 20 },
  'Tríceps Cabeza Medial':  { mev: 4, mav: [8, 12],  mrv: 16 },
  'Dorsal Ancho':        { mev: 10, mav: [14, 22], mrv: 25 },
  'Trapecio':            { mev: 0,  mav: [12, 20], mrv: 26 },
  'Recto Abdominal Superior': { mev: 0, mav: [8, 12], mrv: 16 },
  'Recto Abdominal Inferior': { mev: 0, mav: [8, 12], mrv: 16 },
  'Oblicuos':            { mev: 0,  mav: [12, 16], mrv: 20 },
  'Recto Femoral':       { mev: 6,  mav: [10, 16], mrv: 20 },
  'Vasto Lateral':       { mev: 8,  mav: [12, 18], mrv: 22 },
  'Vasto Medial':        { mev: 6,  mav: [10, 14], mrv: 18 },
  'Bíceps Femoral':      { mev: 6,  mav: [10, 16], mrv: 20 },
  'Semitendinoso':       { mev: 4,  mav: [8, 12],  mrv: 16 },
  'Glúteo Mayor':        { mev: 0,  mav: [4,  12], mrv: 16 },
  'Glúteo Medio':        { mev: 0,  mav: [6,  10], mrv: 14 },
  'Gastrocnemio':        { mev: 8,  mav: [12, 16], mrv: 20 },
  'Sóleo':                { mev: 6,  mav: [10, 14], mrv: 18 },
};

// Mapeo ejercicio.g → músculos con peso de contribución (fallback cuando el
// ejercicio no tiene entrada específica en EXERCISE_MUSCLE_MAP)
// 1.0 = músculo primario (series directas) · <1.0 = secundario (series indirectas)
const MUSCLE_MAP = {
  'Pecho':          [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.5], ['Tríceps Cabeza Lateral', 0.3], ['Tríceps Cabeza Medial', 0.3]],
  'Hombro':         [['Deltoides Lateral', 1.0], ['Deltoides Anterior', 0.5], ['Deltoides Posterior', 0.5]],
  'Biceps':         [['Bíceps Braquial', 1.0]],
  'Triceps':        [['Tríceps Cabeza Larga', 1.0], ['Tríceps Cabeza Lateral', 1.0], ['Tríceps Cabeza Medial', 1.0]],
  'Espalda':        [['Dorsal Ancho', 1.0], ['Bíceps Braquial', 0.5], ['Trapecio', 0.5]],
  'Trapecio':       [['Trapecio', 1.0]],
  'Abdomen':        [['Recto Abdominal Superior', 1.0], ['Recto Abdominal Inferior', 1.0], ['Oblicuos', 0.5]],
  'Cuadriceps':     [['Recto Femoral', 1.0], ['Vasto Lateral', 1.0], ['Vasto Medial', 1.0], ['Glúteo Mayor', 0.5]],
  'Femoral/Gluteo': [['Bíceps Femoral', 1.0], ['Semitendinoso', 1.0], ['Glúteo Mayor', 1.0], ['Glúteo Medio', 1.0]],
  'Femoral':        [['Bíceps Femoral', 1.0], ['Semitendinoso', 1.0]],
  'Gluteo':         [['Glúteo Mayor', 1.0], ['Glúteo Medio', 1.0]],
  'Gemelo':         [['Gastrocnemio', 1.0], ['Sóleo', 1.0]],
};

// Mapeo por ejercicio individual → músculos exactos con peso
// 1.0 = músculo primario · 0.2–0.8 = músculo secundario
// Permite saber qué cabeza/porción trabaja cada ejercicio
const EXERCISE_MUSCLE_MAP = {
  // ── PECHO ──────────────────────────────────────────────────────────
  'Press inclinado con mancuerna': [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.4], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Medial', 0.2]],
  'Press plano maquina o barra':   [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.3], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Medial', 0.2]],
  'Press banca con mancuernas':    [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.3], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Medial', 0.2]],
  'Press banca declinado':         [['Pectoral Mayor', 1.0], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Medial', 0.2]],
  'Aperturas / Pec deck':          [['Pectoral Mayor', 1.0]],
  'Cruces en polea / Fondos':      [['Pectoral Mayor', 1.0], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Medial', 0.2]],
  'Cruces en polea alta':          [['Pectoral Mayor', 1.0]],
  'Fondos en paralelas pecho':     [['Pectoral Mayor', 1.0], ['Deltoides Anterior', 0.4], ['Tríceps Cabeza Lateral', 0.3], ['Tríceps Cabeza Medial', 0.3]],

  // ── ESPALDA ────────────────────────────────────────────────────────
  'Dominadas o Jalon al pecho':    [['Dorsal Ancho', 1.0], ['Bíceps Braquial', 0.5]],
  'Remo con barra':                [['Dorsal Ancho', 1.0], ['Trapecio', 0.5], ['Bíceps Braquial', 0.3]],
  'Remo sentado en maquina':       [['Dorsal Ancho', 1.0], ['Trapecio', 0.5], ['Bíceps Braquial', 0.3]],
  'Remo con mancuerna':            [['Dorsal Ancho', 1.0], ['Trapecio', 0.4], ['Bíceps Braquial', 0.3]],
  'Jalon brazo recto / Pullover':  [['Dorsal Ancho', 1.0]],
  'Jalon agarre estrecho':         [['Dorsal Ancho', 1.0], ['Bíceps Braquial', 0.4]],
  'Peso muerto convencional':      [['Dorsal Ancho', 0.5], ['Trapecio', 0.5], ['Bíceps Femoral', 0.5], ['Semitendinoso', 0.3], ['Glúteo Mayor', 0.5]],
  'Remo en T':                     [['Dorsal Ancho', 1.0], ['Trapecio', 0.5], ['Bíceps Braquial', 0.3]],

  // ── BÍCEPS ─────────────────────────────────────────────────────────
  'Curl con barra':                [['Bíceps Braquial', 1.0]],
  'Curl inclinado mancuerna':      [['Bíceps Braquial', 1.0]],
  'Curl martillo':                 [['Bíceps Braquial', 1.0]],
  'Curl predicador o en polea':    [['Bíceps Braquial', 1.0]],
  'Curl concentrado':              [['Bíceps Braquial', 1.0]],
  'Curl en polea baja':            [['Bíceps Braquial', 1.0]],

  // ── TRÍCEPS — discriminado por cabeza ──────────────────────────────
  'Press frances':                 [['Tríceps Cabeza Larga', 1.0]],
  'Extension en polea (cuerda)':   [['Tríceps Cabeza Lateral', 1.0]],
  'Fondos o press cerrado':        [['Tríceps Cabeza Lateral', 1.0], ['Tríceps Cabeza Medial', 0.8], ['Pectoral Mayor', 0.3]],
  'Extension sobre la cabeza':     [['Tríceps Cabeza Larga', 1.0]],
  'Press cerrado banca':           [['Tríceps Cabeza Lateral', 1.0], ['Tríceps Cabeza Medial', 0.8], ['Pectoral Mayor', 0.3]],
  'Kickback mancuerna':            [['Tríceps Cabeza Lateral', 1.0], ['Tríceps Cabeza Medial', 0.5]],

  // ── HOMBRO — discriminado por cabeza ───────────────────────────────
  'Press militar de pie':          [['Deltoides Anterior', 1.0], ['Deltoides Lateral', 0.3], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Larga', 0.2]],
  'Press hombro sentado / Arnold': [['Deltoides Anterior', 1.0], ['Deltoides Lateral', 0.3], ['Tríceps Cabeza Lateral', 0.2], ['Tríceps Cabeza Larga', 0.2]],
  'Elevacion lateral mancuerna':   [['Deltoides Lateral', 1.0]],
  'Elevacion lateral en polea':    [['Deltoides Lateral', 1.0]],
  'Face pull / posterior polea':   [['Deltoides Posterior', 1.0], ['Trapecio', 0.3]],
  'Reverse pec deck':              [['Deltoides Posterior', 1.0]],
  'Elevacion frontal barra':       [['Deltoides Anterior', 1.0]],

  // ── CUÁDRICEPS — discriminado por cabeza ───────────────────────────
  'Sentadilla libre':              [['Vasto Lateral', 1.0], ['Vasto Medial', 1.0], ['Recto Femoral', 0.6], ['Glúteo Mayor', 0.5]],
  'Prensa 45°':                    [['Vasto Lateral', 1.0], ['Vasto Medial', 0.8], ['Recto Femoral', 0.5], ['Glúteo Mayor', 0.3]],
  'Hack squat o Bulgara':          [['Vasto Lateral', 1.0], ['Vasto Medial', 0.6], ['Recto Femoral', 0.4], ['Glúteo Mayor', 0.3]],
  'Extension de cuadriceps':       [['Recto Femoral', 1.0], ['Vasto Lateral', 0.7], ['Vasto Medial', 0.7]],
  'Zancadas con mancuernas':       [['Vasto Lateral', 1.0], ['Vasto Medial', 0.8], ['Recto Femoral', 0.5], ['Glúteo Mayor', 0.5]],
  'Sentadilla bulgara split':      [['Vasto Lateral', 1.0], ['Vasto Medial', 0.7], ['Recto Femoral', 0.4], ['Glúteo Mayor', 0.5]],
  'Step up con mancuernas':        [['Vasto Lateral', 0.8], ['Vasto Medial', 0.8], ['Recto Femoral', 0.5], ['Glúteo Mayor', 0.6]],

  // ── FEMORAL / GLÚTEO — discriminado por cabeza ─────────────────────
  'Peso muerto rumano':            [['Bíceps Femoral', 1.0], ['Semitendinoso', 0.8], ['Glúteo Mayor', 1.0]],
  'Hip thrust':                    [['Glúteo Mayor', 1.0], ['Glúteo Medio', 0.3], ['Bíceps Femoral', 0.3]],
  'Curl femoral tumbado':          [['Bíceps Femoral', 1.0], ['Semitendinoso', 0.6]],
  'Curl femoral sentado':          [['Semitendinoso', 1.0], ['Bíceps Femoral', 0.7]],
  'Buenos dias':                   [['Bíceps Femoral', 1.0], ['Semitendinoso', 0.7], ['Glúteo Mayor', 0.6]],
  'Patada de gluteo en polea':     [['Glúteo Mayor', 1.0], ['Glúteo Medio', 0.3]],
  'Sumo deadlift':                 [['Glúteo Mayor', 1.0], ['Glúteo Medio', 0.4], ['Bíceps Femoral', 0.5]],

  // ── GEMELO — discriminado gastrocnemio vs sóleo ────────────────────
  'Gemelo de pie':                 [['Gastrocnemio', 1.0]],
  'Gemelo en prensa':              [['Gastrocnemio', 1.0]],
  'Gemelo sentado':                [['Sóleo', 1.0]],
  'Gemelo de pie en maquina':      [['Gastrocnemio', 1.0]],
  'Gemelo con mancuerna':          [['Gastrocnemio', 1.0]],

  // ── ABDOMEN — discriminado por porción (superior = flexión de tronco,
  //    inferior = flexión de cadera) según EMG (Escamilla et al., ACE/SDSU) ──
  'Elevacion de piernas colgado':  [['Recto Abdominal Inferior', 1.0]],
  'Elevacion de piernas':          [['Recto Abdominal Inferior', 1.0]],
  'Crunch en polea arrodillado':   [['Recto Abdominal Superior', 1.0]],
  'Crunch en polea':               [['Recto Abdominal Superior', 1.0]],
  'Crunch lastrado en polea':      [['Recto Abdominal Superior', 1.0]],
  'Rueda abdominal':               [['Recto Abdominal Superior', 0.8], ['Recto Abdominal Inferior', 0.8], ['Oblicuos', 0.3]],
  'Crunch inverso':                [['Recto Abdominal Inferior', 1.0]],
  'Plancha lastrada':              [['Recto Abdominal Superior', 0.5], ['Recto Abdominal Inferior', 0.5], ['Oblicuos', 0.5]],
  'Rotacion / Pallof press':       [['Oblicuos', 1.0]],
  'Crunch bicicleta':              [['Recto Abdominal Superior', 0.6], ['Recto Abdominal Inferior', 0.4], ['Oblicuos', 0.7]],
  'Plancha lateral':               [['Oblicuos', 1.0]],
};

// Músculo VR (granular) → slug del paquete react-native-body-highlighter
// (regiones fijas de la librería). Fuente única — antes vivía duplicado en
// ProgresoScreen.js y ExerciseDetailModal.js y se podía desincronizar cada
// vez que se agregaba o dividía un músculo en VR.
const MUSCLE_TO_SLUG = {
  'Pectoral Mayor':           'chest',
  'Deltoides Anterior':       'deltoids',
  'Deltoides Lateral':        'deltoids',
  'Deltoides Posterior':      'deltoids',
  'Bíceps Braquial':          'biceps',
  'Tríceps Cabeza Larga':     'triceps',
  'Tríceps Cabeza Lateral':   'triceps',
  'Tríceps Cabeza Medial':    'triceps',
  'Dorsal Ancho':             'upper-back',
  'Trapecio':                 'trapezius',
  'Recto Abdominal Superior': 'abs',
  'Recto Abdominal Inferior': 'abs',
  'Oblicuos':                 'obliques',
  'Recto Femoral':            'quadriceps',
  'Vasto Lateral':            'quadriceps',
  'Vasto Medial':             'quadriceps',
  'Bíceps Femoral':           'hamstring',
  'Semitendinoso':            'hamstring',
  'Glúteo Mayor':             'gluteal',
  'Glúteo Medio':             'gluteal',
  'Gastrocnemio':             'calves',
  'Sóleo':                     'calves',
};

module.exports = { VR, MUSCLE_MAP, EXERCISE_MUSCLE_MAP, MUSCLE_TO_SLUG };
