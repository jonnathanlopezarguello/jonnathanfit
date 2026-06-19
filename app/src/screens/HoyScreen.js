import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
import { getState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';
import { PLAN_DAYS, DAY_TITLE } from '../data/templates';

const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

export default function HoyScreen() {
  const [state, setState] = useState(getState());
  const today = new Date();
  const dayName = DAY_ES[today.getDay()];
  const isTrainDay = PLAN_DAYS.includes(dayName);
  const t = calc(state.profile);

  const todayISO = today.toLocaleDateString('en-CA');
  const logged = state.nutrition[todayISO] || [];
  const kcalLogged = logged.reduce((a, it) => a + it.kcal, 0);
  const protLogged = logged.reduce((a, it) => a + it.p, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hola, {state.profile.name || 'atleta'}</Text>
      <Text style={styles.day}>{dayName.toUpperCase()}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>HOY</Text>
        <Text style={styles.bigNum}>{Math.round(kcalLogged)}<Text style={styles.dim}> / {t.kcal} kcal</Text></Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, Math.round(kcalLogged / t.kcal * 100))}%` }]} />
        </View>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroNum}>{Math.round(protLogged)}<Text style={styles.macroUnit}>g</Text></Text>
            <Text style={styles.macroLabel}>Proteína</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNum}>{t.carbs}<Text style={styles.macroUnit}>g</Text></Text>
            <Text style={styles.macroLabel}>Carbos obj.</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroNum}>{t.fat}<Text style={styles.macroUnit}>g</Text></Text>
            <Text style={styles.macroLabel}>Grasa obj.</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ENTRENAMIENTO</Text>
        {isTrainDay ? (
          <>
            <Text style={styles.trainDay}>{DAY_TITLE[dayName]}</Text>
            <Text style={styles.hint}>Ve a la pestaña Entreno para empezar tu sesión</Text>
          </>
        ) : (
          <Text style={styles.hint}>Día de descanso — aprovecha para recuperar</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>OBJETIVO</Text>
        <Text style={styles.goalText}>{GOAL_LABEL[state.profile.goal]}</Text>
        <Text style={styles.hint}>BMR {t.bmr} · TDEE {t.tdee} · Objetivo {t.kcal} kcal</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  greeting: { fontSize: 14, letterSpacing: 2, color: colors.text2, textTransform: 'uppercase', marginBottom: 4 },
  day: { fontSize: 42, fontWeight: '200', color: colors.text, marginBottom: spacing.lg, letterSpacing: -1 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.md },
  label: { fontSize: 9, letterSpacing: 3, color: colors.text3, textTransform: 'uppercase', marginBottom: spacing.sm },
  bigNum: { fontSize: 32, fontWeight: '200', color: colors.text },
  dim: { fontSize: 14, color: colors.text3 },
  track: { height: 3, backgroundColor: colors.line, marginTop: spacing.sm, marginBottom: spacing.md },
  fill: { height: 3, backgroundColor: colors.text },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center' },
  macroNum: { fontSize: 18, fontWeight: '300', color: colors.text },
  macroUnit: { fontSize: 11, color: colors.text3 },
  macroLabel: { fontSize: 9, letterSpacing: 1, color: colors.text3, textTransform: 'uppercase', marginTop: 2 },
  trainDay: { fontSize: 15, color: colors.text, marginBottom: 4 },
  hint: { fontSize: 13, color: colors.text2 },
  goalText: { fontSize: 18, fontWeight: '300', color: colors.text, marginBottom: 4 },
});
