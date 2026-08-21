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

module.exports = { VR, MUSCLE_MAP, EXERCISE_MUSCLE_MAP };
