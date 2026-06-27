import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  supplements: 'jfit_s',
  nutrition: 'jfit_n',
  session: 'jfit_ss',
  workouts: 'jfit_w',
  profile: 'jfit_p',
  activity: 'jfit_act',
  reminders: 'jfit_rem',
  healthConnect: 'jfit_hc',
};

export async function load(key) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

export async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export { KEYS };
