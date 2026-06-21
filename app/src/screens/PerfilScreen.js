import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { spacing } from '../theme';
import { getState, updateState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';

const GOALS = ['bulk', 'cut', 'recomp', 'maint'];
const ACTIVITY_LEVELS = [
  { key: 'sedentario', label: 'Sedentario' },
  { key: 'ligero', label: 'Ligero' },
  { key: 'moderado', label: 'Moderado' },
  { key: 'activo', label: 'Activo' },
  { key: 'muy activo', label: 'Muy activo' },
];
const STRESS_LEVELS = [
  { key: 'bajo', label: 'Bajo' },
  { key: 'medio', label: 'Medio' },
  { key: 'alto', label: 'Alto' },
];

function ChipSelector({ options, value, onChange, theme }) {
  return (
    <View style={styles.chipRow}>
      {options.map(o => {
        const k = typeof o === 'string' ? o : o.key;
        const label = typeof o === 'string' ? (GOAL_LABEL[o] || o) : o.label;
        const selected = value === k;
        return (
          <TouchableOpacity
            key={k}
            style={[styles.chip, {
              borderColor: selected ? theme.accent : theme.line,
              backgroundColor: selected ? theme.accentSoft : 'transparent',
            }]}
            onPress={() => onChange(k)}
          >
            <Text style={{ fontSize: 11, color: selected ? theme.text : theme.text3 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function FormField({ label, children, theme, last }) {
  return (
    <View style={[styles.editRow, !last && { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
      <Text style={[styles.rowLabel, { color: theme.text3 }]}>{label}</Text>
      {children}
    </View>
  );
}

function FormTextInput({ value, onChangeText, theme, keyboardType, placeholder, autoCapitalize, multiline }) {
  return (
    <TextInput
      style={[styles.editInput, { color: theme.text, borderColor: theme.line }, multiline && { minHeight: 60, textAlignVertical: 'top' }]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      placeholder={placeholder || ''}
      placeholderTextColor={theme.text3}
      autoCapitalize={autoCapitalize || 'sentences'}
      multiline={multiline || false}
    />
  );
}

export default function PerfilScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { setState(getState()); }, []);

  const p = state.profile;
  const t = calc(p);

  function startEdit() {
    setForm({
      name: p.name || '',
      age: String(p.age || ''),
      weight: String(p.weight || ''),
      height: String(p.height || ''),
      sex: p.sex || 'male',
      goal: p.goal || 'bulk',
      bodyFat: String(p.bodyFat || ''),
      waistCm: String(p.waistCm || ''),
      neckCm: String(p.neckCm || ''),
      hipCm: String(p.hipCm || ''),
      yearsTraining: String(p.yearsTraining || ''),
      activityLevel: p.activityLevel || 'moderado',
      sleepHours: String(p.sleepHours || '7'),
      stressLevel: p.stressLevel || 'medio',
      injuries: p.injuries || '',
    });
    setEditing(true);
  }

  function updateForm(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function saveProfile() {
    const s = await updateState(st => {
      st.profile.name = form.name;
      st.profile.age = parseInt(form.age) || 0;
      st.profile.weight = parseFloat(form.weight) || 0;
      st.profile.height = parseFloat(form.height) || 0;
      st.profile.sex = form.sex;
      st.profile.goal = form.goal;
      st.profile.bodyFat = form.bodyFat;
      st.profile.waistCm = form.waistCm;
      st.profile.neckCm = form.neckCm;
      st.profile.hipCm = form.hipCm;
      st.profile.yearsTraining = form.yearsTraining;
      st.profile.activityLevel = form.activityLevel;
      st.profile.sleepHours = form.sleepHours;
      st.profile.stressLevel = form.stressLevel;
      st.profile.injuries = form.injuries;
    });
    setState({ ...s });
    setEditing(false);
  }

  async function recordMeasurement() {
    const today = new Date().toISOString().slice(0, 10);
    const entry = {
      date: today,
      weight: parseFloat(p.weight) || 0,
      waistCm: p.waistCm || '',
      neckCm: p.neckCm || '',
      hipCm: p.hipCm || '',
      bodyFat: p.bodyFat || '',
    };
    const s = await updateState(st => {
      if (!Array.isArray(st.measurements)) st.measurements = [];
      st.measurements.push(entry);
    });
    setState({ ...s });
    Alert.alert('Medidas registradas', 'Se guardaron las medidas de hoy (' + today + ').');
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

  // ── EDIT MODE ──
  if (editing) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.supra, { color: theme.text3 }]}>EDITAR DATOS</Text>
        <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

        {/* Basic info */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>DATOS BASICOS</Text>
        <View style={[styles.tableCard, { borderColor: theme.line }]}>
          <FormField label="Nombre" theme={theme}>
            <FormTextInput value={form.name} onChangeText={v => updateForm('name', v)} theme={theme} autoCapitalize="words" />
          </FormField>
          <FormField label="Edad" theme={theme}>
            <FormTextInput value={form.age} onChangeText={v => updateForm('age', v)} theme={theme} keyboardType="numeric" placeholder="25" />
          </FormField>
          <FormField label="Peso (kg)" theme={theme}>
            <FormTextInput value={form.weight} onChangeText={v => updateForm('weight', v)} theme={theme} keyboardType="decimal-pad" placeholder="79" />
          </FormField>
          <FormField label="Altura (cm)" theme={theme}>
            <FormTextInput value={form.height} onChangeText={v => updateForm('height', v)} theme={theme} keyboardType="numeric" placeholder="176" />
          </FormField>
          <FormField label="Sexo" theme={theme}>
            <ChipSelector
              options={[{ key: 'male', label: 'Hombre' }, { key: 'female', label: 'Mujer' }]}
              value={form.sex}
              onChange={v => updateForm('sex', v)}
              theme={theme}
            />
          </FormField>
          <FormField label="Objetivo" theme={theme} last>
            <ChipSelector options={GOALS} value={form.goal} onChange={v => updateForm('goal', v)} theme={theme} />
          </FormField>
        </View>

        {/* Body composition */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>COMPOSICION CORPORAL</Text>
        <View style={[styles.tableCard, { borderColor: theme.line }]}>
          <FormField label="% Grasa corporal" theme={theme}>
            <FormTextInput value={form.bodyFat} onChangeText={v => updateForm('bodyFat', v)} theme={theme} keyboardType="decimal-pad" placeholder="15" />
          </FormField>
          <FormField label="Cintura (cm)" theme={theme}>
            <FormTextInput value={form.waistCm} onChangeText={v => updateForm('waistCm', v)} theme={theme} keyboardType="decimal-pad" placeholder="80" />
          </FormField>
          <FormField label="Cuello (cm)" theme={theme}>
            <FormTextInput value={form.neckCm} onChangeText={v => updateForm('neckCm', v)} theme={theme} keyboardType="decimal-pad" placeholder="38" />
          </FormField>
          <FormField label="Cadera (cm)" theme={theme} last>
            <FormTextInput value={form.hipCm} onChangeText={v => updateForm('hipCm', v)} theme={theme} keyboardType="decimal-pad" placeholder="95" />
          </FormField>
        </View>

        {/* Lifestyle */}
        <Text style={[styles.sectionLabel, { color: theme.text3 }]}>ESTILO DE VIDA</Text>
        <View style={[styles.tableCard, { borderColor: theme.line }]}>
          <FormField label="Nivel de actividad" theme={theme}>
            <ChipSelector options={ACTIVITY_LEVELS} value={form.activityLevel} onChange={v => updateForm('activityLevel', v)} theme={theme} />
          </FormField>
          <FormField label="Anios entrenando" theme={theme}>
            <FormTextInput value={form.yearsTraining} onChangeText={v => updateForm('yearsTraining', v)} theme={theme} keyboardType="decimal-pad" placeholder="3" />
          </FormField>
          <FormField label="Horas de suenio" theme={theme}>
            <FormTextInput value={form.sleepHours} onChangeText={v => updateForm('sleepHours', v)} theme={theme} keyboardType="decimal-pad" placeholder="7" />
          </FormField>
          <FormField label="Nivel de estres" theme={theme}>
            <ChipSelector options={STRESS_LEVELS} value={form.stressLevel} onChange={v => updateForm('stressLevel', v)} theme={theme} />
          </FormField>
          <FormField label="Lesiones / limitaciones" theme={theme} last>
            <FormTextInput value={form.injuries} onChangeText={v => updateForm('injuries', v)} theme={theme} autoCapitalize="none" placeholder="Ej: hernia L5, tendinitis hombro..." multiline />
          </FormField>
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

  // ── VIEW MODE ──
  const activityLabels = { sedentario: 'Sedentario', ligero: 'Ligero', moderado: 'Moderado', activo: 'Activo', 'muy activo': 'Muy activo' };
  const stressLabels = { bajo: 'Bajo', medio: 'Medio', alto: 'Alto' };

  const basicRows = [
    { label: 'Nombre', value: p.name || '---' },
    { label: 'Edad', value: p.age ? String(p.age) : '---' },
    { label: 'Sexo', value: p.sex === 'male' ? 'Hombre' : 'Mujer' },
    { label: 'Peso', value: p.weight ? p.weight + ' kg' : '---', tabular: true },
    { label: 'Altura', value: p.height ? p.height + ' cm' : '---', tabular: true },
    { label: 'Objetivo', value: GOAL_LABEL[p.goal] || '---' },
  ];

  const bodyRows = [
    { label: '% Grasa corporal', value: p.bodyFat ? p.bodyFat + ' %' : '---', tabular: true },
    { label: 'Cintura', value: p.waistCm ? p.waistCm + ' cm' : '---', tabular: true },
    { label: 'Cuello', value: p.neckCm ? p.neckCm + ' cm' : '---', tabular: true },
    { label: 'Cadera', value: p.hipCm ? p.hipCm + ' cm' : '---', tabular: true },
  ];

  const lifeRows = [
    { label: 'Nivel actividad', value: activityLabels[p.activityLevel] || p.activityLevel || '---' },
    { label: 'Anios entrenando', value: p.yearsTraining ? String(p.yearsTraining) : '---' },
    { label: 'Horas de suenio', value: p.sleepHours ? String(p.sleepHours) : '---' },
    { label: 'Nivel estres', value: stressLabels[p.stressLevel] || p.stressLevel || '---' },
    { label: 'Lesiones', value: p.injuries || '---' },
  ];

  function renderTable(rows) {
    return rows.map((r, i) => (
      <View key={r.label} style={[styles.tableRow, i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
        <Text style={[styles.rowLabel, { color: theme.text3 }]}>{r.label}</Text>
        <Text style={[styles.rowValue, { color: theme.text }, r.tabular && styles.tabular]}>{r.value}</Text>
      </View>
    ));
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.supra, { color: theme.text3 }]}>DATOS Y OBJETIVOS</Text>
      <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

      {/* Basic info table */}
      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>DATOS BASICOS</Text>
      <View style={[styles.tableCard, { borderColor: theme.line }]}>
        {renderTable(basicRows)}
      </View>

      {/* Body composition table */}
      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>COMPOSICION CORPORAL</Text>
      <View style={[styles.tableCard, { borderColor: theme.line }]}>
        {renderTable(bodyRows)}
      </View>

      {/* Lifestyle table */}
      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>ESTILO DE VIDA</Text>
      <View style={[styles.tableCard, { borderColor: theme.line }]}>
        {renderTable(lifeRows)}
      </View>

      {/* Metabolism card */}
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

      {/* Action buttons */}
      <TouchableOpacity style={[styles.editBtn, { borderColor: theme.over + '80' }]} onPress={startEdit}>
        <Text style={[styles.editBtnText, { color: theme.over }]}>EDITAR PERFIL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.measureBtn, { backgroundColor: theme.accent }]} onPress={recordMeasurement}>
        <Text style={[styles.editBtnText, { color: theme.bg }]}>MEDIR PROGRESO</Text>
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
  rowLabel: { fontSize: 13, flex: 1 },
  rowValue: { fontSize: 13, textAlign: 'right', flex: 1 },
  tabular: { fontVariant: ['tabular-nums'] },

  sectionLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: spacing.sm, marginBottom: spacing.sm },

  metaCard: { flexDirection: 'row', borderWidth: 1, marginBottom: spacing.lg },
  metaCol: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  metaNum: { fontSize: 24, fontWeight: '300', fontVariant: ['tabular-nums'] },
  metaLabel: { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },

  editBtn: { borderWidth: 1, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  measureBtn: { paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  resetBtn: { borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  editBtnText: { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500' },

  editRow: { paddingVertical: 12, paddingHorizontal: 18 },
  editInput: { borderBottomWidth: 1, fontSize: 14, paddingVertical: 8, marginTop: 4, minHeight: 44 },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  chip: { borderWidth: 1, paddingVertical: 8, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center' },
  formBtns: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  cancelBtn: { flex: 1, borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  saveBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
});
