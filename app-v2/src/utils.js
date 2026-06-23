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

export function diso(off) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d.toISOString().slice(0, 10);
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
  name: 'Jonnathan', sex: 'male', age: 25, weight: 79, height: 176,
  activity: 1.55, goal: 'bulk', ppk: 2, fpk: 1,
  bf: '15', wc: '80', nc: '38', hc: '95',
  yt: '3', sh: '7', sl: 'medio', al: 'moderado'
};
