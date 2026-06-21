import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';
import { spacing } from '../theme';
import { getState } from '../store';
import { calc, e1rm } from '../data/calc';
import { MUSCLE_GROUPS, VOL_RANGE, MUSCLE, TEMPLATES } from '../data/templates';

/* ── SVG path data ── */
const SKELETON = {
  head: 'M80 12 C90 12 96 20 96 32 C96 42 90 48 80 48 C70 48 64 42 64 32 C64 20 70 12 80 12Z',
  neck: 'M66 48 L94 48 Q104 50 108 58 L108 60 Q108 62 106 62 L54 62 Q52 62 52 60 L52 58 Q56 50 66 48Z',
  forearmL: 'M30 134 L26 170 Q24 178 28 178 L38 176 L44 132Z',
  forearmR: 'M130 134 L134 170 Q136 178 132 178 L122 176 L116 132Z',
  feetL: 'M56 306 L54 340 Q54 348 60 348 L68 348 Q72 348 72 340 L70 306Z',
  feetR: 'M104 306 L106 340 Q106 348 100 348 L92 348 Q88 348 88 340 L90 306Z',
};

const FRONT_MUSCLES = {
  'Hombro': [
    { d: 'M44 62 Q38 64 36 72 Q34 82 38 86 L52 82 L52 62Z', label: 'L' },
    { d: 'M116 62 Q122 64 124 72 Q126 82 122 86 L108 82 L108 62Z', label: 'R' },
  ],
  'Pecho': [
    { d: 'M54 64 Q56 60 80 60 Q104 60 106 64 L106 90 Q100 96 80 96 Q60 96 54 90Z' },
  ],
  'Bíceps': [
    { d: 'M38 88 Q34 90 32 100 L30 126 Q30 132 34 132 L44 130 Q48 126 46 100 Q46 90 44 86Z', label: 'L' },
    { d: 'M122 88 Q126 90 128 100 L130 126 Q130 132 126 132 L116 130 Q112 126 114 100 Q114 90 116 86Z', label: 'R' },
  ],
  'Abdomen': [
    { d: 'M62 98 L98 98 Q100 100 100 104 L100 152 Q96 160 80 162 Q64 160 60 152 L60 104 Q60 100 62 98Z' },
  ],
  'Cuádriceps': [
    { d: 'M58 162 Q56 166 54 190 L52 230 Q52 240 56 244 L72 244 Q76 240 76 230 L78 190 Q78 170 76 162Z', label: 'L' },
    { d: 'M102 162 Q104 166 106 190 L108 230 Q108 240 104 244 L88 244 Q84 240 84 230 L82 190 Q82 170 84 162Z', label: 'R' },
  ],
  'Gemelo': [
    { d: 'M54 248 Q50 258 50 274 Q50 296 56 304 L68 304 Q74 296 72 274 Q72 258 70 248Z', label: 'L' },
    { d: 'M106 248 Q110 258 110 274 Q110 296 104 304 L92 304 Q86 296 88 274 Q88 258 90 248Z', label: 'R' },
  ],
};

const BACK_MUSCLES = {
  'Hombro': FRONT_MUSCLES['Hombro'],
  'Espalda': [
    { d: 'M54 64 Q56 60 80 60 Q104 60 106 64 L108 98 Q104 108 94 112 L80 116 L66 112 Q56 108 52 98Z', opacity: 1 },
    { d: 'M58 112 Q62 116 80 118 Q98 116 102 112 L100 148 Q96 156 80 158 Q64 156 60 148Z', opacity: 0.7 },
  ],
  'Tríceps': [
    { d: 'M38 88 Q34 90 32 100 L30 126 Q30 132 34 132 L44 130 Q48 126 46 100 Q46 90 44 86Z', label: 'L' },
    { d: 'M122 88 Q126 90 128 100 L130 126 Q130 132 126 132 L116 130 Q112 126 114 100 Q114 90 116 86Z', label: 'R' },
  ],
  'Femoral y glúteo': [
    { d: 'M58 152 Q56 156 60 162 Q68 170 80 170 Q92 170 100 162 Q104 156 102 152Z', opacity: 0.85 },
    { d: 'M58 170 Q56 176 54 200 L52 236 Q52 244 58 244 L74 244 Q78 240 78 230 L78 196 Q78 178 76 170Z', label: 'L' },
    { d: 'M102 170 Q104 176 106 200 L108 236 Q108 244 102 244 L86 244 Q82 240 82 230 L82 196 Q82 178 84 170Z', label: 'R' },
  ],
  'Gemelo': FRONT_MUSCLES['Gemelo'],
};

/* ── Component ── */
export default function ProgresoScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [view, setView] = useState('front'); // 'front' | 'back'
  const [selMuscle, setSelMuscle] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => { setState(getState()); }, []);

  // Pulse animation for "over" / lacking muscles
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  /* Weekly volume calc */
  const now = Date.now(), cut = now - 7 * 864e5;
  const weekWorkouts = state.workouts.filter(w => new Date(w.date).getTime() >= cut);

  function weeklyVol() {
    const vol = {};
    MUSCLE_GROUPS.forEach(g => (vol[g] = 0));
    weekWorkouts.forEach(w =>
      w.exercises.forEach(e => {
        const g = MUSCLE[e.name];
        if (g && vol[g] !== undefined) vol[g] += e.sets.filter(s => s.done).length;
      }),
    );
    return vol;
  }

  const vol = weeklyVol();

  function muscleColor(group) {
    const v = vol[group] || 0;
    const min = (VOL_RANGE[group] || [10, 20])[0];
    if (min <= 0) return theme.text2;
    const pct = v / min;
    if (pct >= 1) return theme.good;
    if (pct >= 0.5) return theme.text2;
    return theme.over;
  }

  function muscleStatus(group) {
    const v = vol[group] || 0;
    const min = (VOL_RANGE[group] || [10, 20])[0];
    if (min <= 0) return 'met';
    const pct = v / min;
    if (pct >= 1) return 'met';
    if (pct >= 0.5) return 'almost';
    return 'lacking';
  }

  /* Bodyweight */
  const bw = state.bodyweight.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const lastW = bw[bw.length - 1];
  const firstW = bw[0];
  const diff = lastW && firstW ? (lastW.kg - firstW.kg) : null;

  /* Force records */
  const records = {};
  state.workouts.forEach(w =>
    w.exercises.forEach(e =>
      e.sets.forEach(s => {
        if (!s.done) return;
        const best = e1rm(+s.kg, +s.reps);
        if (!records[e.name] || best > records[e.name]) records[e.name] = best;
      }),
    ),
  );
  const topRecords = Object.entries(records)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  /* Render muscle map */
  const muscleData = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;

  function renderMusclePaths() {
    const paths = [];
    Object.entries(muscleData).forEach(([group, parts]) => {
      const color = muscleColor(group);
      const status = muscleStatus(group);
      parts.forEach((p, i) => {
        const opacity = p.opacity !== undefined ? p.opacity : 1;
        if (status === 'lacking') {
          paths.push(
            <PulsingPath
              key={group + i}
              d={p.d}
              fill={color}
              baseOpacity={opacity}
              pulseAnim={pulseAnim}
              onPress={() => setSelMuscle(selMuscle === group ? null : group)}
            />,
          );
        } else {
          paths.push(
            <Path
              key={group + i}
              d={p.d}
              fill={color}
              opacity={opacity}
              onPress={() => setSelMuscle(selMuscle === group ? null : group)}
            />,
          );
        }
      });
    });
    return paths;
  }

  const selData = selMuscle
    ? { sets: vol[selMuscle] || 0, min: (VOL_RANGE[selMuscle] || [10, 20])[0] }
    : null;

  const selExInfo = (() => {
    if (!selMuscle) return null;
    const allExForMuscle = [];
    Object.entries(TEMPLATES).forEach(([day, exs]) => {
      exs.forEach(e => { if (e.g === selMuscle) allExForMuscle.push({ name: e.n, day }); });
    });
    const doneExNames = new Set();
    weekWorkouts.forEach(w => w.exercises.forEach(e => {
      if (e.sets && e.sets.some(s => s.done)) doneExNames.add(e.name);
    }));
    const remaining = allExForMuscle.filter(e => !doneExNames.has(e.name));
    const doneCount = allExForMuscle.filter(e => doneExNames.has(e.name)).length;
    return { total: allExForMuscle.length, doneCount, remaining };
  })();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={[styles.supra, { color: theme.text3 }]}>TENDENCIA</Text>
      <Text style={[styles.title, { color: theme.text }]}>Progreso</Text>

      {/* Muscle map card */}
      <View style={[styles.card, { borderColor: theme.line }]}>
        {/* Card header */}
        <View style={styles.mapHeader}>
          <Text style={[styles.mapLabel, { color: theme.text3 }]}>VOLUMEN SEMANAL</Text>
          <View style={[styles.segmented, { borderColor: theme.line }]}>
            <TouchableOpacity
              style={[styles.seg, view === 'front' && { backgroundColor: theme.accent }]}
              onPress={() => setView('front')}
            >
              <Text style={[styles.segText, { color: theme.text3 }, view === 'front' && { color: theme.bg }]}>
                FRONTAL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.seg, view === 'back' && { backgroundColor: theme.accent }]}
              onPress={() => setView('back')}
            >
              <Text style={[styles.segText, { color: theme.text3 }, view === 'back' && { color: theme.bg }]}>
                POSTERIOR
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SVG body */}
        <View style={styles.svgWrap}>
          <Svg width={160} height={360} viewBox="0 0 160 360">
            {/* Skeleton */}
            <G opacity={0.14}>
              {Object.values(SKELETON).map((d, i) => (
                <Path key={'sk' + i} d={d} fill={theme.text3} />
              ))}
            </G>
            {/* Muscles */}
            <G>{renderMusclePaths()}</G>
          </Svg>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSq, { backgroundColor: theme.good }]} />
            <Text style={[styles.legendText, { color: theme.text3 }]}>Cumplido</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSq, { backgroundColor: theme.text2 }]} />
            <Text style={[styles.legendText, { color: theme.text3 }]}>Casi</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSq, { backgroundColor: theme.over }]} />
            <Text style={[styles.legendText, { color: theme.text3 }]}>Falta</Text>
          </View>
        </View>

        {/* Tap hint or selection */}
        {selMuscle && selData && selExInfo ? (
          <View style={styles.selInfo}>
            <Text style={[styles.selName, { color: theme.text }]}>{selMuscle}</Text>
            <Text style={[styles.selSeries, { color: theme.text2 }]}>
              {selData.sets + ' / ' + selData.min + ' series'}
            </Text>
            <Text style={[styles.selSeries, { color: theme.text2, marginTop: 4 }]}>
              {selExInfo.doneCount + ' / ' + selExInfo.total + ' ejercicios completados'}
            </Text>
            {selExInfo.remaining.length === 0 ? (
              <Text style={[styles.selRemaining, { color: theme.good, marginTop: 4 }]}>
                {'Todos los ejercicios completados'}
              </Text>
            ) : (
              <View style={{ marginTop: 4 }}>
                {selExInfo.remaining.map((e, i) => (
                  <Text key={i} style={[styles.selRemaining, { color: theme.text3 }]}>
                    {e.name + ' (' + e.day + ')'}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={[styles.tapHint, { color: theme.text3 }]}>
            {'Toca un músculo para ver tus series de la semana.'}
          </Text>
        )}
      </View>

      {/* Weight card */}
      <Text style={[styles.sectionLabel, { color: theme.text3 }]}>PESO CORPORAL</Text>
      <View style={[styles.card, { borderColor: theme.line }]}>
        <Text style={[styles.bigWeight, { color: theme.text }]}>
          {lastW ? lastW.kg.toFixed(1) : '---'}
          <Text style={[styles.weightUnit, { color: theme.text3 }]}>{' kg'}</Text>
        </Text>
        {diff !== null && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.good + '29' },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.good }]}>
              {(diff > 0 ? '+' : '') + diff.toFixed(1) + ' KG · EN RANGO'}
            </Text>
          </View>
        )}
      </View>

      {/* Force records */}
      {topRecords.length > 0 && (
        <>
          <Text style={[styles.sectionLabel, { color: theme.text3 }]}>REGISTROS DE FUERZA</Text>
          <View style={[styles.card, { borderColor: theme.line }]}>
            {topRecords.map(([name, best], i) => (
              <View
                key={name}
                style={[
                  styles.recordRow,
                  i < topRecords.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line },
                ]}
              >
                <Text style={[styles.recordName, { color: theme.text }]}>{name}</Text>
                <Text style={[styles.recordVal, { color: theme.text }]}>{best + ' kg'}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

/* Animated pulsing path */
const AnimatedSvgPath = Animated.createAnimatedComponent(Path);

function PulsingPath({ d, fill, baseOpacity, pulseAnim, onPress }) {
  const opacity = useRef(Animated.multiply(pulseAnim, new Animated.Value(baseOpacity))).current;
  return <AnimatedSvgPath d={d} fill={fill} opacity={opacity} onPress={onPress} />;
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

  card: {
    borderWidth: 1,
    borderRadius: 0,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },

  /* Map header */
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mapLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 0,
  },
  seg: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  segText: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '500',
  },

  /* SVG wrapper */
  svgWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  /* Legend */
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSq: {
    width: 10,
    height: 10,
    borderRadius: 0,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    letterSpacing: 1,
  },

  tapHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  selInfo: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  selName: {
    fontSize: 14,
    fontWeight: '500',
  },
  selSeries: {
    fontSize: 13,
    marginTop: 2,
  },
  selRemaining: {
    fontSize: 11,
    lineHeight: 16,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  /* Weight */
  bigWeight: {
    fontSize: 34,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  weightUnit: {
    fontSize: 16,
    fontWeight: '300',
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 0,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '500',
  },

  /* Records */
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recordName: { fontSize: 13 },
  recordVal: {
    fontSize: 14,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
});
