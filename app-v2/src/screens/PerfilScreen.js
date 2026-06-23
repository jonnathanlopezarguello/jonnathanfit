import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../theme';
import { calc, GL, DEFAULT_PROFILE } from '../utils';
import { load, save, KEYS } from '../store';

const SEX_OPTS = [
  { k: 'male', l: 'Hombre' },
  { k: 'female', l: 'Mujer' },
];

const GOAL_OPTS = [
  { k: 'bulk', l: 'Volumen' },
  { k: 'cut', l: 'Definicion' },
  { k: 'recomp', l: 'Recomposicion' },
  { k: 'maint', l: 'Mantenimiento' },
];

const ACTIVITY_OPTS = [
  { k: 1.2, l: 'Sedentario' },
  { k: 1.375, l: 'Ligero' },
  { k: 1.55, l: 'Moderado' },
  { k: 1.725, l: 'Activo' },
  { k: 1.9, l: 'Muy activo' },
];

const STRESS_OPTS = [
  { k: 'bajo', l: 'Bajo' },
  { k: 'medio', l: 'Medio' },
  { k: 'alto', l: 'Alto' },
];

export default function PerfilScreen() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      const p = await load(KEYS.profile);
      if (p) {
        const merged = { ...DEFAULT_PROFILE, ...p };
        setProfile(merged);
        setForm(merged);
      }
    })();
  }, []);

  const targets = calc(profile);

  const startEdit = () => {
    setForm({ ...profile });
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  const saveProfile = async () => {
    const cleaned = {
      ...form,
      age: +form.age || DEFAULT_PROFILE.age,
      weight: +form.weight || DEFAULT_PROFILE.weight,
      height: +form.height || DEFAULT_PROFILE.height,
      ppk: +form.ppk || DEFAULT_PROFILE.ppk,
      fpk: +form.fpk || DEFAULT_PROFILE.fpk,
    };
    setProfile(cleaned);
    await save(KEYS.profile, cleaned);
    setEditing(false);
  };

  const resetData = () => {
    Alert.alert(
      'Reiniciar datos',
      'Se eliminaran todos los datos almacenados (entrenamientos, nutricion, perfil). Esta accion no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(Object.values(KEYS));
            setProfile(DEFAULT_PROFILE);
            setForm(DEFAULT_PROFILE);
          },
        },
      ]
    );
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ─── EDIT MODE ───────────────────────────────────
  if (editing) {
    return (
      <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
        <Text style={s.label}>EDITAR PERFIL</Text>
        <Text style={s.h1}>Datos</Text>

        {/* Text inputs */}
        <View style={s.card}>
          <Text style={s.inputLabel}>NOMBRE</Text>
          <TextInput
            style={s.input}
            value={form.name}
            onChangeText={(v) => updateForm('name', v)}
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>EDAD</Text>
          <TextInput
            style={s.input}
            value={String(form.age)}
            onChangeText={(v) => updateForm('age', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>PESO (kg)</Text>
          <TextInput
            style={s.input}
            value={String(form.weight)}
            onChangeText={(v) => updateForm('weight', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>ESTATURA (cm)</Text>
          <TextInput
            style={s.input}
            value={String(form.height)}
            onChangeText={(v) => updateForm('height', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />
        </View>

        {/* Sex chips */}
        <View style={s.card}>
          <Text style={s.inputLabel}>SEXO</Text>
          <View style={s.chipRow}>
            {SEX_OPTS.map((opt) => (
              <TouchableOpacity
                key={opt.k}
                style={[s.chip, form.sex === opt.k && s.chipActive]}
                onPress={() => updateForm('sex', opt.k)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, form.sex === opt.k && s.chipTextActive]}>{opt.l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.inputLabel}>OBJETIVO</Text>
          <View style={s.chipRow}>
            {GOAL_OPTS.map((opt) => (
              <TouchableOpacity
                key={opt.k}
                style={[s.chip, form.goal === opt.k && s.chipActive]}
                onPress={() => updateForm('goal', opt.k)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, form.goal === opt.k && s.chipTextActive]}>{opt.l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.inputLabel}>NIVEL DE ACTIVIDAD</Text>
          <View style={s.chipRow}>
            {ACTIVITY_OPTS.map((opt) => (
              <TouchableOpacity
                key={opt.k}
                style={[s.chip, form.activity === opt.k && s.chipActive]}
                onPress={() => updateForm('activity', opt.k)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, form.activity === opt.k && s.chipTextActive]}>{opt.l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.inputLabel}>NIVEL DE ESTRES</Text>
          <View style={s.chipRow}>
            {STRESS_OPTS.map((opt) => (
              <TouchableOpacity
                key={opt.k}
                style={[s.chip, form.sl === opt.k && s.chipActive]}
                onPress={() => updateForm('sl', opt.k)}
                activeOpacity={0.7}
              >
                <Text style={[s.chipText, form.sl === opt.k && s.chipTextActive]}>{opt.l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Body composition inputs */}
        <View style={s.card}>
          <Text style={s.cardTitle}>COMPOSICION CORPORAL</Text>

          <Text style={s.inputLabel}>% GRASA CORPORAL</Text>
          <TextInput
            style={s.input}
            value={String(form.bf)}
            onChangeText={(v) => updateForm('bf', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>CINTURA (cm)</Text>
          <TextInput
            style={s.input}
            value={String(form.wc)}
            onChangeText={(v) => updateForm('wc', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>CUELLO (cm)</Text>
          <TextInput
            style={s.input}
            value={String(form.nc)}
            onChangeText={(v) => updateForm('nc', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>CADERA (cm)</Text>
          <TextInput
            style={s.input}
            value={String(form.hc)}
            onChangeText={(v) => updateForm('hc', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>ANOS ENTRENANDO</Text>
          <TextInput
            style={s.input}
            value={String(form.yt)}
            onChangeText={(v) => updateForm('yt', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />

          <Text style={s.inputLabel}>HORAS DE SUENO</Text>
          <TextInput
            style={s.input}
            value={String(form.sh)}
            onChangeText={(v) => updateForm('sh', v)}
            keyboardType="numeric"
            placeholderTextColor={theme.text3}
          />
        </View>

        {/* Action buttons */}
        <View style={s.editActions}>
          <TouchableOpacity style={s.cancelBtn} onPress={cancelEdit} activeOpacity={0.7}>
            <Text style={s.cancelBtnText}>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.saveBtn} onPress={saveProfile} activeOpacity={0.7}>
            <Text style={s.saveBtnText}>GUARDAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ─── VIEW MODE ───────────────────────────────────
  const sexLabel = form.sex === 'male' ? 'Hombre' : 'Mujer';
  const actLabel = ACTIVITY_OPTS.find((o) => o.k === profile.activity);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      {/* Header */}
      <Text style={s.label}>DATOS Y OBJETIVOS</Text>
      <Text style={s.h1}>Perfil</Text>

      {/* Basic data */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>DATOS BASICOS</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <InfoRow label="Nombre" value={profile.name} />
        <InfoRow label="Edad" value={profile.age + ' anos'} />
        <InfoRow label="Sexo" value={sexLabel} />
        <InfoRow label="Peso" value={profile.weight + ' kg'} />
        <InfoRow label="Estatura" value={profile.height + ' cm'} />
        <InfoRow label="Objetivo" value={GL[profile.goal] || profile.goal} last />
      </View>

      {/* Body composition */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>COMPOSICION CORPORAL</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <InfoRow label="% Grasa" value={profile.bf + '%'} />
        <InfoRow label="Cintura" value={profile.wc + ' cm'} />
        <InfoRow label="Cuello" value={profile.nc + ' cm'} />
        <InfoRow label="Cadera" value={profile.hc + ' cm'} last />
      </View>

      {/* Lifestyle */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>ESTILO DE VIDA</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <InfoRow label="Actividad" value={actLabel ? actLabel.l + ' (x' + profile.activity + ')' : 'x' + profile.activity} />
        <InfoRow label="Anos entrenando" value={profile.yt} />
        <InfoRow label="Horas sueno" value={profile.sh + ' h'} />
        <InfoRow label="Estres" value={profile.sl || '-'} last />
      </View>

      {/* Metabolism */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>METABOLISMO</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.metaRow}>
        <View style={s.metaBox}>
          <Text style={s.metaValue}>{targets.bmr}</Text>
          <Text style={s.metaLabel}>BMR</Text>
        </View>
        <View style={s.metaBox}>
          <Text style={s.metaValue}>{targets.tdee}</Text>
          <Text style={s.metaLabel}>TDEE</Text>
        </View>
        <View style={[s.metaBox, { borderColor: theme.accent }]}>
          <Text style={s.metaValue}>{targets.kcal}</Text>
          <Text style={s.metaLabel}>OBJETIVO</Text>
        </View>
      </View>

      {/* Action buttons */}
      <TouchableOpacity style={s.editBtn} onPress={startEdit} activeOpacity={0.7}>
        <Text style={s.editBtnText}>EDITAR PERFIL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.measureBtn} activeOpacity={0.7}>
        <Text style={s.measureBtnText}>MEDIR PROGRESO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.resetBtn} onPress={resetData} activeOpacity={0.7}>
        <Text style={s.resetBtnText}>REINICIAR DATOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <View style={[infoStyles.row, !last && infoStyles.border]}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  label: {
    fontSize: 13,
    color: theme.text3,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.text,
  },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  rootPad: { padding: 24, paddingBottom: 60 },

  /* Header */
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 6,
  },
  h1: {
    fontSize: 30,
    fontWeight: '200',
    color: theme.text,
    marginBottom: 24,
  },

  /* Section divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginRight: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.line,
  },

  /* Card */
  card: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 12,
  },

  /* Metabolism boxes */
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  metaBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 14,
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    fontVariant: ['tabular-nums'],
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginTop: 4,
  },

  /* Action buttons */
  editBtn: {
    borderWidth: 1,
    borderColor: theme.over,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.over,
  },

  measureBtn: {
    borderWidth: 1,
    borderColor: theme.line2,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  measureBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text2,
  },

  resetBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
  },

  /* Edit mode */
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 10,
    color: theme.text,
    fontSize: 14,
    marginBottom: 4,
  },

  /* Chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.line2,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentSoft,
  },
  chipText: {
    fontSize: 12,
    color: theme.text3,
  },
  chipTextActive: {
    color: theme.text,
  },

  /* Edit actions */
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.line2,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text3,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: theme.accent,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.bg,
  },
});
