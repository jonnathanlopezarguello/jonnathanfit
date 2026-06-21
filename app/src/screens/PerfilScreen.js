import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { spacing } from '../theme';
import { getState, updateState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';

const GOALS = ['bulk', 'cut', 'recomp', 'maint'];

export default function PerfilScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { setState(getState()); }, []);

  const p = state.profile;
  const t = calc(p);

  function startEdit() {
    setForm({ name: p.name || '', age: String(p.age || ''), weight: String(p.weight || ''), height: String(p.height || ''), sex: p.sex || 'male', goal: p.goal || 'bulk' });
    setEditing(true);
  }

  async function saveProfile() {
    const s = await updateState(st => {
      st.profile.name = form.name;
      st.profile.age = parseInt(form.age) || 0;
      st.profile.weight = parseFloat(form.weight) || 0;
      st.profile.height = parseFloat(form.height) || 0;
      st.profile.sex = form.sex;
      st.profile.goal = form.goal;
    });
    setState({ ...s });
    setEditing(false);
  }

  async function resetData() {
    Alert.alert('Reiniciar datos', 'Borrar todo el historial? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar todo', style: 'destructive', onPress: async () => {
        const s = await updateState(st => {
          st.workouts = []; st.active = null; st.nutrition = {};
          st.bodyweight = []; st.waist = []; st.measurements = [];
        });
        setState({ ...s });
      }},
    ]);
  }

  if (editing) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
        <Text style={[styles.supra, { color: theme.text3 }]}>EDITAR DATOS</Text>
        <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

        <View style={[styles.tableCard, { borderColor: theme.line }]}>
          <View style={[styles.editRow, { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>Nombre</Text>
            <TextInput style={[styles.editInput, { color: theme.text, borderColor: theme.line }]} value={form.name} onChangeText={v => setForm({ ...form, name: v })} placeholderTextColor={theme.text3} />
          </View>
          <View style={[styles.editRow, { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>Edad</Text>
            <TextInput style={[styles.editInput, { color: theme.text, borderColor: theme.line }]} value={form.age} onChangeText={v => setForm({ ...form, age: v })} keyboardType="numeric" placeholderTextColor={theme.text3} />
          </View>
          <View style={[styles.editRow, { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>Peso (kg)</Text>
            <TextInput style={[styles.editInput, { color: theme.text, borderColor: theme.line }]} value={form.weight} onChangeText={v => setForm({ ...form, weight: v })} keyboardType="numeric" placeholderTextColor={theme.text3} />
          </View>
          <View style={[styles.editRow, { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>Altura (cm)</Text>
            <TextInput style={[styles.editInput, { color: theme.text, borderColor: theme.line }]} value={form.height} onChangeText={v => setForm({ ...form, height: v })} keyboardType="numeric" placeholderTextColor={theme.text3} />
          </View>
          <View style={[styles.editRow, { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>Sexo</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity style={[styles.chip, { borderColor: form.sex === 'male' ? theme.accent : theme.line, backgroundColor: form.sex === 'male' ? theme.accentSoft : 'transparent' }]} onPress={() => setForm({ ...form, sex: 'male' })}>
                <Text style={{ fontSize: 12, color: form.sex === 'male' ? theme.text : theme.text3 }}>Hombre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, { borderColor: form.sex === 'female' ? theme.accent : theme.line, backgroundColor: form.sex === 'female' ? theme.accentSoft : 'transparent' }]} onPress={() => setForm({ ...form, sex: 'female' })}>
                <Text style={{ fontSize: 12, color: form.sex === 'female' ? theme.text : theme.text3 }}>Mujer</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.editRow}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>Objetivo</Text>
            <View style={styles.chipRow}>
              {GOALS.map(g => (
                <TouchableOpacity key={g} style={[styles.chip, { borderColor: form.goal === g ? theme.accent : theme.line, backgroundColor: form.goal === g ? theme.accentSoft : 'transparent' }]} onPress={() => setForm({ ...form, goal: g })}>
                  <Text style={{ fontSize: 11, color: form.goal === g ? theme.text : theme.text3 }}>{GOAL_LABEL[g]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formBtns}>
          <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.line }]} onPress={() => setEditing(false)}>
            <Text style={[styles.editBtnText, { color: theme.text3 }]}>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.accent }]} onPress={saveProfile}>
            <Text style={[styles.editBtnText, { color: theme.bg }]}>GUARDAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const rows = [
    { label: 'Nombre', value: p.name || '---' },
    { label: 'Edad · Sexo', value: (p.age || '---') + ' · ' + (p.sex === 'male' ? 'Hombre' : 'Mujer') },
    { label: 'Peso · Altura', value: (p.weight || '---') + ' kg · ' + (p.height || '---') + ' cm', tabular: true },
    { label: 'Objetivo', value: (GOAL_LABEL[p.goal] || '---') + ' · +10 %' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.supra, { color: theme.text3 }]}>DATOS Y OBJETIVOS</Text>
      <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

      <View style={[styles.tableCard, { borderColor: theme.line }]}>
        {rows.map((r, i) => (
          <View key={r.label} style={[styles.tableRow, i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>{r.label}</Text>
            <Text style={[styles.rowValue, { color: theme.text }, r.tabular && styles.tabular]}>{r.value}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>{'METABOLISMO · MIFFLIN-ST JEOR'}</Text>
      <View style={[styles.metaCard, { borderColor: theme.line }]}>
        <View style={[styles.metaCol, { borderRightWidth: 1, borderRightColor: theme.line }]}>
          <Text style={[styles.metaNum, { color: theme.text }]}>{t.bmr}</Text>
          <Text style={[styles.metaLabel, { color: theme.text3 }]}>BMR</Text>
        </View>
        <View style={[styles.metaCol, { borderRightWidth: 1, borderRightColor: theme.line }]}>
          <Text style={[styles.metaNum, { color: theme.text }]}>{t.tdee}</Text>
          <Text style={[styles.metaLabel, { color: theme.text3 }]}>TDEE</Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={[styles.metaNum, { color: theme.text }]}>{t.kcal}</Text>
          <Text style={[styles.metaLabel, { color: theme.text3 }]}>OBJETIVO</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.editBtn, { borderColor: theme.over + '80' }]} onPress={startEdit}>
        <Text style={[styles.editBtnText, { color: theme.over }]}>EDITAR PERFIL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.resetBtn, { borderColor: theme.line }]} onPress={resetData}>
        <Text style={[styles.editBtnText, { color: theme.text3 }]}>REINICIAR DATOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 60 },
  supra: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '300', marginBottom: spacing.lg },

  tableCard: { borderWidth: 1, marginBottom: spacing.md },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 13, textAlign: 'right' },
  tabular: { fontVariant: ['tabular-nums'] },

  sectionLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: spacing.sm, marginBottom: spacing.sm },

  metaCard: { flexDirection: 'row', borderWidth: 1, marginBottom: spacing.lg },
  metaCol: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  metaNum: { fontSize: 24, fontWeight: '300', fontVariant: ['tabular-nums'] },
  metaLabel: { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },

  editBtn: { borderWidth: 1, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  resetBtn: { borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  editBtnText: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },

  editRow: { paddingVertical: 12, paddingHorizontal: 18 },
  editInput: { borderBottomWidth: 1, fontSize: 14, paddingVertical: 6, marginTop: 4 },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  chip: { borderWidth: 1, paddingVertical: 6, paddingHorizontal: 12 },
  formBtns: { flexDirection: 'row', gap: 8 },
  cancelBtn: { flex: 1, borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  saveBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
});
