import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import theme from '../theme';
import { REFS } from '../data/plan';

export default function FuentesScreen() {
  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      {/* Header */}
      <Text style={s.label}>EVIDENCIA CIENTIFICA</Text>
      <Text style={s.h1}>Fuentes</Text>

      {/* Reference categories */}
      {REFS.map((cat, ci) => (
        <View key={ci} style={s.section}>
          {/* Section label */}
          <View style={s.divider}>
            <Text style={s.dividerLabel}>{cat.c}</Text>
            <View style={s.dividerLine} />
          </View>

          {/* References */}
          {cat.r.map((ref) => (
            <View key={ref.n} style={s.refCard}>
              <Text style={s.refNum}>{ref.n}</Text>
              <Text style={s.refText}>{ref.t}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

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

  /* Section */
  section: {
    marginBottom: 8,
  },

  /* Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
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

  /* Reference card */
  refCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.line,
    padding: 14,
    marginBottom: 8,
  },
  refNum: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.accent,
    width: 32,
    fontVariant: ['tabular-nums'],
  },
  refText: {
    fontSize: 12,
    color: theme.text2,
    flex: 1,
    lineHeight: 18,
  },
});
