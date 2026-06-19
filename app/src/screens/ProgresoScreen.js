import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { getState } from '../store';
import { calc } from '../data/calc';
import { MUSCLE_GROUPS, VOL_RANGE, MUSCLE, TEMPLATES } from '../data/templates';

export default function ProgresoScreen() {
  const [state, setState] = useState(getState());
  const [selMuscle, setSelMuscle] = useState(null);
  useFocusEffect(useCallback(() => { setState(getState()); }, []));

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
    return { g, sets: v, min, pct, color: pct >= 1 ? colors.good : pct >= 0.5 ? colors.over : colors.danger };
  });

  const bw = state.bodyweight.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const lastW = bw[bw.length - 1];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>PROGRESO</Text>

      <Text style={styles.section}>MAPA MUSCULAR SEMANAL</Text>
      <View style={styles.card}>
        {stats.map(s => (
          <TouchableOpacity key={s.g} style={styles.muscleRow} onPress={() => setSelMuscle(selMuscle === s.g ? null : s.g)}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.muscleName}>{s.g}</Text>
            <View style={styles.muscleBar}>
              <View style={[styles.muscleBarFill, { width: `${Math.min(100, Math.round(s.pct * 100))}%`, backgroundColor: s.color }]} />
            </View>
            <Text style={[styles.muscleCount, { color: s.color }]}>{s.sets}/{s.min}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.good }]} /><Text style={styles.legendText}>Cumplido</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.over }]} /><Text style={styles.legendText}>Casi</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.danger }]} /><Text style={styles.legendText}>Falta</Text></View>
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
          <View style={styles.card}>
            <Text style={styles.detailTitle}>{selMuscle.toUpperCase()}</Text>
            <Text style={[styles.detailCount, { color: s.color }]}>{s.sets} / {s.min} series</Text>
            {allEx.map((e, i) => (
              <View key={i} style={styles.exRow}>
                <Text style={styles.exName}>{e.n}</Text>
                <Text style={doneNames.has(e.n) ? styles.exDone : styles.exPending}>
                  {doneNames.has(e.n) ? '✓ hecho' : 'pendiente'}
                </Text>
              </View>
            ))}
          </View>
        );
      })()}

      <Text style={styles.section}>PESO CORPORAL</Text>
      <View style={styles.card}>
        <Text style={styles.bigNum}>{lastW ? lastW.kg : '—'}<Text style={styles.unit}> kg</Text></Text>
        <Text style={styles.hint}>{bw.length > 1 ? `${(bw[bw.length-1].kg - bw[0].kg) > 0 ? '+' : ''}${(bw[bw.length-1].kg - bw[0].kg).toFixed(1)} kg desde el inicio` : 'Registra tu peso para ver la tendencia'}</Text>
      </View>

      <Text style={styles.section}>HISTORIAL</Text>
      <View style={styles.card}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{state.workouts.length}</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{state.workouts.reduce((a, w) => a + w.exercises.reduce((x, e) => x + e.sets.filter(s => s.done).length, 0), 0)}</Text>
            <Text style={styles.statLabel}>Series totales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{weekWorkouts.length}</Text>
            <Text style={styles.statLabel}>Esta semana</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  title: { fontSize: 11, letterSpacing: 3, color: colors.text, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.md },
  section: { fontSize: 9, letterSpacing: 3, color: colors.text3, textTransform: 'uppercase', marginTop: spacing.lg, marginBottom: spacing.sm },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.md },
  muscleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: colors.line },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  muscleName: { fontSize: 13, color: colors.text, width: 120 },
  muscleBar: { flex: 1, height: 4, backgroundColor: colors.line, marginHorizontal: 8 },
  muscleBarFill: { height: 4 },
  muscleCount: { fontSize: 12, fontWeight: '500', width: 40, textAlign: 'right' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendText: { fontSize: 10, color: colors.text3, letterSpacing: 1 },
  detailTitle: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: colors.text, marginBottom: 4 },
  detailCount: { fontSize: 22, fontWeight: '200', marginBottom: spacing.sm },
  exRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderColor: colors.line },
  exName: { fontSize: 13, color: colors.text },
  exDone: { fontSize: 11, color: colors.good, letterSpacing: 1 },
  exPending: { fontSize: 11, color: colors.text3, letterSpacing: 1 },
  bigNum: { fontSize: 32, fontWeight: '200', color: colors.text },
  unit: { fontSize: 14, color: colors.text3 },
  hint: { fontSize: 12, color: colors.text2, marginTop: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '200', color: colors.text },
  statLabel: { fontSize: 9, letterSpacing: 1, color: colors.text3, textTransform: 'uppercase', marginTop: 2 },
});
