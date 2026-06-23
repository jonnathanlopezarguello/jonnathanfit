const MPLAN = [
  {
    m: 'Desayuno',
    it: [
      { fd: 'Huevo entero x3', k: 210, p: 18, c: 1, f: 15 },
      { fd: 'Avena', k: 266, p: 9, c: 46, f: 5 },
      { fd: 'Platano', k: 107, p: 1, c: 27, f: 0 },
      { fd: 'Yogur griego', k: 88, p: 15, c: 5, f: 1 },
    ],
  },
  {
    m: 'Almuerzo',
    it: [
      { fd: 'Pechuga de pollo', k: 165, p: 31, c: 0, f: 4 },
      { fd: 'Arroz blanco', k: 260, p: 5, c: 58, f: 1 },
      { fd: 'Lentejas', k: 172, p: 13, c: 30, f: 1 },
      { fd: 'Aceite de oliva', k: 88, p: 0, c: 0, f: 10 },
    ],
  },
  {
    m: 'Snack',
    it: [
      { fd: 'Atun al natural', k: 132, p: 28, c: 0, f: 2 },
      { fd: 'Arroz blanco', k: 195, p: 4, c: 43, f: 0 },
      { fd: 'Manzana', k: 94, p: 0, c: 25, f: 0 },
    ],
  },
  {
    m: 'Cena',
    it: [
      { fd: 'Carne de res magra', k: 215, p: 26, c: 0, f: 12 },
      { fd: 'Quinoa', k: 180, p: 7, c: 32, f: 3 },
      { fd: 'Aguacate', k: 120, p: 1, c: 6, f: 11 },
      { fd: 'Brocoli', k: 52, p: 5, c: 10, f: 1 },
    ],
  },
];

const SUPPS = [
  { k: 'creatina', n: 'Creatina', d: '5g', i: 'Monohidrato - con cualquier comida' },
  { k: 'proteina', n: 'Proteina Whey', d: '1 scoop', i: '24g proteina - post-entreno o entre comidas' },
  { k: 'cafeina', n: 'Cafeina', d: '200mg', i: '30-60 min pre-entreno - no despues de 2pm' },
];

const REFS = [
  {
    c: 'ENTRENAMIENTO Y VOLUMEN',
    r: [
      { n: 1, t: 'Schoenfeld BJ et al. "Dose-response relationship between weekly resistance training volume and increases in muscle mass." J Sports Sci. 2017;35(11):1073-1082.' },
      { n: 2, t: 'Israetel M et al. "Scientific Principles of Hypertrophy Training." Renaissance Periodization. 2021.' },
      { n: 3, t: 'Schoenfeld BJ. "The mechanisms of muscle hypertrophy and their application to resistance training." J Strength Cond Res. 2010;24(10):2857-2872.' },
      { n: 4, t: 'Nippard J. "The Science Applied Program." Evidence-based training methodology. 2023.' },
    ],
  },
  {
    c: 'NUTRICION Y MACROS',
    r: [
      { n: 5, t: 'Morton RW et al. "A systematic review of protein supplementation on resistance training-induced gains." Br J Sports Med. 2018;52(6):376-384.' },
      { n: 6, t: 'Helms ER et al. "Evidence-based recommendations for natural bodybuilding." J Int Soc Sports Nutr. 2014;11:20.' },
      { n: 7, t: 'Mifflin MD, St Jeor ST et al. "A new predictive equation for resting energy expenditure." Am J Clin Nutr. 1990;51(2):241-247.' },
      { n: 8, t: 'ICBF. "Tabla de Composicion de Alimentos Colombianos (TCAC)." 2018.' },
    ],
  },
  {
    c: 'SUPLEMENTACION',
    r: [
      { n: 9, t: 'Kreider RB et al. "ISSN position stand: safety and efficacy of creatine supplementation." J Int Soc Sports Nutr. 2017;14:18.' },
      { n: 10, t: 'Jager R et al. "ISSN Position Stand: protein and exercise." J Int Soc Sports Nutr. 2017;14:20.' },
      { n: 11, t: 'Guest NS et al. "ISSN position stand: caffeine and exercise performance." J Int Soc Sports Nutr. 2021;18:1.' },
    ],
  },
  {
    c: 'COMPOSICION CORPORAL',
    r: [
      { n: 12, t: 'Hodgdon JA, Beckett MB. "Prediction of percent body fat for U.S. Navy personnel." Naval Health Research Center. 1984.' },
      { n: 13, t: 'Jackson AS, Pollock ML. "Generalized equations for predicting body density of men." Br J Nutr. 1978;40(3):497-504.' },
      { n: 14, t: 'ENSIN. "Encuesta Nacional de la Situacion Nutricional en Colombia." 2015.' },
    ],
  },
  {
    c: 'SOBRECARGA PROGRESIVA',
    r: [
      { n: 15, t: 'Zourdos MC et al. "Novel RIR-Based RPE Scale." J Strength Cond Res. 2016;30(1):267-275.' },
      { n: 16, t: 'Helms ER et al. "Application of the RIR-Based RPE Scale for Resistance Training." Strength Cond J. 2016;38(4):42-49.' },
    ],
  },
];

const SCHED = [
  { t: '07:00', l: 'Desayuno + Creatina', ty: 'n' },
  { t: '09:00', l: 'Snack de media manana', ty: 'n' },
  { t: '12:00', l: 'Almuerzo', ty: 'n' },
  { t: '15:00', l: 'Snack de la tarde', ty: 'n' },
  { t: '17:00', l: 'Pre-entreno (Cafeina)', ty: 's' },
  { t: '17:30', l: 'Sesion de entrenamiento', ty: 'e' },
  { t: '19:00', l: 'Cena + Proteina Whey', ty: 'n' },
  { t: '21:00', l: 'Revision diaria', ty: 'r' },
  { t: '22:30', l: 'Preparar para dormir', ty: 'd' },
];

const HMET = [
  { l: 'Pasos diarios', ic: '👟', tg: '8,000-10,000' },
  { l: 'Frecuencia cardiaca', ic: '❤️', tg: '60-85% FCmax' },
  { l: 'Calidad de sueno', ic: '😴', tg: '7-9 horas' },
  { l: 'Calorias quemadas', ic: '🔥', tg: 'TDEE estimado' },
  { l: 'Nivel de estres', ic: '🧘', tg: 'Bajo-Medio' },
  { l: 'Oxigeno en sangre', ic: '🫁', tg: '95-100%' },
];

module.exports = { MPLAN, SUPPS, REFS, SCHED, HMET };
