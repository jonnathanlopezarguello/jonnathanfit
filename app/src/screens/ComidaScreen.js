import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { spacing } from '../theme';
import { getState, updateState } from '../store';
import { calc } from '../data/calc';

const DAY_SHORT = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
const MONTH_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

const MEAL_OPTIONS = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

function getDateISO(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-CA');
}

function getDateLabel(offset) {
  if (offset === 0) return 'Hoy';
  if (offset === -1) return 'Ayer';
  if (offset === 1) return 'Mañana';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export default function ComidaScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [dayOffset, setDayOffset] = useState(0);
  const [adding, setAdding] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodKcal, setFoodKcal] = useState('');
  const [foodP, setFoodP] = useState('');
  const [foodC, setFoodC] = useState('');
  const [foodF, setFoodF] = useState('');
  const [foodMeal, setFoodMeal] = useState('Almuerzo');

  useEffect(() => { setState(getState()); }, []);

  const dateISO = getDateISO(dayOffset);
  const logged = state.nutrition[dateISO] || [];
  const t = calc(state.profile);
  const totals = logged.reduce(
    (a, it) => ({ kcal: a.kcal + it.kcal, p: a.p + it.p, c: a.c + (it.c || 0), f: a.f + (it.f || 0) }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  const meals = {};
  logged.forEach(it => {
    const key = it.meal || 'Otro';
    if (!meals[key]) meals[key] = [];
    meals[key].push(it);
  });

  const mealKcal = name =>
    (meals[name] || []).reduce((s, it) => s + it.kcal, 0);

  const pct = t.kcal > 0 ? Math.min(100, Math.round((totals.kcal / t.kcal) * 100)) : 0;

  async function addFood() {
    const kcal = parseFloat(foodKcal) || 0;
    const p = parseFloat(foodP) || 0;
    const c = parseFloat(foodC) || 0;
    const f = parseFloat(foodF) || 0;
    if (!foodName.trim() || kcal <= 0) {
      Alert.alert('Datos incompletos', 'Ingresa al menos nombre y calorias.');
      return;
    }
    const entry = { food: foodName.trim(), kcal, p, c, f, meal: foodMeal };
    const s = await updateState(st => {
      if (!st.nutrition[dateISO]) st.nutrition[dateISO] = [];
      st.nutrition[dateISO].push(entry);
    });
    setState({ ...s });
    setAdding(false);
    setFoodName(''); setFoodKcal(''); setFoodP(''); setFoodC(''); setFoodF('');
  }

  async function deleteFood(mealName, idx) {
    const mealItems = meals[mealName];
    const item = mealItems[idx];
    const globalIdx = logged.indexOf(item);
    if (globalIdx < 0) return;
    Alert.alert('Eliminar', `Borrar ${item.food}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: async () => {
        const s = await updateState(st => {
          st.nutrition[dateISO].splice(globalIdx, 1);
        });
        setState({ ...s });
      }},
    ]);
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.supra, { color: theme.text3 }]}>{'REGISTRO DE ALIMENTACIÓN'}</Text>
      <Text style={[styles.title, { color: theme.text }]}>Comida</Text>

      {/* Day selector row */}
      <View style={styles.dayRow}>
        <View style={[styles.dayBox, { borderColor: theme.line }]}>
          <TouchableOpacity onPress={() => setDayOffset(d => d - 1)}>
            <Text style={[styles.dayArrow, { color: theme.text2 }]}>{'‹'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDayOffset(0)}>
            <Text style={[styles.dayLabel, { color: theme.text }]}>{getDateLabel(dayOffset)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDayOffset(d => d + 1)}>
            <Text style={[styles.dayArrow, { color: theme.text2 }]}>{'›'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.loadBtn, { borderColor: theme.line }]} onPress={() => {
          Alert.alert('Cargar plan', 'Esta funcion cargara tus macros planificados (proximamente).');
        }}>
          <Text style={[styles.loadBtnText, { color: theme.text2 }]}>{'CARGAR PLAN ⇧'}</Text>
        </TouchableOpacity>
      </View>

      {/* Total card */}
      <View style={[styles.card, { borderColor: theme.line }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.bigKcal, { color: theme.text }]}>
            {Math.round(totals.kcal).toLocaleString('es-ES')}
          </Text>
          <Text style={[styles.totalTarget, { color: theme.text3 }]}>
            {'DE ' + Math.round(t.kcal).toLocaleString('es-ES') + ' KCAL'}
          </Text>
        </View>
        <View style={[styles.track, { backgroundColor: theme.line2 }]}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: theme.accent }]} />
        </View>
      </View>

      {/* Meal sections */}
      {Object.keys(meals).length === 0 && !adding ? (
        <View style={[styles.card, { borderColor: theme.line }]}>
          <Text style={[styles.hint, { color: theme.text3 }]}>No hay alimentos registrados.</Text>
        </View>
      ) : (
        Object.entries(meals).map(([meal, items]) => (
          <View key={meal}>
            <Text style={[styles.sectionLabel, { color: theme.text3 }]}>
              {meal.toUpperCase() + ' · ' + Math.round(mealKcal(meal)) + ' KCAL'}
            </Text>
            <View style={[styles.card, { borderColor: theme.line }]}>
              {items.map((it, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.foodRow,
                    i < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line },
                  ]}
                  onLongPress={() => deleteFood(meal, i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.foodLeft}>
                    <Text style={[styles.foodName, { color: theme.text }]}>{it.food}</Text>
                    <Text style={[styles.foodMacros, { color: theme.text3 }]}>
                      {'P ' + Math.round(it.p) + ' · C ' + Math.round(it.c) + ' · G ' + Math.round(it.f)}
                    </Text>
                  </View>
                  <Text style={[styles.foodKcal, { color: theme.text }]}>{Math.round(it.kcal)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}

      {/* Add food form */}
      {adding ? (
        <View style={[styles.card, { borderColor: theme.accent }]}>
          {/* Meal selector */}
          <View style={styles.mealRow}>
            {MEAL_OPTIONS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.mealChip, { borderColor: foodMeal === m ? theme.accent : theme.line, backgroundColor: foodMeal === m ? theme.accentSoft : 'transparent' }]}
                onPress={() => setFoodMeal(m)}
              >
                <Text style={{ fontSize: 10, color: foodMeal === m ? theme.text : theme.text3 }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={[styles.input, { borderColor: theme.line, color: theme.text }]} placeholder="Nombre del alimento" placeholderTextColor={theme.text3} value={foodName} onChangeText={setFoodName} />
          <View style={styles.inputRow}>
            <TextInput style={[styles.inputSmall, { borderColor: theme.line, color: theme.text }]} placeholder="Kcal" placeholderTextColor={theme.text3} value={foodKcal} onChangeText={setFoodKcal} keyboardType="numeric" />
            <TextInput style={[styles.inputSmall, { borderColor: theme.line, color: theme.text }]} placeholder="Prot" placeholderTextColor={theme.text3} value={foodP} onChangeText={setFoodP} keyboardType="numeric" />
            <TextInput style={[styles.inputSmall, { borderColor: theme.line, color: theme.text }]} placeholder="Carb" placeholderTextColor={theme.text3} value={foodC} onChangeText={setFoodC} keyboardType="numeric" />
            <TextInput style={[styles.inputSmall, { borderColor: theme.line, color: theme.text }]} placeholder="Grasa" placeholderTextColor={theme.text3} value={foodF} onChangeText={setFoodF} keyboardType="numeric" />
          </View>
          <View style={styles.formBtns}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.line }]} onPress={() => setAdding(false)}>
              <Text style={[styles.addBtnText, { color: theme.text3 }]}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.accent }]} onPress={addFood}>
              <Text style={[styles.addBtnText, { color: theme.bg }]}>GUARDAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={[styles.addBtn, { borderColor: theme.line2 }]} onPress={() => setAdding(true)}>
          <Text style={[styles.addBtnText, { color: theme.text3 }]}>{'+ AÑADIR COMIDA'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 60 },
  supra: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '300', marginBottom: spacing.lg },

  dayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.sm },
  dayBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, gap: 10 },
  dayArrow: { fontSize: 16, fontWeight: '300', paddingHorizontal: 4 },
  dayLabel: { fontSize: 13, fontWeight: '500' },
  loadBtn: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  loadBtnText: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },

  card: { borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: spacing.sm },
  bigKcal: { fontSize: 30, fontWeight: '300', fontVariant: ['tabular-nums'] },
  totalTarget: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  track: { height: 3 },
  fill: { height: 3 },

  sectionLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: spacing.sm, marginBottom: spacing.sm },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  foodLeft: { flex: 1 },
  foodName: { fontSize: 14 },
  foodMacros: { fontSize: 11, marginTop: 2 },
  foodKcal: { fontSize: 16, fontWeight: '300', marginLeft: 12 },
  hint: { fontSize: 13 },

  addBtn: { borderWidth: 1, borderStyle: 'dashed', paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  addBtnText: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },

  mealRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  mealChip: { borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10 },
  input: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  inputSmall: { flex: 1, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 10, fontSize: 13, textAlign: 'center' },
  formBtns: { flexDirection: 'row', gap: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  saveBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
});
