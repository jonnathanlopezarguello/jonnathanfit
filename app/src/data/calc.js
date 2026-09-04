const GOAL_MULT = { bulk: 1.10, cut: 0.80, recomp: 1.0, maint: 1.0 };

export function calc(profile) {
  const w = +profile.weight, h = +profile.height, a = +profile.age;
  const bmr = Math.round(10 * w + 6.25 * h - 5 * a + (profile.sex === 'male' ? 5 : -161));
  const tdee = Math.round(bmr * +profile.activity);
  const kcal = Math.round(tdee * (GOAL_MULT[profile.goal] || 1) + (+profile.calAdjust || 0));
  const protein = Math.round(w * +profile.proteinPerKg);
  const fat = Math.round(w * +profile.fatPerKg);
  const carbCal = kcal - protein * 4 - fat * 9;
  const carbs = Math.max(0, Math.round(carbCal / 4));
  const fiber = Math.round(kcal / 1000 * 14);
  return { bmr, tdee, kcal, protein, fat, carbs, fiber };
}

export const GOAL_LABEL = { bulk: 'Volumen', cut: 'Definición', recomp: 'Recomposición', maint: 'Mantenimiento' };

export function e1rm(kg, reps) {
  return reps > 0 ? Math.round(kg * (1 + reps / 30)) : 0;
}
