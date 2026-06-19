import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { getState } from '../store';
import { calc } from '../data/calc';
import { MUSCLE_GROUPS, VOL_RANGE, MUSCLE, TEMPLATES } from '../data/templates';

export default function ProgresoScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [selMuscle, setSelMuscle] = useState(null);
  useEffect(() => { setState(getState()); }, []);

  const now = Date.now(), cut = now - 7 * 864e5;
  const weekWorkouts = state.workouts.filter(w => new Date(w.date).getTime() >= cut);

  function weeklyVol() {
    const vol = {};
    MUSCLE_GROUPS.forEach(g => vol[g] = 0);
    weekWorkouts.forEach(w => w.exercises.forEach(e => {
      const g = MUSCLE[e.name];
      if (g && vol[g] !== undefined) vol[g] += e.sets.filter(s => s.done).length;
    }));
    return vol;
  }

  const vol = weeklyVol();
  const stats = MUSCLE_GROUPS.map(g => {
    const v = vol[g], min = (VOL_RANGE[g] || [10, 20])[0];
    const pct = min > 0 ? v / min : 0;
    return { g, sets: v, min, pct, color: pct >= 1 ? theme.good : pct >= 0.5 ? theme.over : theme.danger };
  });

  const bw = state.bodyweight.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const lastW = bw[bw.length - 1];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>PROGRESO</Text>

      <Text style={[styles.section, { color: theme.text3 }]}>MAPA MUSCULAR SEMANAL</Text>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        {stats.map(s => (
          <TouchableOpacity key={s.g} style={[styles.muscleRow, { borderColor: theme.line }]} onPress={() => setSelMuscle(selMuscle === s.g ? null : s.g)}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={[styles.muscleName, { color: theme.text }]}>{s.g}</Text>
            <View style={[styles.muscleBar, { backgroundColor: theme.line }]}>
              <View style={[styles.muscleBarFill, { width: `${Math.min(100, Math.round(s.pct * 100))}%`, backgroundColor: s.color }]} />
            </View>
            <Text style={[styles.muscleCount, { color: s.color }]}>{s.sets}/{s.min}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.good }]} /><Text style={[styles.legendText, { color: theme.text3 }]}>Cumplido</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.over }]} /><Text style={[styles.legendText, { color: theme.text3 }]}>Casi</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.danger }]} /><Text style={[styles.legendText, { color: theme.text3 }]}>Falta</Text></View>
        </View>
      </View>

      {selMuscle && (() => {
        const s = stats.find(x => x.g === selMuscle);
        const allEx = Object.values(TEMPLATES).flat().filter(e => e.g === selMuscle);
        const doneNames = new Set();
        weekWorkouts.forEach(w => w.exercises.forEach(e => {
          if (MUSCLE[e.name] === selMuscle && e.sets.some(ss => ss.done)) doneNames.add(e.name);
        }));
        return (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
            <Text style={[styles.detailTitle, { color: theme.text }]}>{selMuscle.toUpperCase()}</Text>
            <Text style={[styles.detailCount, { color: s.color }]}>{s.sets} / {s.min} series</Text>
            {allEx.map((e, i) => (
              <View key={i} style={[styles.exRow, { borderColor: theme.line }]}>
                <Text style={[styles.exName, { color: theme.text }]}>{e.n}</Text>
                <Text style={doneNames.has(e.n) ? [styles.exStatus, { color: theme.good }] : [styles.exStatus, { color: theme.text3 }]}>
                  {doneNames.has(e.n) ? '✓ hecho' : 'pendiente'}
                </Text>
              </View>
            ))}
          </View>
        );
      })()}

      <Text style={[styles.section, { color: theme.text3 }]}>PESO CORPORAL</Text>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text style={[styles.bigNum, { color: theme.text }]}>{lastW ? lastW.kg : '—'}<Text style={[styles.unit, { color: theme.text3 }]}> kg</Text></Text>
        <Text style={[styles.hint, { color: theme.text2 }]}>{bw.length > 1 ? `${(bw[bw.length-1].kg - bw[0].kg) > 0 ? '+' : ''}${(bw[bw.length-1].kg - bw[0].kg).toFixed(1)} kg desde el inicio` : 'Registra tu peso para ver la tendencia'}</Text>
      </View>

      <Text style={[styles.section, { color: theme.text3 }]}>HISTORIAL</Text>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.text }]}>{state.workouts.length}</Text>
            <Text style={[styles.statLabel, { color: theme.text3 }]}>Entrenamientos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.text }]}>{state.workouts.reduce((a, w) => a + w.exercises.reduce((x, e) => x + e.sets.filter(s => s.done).length, 0), 0)}</Text>
            <Text style={[styles.statLabel, { color: theme.text3 }]}>Series totales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.text }]}>{weekWorkouts.length}</Text>
            <Text style={[styles.statLabel, { color: theme.text3 }]}>Esta semana</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  title: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.md },
  section: { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  muscleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  muscleName: { fontSize: 13, width: 120 },
  muscleBar: { flex: 1, height: 4, marginHorizontal: 8 },
  muscleBarFill: { height: 4 },
  muscleCount: { fontSize: 12, fontWeight: '500', width: 40, textAlign: 'right' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendText: { fontSize: 10, letterSpacing: 1 },
  detailTitle: { fontSize: 13, fontWeight: '500', letterSpacing: 2, marginBottom: 4 },
  detailCount: { fontSize: 22, fontWeight: '200', marginBottom: spacing.sm },
  exRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5 },
  exName: { fontSize: 13 },
  exStatus: { fontSize: 11, letterSpacing: 1 },
  bigNum: { fontSize: 32, fontWeight: '200' },
  unit: { fontSize: 14 },
  hint: { fontSize: 12, marginTop: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '200' },
  statLabel: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 },
});
