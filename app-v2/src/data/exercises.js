const T = {
  Lunes: [
    { n: 'Sentadilla libre', g: 'Cuadriceps', s: 4, r: '6-10', ri: '2-3', re: '2-3 min', f: 'Vasto ext/medial; profundidad completa' },
    { n: 'Prensa 45°', g: 'Cuadriceps', s: 3, r: '10-12', ri: '1-2', re: '2 min', f: 'General; recorrido largo sin bloquear' },
    { n: 'Hack squat o Bulgara', g: 'Cuadriceps', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Vasto externo; rango profundo' },
    { n: 'Extension de cuadriceps', g: 'Cuadriceps', s: 3, r: '12-15', ri: '0-1', re: '1.5 min', f: 'Recto femoral; drop set ultima' },
    { n: 'Press militar de pie', g: 'Hombro', s: 3, r: '6-10', ri: '2-3', re: '2 min', f: 'Deltoides anterior; sin arquear lumbar' },
    { n: 'Elevacion lateral mancuerna', g: 'Hombro', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Deltoides lateral; codo lidera' },
    { n: 'Elevacion lateral en polea', g: 'Hombro', s: 2, r: '12-20', ri: '0-1', re: '1 min', f: 'Lateral; tension en estiramiento' },
    { n: 'Face pull / posterior polea', g: 'Hombro', s: 4, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Elevacion de piernas colgado', g: 'Abdomen', s: 2, r: '10-15', ri: '1-2', re: '1 min', f: 'Recto inferior; sin balanceo' },
    { n: 'Crunch en polea arrodillado', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Recto superior; flexionar columna' },
    { n: 'Rueda abdominal', g: 'Abdomen', s: 2, r: '8-12', ri: '1-2', re: '1 min', f: 'Anti-extension; core completo' },
    { n: 'Crunch inverso', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Porcion inferior' },
    { n: 'Gemelo de pie', g: 'Gemelo', s: 3, r: '10-15', ri: '0-1', re: '1 min', f: 'Gastrocnemio; estiramiento abajo' },
    { n: 'Gemelo en prensa', g: 'Gemelo', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Gastrocnemio; rodilla extendida' },
    { n: 'Gemelo sentado', g: 'Gemelo', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Soleo; rodilla flexionada' },
  ],
  Martes: [
    { n: 'Dominadas o Jalon al pecho', g: 'Espalda', s: 4, r: '8-12', ri: '2-3', re: '2 min', f: 'Dorsal ancho (anchura)' },
    { n: 'Remo con barra', g: 'Espalda', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Espesor; apretar escapulas' },
    { n: 'Remo sentado en maquina', g: 'Espalda', s: 3, r: '10-12', ri: '1-2', re: '1.5 min', f: 'Dorsal medio / romboides' },
    { n: 'Jalon brazo recto / Pullover', g: 'Espalda', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Dorsal en estiramiento' },
    { n: 'Curl con barra', g: 'Biceps', s: 3, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza corta y larga' },
    { n: 'Curl inclinado mancuerna', g: 'Biceps', s: 2, r: '10-12', ri: '1-2', re: '1 min', f: 'Cabeza larga (estiramiento)' },
    { n: 'Curl martillo', g: 'Biceps', s: 2, r: '10-12', ri: '1-2', re: '1 min', f: 'Braquial / braquiorradial' },
    { n: 'Curl predicador o en polea', g: 'Biceps', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Cabeza corta; drop set ultima' },
  ],
  Jueves: [
    { n: 'Peso muerto rumano', g: 'Femoral/Gluteo', s: 4, r: '6-10', ri: '2-3', re: '2-3 min', f: 'Femoral y gluteo' },
    { n: 'Hip thrust', g: 'Femoral/Gluteo', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Gluteo mayor; pausa 1s arriba' },
    { n: 'Curl femoral tumbado', g: 'Femoral/Gluteo', s: 3, r: '10-15', ri: '0-1', re: '1.5 min', f: 'Femoral (cabezas inferiores)' },
    { n: 'Curl femoral sentado', g: 'Femoral/Gluteo', s: 3, r: '10-15', ri: '0-1', re: '1.5 min', f: 'Femoral (mayor estiramiento)' },
    { n: 'Press hombro sentado / Arnold', g: 'Hombro', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Deltoides anterior; rango completo' },
    { n: 'Elevacion lateral mancuerna', g: 'Hombro', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Deltoides lateral' },
    { n: 'Elevacion lateral en polea', g: 'Hombro', s: 2, r: '12-20', ri: '0-1', re: '1 min', f: 'Lateral; tension constante' },
    { n: 'Reverse pec deck', g: 'Hombro', s: 4, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Rueda abdominal', g: 'Abdomen', s: 2, r: '8-12', ri: '1-2', re: '1 min', f: 'Core anti-extension' },
    { n: 'Crunch lastrado en polea', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Recto superior' },
    { n: 'Elevacion de piernas colgado', g: 'Abdomen', s: 2, r: '10-15', ri: '1-2', re: '1 min', f: 'Porcion inferior' },
    { n: 'Rotacion / Pallof press', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Oblicuos' },
    { n: 'Gemelo sentado', g: 'Gemelo', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Soleo; rodilla flexionada' },
    { n: 'Gemelo de pie en maquina', g: 'Gemelo', s: 3, r: '10-15', ri: '0-1', re: '1 min', f: 'Gastrocnemio' },
  ],
  Viernes: [
    { n: 'Press inclinado con mancuerna', g: 'Pecho', s: 4, r: '6-10', ri: '2-3', re: '2 min', f: 'Pecho superior; estiramiento amplio' },
    { n: 'Press plano maquina o barra', g: 'Pecho', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Pecho medio; escapulas retraidas' },
    { n: 'Aperturas / Pec deck', g: 'Pecho', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Estiramiento maximo; drop set' },
    { n: 'Cruces en polea / Fondos', g: 'Pecho', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Pecho inferior/interno' },
    { n: 'Press frances', g: 'Triceps', s: 3, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza larga (estiramiento)' },
    { n: 'Extension en polea (cuerda)', g: 'Triceps', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Cabeza lateral' },
    { n: 'Fondos o press cerrado', g: 'Triceps', s: 3, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza medial/lateral' },
    { n: 'Extension sobre la cabeza', g: 'Triceps', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Cabeza larga (estiramiento)' },
    { n: 'Crunch en polea', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Recto superior' },
    { n: 'Rueda abdominal', g: 'Abdomen', s: 2, r: '8-12', ri: '1-2', re: '1 min', f: 'Core completo' },
    { n: 'Elevacion de piernas', g: 'Abdomen', s: 2, r: '10-15', ri: '1-2', re: '1 min', f: 'Recto inferior' },
    { n: 'Plancha lastrada', g: 'Abdomen', s: 2, r: '30-45 s', ri: '-', re: '1 min', f: 'Estabilidad de core' },
  ],
};

const DT = {
  Lunes: 'Cuadriceps · Hombro · Abdomen · Gemelo',
  Martes: 'Espalda · Biceps',
  Jueves: 'Femoral/Gluteo · Hombro · Abdomen · Gemelo',
  Viernes: 'Pecho · Triceps · Abdomen',
};

const PD = ['Lunes', 'Martes', 'Jueves', 'Viernes'];

/* ══════════════════════════════════════════════════════════════════════════
   FULL BODY — 2-3 dias/semana (frecuencia alta, volumen bajo por sesion,
   Schoenfeld et al. 2016/2019: la frecuencia >=2x/semana por musculo iguala
   o supera al split de un solo dia con el mismo volumen semanal total)
══════════════════════════════════════════════════════════════════════════ */
const T3 = {
  Lunes: [
    { n: 'Sentadilla libre', g: 'Cuadriceps', s: 4, r: '8-10', ri: '2-3', re: '2-3 min', f: 'Vasto ext/medial; profundidad completa' },
    { n: 'Press plano maquina o barra', g: 'Pecho', s: 3, r: '8-10', ri: '2-3', re: '2 min', f: 'Pecho medio; escapulas retraidas' },
    { n: 'Remo con barra', g: 'Espalda', s: 4, r: '8-10', ri: '2-3', re: '2 min', f: 'Espesor; apretar escapulas' },
    { n: 'Press militar de pie', g: 'Hombro', s: 4, r: '10-12', ri: '1-2', re: '1.5 min', f: 'Deltoides anterior; sin arquear lumbar' },
    { n: 'Face pull / posterior polea', g: 'Hombro', s: 4, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Curl con barra', g: 'Biceps', s: 2, r: '10-12', ri: '1-2', re: '1.5 min', f: 'Cabeza corta y larga' },
    { n: 'Extension en polea (cuerda)', g: 'Triceps', s: 3, r: '10-12', ri: '1-2', re: '1 min', f: 'Cabeza lateral' },
    { n: 'Elevacion de piernas', g: 'Abdomen', s: 2, r: '10-15', ri: '1-2', re: '1 min', f: 'Recto inferior' },
  ],
  Miercoles: [
    { n: 'Peso muerto rumano', g: 'Femoral/Gluteo', s: 4, r: '8-10', ri: '2-3', re: '2-3 min', f: 'Femoral y gluteo' },
    { n: 'Dominadas o Jalon al pecho', g: 'Espalda', s: 3, r: '8-10', ri: '2-3', re: '2 min', f: 'Dorsal ancho (anchura)' },
    { n: 'Press inclinado con mancuerna', g: 'Pecho', s: 3, r: '8-10', ri: '2-3', re: '2 min', f: 'Pecho superior; estiramiento amplio' },
    { n: 'Elevacion lateral mancuerna', g: 'Hombro', s: 4, r: '12-15', ri: '0-1', re: '1 min', f: 'Deltoides lateral; codo lidera' },
    { n: 'Reverse pec deck', g: 'Hombro', s: 4, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Curl martillo', g: 'Biceps', s: 2, r: '10-12', ri: '1-2', re: '1 min', f: 'Braquial / braquiorradial' },
    { n: 'Fondos o press cerrado', g: 'Triceps', s: 3, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza medial/lateral' },
    { n: 'Crunch en polea', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Recto superior' },
  ],
  Viernes: [
    { n: 'Prensa 45°', g: 'Cuadriceps', s: 3, r: '10-12', ri: '1-2', re: '2 min', f: 'General; recorrido largo sin bloquear' },
    { n: 'Extension de cuadriceps', g: 'Cuadriceps', s: 2, r: '12-15', ri: '0-1', re: '1.5 min', f: 'Recto femoral; drop set ultima' },
    { n: 'Remo sentado en maquina', g: 'Espalda', s: 3, r: '10-12', ri: '1-2', re: '1.5 min', f: 'Dorsal medio / romboides' },
    { n: 'Aperturas / Pec deck', g: 'Pecho', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Estiramiento maximo; drop set' },
    { n: 'Elevacion lateral en polea', g: 'Hombro', s: 4, r: '12-20', ri: '0-1', re: '1 min', f: 'Lateral; tension en estiramiento' },
    { n: 'Curl inclinado mancuerna', g: 'Biceps', s: 2, r: '10-12', ri: '1-2', re: '1 min', f: 'Cabeza larga (estiramiento)' },
    { n: 'Press frances', g: 'Triceps', s: 4, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza larga (estiramiento)' },
    { n: 'Rueda abdominal', g: 'Abdomen', s: 2, r: '8-12', ri: '1-2', re: '1 min', f: 'Anti-extension; core completo' },
    { n: 'Gemelo de pie', g: 'Gemelo', s: 4, r: '10-15', ri: '0-1', re: '1 min', f: 'Gastrocnemio; estiramiento abajo' },
    { n: 'Gemelo sentado', g: 'Gemelo', s: 4, r: '12-20', ri: '0-1', re: '1 min', f: 'Soleo; rodilla flexionada' },
  ],
};

const DT3 = {
  Lunes: 'Full Body A',
  Miercoles: 'Full Body B',
  Viernes: 'Full Body C',
};

const PD3 = ['Lunes', 'Miercoles', 'Viernes'];

/* ══════════════════════════════════════════════════════════════════════════
   PUSH / PULL / LEGS ×2 — 5-6 dias/semana
══════════════════════════════════════════════════════════════════════════ */
const T6 = {
  Lunes: [
    { n: 'Press plano maquina o barra', g: 'Pecho', s: 4, r: '6-10', ri: '2-3', re: '2 min', f: 'Pecho medio; escapulas retraidas' },
    { n: 'Press militar de pie', g: 'Hombro', s: 3, r: '6-10', ri: '2-3', re: '2 min', f: 'Deltoides anterior; sin arquear lumbar' },
    { n: 'Aperturas / Pec deck', g: 'Pecho', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Estiramiento maximo; drop set' },
    { n: 'Elevacion lateral mancuerna', g: 'Hombro', s: 4, r: '12-20', ri: '0-1', re: '1 min', f: 'Deltoides lateral; codo lidera' },
    { n: 'Extension en polea (cuerda)', g: 'Triceps', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Cabeza lateral' },
    { n: 'Press frances', g: 'Triceps', s: 2, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza larga (estiramiento)' },
  ],
  Martes: [
    { n: 'Dominadas o Jalon al pecho', g: 'Espalda', s: 4, r: '6-10', ri: '2-3', re: '2 min', f: 'Dorsal ancho (anchura)' },
    { n: 'Remo con barra', g: 'Espalda', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Espesor; apretar escapulas' },
    { n: 'Face pull / posterior polea', g: 'Hombro', s: 4, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Curl con barra', g: 'Biceps', s: 3, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza corta y larga' },
    { n: 'Curl martillo', g: 'Biceps', s: 2, r: '10-12', ri: '1-2', re: '1 min', f: 'Braquial / braquiorradial' },
  ],
  Miercoles: [
    { n: 'Sentadilla libre', g: 'Cuadriceps', s: 4, r: '6-10', ri: '2-3', re: '2-3 min', f: 'Vasto ext/medial; profundidad completa' },
    { n: 'Peso muerto rumano', g: 'Femoral/Gluteo', s: 3, r: '8-10', ri: '2-3', re: '2-3 min', f: 'Femoral y gluteo' },
    { n: 'Extension de cuadriceps', g: 'Cuadriceps', s: 3, r: '12-15', ri: '0-1', re: '1.5 min', f: 'Recto femoral; drop set ultima' },
    { n: 'Curl femoral tumbado', g: 'Femoral/Gluteo', s: 3, r: '10-15', ri: '0-1', re: '1.5 min', f: 'Femoral (cabezas inferiores)' },
    { n: 'Gemelo de pie', g: 'Gemelo', s: 4, r: '10-15', ri: '0-1', re: '1 min', f: 'Gastrocnemio; estiramiento abajo' },
    { n: 'Gemelo sentado', g: 'Gemelo', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Soleo; rodilla flexionada' },
  ],
  Jueves: [
    { n: 'Press inclinado con mancuerna', g: 'Pecho', s: 4, r: '8-12', ri: '1-2', re: '2 min', f: 'Pecho superior; estiramiento amplio' },
    { n: 'Press hombro sentado / Arnold', g: 'Hombro', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Deltoides anterior; rango completo' },
    { n: 'Cruces en polea / Fondos', g: 'Pecho', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Pecho inferior/interno' },
    { n: 'Elevacion lateral en polea', g: 'Hombro', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Lateral; tension en estiramiento' },
    { n: 'Press cerrado banca', g: 'Triceps', s: 3, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza medial y lateral; mas carga' },
    { n: 'Extension sobre la cabeza', g: 'Triceps', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Cabeza larga (estiramiento)' },
  ],
  Viernes: [
    { n: 'Remo sentado en maquina', g: 'Espalda', s: 4, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Dorsal medio / romboides' },
    { n: 'Jalon brazo recto / Pullover', g: 'Espalda', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Dorsal en estiramiento' },
    { n: 'Reverse pec deck', g: 'Hombro', s: 4, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Curl predicador o en polea', g: 'Biceps', s: 3, r: '12-15', ri: '0-1', re: '1 min', f: 'Cabeza corta; drop set ultima' },
    { n: 'Curl en polea baja', g: 'Biceps', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Tension constante en el estiramiento' },
  ],
  Sabado: [
    { n: 'Hack squat o Bulgara', g: 'Cuadriceps', s: 4, r: '8-12', ri: '1-2', re: '2 min', f: 'Vasto externo; rango profundo' },
    { n: 'Hip thrust', g: 'Femoral/Gluteo', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Gluteo mayor; pausa 1s arriba' },
    { n: 'Curl femoral sentado', g: 'Femoral/Gluteo', s: 3, r: '10-15', ri: '0-1', re: '1.5 min', f: 'Femoral (mayor estiramiento)' },
    { n: 'Zancadas con mancuernas', g: 'Cuadriceps', s: 3, r: '10-12', ri: '1-2', re: '2 min', f: 'Cuad + gluteo; paso largo' },
    { n: 'Gemelo en prensa', g: 'Gemelo', s: 4, r: '12-20', ri: '0-1', re: '1 min', f: 'Gastrocnemio; rodilla extendida' },
    { n: 'Gemelo sentado', g: 'Gemelo', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Soleo; rodilla flexionada' },
    { n: 'Rueda abdominal', g: 'Abdomen', s: 2, r: '8-12', ri: '1-2', re: '1 min', f: 'Anti-extension; core completo' },
  ],
};

const DT6 = {
  Lunes: 'Push A — Pecho · Hombro · Triceps',
  Martes: 'Pull A — Espalda · Biceps',
  Miercoles: 'Legs A — Pierna',
  Jueves: 'Push B — Pecho · Hombro · Triceps',
  Viernes: 'Pull B — Espalda · Biceps',
  Sabado: 'Legs B — Pierna · Abdomen',
};

const PD6 = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

// Devuelve la rutina {T, DT, PD} segun los dias/semana elegidos en el perfil.
// 5 dias reutiliza el PPL de 6 quitando el segundo dia de pierna (Sabado).
function getRoutine(daysPerWeek) {
  const d = Number(daysPerWeek) || 4; // sin dato valido, no asumir la mas pesada
  if (d <= 3) return { T: T3, DT: DT3, PD: PD3 };
  if (d === 4) return { T, DT, PD };
  if (d === 5) {
    const { Sabado, ...T5 } = T6;
    const { Sabado: _drop, ...DT5 } = DT6;
    return { T: T5, DT: DT5, PD: PD6.slice(0, 5) };
  }
  return { T: T6, DT: DT6, PD: PD6 };
}

const EXERCISE_LIBRARY = [
  // PECHO
  { n: 'Press inclinado con mancuerna', g: 'Pecho', s:4, r:'6-10', ri:'2-3', re:'2 min', f:'Pecho superior; estiramiento amplio' },
  { n: 'Press plano maquina o barra', g: 'Pecho', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Pecho medio; escapulas retraidas' },
  { n: 'Press banca con mancuernas', g: 'Pecho', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Mayor rango de movimiento que barra' },
  { n: 'Press banca declinado', g: 'Pecho', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Pecho inferior; fibras esternales' },
  { n: 'Aperturas / Pec deck', g: 'Pecho', s:3, r:'12-15', ri:'0-1', re:'1 min', f:'Estiramiento maximo; drop set' },
  { n: 'Cruces en polea / Fondos', g: 'Pecho', s:3, r:'12-15', ri:'0-1', re:'1 min', f:'Pecho inferior/interno' },
  { n: 'Cruces en polea alta', g: 'Pecho', s:3, r:'12-15', ri:'0-1', re:'1 min', f:'Pecho inferior; tension constante' },
  { n: 'Fondos en paralelas pecho', g: 'Pecho', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Inclinar torso adelante; pecho completo' },
  // ESPALDA
  { n: 'Dominadas o Jalon al pecho', g: 'Espalda', s:4, r:'8-12', ri:'2-3', re:'2 min', f:'Dorsal ancho (anchura)' },
  { n: 'Remo con barra', g: 'Espalda', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Espesor; apretar escapulas' },
  { n: 'Remo sentado en maquina', g: 'Espalda', s:3, r:'10-12', ri:'1-2', re:'1.5 min', f:'Dorsal medio / romboides' },
  { n: 'Remo con mancuerna', g: 'Espalda', s:3, r:'10-12', ri:'1-2', re:'1.5 min', f:'Espesor unilateral; evitar rotacion' },
  { n: 'Jalon brazo recto / Pullover', g: 'Espalda', s:3, r:'12-15', ri:'0-1', re:'1 min', f:'Dorsal en estiramiento' },
  { n: 'Jalon agarre estrecho', g: 'Espalda', s:3, r:'10-12', ri:'1-2', re:'1.5 min', f:'Dorsal inferior; codos a caderas' },
  { n: 'Peso muerto convencional', g: 'Espalda', s:4, r:'4-8', ri:'2-3', re:'3 min', f:'Cadena posterior completa; espalda neutra' },
  { n: 'Remo en T', g: 'Espalda', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Espesor; agarre neutro' },
  // BICEPS
  { n: 'Curl con barra', g: 'Biceps', s:3, r:'8-12', ri:'1-2', re:'1.5 min', f:'Cabeza corta y larga' },
  { n: 'Curl inclinado mancuerna', g: 'Biceps', s:2, r:'10-12', ri:'1-2', re:'1 min', f:'Cabeza larga (estiramiento)' },
  { n: 'Curl martillo', g: 'Biceps', s:2, r:'10-12', ri:'1-2', re:'1 min', f:'Braquial / braquiorradial' },
  { n: 'Curl predicador o en polea', g: 'Biceps', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Cabeza corta; drop set ultima' },
  { n: 'Curl concentrado', g: 'Biceps', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Pico del biceps; contraccion maxima' },
  { n: 'Curl en polea baja', g: 'Biceps', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Tension constante en el estiramiento' },
  // TRICEPS
  { n: 'Press frances', g: 'Triceps', s:3, r:'8-12', ri:'1-2', re:'1.5 min', f:'Cabeza larga (estiramiento)' },
  { n: 'Extension en polea (cuerda)', g: 'Triceps', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Cabeza lateral' },
  { n: 'Fondos o press cerrado', g: 'Triceps', s:2, r:'8-12', ri:'1-2', re:'1.5 min', f:'Cabeza medial/lateral' },
  { n: 'Extension sobre la cabeza', g: 'Triceps', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Cabeza larga (estiramiento)' },
  { n: 'Press cerrado banca', g: 'Triceps', s:3, r:'8-12', ri:'1-2', re:'1.5 min', f:'Cabeza medial y lateral; mas carga' },
  { n: 'Kickback mancuerna', g: 'Triceps', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Contraccion maxima; unilateral' },
  // HOMBRO
  { n: 'Press militar de pie', g: 'Hombro', s:3, r:'6-10', ri:'2-3', re:'2 min', f:'Deltoides anterior; sin arquear lumbar' },
  { n: 'Press hombro sentado / Arnold', g: 'Hombro', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Deltoides anterior; rango completo' },
  { n: 'Elevacion lateral mancuerna', g: 'Hombro', s:3, r:'12-20', ri:'0-1', re:'1 min', f:'Deltoides lateral; codo lidera' },
  { n: 'Elevacion lateral en polea', g: 'Hombro', s:2, r:'12-20', ri:'0-1', re:'1 min', f:'Lateral; tension en estiramiento' },
  { n: 'Face pull / posterior polea', g: 'Hombro', s:2, r:'15-20', ri:'0-1', re:'1 min', f:'Deltoides posterior' },
  { n: 'Reverse pec deck', g: 'Hombro', s:2, r:'15-20', ri:'0-1', re:'1 min', f:'Deltoides posterior' },
  { n: 'Elevacion frontal barra', g: 'Hombro', s:2, r:'10-15', ri:'0-1', re:'1 min', f:'Deltoides anterior; evitar impetu' },
  // CUADRICEPS
  { n: 'Sentadilla libre', g: 'Cuadriceps', s:4, r:'6-10', ri:'2-3', re:'2-3 min', f:'Vasto ext/medial; profundidad completa' },
  { n: 'Prensa 45°', g: 'Cuadriceps', s:3, r:'10-12', ri:'1-2', re:'2 min', f:'General; recorrido largo sin bloquear' },
  { n: 'Hack squat o Bulgara', g: 'Cuadriceps', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Vasto externo; rango profundo' },
  { n: 'Extension de cuadriceps', g: 'Cuadriceps', s:3, r:'12-15', ri:'0-1', re:'1.5 min', f:'Recto femoral; drop set ultima' },
  { n: 'Zancadas con mancuernas', g: 'Cuadriceps', s:3, r:'10-12', ri:'1-2', re:'2 min', f:'Cuad + gluteo; paso largo' },
  { n: 'Sentadilla bulgara split', g: 'Cuadriceps', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Vasto externo + gluteo; unilateral' },
  { n: 'Step up con mancuernas', g: 'Cuadriceps', s:3, r:'10-12', ri:'1-2', re:'1.5 min', f:'Unilateral; control en el descenso' },
  // FEMORAL/GLUTEO
  { n: 'Peso muerto rumano', g: 'Femoral/Gluteo', s:4, r:'6-10', ri:'2-3', re:'2-3 min', f:'Femoral y gluteo' },
  { n: 'Hip thrust', g: 'Femoral/Gluteo', s:3, r:'8-12', ri:'1-2', re:'2 min', f:'Gluteo mayor; pausa 1s arriba' },
  { n: 'Curl femoral tumbado', g: 'Femoral/Gluteo', s:3, r:'10-15', ri:'0-1', re:'1.5 min', f:'Femoral (cabezas inferiores)' },
  { n: 'Curl femoral sentado', g: 'Femoral/Gluteo', s:3, r:'10-15', ri:'0-1', re:'1.5 min', f:'Femoral (mayor estiramiento)' },
  { n: 'Buenos dias', g: 'Femoral/Gluteo', s:3, r:'10-12', ri:'1-2', re:'2 min', f:'Femoral + espalda baja; caderas atras' },
  { n: 'Patada de gluteo en polea', g: 'Femoral/Gluteo', s:3, r:'12-15', ri:'0-1', re:'1 min', f:'Gluteo mayor; extension completa' },
  { n: 'Sumo deadlift', g: 'Femoral/Gluteo', s:4, r:'6-10', ri:'2-3', re:'2-3 min', f:'Adductores + gluteo; postura ancha' },
  // GEMELO
  { n: 'Gemelo de pie', g: 'Gemelo', s:3, r:'10-15', ri:'0-1', re:'1 min', f:'Gastrocnemio; estiramiento abajo' },
  { n: 'Gemelo en prensa', g: 'Gemelo', s:3, r:'12-20', ri:'0-1', re:'1 min', f:'Gastrocnemio; rodilla extendida' },
  { n: 'Gemelo sentado', g: 'Gemelo', s:3, r:'12-20', ri:'0-1', re:'1 min', f:'Soleo; rodilla flexionada' },
  { n: 'Gemelo de pie en maquina', g: 'Gemelo', s:3, r:'10-15', ri:'0-1', re:'1 min', f:'Gastrocnemio' },
  { n: 'Gemelo con mancuerna', g: 'Gemelo', s:3, r:'12-15', ri:'0-1', re:'1 min', f:'Unilateral; mayor rango' },
  // ABDOMEN
  { n: 'Elevacion de piernas colgado', g: 'Abdomen', s:2, r:'10-15', ri:'1-2', re:'1 min', f:'Recto inferior; sin balanceo' },
  { n: 'Crunch en polea arrodillado', g: 'Abdomen', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Recto superior; flexionar columna' },
  { n: 'Rueda abdominal', g: 'Abdomen', s:2, r:'8-12', ri:'1-2', re:'1 min', f:'Anti-extension; core completo' },
  { n: 'Crunch inverso', g: 'Abdomen', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Porcion inferior' },
  { n: 'Plancha lastrada', g: 'Abdomen', s:2, r:'30-45 s', ri:'-', re:'1 min', f:'Estabilidad de core' },
  { n: 'Rotacion / Pallof press', g: 'Abdomen', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Oblicuos' },
  { n: 'Crunch bicicleta', g: 'Abdomen', s:2, r:'16-20', ri:'0-1', re:'1 min', f:'Recto + oblicuos; rotacion controlada' },
  { n: 'Plancha lateral', g: 'Abdomen', s:2, r:'20-30 s', ri:'-', re:'1 min', f:'Oblicuos; cadera elevada' },
  { n: 'Crunch en polea', g: 'Abdomen', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Recto superior' },
  { n: 'Elevacion de piernas', g: 'Abdomen', s:2, r:'10-15', ri:'1-2', re:'1 min', f:'Recto inferior' },
  { n: 'Crunch lastrado en polea', g: 'Abdomen', s:2, r:'12-15', ri:'0-1', re:'1 min', f:'Recto superior' },
];

module.exports = { T, DT, PD, EXERCISE_LIBRARY, getRoutine };
