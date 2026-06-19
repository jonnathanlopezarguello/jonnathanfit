import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { getState, updateState } from '../store';
import { PLAN_DAYS, DAY_TITLE, TEMPLATES } from '../data/templates';

const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

export default function EntrenoScreen() {
  const [state, setState] = useState(getState());
  const [selEx, setSelEx] = useState(0);

  useFocusEffect(useCallback(() => { setState(getState()); }, []));

  const dayName = DAY_ES[new Date().getDay()];
  const planEx = TEMPLATES[dayName];
  const active = state.active;

  async function startSession() {
    if (!planEx) return;
    const exercises = planEx.map(e => ({
      name: e.n, plan: e,
      sets: Array.from({ length: e.s }, () => ({ kg: '', reps: '', done: false }))
    }));
    const s = await updateState(s => {
      s.active = {
        id: Date.now(), name: DAY_TITLE[dayName] || dayName,
        date: new Date().toLocaleDateString('en-CA'),
        start: Date.now(), exercises
      };
    });
    setState({ ...s });
  }

  async function setVal(ei, si, key, val) {
    const s = await updateState(s => { s.active.exercises[ei].sets[si][key] = val; });
    setState({ ...s });
  }

  async function toggleSet(ei, si) {
    const s = await updateState(s => {
      s.active.exercises[ei].sets[si].done = !s.active.exercises[ei].sets[si].done;
    });
    setState({ ...s });
  }

  async function finishWorkout() {
    Alert.alert('Terminar sesión', '¿Guardar este entrenamiento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Guardar', onPress: async () => {
        const s = await updateState(s => {
          const a = s.active;
          a.exercises = a.exercises.filter(e => e.sets.some(ss => ss.done));
          a.dur = Math.round((Date.now() - a.start) / 60000);
          s.workouts.unshift(a);
          s.active = null;
        });
        setState({ ...s });
      }}
    ]);
  }

  if (!active) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>ENTRENO</Text>
        {planEx ? (
          <>
            <Text style={styles.subtitle}>{dayName} — {DAY_TITLE[dayName]}</Text>
            <Text style={styles.hint}>{planEx.length} ejercicios planificados</Text>
            {planEx.map((e, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.exName}>{e.n}</Text>
                <Text style={styles.exDetail}>{e.s}×{e.reps} · RIR {e.rir} · {e.g}</Text>
                <Text style={styles.exFoco}>{e.foco}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.btnPrimary} onPress={startSession}>
              <Text style={styles.btnText}>Iniciar sesión →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.hint}>Día de descanso — entrenas {PLAN_DAYS.join(', ')}</Text>
          </View>
        )}

        {state.workouts.length > 0 && (
          <>
            <Text style={[styles.subtitle, { marginTop: spacing.xl }]}>HISTORIAL</Text>
            {state.workouts.slice(0, 10).map((w, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.exName}>{w.name}</Text>
                <Text style={styles.exDetail}>
                  {new Date(w.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · {w.dur || 0} min · {w.exercises.length} ejercicios
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{active.name}</Text>
        <TouchableOpacity style={styles.btnSmall} onPress={finishWorkout}>
          <Text style={styles.btnSmallText}>Terminar</Text>
        </TouchableOpacity>
      </View>

      {active.exercises.map((ex, ei) => (
        <View key={ei} style={[styles.card, ei === selEx && styles.cardSel]}>
          <TouchableOpacity onPress={() => setSelEx(ei)}>
            <Text style={styles.exName}>{ex.name}</Text>
            {ex.plan && <Text style={styles.exDetail}>{ex.plan.s}×{ex.plan.reps} · RIR {ex.plan.rir} · {ex.plan.foco}</Text>}
          </TouchableOpacity>

          <View style={styles.setHeader}>
            <Text style={styles.setH}>SET</Text>
            <Text style={styles.setH}>KG</Text>
            <Text style={styles.setH}>REPS</Text>
            <Text style={styles.setH}>OK</Text>
          </View>
          {ex.sets.map((set, si) => (
            <View key={si} style={[styles.setRow, set.done && styles.setDone]}>
              <Text style={styles.setNum}>{si + 1}</Text>
              <TextInput
                style={styles.setInput}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.text3}
                value={String(set.kg)}
                onChangeText={v => setVal(ei, si, 'kg', v)}
              />
              <TextInput
                style={styles.setInput}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.text3}
                value={String(set.reps)}
                onChangeText={v => setVal(ei, si, 'reps', v)}
              />
              <TouchableOpacity
                style={[styles.checkBtn, set.done && styles.checkDone]}
                onPress={() => toggleSet(ei, si)}
              >
                <Text style={[styles.checkText, set.done && styles.checkTextDone]}>✓</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  title: { fontSize: 11, letterSpacing: 3, color: colors.text, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.sm },
  subtitle: { fontSize: 14, color: colors.text2, marginBottom: spacing.md },
  hint: { fontSize: 13, color: colors.text3, marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, marginBottom: spacing.sm },
  cardSel: { borderColor: colors.text },
  exName: { fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', color: colors.text, marginBottom: 4 },
  exDetail: { fontSize: 12, color: colors.text2, marginBottom: 2 },
  exFoco: { fontSize: 11, color: colors.text3, fontStyle: 'italic' },
  btnPrimary: { backgroundColor: colors.text, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  btnText: { color: colors.bg, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },
  btnSmall: { borderWidth: 1, borderColor: colors.text, paddingHorizontal: 12, paddingVertical: 6 },
  btnSmallText: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.text },
  setHeader: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderColor: colors.line, marginTop: spacing.sm },
  setH: { flex: 1, fontSize: 9, letterSpacing: 2, color: colors.text3, textAlign: 'center', textTransform: 'uppercase' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 0.5, borderColor: colors.line },
  setDone: { opacity: 0.5 },
  setNum: { width: 30, fontSize: 16, fontWeight: '200', color: colors.text2, textAlign: 'center' },
  setInput: { flex: 1, textAlign: 'center', fontSize: 16, color: colors.text, padding: 8, borderWidth: 1, borderColor: colors.line, marginHorizontal: 4 },
  checkBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  checkDone: { backgroundColor: colors.text, borderColor: colors.text },
  checkText: { fontSize: 16, color: colors.text3 },
  checkTextDone: { color: colors.bg },
});
