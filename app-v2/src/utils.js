export function p2(n) { return n < 10 ? '0' + n : '' + n; }

export function calc(prof) {
  const w = +prof.weight, h = +prof.height, a = +prof.age;
  const bmr = Math.round(10 * w + 6.25 * h - 5 * a + (prof.sex === 'male' ? 5 : -161));
  const tdee = Math.round(bmr * prof.activity);
  const m = { bulk: 1.1, cut: 0.8, recomp: 1, maint: 1 };
  const kcal = Math.round(tdee * (m[prof.goal] || 1));
  const protein = Math.round(w * prof.ppk);
  const fat = Math.round(w * prof.fpk);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const fiber = Math.round(kcal / 1000 * 14);
  return { bmr, tdee, kcal, protein, fat, carbs, fiber };
}

export const GL = { bulk: 'Volumen', cut: 'Definicion', recomp: 'Recomposicion', maint: 'Mantenimiento' };

// Fecha local (no UTC) en formato YYYY-MM-DD. toISOString() convierte a UTC
// primero, lo que adelanta la fecha varias horas antes de medianoche real
// para cualquier usuario al oeste de Greenwich (ej. Colombia, UTC-5).
export function dkey(d) {
  return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
}

export function diso(off) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return dkey(d);
}

export function dlbl(off) {
  if (off === 0) return 'Hoy';
  if (off === -1) return 'Ayer';
  if (off === 1) return 'Manana';
  const d = new Date();
  d.setDate(d.getDate() + off);
  const ds = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const ms = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return ds[d.getDay()] + ' ' + d.getDate() + ' ' + ms[d.getMonth()];
}

export function greet() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos dias' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

export function fe(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return p2(h) + ':' + p2(m) + ':' + p2(s % 60);
}

export function getDayName() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return days[new Date().getDay()];
}

export const DEFAULT_PROFILE = {
  name: 'Usuario', sex: 'male', age: 25, weight: 75, height: 175,
  activity: 1.375, goal: 'maint', ppk: 1.6, fpk: 0.8,
  bf: '', wc: '', nc: '', hc: '',
  yt: '', sh: '7', sl: 'medio', al: 'moderado',
  units: 'kg',
  diet: 'omni',
  level: 'principiante', trainGoal: 'hipertrofia', daysPerWeek: 4, equipment: 'gym',
};

// Ejercicios cuyo nombre no deja claro el equipo con las palabras clave de
// abajo (ej. "Sentadilla libre" no dice "barra") — se listan explícitos para
// que ninguno caiga en el cajón genérico "Libre" y se cuele en un filtro de
// equipo que en realidad no tiene.
const CATEGORY_OVERRIDES = {
  'Press banca declinado': 'Barra',
  'Press frances': 'Barra',
  'Press cerrado banca': 'Barra',
  'Fondos o press cerrado': 'Barra',
  'Sentadilla libre': 'Barra',
  'Buenos dias': 'Barra',
  'Sumo deadlift': 'Barra',
  'Remo en T': 'Máquina',
  'Curl femoral tumbado': 'Máquina',
  'Curl femoral sentado': 'Máquina',
  'Gemelo sentado': 'Máquina',
  'Gemelo de pie en maquina': 'Máquina',
  'Curl concentrado': 'Mancuerna',
  'Extension sobre la cabeza': 'Mancuerna',
  'Press hombro sentado / Arnold': 'Mancuerna',
  'Rotacion / Pallof press': 'Polea',
  'Gemelo de pie': 'Peso corporal',
};

/* ── Clasificación de equipo por ejercicio (reusa el nombre) ── */
export function getCategory(name) {
  if (CATEGORY_OVERRIDES[name]) return CATEGORY_OVERRIDES[name];
  const n = name.toLowerCase();
  if (/polea|cable|face pull|jalon brazo|jalon agarre|curl en polea|elevacion lateral en polea|jalon al pecho/.test(n)) return 'Polea';
  if (/prensa|hack|predicador|extension de|remo sentado en maquina|pec deck/.test(n)) return 'Máquina';
  if (/barra|press militar|peso muerto|remo con barra|curl con barra/.test(n)) return 'Barra';
  if (/mancuerna|curl inclinado|elevacion lateral man|curl martillo/.test(n)) return 'Mancuerna';
  if (/dominadas|fondos|crunch|rueda|elevacion de piernas|plancha|hip thrust|bulgara/.test(n)) return 'Peso corporal';
  return 'Libre';
}

// Qué categorías de ejercicio caben en cada nivel de equipo disponible
export const EQUIPMENT_ALLOWED = {
  gym: ['Polea', 'Máquina', 'Barra', 'Mancuerna', 'Peso corporal', 'Libre'],
  casa: ['Mancuerna', 'Peso corporal', 'Libre'],
  peso_corporal: ['Peso corporal'],
};

export function exerciseFitsEquipment(exerciseName, equipment) {
  const allowed = EQUIPMENT_ALLOWED[equipment] || EQUIPMENT_ALLOWED.gym;
  return allowed.includes(getCategory(exerciseName));
}

export function toDisplay(kg, units) {
  if (!kg && kg !== 0) return '';
  const v = parseFloat(kg);
  if (isNaN(v)) return kg;
  return units === 'lbs' ? Math.round(v * 2.2046 * 10) / 10 + '' : kg + '';
}

export function toKg(val, units) {
  const v = parseFloat(val);
  if (isNaN(v)) return '';
  return units === 'lbs' ? Math.round(v / 2.2046 * 10) / 10 + '' : val;
}
