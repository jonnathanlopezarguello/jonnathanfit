// Exercise technique demonstration data
// Stick-figure pose definitions for animated exercise demos

// Static reference lines
export const GROUND = [[20, 226, 200, 226]];
export const STAND = { S: [105, 82], H: [105, 140], K: [105, 184], A: [105, 222], T: [127, 222], hd: [105, 64] };

// Archetype mapping: exercise name -> archetype key
export const ARCH = {};
[
  ['squat', ['Sentadilla libre', 'Hack squat o Búlgara', 'Sentadilla', 'Zancadas con mancuernas']],
  ['legpress', ['Prensa 45°', 'Prensa de piernas']],
  ['legext', ['Extensión de cuádriceps']],
  ['legcurl', ['Curl femoral tumbado', 'Curl femoral sentado']],
  ['hinge', ['Peso muerto rumano', 'Peso muerto convencional']],
  ['hipthrust', ['Hip thrust']],
  ['calf', ['Gemelo de pie', 'Gemelo de pie en máquina', 'Gemelo sentado', 'Gemelo en prensa', 'Elevación de gemelos']],
  ['vpress', ['Press militar de pie', 'Press hombro sentado / Arnold', 'Press militar', 'Press militar con mancuernas']],
  ['latraise', ['Elevación lateral mancuerna', 'Elevación lateral en polea', 'Elevaciones laterales']],
  ['row', ['Remo con barra', 'Remo sentado en máquina', 'Remo en polea baja', 'Face pull / posterior polea', 'Reverse pec deck']],
  ['hpress', ['Press inclinado con mancuerna', 'Press plano máquina o barra', 'Press de banca', 'Press inclinado con mancuernas', 'Fondos o press cerrado']],
  ['fly', ['Aperturas / Pec deck', 'Cruces en polea / Fondos']],
  ['vpull', ['Dominadas o Jalón al pecho', 'Jalón al pecho', 'Dominadas', 'Jalón brazo recto / Pullover']],
  ['curl', ['Curl con barra', 'Curl inclinado mancuerna', 'Curl martillo', 'Curl predicador o en polea', 'Curl de bíceps con barra']],
  ['triext', ['Press francés', 'Extensión en polea (cuerda)', 'Extensión sobre la cabeza', 'Extensión de tríceps en polea', 'Rotación / Pallof press']],
  ['crunch', ['Crunch en polea arrodillado', 'Crunch inverso', 'Crunch lastrado en polea', 'Crunch en polea', 'Crunch']],
  ['legraise', ['Elevación de piernas colgado', 'Elevación de piernas']],
  ['abwheel', ['Rueda abdominal']],
  ['plank', ['Plancha lastrada', 'Plancha abdominal']]
].forEach(([k, list]) => list.forEach(n => { ARCH[n] = k; }));

// Poses: a = start position, b = end position
// Joints: S=shoulder, H=hip, K=knee, A=ankle, T=toe, E=elbow, W=wrist, hd=head
export const POSES = {
  squat: {
    props: GROUND, eq: 'barS',
    a: { ...STAND, E: [97, 106], W: [93, 96] },
    b: { S: [88, 122], H: [118, 176], K: [97, 192], A: [105, 222], T: [127, 222], E: [82, 142], W: [78, 130], hd: [80, 103] }
  },
  hinge: {
    props: GROUND, eq: 'barW',
    a: { ...STAND, E: [105, 112], W: [107, 144] },
    b: { S: [72, 118], H: [122, 152], K: [110, 190], A: [105, 222], T: [127, 222], E: [74, 144], W: [76, 168], hd: [57, 108] }
  },
  legpress: {
    props: [[62, 200, 92, 142], [150, 142, 180, 100]], eq: null,
    a: { S: [80, 142], H: [100, 178], K: [132, 144], A: [158, 116], T: [167, 105], E: [92, 162], W: [100, 178], hd: [68, 128] },
    b: { S: [80, 142], H: [100, 178], K: [117, 151], A: [133, 131], T: [142, 121], E: [92, 162], W: [100, 178], hd: [68, 128] }
  },
  legext: {
    props: [[75, 164, 130, 164], [85, 164, 85, 212]], eq: null,
    a: { S: [100, 100], H: [100, 160], K: [133, 160], A: [136, 196], T: [143, 194], E: [100, 126], W: [98, 148], hd: [100, 82] },
    b: { S: [100, 100], H: [100, 160], K: [133, 160], A: [170, 158], T: [178, 152], E: [100, 126], W: [98, 148], hd: [100, 82] }
  },
  legcurl: {
    props: [[40, 172, 170, 172], [60, 172, 60, 212], [150, 172, 150, 212]], eq: null,
    a: { S: [62, 166], H: [118, 166], K: [148, 168], A: [183, 172], T: [190, 168], E: [64, 186], W: [58, 200], hd: [46, 162] },
    b: { S: [62, 166], H: [118, 166], K: [148, 168], A: [152, 132], T: [148, 120], E: [64, 186], W: [58, 200], hd: [46, 162] }
  },
  hipthrust: {
    props: [...GROUND, [40, 152, 80, 152], [44, 152, 44, 202], [76, 152, 76, 202]], eq: 'barH',
    a: { S: [70, 150], H: [114, 194], K: [146, 170], A: [150, 222], T: [168, 222], E: [84, 172], W: [98, 190], hd: [55, 146] },
    b: { S: [70, 150], H: [124, 156], K: [150, 170], A: [150, 222], T: [168, 222], E: [88, 160], W: [104, 158], hd: [55, 146] }
  },
  calf: {
    props: GROUND, eq: 'dbW',
    a: { ...STAND, E: [105, 110], W: [107, 134] },
    b: { S: [105, 68], H: [105, 126], K: [105, 170], A: [103, 206], T: [127, 222], E: [105, 96], W: [107, 120], hd: [105, 50] }
  },
  vpress: {
    props: GROUND, eq: 'barW',
    a: { ...STAND, E: [121, 96], W: [117, 78] },
    b: { ...STAND, E: [109, 56], W: [107, 30] }
  },
  latraise: {
    props: GROUND, eq: 'dbW',
    a: { ...STAND, E: [107, 110], W: [109, 134] },
    b: { ...STAND, E: [131, 82], W: [157, 84] }
  },
  row: {
    props: GROUND, eq: 'barW',
    a: { S: [75, 120], H: [120, 152], K: [110, 190], A: [105, 222], T: [127, 222], E: [80, 142], W: [84, 164], hd: [60, 112] },
    b: { S: [75, 120], H: [120, 152], K: [110, 190], A: [105, 222], T: [127, 222], E: [94, 132], W: [100, 148], hd: [60, 112] }
  },
  hpress: {
    props: [[40, 172, 150, 172], [55, 172, 55, 212], [135, 172, 135, 212]], eq: 'barW',
    a: { S: [64, 168], H: [120, 168], K: [146, 196], A: [160, 222], T: [176, 222], E: [82, 152], W: [68, 140], hd: [46, 158] },
    b: { S: [64, 168], H: [120, 168], K: [146, 196], A: [160, 222], T: [176, 222], E: [64, 128], W: [62, 104], hd: [46, 158] }
  },
  fly: {
    props: [[40, 172, 150, 172], [55, 172, 55, 212], [135, 172, 135, 212]], eq: 'dbW',
    a: { S: [64, 168], H: [120, 168], K: [146, 196], A: [160, 222], T: [176, 222], E: [96, 148], W: [114, 132], hd: [46, 158] },
    b: { S: [64, 168], H: [120, 168], K: [146, 196], A: [160, 222], T: [176, 222], E: [68, 128], W: [66, 108], hd: [46, 158] }
  },
  vpull: {
    props: [[80, 162, 130, 162]], eq: 'barW',
    a: { S: [103, 98], H: [100, 160], K: [134, 160], A: [136, 198], T: [148, 196], E: [118, 68], W: [124, 40], hd: [103, 80] },
    b: { S: [103, 98], H: [100, 160], K: [134, 160], A: [136, 198], T: [148, 196], E: [122, 108], W: [110, 100], hd: [103, 80] }
  },
  curl: {
    props: GROUND, eq: 'dbW',
    a: { ...STAND, E: [106, 110], W: [108, 134] },
    b: { ...STAND, E: [106, 110], W: [124, 98] }
  },
  triext: {
    props: GROUND, eq: 'dbW',
    a: { ...STAND, E: [108, 108], W: [118, 86] },
    b: { ...STAND, E: [108, 108], W: [112, 134] }
  },
  crunch: {
    props: GROUND, eq: null,
    a: { S: [60, 206], H: [112, 212], K: [140, 182], A: [158, 212], T: [170, 208], E: [68, 198], W: [78, 192], hd: [44, 200] },
    b: { S: [74, 182], H: [112, 212], K: [140, 182], A: [158, 212], T: [170, 208], E: [80, 176], W: [90, 172], hd: [62, 170] }
  },
  legraise: {
    props: [[70, 28, 140, 28]], eq: null,
    a: { S: [105, 88], H: [105, 150], K: [105, 186], A: [107, 220], T: [117, 216], E: [105, 58], W: [105, 30], hd: [116, 84] },
    b: { S: [105, 88], H: [105, 150], K: [133, 148], A: [162, 154], T: [172, 146], E: [105, 58], W: [105, 30], hd: [116, 84] }
  },
  abwheel: {
    props: GROUND, eq: 'wheelW',
    a: { K: [85, 212], A: [60, 222], T: [50, 216], H: [92, 182], S: [118, 152], hd: [130, 142], E: [132, 172], W: [142, 196] },
    b: { K: [85, 212], A: [60, 222], T: [50, 216], H: [108, 176], S: [140, 160], hd: [152, 152], E: [158, 176], W: [170, 196] }
  },
  plank: {
    props: GROUND, eq: null,
    a: { E: [82, 222], W: [108, 222], S: [88, 196], hd: [72, 186], K: [160, 212], A: [186, 222], T: [196, 222], H: [134, 202] },
    b: { E: [82, 222], W: [108, 222], S: [88, 196], hd: [72, 186], K: [160, 212], A: [186, 222], T: [196, 222], H: [134, 206] }
  }
};
