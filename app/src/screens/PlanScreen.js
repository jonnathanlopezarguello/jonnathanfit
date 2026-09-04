import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';

function fmt(n) {
  if (n == null || isNaN(n)) return '0';
  const s = String(Math.round(n));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function PlanScreen({ theme }) {
  const profile = getState().profile;
  const c = calc(profile);
  const goalLabel = GOAL_LABEL[profile.goal] || 'Volumen';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Section label */}
      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>
        NUTRICI{'Ó'}N BASADA EN EVIDENCIA
      </Text>

      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>Plan</Text>

      {/* Main Card */}
      <View style={[styles.card, { borderColor: theme.line, backgroundColor: theme.surface }]}>
        <Text style={[styles.cardLabel, { color: theme.text3 }]}>
          OBJETIVO DIARIO {'·'} {goalLabel.toUpperCase()}
        </Text>

        <View style={styles.bigRow}>
          <Text style={[styles.bigNumber, { color: theme.text }]}>
            {fmt(c.kcal)}
          </Text>
          <Text style={[styles.bigUnit, { color: theme.text3 }]}> kcal</Text>
        </View>

        {/* Separator */}
        <View style={{ height: 1, backgroundColor: theme.line, marginVertical: 20 }} />

        {/* 4-column grid */}
        <View style={styles.macroGrid}>
          <View style={styles.macroCol}>
            <Text style={[styles.macroValue, { color: theme.text }]}>{c.protein}</Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>Prot</Text>
          </View>
          <View style={styles.macroCol}>
            <Text style={[styles.macroValue, { color: theme.text }]}>{c.carbs}</Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>Carb</Text>
          </View>
          <View style={styles.macroCol}>
            <Text style={[styles.macroValue, { color: theme.text }]}>{c.fat}</Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>Grasa</Text>
          </View>
          <View style={styles.macroCol}>
            <Text style={[styles.macroValue, { color: theme.good }]}>{c.fiber}</Text>
            <Text style={[styles.macroLabel, { color: theme.text3 }]}>Fibra</Text>
          </View>
        </View>
      </View>

      {/* Evidence Card 1 */}
      <View style={[styles.card, { borderColor: theme.line, backgroundColor: theme.surface }]}>
        <Text style={[styles.evidenceText, { color: theme.text2 }]}>
          2.0 g de prote{'í'}na por kg para maximizar la s{'í'}ntesis muscular en super{'á'}vit.
        </Text>
        <Text style={[styles.citation, { color: theme.text3 }]}>
          MORTON ET AL. 2018 {'·'} BJSM
        </Text>
      </View>

      {/* Evidence Card 2 */}
      <View style={[styles.card, { borderColor: theme.line, backgroundColor: theme.surface }]}>
        <Text style={[styles.evidenceText, { color: theme.text2 }]}>
          Super{'á'}vit de +10 % sobre el TDEE para ganancia magra controlada.
        </Text>
        <Text style={[styles.citation, { color: theme.text3 }]}>
          ISSN POSITION STAND 2017
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '300',
    marginBottom: 24,
  },

  /* Cards */
  card: {
    borderWidth: 1,
    borderRadius: 0,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '500',
    marginBottom: 16,
  },

  /* Big number */
  bigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigNumber: {
    fontSize: 44,
    fontWeight: '300',
  },
  bigUnit: {
    fontSize: 14,
    fontWeight: '400',
  },

  /* Macro grid */
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCol: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
  },

  /* Evidence */
  evidenceText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    marginBottom: 12,
  },
  citation: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
});
