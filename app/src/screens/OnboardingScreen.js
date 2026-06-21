import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { updateState } from '../store';
import { GOAL_LABEL } from '../data/calc';

const GOALS = ['bulk', 'cut', 'recomp', 'maint'];
const SEXES = [{ key: 'male', label: 'Hombre' }, { key: 'female', label: 'Mujer' }];
const ACTIVITY_LEVELS = [
  { key: 1.2, label: 'Sedentario', desc: 'Poco o nada de ejercicio' },
  { key: 1.375, label: 'Ligero', desc: 'Ejercicio 1-3 dias/semana' },
  { key: 1.55, label: 'Moderado', desc: 'Ejercicio 3-5 dias/semana' },
  { key: 1.725, label: 'Activo', desc: 'Ejercicio 6-7 dias/semana' },
  { key: 1.9, label: 'Muy activo', desc: 'Ejercicio intenso diario + trabajo fisico' },
];

const STEPS = ['nombre', 'basico', 'cuerpo', 'actividad', 'objetivo'];
const STEP_TITLE = {
  nombre: 'Como te llamas?',
  basico: 'Datos basicos',
  cuerpo: 'Composicion corporal',
  actividad: 'Nivel de actividad',
  objetivo: 'Cual es tu objetivo?',
};
const STEP_SUB = {
  nombre: 'Para personalizar tu experiencia.',
  basico: 'Necesitamos estos datos para calcular tus macros.',
  cuerpo: 'Opcional pero mejora la precision del plan.',
  actividad: 'Esto determina tu gasto calorico diario.',
  objetivo: 'Ajustaremos tus calorias y macros automaticamente.',
};

export default function OnboardingScreen({ theme, onFinish }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '25',
    weight: '79',
    height: '176',
    sex: 'male',
    bodyFat: '',
    waistCm: '',
    neckCm: '',
    hipCm: '',
    activity: 1.55,
    activityLevel: 'moderado',
    goal: 'bulk',
    yearsTraining: '',
    sleepHours: '7',
  });

  function update(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function next() {
    if (step === 0 && !form.name.trim()) {
      Alert.alert('Nombre', 'Ingresa tu nombre para continuar.');
      return;
    }
    if (step === 1) {
      if (!form.age || !form.weight || !form.height) {
        Alert.alert('Datos incompletos', 'Ingresa edad, peso y altura.');
        return;
      }
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function finish() {
    const activityLabels = { 1.2: 'sedentario', 1.375: 'ligero', 1.55: 'moderado', 1.725: 'activo', 1.9: 'muy activo' };
    await updateState(s => {
      s.profile.name = form.name.trim();
      s.profile.age = parseFloat(form.age) || 25;
      s.profile.weight = parseFloat(form.weight) || 79;
      s.profile.height = parseFloat(form.height) || 176;
      s.profile.sex = form.sex;
      s.profile.bodyFat = form.bodyFat;
      s.profile.waistCm = form.waistCm;
      s.profile.neckCm = form.neckCm;
      s.profile.hipCm = form.hipCm;
      s.profile.activity = form.activity;
      s.profile.activityLevel = activityLabels[form.activity] || 'moderado';
      s.profile.goal = form.goal;
      s.profile.yearsTraining = form.yearsTraining;
      s.profile.sleepHours = form.sleepHours;
      s.profile._set = true;
      s.profile.programStart = new Date().toLocaleDateString('en-CA');
    });
    onFinish();
  }

  const stepKey = STEPS[step];

  return (
    <ScrollView style={[st.container, { backgroundColor: theme.bg }]} contentContainerStyle={st.content} keyboardShouldPersistTaps="handled">
      <View style={st.stepIndicator}>
        {STEPS.map((_, i) => (
          <View key={i} style={[st.stepDot, { backgroundColor: i <= step ? theme.text : theme.line }]} />
        ))}
      </View>

      <Text style={[st.title, { color: theme.text }]}>{STEP_TITLE[stepKey]}</Text>
      <Text style={[st.subtitle, { color: theme.text3 }]}>{STEP_SUB[stepKey]}</Text>

      {stepKey === 'nombre' && (
        <View style={st.section}>
          <TextInput
            style={[st.bigInput, { borderColor: theme.line, color: theme.text }]}
            value={form.name}
            onChangeText={v => update('name', v)}
            placeholder="Tu nombre"
            placeholderTextColor={theme.text3}
            autoCapitalize="words"
            autoFocus
          />
        </View>
      )}

      {stepKey === 'basico' && (
        <View style={st.section}>
          <Text style={[st.label, { color: theme.text3 }]}>SEXO</Text>
          <View style={st.chipRow}>
            {SEXES.map(s => (
              <TouchableOpacity
                key={s.key}
                style={[st.chip, { borderColor: form.sex === s.key ? theme.accent : theme.line, backgroundColor: form.sex === s.key ? theme.accentSoft : 'transparent' }]}
                onPress={() => update('sex', s.key)}
              >
                <Text style={{ fontSize: 13, color: form.sex === s.key ? theme.text : theme.text3 }}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[st.label, { color: theme.text3 }]}>EDAD</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.age}
            onChangeText={v => update('age', v)}
            keyboardType="numeric"
            placeholder="25"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>PESO (KG)</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.weight}
            onChangeText={v => update('weight', v)}
            keyboardType="decimal-pad"
            placeholder="79"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>ALTURA (CM)</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.height}
            onChangeText={v => update('height', v)}
            keyboardType="numeric"
            placeholder="176"
            placeholderTextColor={theme.text3}
          />
        </View>
      )}

      {stepKey === 'cuerpo' && (
        <View style={st.section}>
          <Text style={[st.label, { color: theme.text3 }]}>% GRASA CORPORAL (OPCIONAL)</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.bodyFat}
            onChangeText={v => update('bodyFat', v)}
            keyboardType="decimal-pad"
            placeholder="Ej: 15"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>CINTURA (CM)</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.waistCm}
            onChangeText={v => update('waistCm', v)}
            keyboardType="decimal-pad"
            placeholder="Ej: 80"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>CUELLO (CM)</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.neckCm}
            onChangeText={v => update('neckCm', v)}
            keyboardType="decimal-pad"
            placeholder="Ej: 38"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>CADERA (CM)</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.hipCm}
            onChangeText={v => update('hipCm', v)}
            keyboardType="decimal-pad"
            placeholder="Ej: 95"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>ANOS ENTRENANDO</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.yearsTraining}
            onChangeText={v => update('yearsTraining', v)}
            keyboardType="decimal-pad"
            placeholder="Ej: 3"
            placeholderTextColor={theme.text3}
          />

          <Text style={[st.label, { color: theme.text3 }]}>HORAS DE SUENO</Text>
          <TextInput
            style={[st.input, { borderColor: theme.line, color: theme.text }]}
            value={form.sleepHours}
            onChangeText={v => update('sleepHours', v)}
            keyboardType="decimal-pad"
            placeholder="7"
            placeholderTextColor={theme.text3}
          />
        </View>
      )}

      {stepKey === 'actividad' && (
        <View style={st.section}>
          {ACTIVITY_LEVELS.map(a => (
            <TouchableOpacity
              key={a.key}
              style={[st.activityOption, { borderColor: form.activity === a.key ? theme.accent : theme.line, backgroundColor: form.activity === a.key ? theme.accentSoft : 'transparent' }]}
              onPress={() => update('activity', a.key)}
            >
              <Text style={[st.activityLabel, { color: form.activity === a.key ? theme.text : theme.text2 }]}>{a.label}</Text>
              <Text style={[st.activityDesc, { color: theme.text3 }]}>{a.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {stepKey === 'objetivo' && (
        <View style={st.section}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g}
              style={[st.goalOption, { borderColor: form.goal === g ? theme.accent : theme.line, backgroundColor: form.goal === g ? theme.accentSoft : 'transparent' }]}
              onPress={() => update('goal', g)}
            >
              <Text style={[st.goalLabel, { color: form.goal === g ? theme.text : theme.text2 }]}>
                {GOAL_LABEL[g]}
              </Text>
              <Text style={[st.goalDesc, { color: theme.text3 }]}>
                {g === 'bulk' && 'Superavit calorico +10% para ganar masa muscular'}
                {g === 'cut' && 'Deficit calorico -20% para perder grasa'}
                {g === 'recomp' && 'Calorias de mantenimiento, recomposicion corporal'}
                {g === 'maint' && 'Mantener peso y composicion actual'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={st.btnRow}>
        {step > 0 && (
          <TouchableOpacity style={[st.backBtn, { borderColor: theme.line }]} onPress={back}>
            <Text style={[st.backBtnText, { color: theme.text3 }]}>ATRAS</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[st.nextBtn, { backgroundColor: theme.accent, flex: step > 0 ? 2 : 1 }]} onPress={next} activeOpacity={0.8}>
          <Text style={[st.nextBtnText, { color: theme.bg }]}>
            {step === STEPS.length - 1 ? 'COMENZAR' : 'SIGUIENTE'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, paddingBottom: 60 },

  stepIndicator: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  stepDot: { width: 8, height: 8, borderRadius: 4 },

  title: { fontSize: 28, fontWeight: '300', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 32 },

  section: { marginBottom: 24 },

  label: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '500', marginBottom: 8, marginTop: 16 },
  input: { borderBottomWidth: 1, fontSize: 16, paddingVertical: 10, minHeight: 44 },
  bigInput: { borderBottomWidth: 1, fontSize: 22, fontWeight: '300', paddingVertical: 12, minHeight: 50 },

  chipRow: { flexDirection: 'row', gap: 10 },
  chip: { borderWidth: 1, paddingVertical: 10, paddingHorizontal: 20, minHeight: 44, justifyContent: 'center' },

  activityOption: { borderWidth: 1, padding: 16, marginBottom: 8 },
  activityLabel: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  activityDesc: { fontSize: 12 },

  goalOption: { borderWidth: 1, padding: 16, marginBottom: 8 },
  goalLabel: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  goalDesc: { fontSize: 12, lineHeight: 16 },

  btnRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  backBtn: { flex: 1, borderWidth: 1, paddingVertical: 14, alignItems: 'center' },
  backBtnText: { fontSize: 11, letterSpacing: 2, fontWeight: '500' },
  nextBtn: { paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
});
