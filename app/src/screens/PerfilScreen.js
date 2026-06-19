import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { spacing } from '../theme';
import { getState, updateState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';

export default function PerfilScreen({ theme }) {
  const [state, setState] = useState(getState());
  useEffect(() => { setState(getState()); }, []);

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
      <Text style={[styles.fieldLabel, { color: theme.text3 }]}>{label}</Text>
      <TextInput style={[styles.fieldInput, { borderColor: theme.line, color: theme.text }]} value={String(value || '')} onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'} placeholderTextColor={theme.text3} />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>PERFIL</Text>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text style={[styles.section, { color: theme.text3 }]}>DATOS PERSONALES</Text>
        <View style={styles.grid}>
          <Field label="Nombre" value={p.name} onChangeText={v => update('name', v)} />
          <Field label="Edad" value={p.age} onChangeText={v => update('age', +v)} keyboardType="number-pad" />
          <Field label="Peso (kg)" value={p.weight} onChangeText={v => update('weight', +v)} keyboardType="decimal-pad" />
          <Field label="Altura (cm)" value={p.height} onChangeText={v => update('height', +v)} keyboardType="number-pad" />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text style={[styles.section, { color: theme.text3 }]}>TUS NÚMEROS</Text>
        <View style={styles.numRow}>
          <View style={styles.numItem}><Text style={[styles.numVal, { color: theme.text }]}>{t.bmr}</Text><Text style={[styles.numLabel, { color: theme.text3 }]}>BMR</Text></View>
          <View style={styles.numItem}><Text style={[styles.numVal, { color: theme.text }]}>{t.tdee}</Text><Text style={[styles.numLabel, { color: theme.text3 }]}>TDEE</Text></View>
          <View style={styles.numItem}><Text style={[styles.numVal, { color: theme.text }]}>{t.kcal}</Text><Text style={[styles.numLabel, { color: theme.text3 }]}>OBJETIVO</Text></View>
        </View>
        <View style={styles.numRow}>
          <View style={styles.numItem}><Text style={[styles.numVal, { color: theme.text }]}>{t.protein}g</Text><Text style={[styles.numLabel, { color: theme.text3 }]}>PROTEÍNA</Text></View>
          <View style={styles.numItem}><Text style={[styles.numVal, { color: theme.text }]}>{t.carbs}g</Text><Text style={[styles.numLabel, { color: theme.text3 }]}>CARBOS</Text></View>
          <View style={styles.numItem}><Text style={[styles.numVal, { color: theme.text }]}>{t.fat}g</Text><Text style={[styles.numLabel, { color: theme.text3 }]}>GRASA</Text></View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text style={[styles.section, { color: theme.text3 }]}>OBJETIVO</Text>
        <Text style={[styles.goalCurrent, { color: theme.text }]}>{GOAL_LABEL[p.goal]}</Text>
        <View style={styles.goalRow}>
          {['bulk', 'cut', 'recomp', 'maint'].map(g => (
            <TouchableOpacity key={g} style={[styles.goalBtn, { borderColor: theme.line }, p.goal === g && { borderColor: theme.text, backgroundColor: theme.text }]}
              onPress={() => update('goal', g)}>
              <Text style={[styles.goalBtnText, { color: theme.text2 }, p.goal === g && { color: theme.bg }]}>{GOAL_LABEL[g]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.dangerBtn, { borderColor: theme.danger }]} onPress={resetData}>
        <Text style={[styles.dangerText, { color: theme.danger }]}>Reiniciar todos los datos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 60 },
  title: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: spacing.md },
  card: { borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  section: { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  field: { width: '48%' },
  fieldLabel: { fontSize: 11, letterSpacing: 1, marginBottom: 4 },
  fieldInput: { borderWidth: 1, padding: 10, fontSize: 15 },
  numRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  numItem: { alignItems: 'center' },
  numVal: { fontSize: 20, fontWeight: '200' },
  numLabel: { fontSize: 8, letterSpacing: 2, marginTop: 2 },
  goalCurrent: { fontSize: 18, fontWeight: '300', marginBottom: spacing.sm },
  goalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  goalBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  goalBtnText: { fontSize: 11, letterSpacing: 1 },
  dangerBtn: { borderWidth: 1, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  dangerText: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
});
