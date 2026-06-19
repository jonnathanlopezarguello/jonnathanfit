import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { getState } from '../store';
import { calc } from '../data/calc';

export default function ComidaScreen() {
  const [state, setState] = useState(getState());
  useFocusEffect(useCallback(() => { setState(getState()); }, []));

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>COMIDA</Text>

      <View style={styles.card}>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.bigNum}>{Math.round(totals.kcal)}</Text>
            <Text style={styles.macroLabel}>KCAL</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNum}>{Math.round(totals.p)}<Text style={styles.unit}>g</Text></Text>
            <Text style={styles.macroLabel}>PROTEÍNA</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNum}>{Math.round(totals.c)}<Text style={styles.unit}>g</Text></Text>
            <Text style={styles.macroLabel}>CARBOS</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNum}>{Math.round(totals.f)}<Text style={styles.unit}>g</Text></Text>
            <Text style={styles.macroLabel}>GRASA</Text>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, Math.round(totals.kcal / t.kcal * 100))}%` }]} />
        </View>
        <Text style={styles.remaining}>
          {totals.kcal < t.kcal ? `${Math.round(t.kcal - totals.kcal)} kcal restantes` : 'Objetivo alcanzado ✓'}
        </Text>
      </View>

      {Object.keys(meals).length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.hint}>No hay alimentos registrados hoy.</Text>
          <Text style={styles.hint}>Ve a Plan → "Cargar a Comida" para importar tu plan del día.</Text>
        </View>
      ) : (
        Object.entries(meals).map(([meal, items]) => (
          <View key={meal} style={styles.card}>
            <Text style={styles.mealName}>{meal}</Text>
            {items.map((it, i) => (
              <View key={i} style={styles.foodRow}>
                <View>
                  <Text style={styles.foodName}>{it.food}</Text>
                  <Text style={styles.foodDetail}>{it.grams}g</Text>
                </View>
                <Text style={styles.foodKcal}>{Math.round(it.kcal)}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  title: { fontSize: 11, letterSpacing: 3, color: colors.text, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.md },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center' },
  bigNum: { fontSize: 28, fontWeight: '200', color: colors.text },
  macroNum: { fontSize: 18, fontWeight: '300', color: colors.text },
  unit: { fontSize: 11, color: colors.text3 },
  macroLabel: { fontSize: 8, letterSpacing: 2, color: colors.text3, marginTop: 2 },
  track: { height: 3, backgroundColor: colors.line, marginTop: spacing.md },
  fill: { height: 3, backgroundColor: colors.text },
  remaining: { fontSize: 12, color: colors.text2, marginTop: spacing.sm, textAlign: 'center' },
  hint: { fontSize: 13, color: colors.text3 },
  mealName: { fontSize: 11, letterSpacing: 2, color: colors.text3, textTransform: 'uppercase', marginBottom: spacing.sm },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: colors.line },
  foodName: { fontSize: 14, color: colors.text },
  foodDetail: { fontSize: 12, color: colors.text3 },
  foodKcal: { fontSize: 16, fontWeight: '300', color: colors.text },
});
