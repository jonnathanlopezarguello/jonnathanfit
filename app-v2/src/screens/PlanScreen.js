import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';
import { calc, GL } from '../utils';
import { T, DT, PD } from '../data/exercises';
import { load, KEYS } from '../store';

const DEFAULT_PROFILE = {
  weight: 79, height: 176, age: 25, sex: 'male',
  activity: 1.55, goal: 'bulk', ppk: 2, fpk: 1,
};

export default function PlanScreen() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      const p = await load(KEYS.profile);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...p });
    })();
  }, []);

  const targets = calc(profile);

  return (
    <View style={s.root}>
      {/* Header */}
      <Text style={s.label}>NUTRICION BASADA EN EVIDENCIA</Text>
      <Text style={s.h1}>Plan</Text>

      {/* Daily target card */}
      <View style={s.card}>
        <Text style={s.cardLabel}>OBJETIVO DIARIO</Text>
        <Text style={s.kcalBig}>{targets.kcal}</Text>
        <Text style={s.kcalUnit}>kcal / dia</Text>

        <View style={s.macroGrid}>
          <View style={s.macroItem}>
            <Text style={s.macroValue}>{targets.protein}g</Text>
            <Text style={s.macroName}>Protein</Text>
          </View>
          <View style={s.macroItem}>
            <Text style={s.macroValue}>{targets.carbs}g</Text>
            <Text style={s.macroName}>Carbs</Text>
          </View>
          <View style={s.macroItem}>
            <Text style={s.macroValue}>{targets.fat}g</Text>
            <Text style={s.macroName}>Fat</Text>
          </View>
          <View style={s.macroItem}>
            <Text style={s.macroValue}>{targets.fiber}g</Text>
            <Text style={s.macroName}>Fiber</Text>
          </View>
        </View>

        <View style={s.goalBadge}>
          <Text style={s.goalText}>{GL[profile.goal] || profile.goal}</Text>
          <Text style={s.goalSub}>{profile.weight} kg  ·  x{profile.activity}</Text>
        </View>
      </View>

      {/* Evidence card 1 */}
      <View style={s.evidenceCard}>
        <Text style={s.evidenceText}>
          2.0 g de proteina por kg para maximizar la sintesis muscular en superavit.
        </Text>
        <Text style={s.evidenceSource}>MORTON ET AL. 2018  ·  BJSM</Text>
      </View>

      {/* Evidence card 2 */}
      <View style={s.evidenceCard}>
        <Text style={s.evidenceText}>
          Superavit de +10% sobre el TDEE para ganancia magra controlada.
        </Text>
        <Text style={s.evidenceSource}>ISSN POSITION STAND 2017</Text>
      </View>

      {/* Training plan section */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>PLAN DE ENTRENAMIENTO SEMANAL</Text>
        <View style={s.dividerLine} />
      </View>

      {PD.map((day) => {
        const exercises = T[day];
        const title = DT[day];
        // Group exercises by muscle group
        const groups = {};
        exercises.forEach((ex) => {
          if (!groups[ex.g]) groups[ex.g] = [];
          groups[ex.g].push(ex);
        });

        return (
          <View key={day} style={s.dayCard}>
            <View style={s.dayHeader}>
              <Text style={s.dayName}>{day}</Text>
              <Text style={s.dayTitle}>{title}</Text>
            </View>

            {Object.keys(groups).map((group) => (
              <View key={group} style={s.groupBlock}>
                <Text style={s.groupLabel}>{group.toUpperCase()}</Text>
                {groups[group].map((ex, i) => (
                  <View key={i} style={s.exRow}>
                    <Text style={s.exNum}>{i + 1}</Text>
                    <View style={s.exInfo}>
                      <Text style={s.exName}>{ex.n}</Text>
                      <Text style={s.exDetail}>
                        {ex.s}x{ex.r}  ·  RIR {ex.ri}  ·  {ex.g}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },

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

  /* Card */
  card: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 20,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 12,
  },
  kcalBig: {
    fontSize: 44,
    fontWeight: '200',
    color: theme.text,
    fontVariant: ['tabular-nums'],
  },
  kcalUnit: {
    fontSize: 12,
    color: theme.text3,
    letterSpacing: 1,
    marginBottom: 20,
  },

  /* Macro grid */
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    fontVariant: ['tabular-nums'],
  },
  macroName: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.text3,
    marginTop: 2,
  },

  /* Goal badge */
  goalBadge: {
    borderTopWidth: 1,
    borderTopColor: theme.line,
    paddingTop: 12,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.accent,
  },
  goalSub: {
    fontSize: 11,
    color: theme.text3,
    marginTop: 4,
  },

  /* Evidence cards */
  evidenceCard: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
    marginBottom: 12,
    backgroundColor: theme.accentSoft,
  },
  evidenceText: {
    fontSize: 13,
    color: theme.text,
    lineHeight: 19,
    marginBottom: 8,
  },
  evidenceSource: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: theme.text3,
  },

  /* Section divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
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

  /* Day card */
  dayCard: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
    marginBottom: 14,
  },
  dayHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    paddingBottom: 10,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 1,
    marginBottom: 2,
  },
  dayTitle: {
    fontSize: 12,
    color: theme.text2,
  },

  /* Group block */
  groupBlock: {
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 6,
    marginTop: 4,
  },

  /* Exercise row */
  exRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  exNum: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text3,
    width: 20,
    marginTop: 2,
  },
  exInfo: {
    flex: 1,
  },
  exName: {
    fontSize: 13,
    color: theme.text,
  },
  exDetail: {
    fontSize: 11,
    color: theme.text3,
    marginTop: 2,
  },
});
