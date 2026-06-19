import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { getState, updateState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';

export default function PerfilScreen() {
  const [state, setState] = useState(getState());
  useFocusEffect(useCallback(() => { setState(getState()); }, []));

  const p = state.profile;
  const t = calc(p);

  async function update(key, val) {
    const s = await updateState(s => { s.profile[key] = val; });
    setState({ ...s });
  }

  function resetData() {
    Alert.alert('Reiniciar datos', '¿Borrar todo el historial? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar todo', style: 'destructive', onPress: async () => {
        const s = await updateState(s => {
          s.workouts = []; s.active = null; s.nutrition = {};
          s.bodyweight = []; s.waist = []; s.measurements = [];
        });
        setState({ ...s });
      }}
    ]);
  }

  const Field = ({ label, value, onChangeText, keyboardType }) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.fieldInput} value={String(value || '')} onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'} placeholderTextColor={colors.text3} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>PERFIL</Text>

      <View style={styles.card}>
        <Text style={styles.section}>DATOS PERSONALES</Text>
        <View style={styles.grid}>
          <Field label="Nombre" value={p.name} onChangeText={v => update('name', v)} />
          <Field label="Edad" value={p.age} onChangeText={v => update('age', +v)} keyboardType="number-pad" />
          <Field label="Peso (kg)" value={p.weight} onChangeText={v => update('weight', +v)} keyboardType="decimal-pad" />
          <Field label="Altura (cm)" value={p.height} onChangeText={v => update('height', +v)} keyboardType="number-pad" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>TUS NÚMEROS</Text>
        <View style={styles.numRow}>
          <View style={styles.numItem}><Text style={styles.numVal}>{t.bmr}</Text><Text style={styles.numLabel}>BMR</Text></View>
          <View style={styles.numItem}><Text style={styles.numVal}>{t.tdee}</Text><Text style={styles.numLabel}>TDEE</Text></View>
          <View style={styles.numItem}><Text style={styles.numVal}>{t.kcal}</Text><Text style={styles.numLabel}>OBJETIVO</Text></View>
        </View>
        <View style={styles.numRow}>
          <View style={styles.numItem}><Text style={styles.numVal}>{t.protein}g</Text><Text style={styles.numLabel}>PROTEÍNA</Text></View>
          <View style={styles.numItem}><Text style={styles.numVal}>{t.carbs}g</Text><Text style={styles.numLabel}>CARBOS</Text></View>
          <View style={styles.numItem}><Text style={styles.numVal}>{t.fat}g</Text><Text style={styles.numLabel}>GRASA</Text></View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>OBJETIVO</Text>
        <Text style={styles.goalCurrent}>{GOAL_LABEL[p.goal]}</Text>
        <View style={styles.goalRow}>
          {['bulk', 'cut', 'recomp', 'maint'].map(g => (
            <TouchableOpacity key={g} style={[styles.goalBtn, p.goal === g && styles.goalBtnActive]}
              onPress={() => update('goal', g)}>
              <Text style={[styles.goalBtnText, p.goal === g && styles.goalBtnTextActive]}>{GOAL_LABEL[g]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.dangerBtn} onPress={resetData}>
        <Text style={styles.dangerText}>Reiniciar todos los datos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: 60 },
  title: { fontSize: 11, letterSpacing: 3, color: colors.text, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, marginBottom: spacing.md },
  section: { fontSize: 9, letterSpacing: 3, color: colors.text3, textTransform: 'uppercase', marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  field: { width: '48%' },
  fieldLabel: { fontSize: 11, color: colors.text3, letterSpacing: 1, marginBottom: 4 },
  fieldInput: { borderWidth: 1, borderColor: colors.line, padding: 10, fontSize: 15, color: colors.text },
  numRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  numItem: { alignItems: 'center' },
  numVal: { fontSize: 20, fontWeight: '200', color: colors.text },
  numLabel: { fontSize: 8, letterSpacing: 2, color: colors.text3, marginTop: 2 },
  goalCurrent: { fontSize: 18, fontWeight: '300', color: colors.text, marginBottom: spacing.sm },
  goalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  goalBtn: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 8 },
  goalBtnActive: { borderColor: colors.text, backgroundColor: colors.text },
  goalBtnText: { fontSize: 11, letterSpacing: 1, color: colors.text2 },
  goalBtnTextActive: { color: colors.bg },
  dangerBtn: { borderWidth: 1, borderColor: colors.danger, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  dangerText: { fontSize: 11, letterSpacing: 1.5, color: colors.danger, textTransform: 'uppercase' },
});
