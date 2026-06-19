import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { getState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';

export default function PerfilScreen({ theme }) {
  const [state, setState] = useState(getState());
  useEffect(() => { setState(getState()); }, []);

  const p = state.profile;
  const t = calc(p);

  const rows = [
    { label: 'Nombre', value: p.name || '---' },
    { label: 'Edad · Sexo', value: (p.age || '---') + ' · ' + (p.sex === 'male' ? 'Hombre' : 'Mujer') },
    { label: 'Peso · Altura', value: (p.weight || '---') + ' kg · ' + (p.height || '---') + ' cm', tabular: true },
    { label: 'Objetivo', value: (GOAL_LABEL[p.goal] || '---') + ' · +10 %' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={[styles.supra, { color: theme.text3 }]}>DATOS Y OBJETIVOS</Text>
      <Text style={[styles.title, { color: theme.text }]}>Perfil</Text>

      {/* Data table card */}
      <View style={[styles.tableCard, { borderColor: theme.line }]}>
        {rows.map((r, i) => (
          <View
            key={r.label}
            style={[
              styles.tableRow,
              i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line },
            ]}
          >
            <Text style={[styles.rowLabel, { color: theme.text3 }]}>{r.label}</Text>
            <Text
              style={[
                styles.rowValue,
                { color: theme.text },
                r.tabular && styles.tabular,
              ]}
            >
              {r.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Metabolism section */}
      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>
        {'METABOLISMO · MIFFLIN-ST JEOR'}
      </Text>
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

      {/* Edit button */}
      <TouchableOpacity
        style={[styles.editBtn, { borderColor: theme.over + '80' }]}
      >
        <Text style={[styles.editBtnText, { color: theme.over }]}>EDITAR PERFIL</Text>
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

  /* Data table */
  tableCard: {
    borderWidth: 1,
    borderRadius: 0,
    marginBottom: spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  rowLabel: {
    fontSize: 13,
  },
  rowValue: {
    fontSize: 13,
    textAlign: 'right',
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },

  /* Section label */
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  /* Metabolism card */
  metaCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 0,
    marginBottom: spacing.lg,
  },
  metaCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  metaNum: {
    fontSize: 24,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  metaLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },

  /* Edit button */
  editBtn: {
    borderWidth: 1,
    borderRadius: 0,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
