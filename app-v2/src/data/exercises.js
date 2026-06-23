const T = {
  Lunes: [
    { n: 'Sentadilla libre', g: 'Cuadriceps', s: 4, r: '6-10', ri: '2-3', re: '2-3 min', f: 'Vasto ext/medial; profundidad completa' },
    { n: 'Prensa 45°', g: 'Cuadriceps', s: 3, r: '10-12', ri: '1-2', re: '2 min', f: 'General; recorrido largo sin bloquear' },
    { n: 'Hack squat o Bulgara', g: 'Cuadriceps', s: 3, r: '8-12', ri: '1-2', re: '2 min', f: 'Vasto externo; rango profundo' },
    { n: 'Extension de cuadriceps', g: 'Cuadriceps', s: 3, r: '12-15', ri: '0-1', re: '1.5 min', f: 'Recto femoral; drop set ultima' },
    { n: 'Press militar de pie', g: 'Hombro', s: 3, r: '6-10', ri: '2-3', re: '2 min', f: 'Deltoides anterior; sin arquear lumbar' },
    { n: 'Elevacion lateral mancuerna', g: 'Hombro', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Deltoides lateral; codo lidera' },
    { n: 'Elevacion lateral en polea', g: 'Hombro', s: 2, r: '12-20', ri: '0-1', re: '1 min', f: 'Lateral; tension en estiramiento' },
    { n: 'Face pull / posterior polea', g: 'Hombro', s: 2, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
    { n: 'Elevacion de piernas colgado', g: 'Abdomen', s: 2, r: '10-15', ri: '1-2', re: '1 min', f: 'Recto inferior; sin balanceo' },
    { n: 'Crunch en polea arrodillado', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Recto superior; flexionar columna' },
    { n: 'Rueda abdominal', g: 'Abdomen', s: 2, r: '8-12', ri: '1-2', re: '1 min', f: 'Anti-extension; core completo' },
    { n: 'Crunch inverso', g: 'Abdomen', s: 2, r: '12-15', ri: '0-1', re: '1 min', f: 'Porcion inferior' },
    { n: 'Gemelo de pie', g: 'Gemelo', s: 3, r: '10-15', ri: '0-1', re: '1 min', f: 'Gastrocnemio; estiramiento abajo' },
    { n: 'Gemelo en prensa', g: 'Gemelo', s: 3, r: '12-20', ri: '0-1', re: '1 min', f: 'Gastrocnemio; rodilla extendida' },
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
    { n: 'Reverse pec deck', g: 'Hombro', s: 2, r: '15-20', ri: '0-1', re: '1 min', f: 'Deltoides posterior' },
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
    { n: 'Fondos o press cerrado', g: 'Triceps', s: 2, r: '8-12', ri: '1-2', re: '1.5 min', f: 'Cabeza medial/lateral' },
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

module.exports = { T, DT, PD };
