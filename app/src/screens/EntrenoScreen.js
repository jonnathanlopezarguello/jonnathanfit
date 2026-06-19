import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { spacing } from '../theme';
import { getState, updateState } from '../store';
import { PLAN_DAYS, DAY_TITLE, TEMPLATES } from '../data/templates';

const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

export default function EntrenoScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [selEx, setSelEx] = useState(0);

  useEffect(() => { setState(getState()); }, []);

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
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>ENTRENO</Text>
        {planEx ? (
          <>
            <Text style={[styles.subtitle, { color: theme.text2 }]}>{dayName} — {DAY_TITLE[dayName]}</Text>
            <Text style={[styles.hint, { color: theme.text3 }]}>{planEx.length} ejercicios planificados</Text>
            {planEx.map((e, i) => (
              <View key={i} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
                <Text style={[styles.exName, { color: theme.text }]}>{e.n}</Text>
                <Text style={[styles.exDetail, { color: theme.text2 }]}>{e.s}×{e.reps} · RIR {e.rir} · {e.g}</Text>
                <Text style={[styles.exFoco, { color: theme.text3 }]}>{e.foco}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: theme.text }]} onPress={startSession}>
              <Text style={[styles.btnText, { color: theme.bg }]}>Iniciar sesión →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
            <Text style={[styles.hint, { color: theme.text3 }]}>Día de descanso — entrenas {PLAN_DAYS.join(', ')}</Text>
          </View>
        )}

        {state.workouts.length > 0 && (
          <>
            <Text style={[styles.subtitle, { marginTop: spacing.xl, color: theme.text2 }]}>HISTORIAL</Text>
            {state.workouts.slice(0, 10).map((w, i) => (
              <View key={i} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
                <Text style={[styles.exName, { color: theme.text }]}>{w.name}</Text>
                <Text style={[styles.exDetail, { color: theme.text2 }]}>
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
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>{active.name}</Text>
        <TouchableOpacity style={[styles.btnSmall, { borderColor: theme.text }]} onPress={finishWorkout}>
          <Text style={[styles.btnSmallText, { color: theme.text }]}>Terminar</Text>
        </TouchableOpacity>
      </View>

      {active.exercises.map((ex, ei) => (
        <View key={ei} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }, ei === selEx && { borderColor: theme.text }]}>
          <TouchableOpacity onPress={() => setSelEx(ei)}>
            <Text style={[styles.exName, { color: theme.text }]}>{ex.name}</Text>
            {ex.plan && <Text style={[styles.exDetail, { color: theme.text2 }]}>{ex.plan.s}×{ex.plan.reps} · RIR {ex.plan.rir} · {ex.plan.foco}</Text>}
          </TouchableOpacity>

          <View style={[styles.setHeader, { borderColor: theme.line }]}>
            <Text style={[styles.setH, { color: theme.text3 }]}>SET</Text>
            <Text style={[styles.setH, { color: theme.text3 }]}>KG</Text>
            <Text style={[styles.setH, { color: theme.text3 }]}>REPS</Text>
            <Text style={[styles.setH, { color: theme.text3 }]}>OK</Text>
          </View>
          {ex.sets.map((set, si) => (
            <View key={si} style={[styles.setRow, { borderColor: theme.line }, set.done && styles.setDone]}>
              <Text style={[styles.setNum, { color: theme.text2 }]}>{si + 1}</Text>
              <TextInput
                style={[styles.setInput, { color: theme.text, borderColor: theme.line }]}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={theme.text3}
                value={String(set.kg)}
                onChangeText={v => setVal(ei, si, 'kg', v)}
              />
              <TextInput
                style={[styles.setInput, { color: theme.text, borderColor: theme.line }]}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={theme.text3}
                value={String(set.reps)}
                onChangeText={v => setVal(ei, si, 'reps', v)}
              />
              <TouchableOpacity
                style={[styles.checkBtn, { borderColor: theme.line }, set.done && { backgroundColor: theme.text, borderColor: theme.text }]}
                onPress={() => toggleSet(ei, si)}
              >
                <Text style={[styles.checkText, { color: theme.text3 }, set.done && { color: theme.bg }]}>✓</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  title: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.sm },
  subtitle: { fontSize: 14, marginBottom: spacing.md },
  hint: { fontSize: 13, marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  card: { borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  exName: { fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  exDetail: { fontSize: 12, marginBottom: 2 },
  exFoco: { fontSize: 11, fontStyle: 'italic' },
  btnPrimary: { padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  btnText: { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },
  btnSmall: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  btnSmallText: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  setHeader: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, marginTop: spacing.sm },
  setH: { flex: 1, fontSize: 9, letterSpacing: 2, textAlign: 'center', textTransform: 'uppercase' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 0.5 },
  setDone: { opacity: 0.5 },
  setNum: { width: 30, fontSize: 16, fontWeight: '200', textAlign: 'center' },
  setInput: { flex: 1, textAlign: 'center', fontSize: 16, padding: 8, borderWidth: 1, marginHorizontal: 4 },
  checkBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  checkText: { fontSize: 16 },
});
