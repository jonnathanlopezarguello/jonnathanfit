export const PLAN_DAYS = ['Lunes', 'Martes', 'Jueves', 'Viernes'];
export const DAY_TITLE = {
  'Lunes': 'Cuádriceps · Hombro · Abdomen · Gemelo',
  'Martes': 'Espalda · Bíceps',
  'Jueves': 'Femoral/Glúteo · Hombro · Abdomen · Gemelo',
  'Viernes': 'Pecho · Tríceps · Abdomen'
};
export const TEMPLATES = {
  'Lunes': [
    {n:'Sentadilla libre',g:'Cuádriceps',s:4,reps:'6-10',rir:'2-3',rest:'2-3 min',foco:'Vasto ext/medial; profundidad completa',c:'Nippard'},
    {n:'Prensa 45°',g:'Cuádriceps',s:3,reps:'10-12',rir:'1-2',rest:'2 min',foco:'General; recorrido largo sin bloquear',c:'Nippard'},
    {n:'Hack squat o Búlgara',g:'Cuádriceps',s:3,reps:'8-12',rir:'1-2',rest:'2 min',foco:'Vasto externo; rango profundo',c:'Raúl Ocaña'},
    {n:'Extensión de cuádriceps',g:'Cuádriceps',s:3,reps:'12-15',rir:'0-1',rest:'1.5 min',foco:'Recto femoral; drop set última',c:'Nippard'},
    {n:'Press militar de pie',g:'Hombro',s:3,reps:'6-10',rir:'2-3',rest:'2 min',foco:'Deltoides anterior; sin arquear lumbar',c:'Nippard'},
    {n:'Elevación lateral mancuerna',g:'Hombro',s:3,reps:'12-20',rir:'0-1',rest:'1 min',foco:'Deltoides lateral; codo lidera',c:'Shakil Ahmed'},
    {n:'Elevación lateral en polea',g:'Hombro',s:2,reps:'12-20',rir:'0-1',rest:'1 min',foco:'Lateral; tensión en estiramiento',c:'Raúl Ocaña'},
    {n:'Face pull / posterior polea',g:'Hombro',s:2,reps:'15-20',rir:'0-1',rest:'1 min',foco:'Deltoides posterior',c:'Nippard'},
    {n:'Elevación de piernas colgado',g:'Abdomen',s:2,reps:'10-15',rir:'1-2',rest:'1 min',foco:'Recto inferior; sin balanceo',c:'Athlean-X'},
    {n:'Crunch en polea arrodillado',g:'Abdomen',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Recto superior; flexionar columna',c:'Nippard'},
    {n:'Rueda abdominal',g:'Abdomen',s:2,reps:'8-12',rir:'1-2',rest:'1 min',foco:'Anti-extensión; core completo',c:'Athlean-X'},
    {n:'Crunch inverso',g:'Abdomen',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Porción inferior',c:'Athlean-X'},
    {n:'Gemelo de pie',g:'Gemelo',s:3,reps:'10-15',rir:'0-1',rest:'1 min',foco:'Gastrocnemio; estiramiento abajo',c:'Nippard'},
    {n:'Gemelo en prensa',g:'Gemelo',s:3,reps:'12-20',rir:'0-1',rest:'1 min',foco:'Gastrocnemio; rodilla extendida',c:'Raúl Ocaña'}
  ],
  'Martes': [
    {n:'Dominadas o Jalón al pecho',g:'Espalda',s:4,reps:'8-12',rir:'2-3',rest:'2 min',foco:'Dorsal ancho (anchura)',c:'Nippard'},
    {n:'Remo con barra',g:'Espalda',s:3,reps:'8-12',rir:'1-2',rest:'2 min',foco:'Espesor; apretar escápulas',c:'Raúl Ocaña'},
    {n:'Remo sentado en máquina',g:'Espalda',s:3,reps:'10-12',rir:'1-2',rest:'1.5 min',foco:'Dorsal medio / romboides',c:'Nippard'},
    {n:'Jalón brazo recto / Pullover',g:'Espalda',s:3,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Dorsal en estiramiento',c:'Shakil Ahmed'},
    {n:'Curl con barra',g:'Bíceps',s:3,reps:'8-12',rir:'1-2',rest:'1.5 min',foco:'Cabeza corta y larga',c:'Nippard'},
    {n:'Curl inclinado mancuerna',g:'Bíceps',s:2,reps:'10-12',rir:'1-2',rest:'1 min',foco:'Cabeza larga (estiramiento)',c:'Raúl Ocaña'},
    {n:'Curl martillo',g:'Bíceps',s:2,reps:'10-12',rir:'1-2',rest:'1 min',foco:'Braquial / braquiorradial',c:'Nippard'},
    {n:'Curl predicador o en polea',g:'Bíceps',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Cabeza corta; drop set última',c:'Shakil Ahmed'}
  ],
  'Jueves': [
    {n:'Peso muerto rumano',g:'Femoral y glúteo',s:4,reps:'6-10',rir:'2-3',rest:'2-3 min',foco:'Femoral (estiramiento) y glúteo',c:'Nippard'},
    {n:'Hip thrust',g:'Femoral y glúteo',s:3,reps:'8-12',rir:'1-2',rest:'2 min',foco:'Glúteo mayor; pausa 1s arriba',c:'Raúl Ocaña'},
    {n:'Curl femoral tumbado',g:'Femoral y glúteo',s:3,reps:'10-15',rir:'0-1',rest:'1.5 min',foco:'Femoral (cabezas inferiores)',c:'Nippard'},
    {n:'Curl femoral sentado',g:'Femoral y glúteo',s:3,reps:'10-15',rir:'0-1',rest:'1.5 min',foco:'Femoral (mayor estiramiento)',c:'Nippard'},
    {n:'Press hombro sentado / Arnold',g:'Hombro',s:3,reps:'8-12',rir:'1-2',rest:'2 min',foco:'Deltoides anterior; rango completo',c:'Raúl Ocaña'},
    {n:'Elevación lateral mancuerna',g:'Hombro',s:3,reps:'12-20',rir:'0-1',rest:'1 min',foco:'Deltoides lateral',c:'Shakil Ahmed'},
    {n:'Elevación lateral en polea',g:'Hombro',s:2,reps:'12-20',rir:'0-1',rest:'1 min',foco:'Lateral; tensión constante',c:'Nippard'},
    {n:'Reverse pec deck',g:'Hombro',s:2,reps:'15-20',rir:'0-1',rest:'1 min',foco:'Deltoides posterior',c:'Nippard'},
    {n:'Rueda abdominal',g:'Abdomen',s:2,reps:'8-12',rir:'1-2',rest:'1 min',foco:'Core anti-extensión',c:'Athlean-X'},
    {n:'Crunch lastrado en polea',g:'Abdomen',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Recto superior',c:'Nippard'},
    {n:'Elevación de piernas colgado',g:'Abdomen',s:2,reps:'10-15',rir:'1-2',rest:'1 min',foco:'Porción inferior',c:'Athlean-X'},
    {n:'Rotación / Pallof press',g:'Abdomen',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Oblicuos',c:'Athlean-X'},
    {n:'Gemelo sentado',g:'Gemelo',s:3,reps:'12-20',rir:'0-1',rest:'1 min',foco:'Sóleo; rodilla flexionada',c:'Nippard'},
    {n:'Gemelo de pie en máquina',g:'Gemelo',s:3,reps:'10-15',rir:'0-1',rest:'1 min',foco:'Gastrocnemio',c:'Raúl Ocaña'}
  ],
  'Viernes': [
    {n:'Press inclinado con mancuerna',g:'Pecho',s:4,reps:'6-10',rir:'2-3',rest:'2 min',foco:'Pecho superior; estiramiento amplio',c:'Nippard'},
    {n:'Press plano máquina o barra',g:'Pecho',s:3,reps:'8-12',rir:'1-2',rest:'2 min',foco:'Pecho medio; escápulas retraídas',c:'Raúl Ocaña'},
    {n:'Aperturas / Pec deck',g:'Pecho',s:3,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Estiramiento máximo; drop set',c:'Nippard'},
    {n:'Cruces en polea / Fondos',g:'Pecho',s:3,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Pecho inferior/interno',c:'Shakil Ahmed'},
    {n:'Press francés',g:'Tríceps',s:3,reps:'8-12',rir:'1-2',rest:'1.5 min',foco:'Cabeza larga (estiramiento)',c:'Nippard'},
    {n:'Extensión en polea (cuerda)',g:'Tríceps',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Cabeza lateral',c:'Raúl Ocaña'},
    {n:'Fondos o press cerrado',g:'Tríceps',s:2,reps:'8-12',rir:'1-2',rest:'1.5 min',foco:'Cabeza medial/lateral',c:'Nippard'},
    {n:'Extensión sobre la cabeza',g:'Tríceps',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Cabeza larga (estiramiento)',c:'Shakil Ahmed'},
    {n:'Crunch en polea',g:'Abdomen',s:2,reps:'12-15',rir:'0-1',rest:'1 min',foco:'Recto superior',c:'Nippard'},
    {n:'Rueda abdominal',g:'Abdomen',s:2,reps:'8-12',rir:'1-2',rest:'1 min',foco:'Core completo',c:'Athlean-X'},
    {n:'Elevación de piernas',g:'Abdomen',s:2,reps:'10-15',rir:'1-2',rest:'1 min',foco:'Recto inferior',c:'Athlean-X'},
    {n:'Plancha lastrada',g:'Abdomen',s:2,reps:'30-45 s',rir:'-',rest:'1 min',foco:'Estabilidad de core',c:'Athlean-X'}
  ]
};

export const MUSCLE_GROUPS = ['Cuádriceps','Femoral y glúteo','Pecho','Espalda','Hombro','Bíceps','Tríceps','Abdomen','Gemelo'];
export const VOL_RANGE = {'Cuádriceps':[12,18],'Femoral y glúteo':[12,18],'Hombro':[14,22],'Abdomen':[14,26],'Gemelo':[8,16],'Pecho':[10,18],'Espalda':[10,18],'Bíceps':[8,16],'Tríceps':[8,16]};

// Build muscle map from templates
export const MUSCLE = {};
Object.values(TEMPLATES).flat().forEach(e => { MUSCLE[e.n] = e.g; });
export const EXERCISE_LIB = [...new Set(Object.values(TEMPLATES).flat().map(e => e.n))].sort();
