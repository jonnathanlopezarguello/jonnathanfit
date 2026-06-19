import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { getState } from '../store';
import { calc } from '../data/calc';

export default function ComidaScreen({ theme }) {
  const [state, setState] = useState(getState());
  useEffect(() => { setState(getState()); }, []);

  const todayISO = new Date().toLocaleDateString('en-CA');
  const logged = state.nutrition[todayISO] || [];
  const t = calc(state.profile);
  const totals = logged.reduce((a, it) => ({
    kcal: a.kcal + it.kcal, p: a.p + it.p, c: a.c + it.c, f: a.f + it.f
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  const meals = {};
  logged.forEach(it => {
    if (!meals[it.meal]) meals[it.meal] = [];
    meals[it.meal].push(it);
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>COMIDA</Text>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.bigNum, { color: theme.text }]}>{Math.round(totals.kcal)}</Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>KCAL</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroNum, { color: theme.text }]}>{Math.round(totals.p)}<Text style={[styles.unit, { color: theme.text3 }]}>g</Text></Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>PROTEÍNA</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroNum, { color: theme.text }]}>{Math.round(totals.c)}<Text style={[styles.unit, { color: theme.text3 }]}>g</Text></Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>CARBOS</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroNum, { color: theme.text }]}>{Math.round(totals.f)}<Text style={[styles.unit, { color: theme.text3 }]}>g</Text></Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>GRASA</Text>
          </View>
        </View>
        <View style={[styles.track, { backgroundColor: theme.line }]}>
          <View style={[styles.fill, { width: `${Math.min(100, Math.round(totals.kcal / t.kcal * 100))}%`, backgroundColor: theme.text }]} />
        </View>
        <Text style={[styles.remaining, { color: theme.text2 }]}>
          {totals.kcal < t.kcal ? `${Math.round(t.kcal - totals.kcal)} kcal restantes` : 'Objetivo alcanzado ✓'}
        </Text>
      </View>

      {Object.keys(meals).length === 0 ? (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
          <Text style={[styles.hint, { color: theme.text3 }]}>No hay alimentos registrados hoy.</Text>
          <Text style={[styles.hint, { color: theme.text3 }]}>Ve a Plan → "Cargar a Comida" para importar tu plan del día.</Text>
        </View>
      ) : (
        Object.entries(meals).map(([meal, items]) => (
          <View key={meal} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
            <Text style={[styles.mealName, { color: theme.text3 }]}>{meal}</Text>
            {items.map((it, i) => (
              <View key={i} style={[styles.foodRow, { borderColor: theme.line }]}>
                <View>
                  <Text style={[styles.foodName, { color: theme.text }]}>{it.food}</Text>
                  <Text style={[styles.foodDetail, { color: theme.text3 }]}>{it.grams}g</Text>
                </View>
                <Text style={[styles.foodKcal, { color: theme.text }]}>{Math.round(it.kcal)}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  title: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.md },
  card: { borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center' },
  bigNum: { fontSize: 28, fontWeight: '200' },
  macroNum: { fontSize: 18, fontWeight: '300' },
  unit: { fontSize: 11 },
  macroLabel: { fontSize: 8, letterSpacing: 2, marginTop: 2 },
  track: { height: 3, marginTop: spacing.md },
  fill: { height: 3 },
  remaining: { fontSize: 12, marginTop: spacing.sm, textAlign: 'center' },
  hint: { fontSize: 13 },
  mealName: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: spacing.sm },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5 },
  foodName: { fontSize: 14 },
  foodDetail: { fontSize: 12 },
  foodKcal: { fontSize: 16, fontWeight: '300' },
});
