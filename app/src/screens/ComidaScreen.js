import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
let SvgLib = null;
try { SvgLib = require('react-native-svg'); } catch (e) {}
import { spacing } from '../theme';
import { getState, updateState } from '../store';
import { calc } from '../data/calc';
import { PLAN_DAYS } from '../data/templates';

const DAY_SHORT = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
const MONTH_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

const MEAL_OPTIONS = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

const MEALPLANS = {
  entreno: {
    label: 'Entrenamiento',
    meals: [
      { name: 'Desayuno', items: [
        { food: 'Huevo entero', kcal: 210, p: 18, c: 1, f: 15 },
        { food: 'Avena', kcal: 266, p: 9, c: 46, f: 5 },
        { food: 'Platano', kcal: 107, p: 1, c: 27, f: 0 },
        { food: 'Yogur griego', kcal: 88, p: 15, c: 5, f: 1 },
      ]},
      { name: 'Almuerzo', items: [
        { food: 'Pechuga de pollo', kcal: 165, p: 31, c: 0, f: 4 },
        { food: 'Arroz blanco', kcal: 260, p: 5, c: 58, f: 1 },
        { food: 'Lentejas', kcal: 172, p: 13, c: 30, f: 1 },
        { food: 'Aceite de oliva', kcal: 88, p: 0, c: 0, f: 10 },
      ]},
      { name: 'Snack', items: [
        { food: 'Atun al natural', kcal: 132, p: 28, c: 0, f: 2 },
        { food: 'Arroz blanco', kcal: 195, p: 4, c: 43, f: 0 },
        { food: 'Manzana', kcal: 94, p: 0, c: 25, f: 0 },
      ]},
      { name: 'Cena', items: [
        { food: 'Carne de res magra', kcal: 215, p: 26, c: 0, f: 12 },
        { food: 'Quinoa', kcal: 180, p: 7, c: 32, f: 3 },
        { food: 'Aguacate', kcal: 120, p: 1, c: 6, f: 11 },
        { food: 'Brocoli', kcal: 52, p: 5, c: 10, f: 1 },
      ]},
    ]
  },
  descanso: {
    label: 'Descanso',
    meals: [
      { name: 'Desayuno', items: [
        { food: 'Huevo entero', kcal: 210, p: 18, c: 1, f: 15 },
        { food: 'Avena', kcal: 190, p: 7, c: 33, f: 4 },
        { food: 'Manzana', kcal: 94, p: 0, c: 25, f: 0 },
        { food: 'Yogur griego', kcal: 88, p: 15, c: 5, f: 1 },
      ]},
      { name: 'Almuerzo', items: [
        { food: 'Pechuga de pollo', kcal: 165, p: 31, c: 0, f: 4 },
        { food: 'Arroz blanco', kcal: 195, p: 4, c: 43, f: 0 },
        { food: 'Frijoles negros', kcal: 198, p: 13, c: 36, f: 1 },
        { food: 'Aceite de oliva', kcal: 88, p: 0, c: 0, f: 10 },
      ]},
      { name: 'Snack', items: [
        { food: 'Yogur griego', kcal: 117, p: 20, c: 7, f: 1 },
        { food: 'Nueces', kcal: 196, p: 5, c: 4, f: 20 },
        { food: 'Manzana', kcal: 94, p: 0, c: 25, f: 0 },
      ]},
      { name: 'Cena', items: [
        { food: 'Carne de res magra', kcal: 258, p: 31, c: 0, f: 14 },
        { food: 'Quinoa', kcal: 180, p: 7, c: 32, f: 3 },
        { food: 'Aguacate', kcal: 120, p: 1, c: 6, f: 11 },
        { food: 'Brocoli', kcal: 52, p: 5, c: 10, f: 1 },
      ]},
    ]
  }
};

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

function MacroDonut({ totals, target, theme }) {
  if (!SvgLib) return null;
  const { Svg, Circle: SvgCircle, Path } = SvgLib;
  const cx = 50, cy = 50, r = 38;
  const total = totals.p * 4 + totals.c * 4 + totals.f * 9;
  if (total <= 0) {
    return (
      <Svg width={100} height={100} viewBox="0 0 100 100">
        <SvgCircle cx={cx} cy={cy} r={r + 4} fill="none" stroke={theme.line} strokeWidth={1.5} />
        <SvgCircle cx={cx} cy={cy} r={r} fill={theme.surface2} />
      </Svg>
    );
  }
  const segments = [
    { cal: totals.p * 4, color: theme.accent },
    { cal: totals.c * 4, color: theme.text2 },
    { cal: totals.f * 9, color: theme.text3 },
  ];
  let angle = -Math.PI / 2;
  const paths = segments.map((seg, i) => {
    const frac = seg.cal / total;
    if (frac <= 0) return null;
    const sweep = frac * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return (
      <Path
        key={i}
        d={`M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`}
        fill={seg.color}
        stroke={theme.bg}
        strokeWidth={1.5}
      />
    );
  });
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <SvgCircle cx={cx} cy={cy} r={r + 4} fill="none" stroke={theme.line} strokeWidth={1.5} />
      {paths}
      <SvgCircle cx={cx} cy={cy} r={14} fill={theme.bg} />
    </Svg>
  );
}

function FoodPlate({ items, theme }) {
  if (!SvgLib) return null;
  const { Svg, Circle: SvgCircle, Path, Text: SvgText, Line, Ellipse, Rect, G } = SvgLib;
  const totalP = items.reduce((s, it) => s + (it.p || 0), 0);
  const totalC = items.reduce((s, it) => s + (it.c || 0), 0);
  const pLvl = totalP > 80 ? 3 : totalP > 40 ? 2 : totalP > 0 ? 1 : 0;
  const cLvl = totalC > 150 ? 3 : totalC > 80 ? 2 : totalC > 0 ? 1 : 0;
  const vLvl = items.length > 8 ? 3 : items.length > 4 ? 2 : items.length > 0 ? 1 : 0;

  return (
    <Svg width="100%" viewBox="0 0 360 200" style={{ marginBottom: 12 }}>
      <Ellipse cx={124} cy={105} rx={86} ry={82} fill="rgba(0,0,0,0.09)" />
      <SvgCircle cx={120} cy={100} r={87} fill="#C8C9C3" />
      <SvgCircle cx={120} cy={100} r={86} fill="none" stroke="#2B68AD" strokeWidth={4} />
      <SvgCircle cx={120} cy={100} r={81} fill="none" stroke="#4A8DD4" strokeWidth={0.9} strokeDasharray="3 5" />
      <SvgCircle cx={120} cy={100} r={74} fill="#F7F8F5" />
      <Ellipse cx={97} cy={74} rx={16} ry={10} fill="#fff" opacity={0.35} />
      <Line x1={46} y1={100} x2={194} y2={100} stroke="#3FA85A" strokeWidth={1.8} strokeDasharray="5 4.5" opacity={0.65} />
      <Line x1={120} y1={100} x2={120} y2={186} stroke="#3FA85A" strokeWidth={1.8} strokeDasharray="5 4.5" opacity={0.65} />
      <SvgText x={120} y={63} textAnchor="middle" fontSize={8} fill="#8FA08A" fontWeight="500">VERDURAS</SvgText>
      <SvgText x={82} y={162} textAnchor="middle" fontSize={8} fill="#9AA0A6" fontWeight="500">PROTEINA</SvgText>
      <SvgText x={158} y={162} textAnchor="middle" fontSize={8} fill="#9AA0A6" fontWeight="500">CEREAL</SvgText>
      {vLvl >= 1 && <SvgText x={120} y={84} textAnchor="middle" fontSize={26}>{'🥦'}</SvgText>}
      {vLvl >= 2 && <SvgText x={100} y={92} textAnchor="middle" fontSize={22}>{'🥕'}</SvgText>}
      {vLvl >= 3 && <SvgText x={140} y={92} textAnchor="middle" fontSize={20}>{'🥗'}</SvgText>}
      {pLvl >= 1 && <SvgText x={82} y={150} textAnchor="middle" fontSize={28}>{'🍗'}</SvgText>}
      {pLvl >= 2 && <SvgText x={77} y={132} textAnchor="middle" fontSize={20}>{'🥚'}</SvgText>}
      {pLvl >= 3 && <SvgText x={96} y={160} textAnchor="middle" fontSize={18}>{'🥩'}</SvgText>}
      {cLvl >= 1 && <SvgText x={158} y={150} textAnchor="middle" fontSize={26}>{'🍚'}</SvgText>}
      {cLvl >= 2 && <SvgText x={150} y={132} textAnchor="middle" fontSize={22}>{'🥔'}</SvgText>}
      {cLvl >= 3 && <SvgText x={164} y={155} textAnchor="middle" fontSize={18}>{'🍞'}</SvgText>}
      <G transform="translate(24,36)">
        <Rect x={-2.5} y={28} width={5} height={72} rx={2.5} fill="#B4B5AF" stroke="#989994" strokeWidth={0.7} />
        <Line x1={-5} y1={2} x2={-5} y2={24} stroke="#989994" strokeWidth={1.5} />
        <Line x1={0} y1={1} x2={0} y2={26} stroke="#989994" strokeWidth={1.5} />
        <Line x1={5} y1={2} x2={5} y2={24} stroke="#989994" strokeWidth={1.5} />
      </G>
      <G transform="translate(213,36)">
        <Rect x={-2.5} y={32} width={5} height={68} rx={2.5} fill="#B4B5AF" stroke="#989994" strokeWidth={0.7} />
        <Path d="M2.5 1 Q12.5 7 12.5 32 Q12.5 38 -2.5 38 L-2.5 32 Z" fill="#C8C9C3" stroke="#A0A19C" strokeWidth={0.7} />
      </G>
    </Svg>
  );
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

  function loadMealPlan() {
    const realDay = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    const dayName = realDay[d.getDay()];
    const isTraining = PLAN_DAYS.includes(dayName);
    const plan = isTraining ? MEALPLANS.entreno : MEALPLANS.descanso;

    const existing = state.nutrition[dateISO] || [];
    const doLoad = () => {
      updateState(st => {
        if (!st.nutrition[dateISO]) st.nutrition[dateISO] = [];
        plan.meals.forEach(meal => {
          meal.items.forEach(item => {
            st.nutrition[dateISO].push({
              food: item.food, kcal: item.kcal, p: item.p, c: item.c, f: item.f, meal: meal.name
            });
          });
        });
      }).then(s => setState({ ...s }));
    };

    if (existing.length > 0) {
      Alert.alert('Cargar plan', 'Ya hay alimentos registrados. Agregar el plan igual?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Agregar', onPress: doLoad },
      ]);
    } else {
      doLoad();
    }
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
        <TouchableOpacity style={[styles.loadBtn, { borderColor: theme.line }]} onPress={loadMealPlan}>
          <Text style={[styles.loadBtnText, { color: theme.text2 }]}>{'CARGAR PLAN'}</Text>
        </TouchableOpacity>
      </View>

      {/* Total card with donut */}
      <View style={[styles.card, { borderColor: theme.line }]}>
        <View style={styles.totalRow}>
          <MacroDonut totals={totals} target={t} theme={theme} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.bigKcal, { color: theme.text }]}>
              {Math.round(totals.kcal).toLocaleString('es-ES')}
            </Text>
            <Text style={[styles.totalTarget, { color: theme.text3 }]}>
              {'DE ' + Math.round(t.kcal).toLocaleString('es-ES') + ' KCAL'}
            </Text>
            <View style={[styles.track, { backgroundColor: theme.line2, marginTop: 8 }]}>
              <View style={[styles.fill, { width: `${pct}%`, backgroundColor: theme.accent }]} />
            </View>
            <View style={styles.macroRow}>
              <Text style={[styles.macroText, { color: theme.accent }]}>P {Math.round(totals.p)}</Text>
              <Text style={[styles.macroText, { color: theme.text2 }]}>C {Math.round(totals.c)}</Text>
              <Text style={[styles.macroText, { color: theme.text3 }]}>G {Math.round(totals.f)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Food plate visualization */}
      {logged.length > 0 && <FoodPlate items={logged} theme={theme} />}

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
  totalRow: { flexDirection: 'row', alignItems: 'center' },
  bigKcal: { fontSize: 30, fontWeight: '300', fontVariant: ['tabular-nums'] },
  totalTarget: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  track: { height: 3 },
  fill: { height: 3 },
  macroRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  macroText: { fontSize: 11, fontWeight: '500', letterSpacing: 1 },

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
