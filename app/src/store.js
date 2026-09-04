import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'jfit.v1';

const defaultState = {
  profile: {
    name: '', sex: 'male', age: 25, weight: 79, height: 176,
    activity: 1.55, goal: 'bulk', days: 4,
    proteinPerKg: 2.0, fatPerKg: 1.0,
    bodyFat: '', waistCm: '', neckCm: '', hipCm: '',
    yearsTraining: '', sleepHours: '7', stressLevel: 'medio',
    injuries: '', activityLevel: 'moderado',
    calAdjust: 0, programStart: '', _set: false
  },
  bodyweight: [],
  waist: [],
  // Each entry: { date, weight, waistCm, neckCm, hipCm, bodyFat }
  measurements: [],
  workouts: [],
  active: null,
  nutrition: {},
  customFoods: [],
  recipes: [],
  suppLog: {},
  cardio: {},
  activity: {}
};

let state = null;

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...defaultState, ...parsed, profile: { ...defaultState.profile, ...(parsed.profile || {}) } };
    } else {
      state = JSON.parse(JSON.stringify(defaultState));
    }
  } catch (e) {
    state = JSON.parse(JSON.stringify(defaultState));
  }
  return state;
}

export function getState() {
  return state || JSON.parse(JSON.stringify(defaultState));
}

export async function saveState(newState) {
  state = newState;
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}

export async function updateState(fn) {
  const s = getState();
  fn(s);
  await saveState(s);
  return s;
}
