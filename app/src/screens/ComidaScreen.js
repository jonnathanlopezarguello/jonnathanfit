import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { getState } from '../store';
import { calc } from '../data/calc';

export default function ComidaScreen({ theme }) {
  const [state, setState] = useState(getState());
  useEffect(() => { setState(getState()); }, []);

  const todayISO = new Date().toLocaleDateString('en-CA');
  const logged = state.nutrition[todayISO] || [];
  const t = calc(state.profile);
  const totals = logged.reduce(
    (a, it) => ({ kcal: a.kcal + it.kcal, p: a.p + it.p, c: a.c + it.c, f: a.f + it.f }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  const meals = {};
  logged.forEach(it => {
    if (!meals[it.meal]) meals[it.meal] = [];
    meals[it.meal].push(it);
  });

  const mealKcal = name =>
    (meals[name] || []).reduce((s, it) => s + it.kcal, 0);

  const pct = t.kcal > 0 ? Math.min(100, Math.round((totals.kcal / t.kcal) * 100)) : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={[styles.supra, { color: theme.text3 }]}>{'REGISTRO DE ALIMENTACIÓN'}</Text>
      <Text style={[styles.title, { color: theme.text }]}>Comida</Text>

      {/* Day selector row */}
      <View style={styles.dayRow}>
        <View style={[styles.dayBox, { borderColor: theme.line }]}>
          <Text style={[styles.dayArrow, { color: theme.text2 }]}>{'‹'}</Text>
          <Text style={[styles.dayLabel, { color: theme.text }]}>Hoy</Text>
          <Text style={[styles.dayArrow, { color: theme.text2 }]}>{'›'}</Text>
        </View>
        <TouchableOpacity style={[styles.loadBtn, { borderColor: theme.line }]}>
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
      {Object.keys(meals).length === 0 ? (
        <View style={[styles.card, { borderColor: theme.line }]}>
          <Text style={[styles.hint, { color: theme.text3 }]}>No hay alimentos registrados hoy.</Text>
        </View>
      ) : (
        Object.entries(meals).map(([meal, items]) => (
          <View key={meal}>
            <Text style={[styles.sectionLabel, { color: theme.text3 }]}>
              {meal.toUpperCase() + ' · ' + Math.round(mealKcal(meal)) + ' KCAL'}
            </Text>
            <View style={[styles.card, { borderColor: theme.line }]}>
              {items.map((it, i) => (
                <View
                  key={i}
                  style={[
                    styles.foodRow,
                    i < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line },
                  ]}
                >
                  <View style={styles.foodLeft}>
                    <Text style={[styles.foodName, { color: theme.text }]}>{it.food}</Text>
                    <Text style={[styles.foodMacros, { color: theme.text3 }]}>
                      {'P ' + Math.round(it.p) + ' · C ' + Math.round(it.c) + ' · G ' + Math.round(it.f)}
                    </Text>
                  </View>
                  <Text style={[styles.foodKcal, { color: theme.text }]}>{Math.round(it.kcal)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      )}

      {/* Add button */}
      <TouchableOpacity style={[styles.addBtn, { borderColor: theme.line2 }]}>
        <Text style={[styles.addBtnText, { color: theme.text3 }]}>{'+ AÑADIR COMIDA'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 60 },
  supra: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    marginBottom: spacing.lg,
  },

  /* Day selector */
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  dayArrow: { fontSize: 16, fontWeight: '300' },
  dayLabel: { fontSize: 13, fontWeight: '500' },
  loadBtn: {
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loadBtnText: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  /* Total card */
  card: {
    borderWidth: 1,
    borderRadius: 0,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: spacing.sm,
  },
  bigKcal: {
    fontSize: 30,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  totalTarget: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  track: { height: 3, borderRadius: 0 },
  fill: { height: 3, borderRadius: 0 },

  /* Section label */
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  /* Food rows */
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  foodLeft: { flex: 1 },
  foodName: { fontSize: 14 },
  foodMacros: {
    fontSize: 11,
    marginTop: 2,
  },
  foodKcal: {
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 12,
  },

  hint: { fontSize: 13 },

  /* Add button */
  addBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 0,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addBtnText: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
