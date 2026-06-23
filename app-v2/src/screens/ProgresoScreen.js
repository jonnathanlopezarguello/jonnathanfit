import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../theme';
import { load, KEYS } from '../store';
import { T, DT } from '../data/exercises';
import { SKEL, FM, BM, VR } from '../data/bodymap';
import { DEFAULT_PROFILE } from '../utils';

export default function ProgresoScreen() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [workouts, setWorkouts] = useState([]);
  const [view, setView] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await load(KEYS.profile);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...p });
      const w = await load(KEYS.workouts);
      if (w) setWorkouts(w);
    })();
  }, []);

  // Build exercise-to-muscle-group map from training data
  const exToGroup = {};
  Object.values(T).forEach((dayExercises) => {
    dayExercises.forEach((ex) => {
      exToGroup[ex.n] = ex.g;
    });
  });

  // Calculate weekly volume (sets per muscle group) from workout history
  // Consider workouts from the last 7 days
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoISO = weekAgo.toISOString().slice(0, 10);

  const volumeMap = {};
  Object.keys(VR).forEach((g) => { volumeMap[g] = 0; });

  workouts.forEach((w) => {
    if (w.dt >= weekAgoISO) {
      (w.ex || []).forEach((exercise) => {
        const group = exToGroup[exercise.name];
        if (group && volumeMap[group] !== undefined) {
          volumeMap[group] += (exercise.sets || []).length;
        }
      });
    }
  });

  // Determine muscle color by volume status
  const muscleColor = (group) => {
    const vol = volumeMap[group] || 0;
    const range = VR[group];
    if (!range) return theme.text3;
    if (vol >= range[0]) return theme.good;
    if (vol >= range[0] * 0.6) return theme.text3;
    return theme.over;
  };

  const muscleStatus = (group) => {
    const vol = volumeMap[group] || 0;
    const range = VR[group];
    if (!range) return 'unknown';
    if (vol >= range[0]) return 'met';
    if (vol >= range[0] * 0.6) return 'almost';
    return 'lacking';
  };

  // Muscle map to render (front or back)
  const muscleMap = view === 'front' ? FM : BM;

  // Calculate estimated 1RM from workout history
  const records = {};
  workouts.forEach((w) => {
    (w.ex || []).forEach((exercise) => {
      (exercise.sets || []).forEach((set) => {
        const kg = parseFloat(set.kg);
        const rp = parseFloat(set.rp);
        if (kg > 0 && rp > 0) {
          const e1rm = Math.round(kg * (1 + rp / 30));
          if (!records[exercise.name] || e1rm > records[exercise.name]) {
            records[exercise.name] = e1rm;
          }
        }
      });
    });
  });

  // Top 8 records
  const topRecords = Object.entries(records)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Weekend reinforcement: muscle groups below minimum volume
  const lacking = Object.entries(VR)
    .filter(([group]) => {
      const vol = volumeMap[group] || 0;
      return vol < VR[group][0];
    })
    .map(([group, range]) => {
      const vol = volumeMap[group] || 0;
      const deficit = range[0] - vol;
      // Find exercises for this group
      const exercises = [];
      Object.values(T).forEach((dayExercises) => {
        dayExercises.forEach((ex) => {
          if (ex.g === group && !exercises.find((e) => e.n === ex.n)) {
            exercises.push(ex);
          }
        });
      });
      return { group, vol, min: range[0], deficit, exercises: exercises.slice(0, 2) };
    });

  return (
    <View style={s.root}>
      {/* Header */}
      <Text style={s.label}>TENDENCIA</Text>
      <Text style={s.h1}>Progreso</Text>

      {/* Volume section */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>VOLUMEN SEMANAL</Text>
        <View style={s.dividerLine} />
      </View>

      {/* Front/Back toggle */}
      <View style={s.toggleRow}>
        <TouchableOpacity
          style={[s.toggleBtn, view === 'front' && s.toggleBtnActive]}
          onPress={() => setView('front')}
          activeOpacity={0.7}
        >
          <Text style={[s.toggleTxt, view === 'front' && s.toggleTxtActive]}>FRONTAL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, view === 'back' && s.toggleBtnActive]}
          onPress={() => setView('back')}
          activeOpacity={0.7}
        >
          <Text style={[s.toggleTxt, view === 'back' && s.toggleTxtActive]}>POSTERIOR</Text>
        </TouchableOpacity>
      </View>

      {/* SVG Body Map */}
      <View style={s.card}>
        <View style={s.mapWrap}>
          <Svg width={200} height={450} viewBox="0 0 160 360">
            {/* Skeleton */}
            {SKEL.map((d, i) => (
              <Path key={'sk' + i} d={d} fill={theme.text3} opacity={0.14} />
            ))}

            {/* Muscle groups */}
            {Object.entries(muscleMap).map(([group, paths]) =>
              paths.map((p, i) => (
                <Path
                  key={group + i}
                  d={p.d}
                  fill={muscleColor(group)}
                  opacity={p.o || 1}
                  onPress={() => setSelectedMuscle(selectedMuscle === group ? null : group)}
                />
              ))
            )}
          </Svg>
        </View>

        {/* Legend */}
        <View style={s.legendRow}>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: theme.good }]} />
            <Text style={s.legendText}>Cumplido</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: theme.text3 }]} />
            <Text style={s.legendText}>Casi</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: theme.over }]} />
            <Text style={s.legendText}>Falta</Text>
          </View>
        </View>

        {/* Selected muscle detail */}
        {selectedMuscle && (
          <View style={s.muscleDetail}>
            <Text style={s.muscleDetailName}>{selectedMuscle}</Text>
            <Text style={s.muscleDetailVol}>
              {volumeMap[selectedMuscle] || 0} / {VR[selectedMuscle] ? VR[selectedMuscle][0] + '-' + VR[selectedMuscle][1] : '?'} sets semanales
            </Text>
          </View>
        )}

        {/* Volume table */}
        {Object.entries(VR).map(([group, range]) => {
          const vol = volumeMap[group] || 0;
          const status = muscleStatus(group);
          const color = status === 'met' ? theme.good : status === 'almost' ? theme.text3 : theme.over;
          return (
            <View key={group} style={s.volRow}>
              <Text style={s.volGroup}>{group}</Text>
              <View style={s.volBarOuter}>
                <View
                  style={[
                    s.volBarInner,
                    {
                      width: Math.min((vol / range[1]) * 100, 100) + '%',
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={[s.volCount, { color }]}>{vol}</Text>
              <Text style={s.volRange}>/{range[0]}-{range[1]}</Text>
            </View>
          );
        })}
      </View>

      {/* Weight card */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>PESO CORPORAL</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <View style={s.weightRow}>
          <View>
            <Text style={s.weightBig}>{profile.weight}</Text>
            <Text style={s.weightUnit}>kg</Text>
          </View>
          <View style={s.rangeBadge}>
            <Text style={s.rangeBadgeText}>EN RANGO</Text>
          </View>
        </View>
      </View>

      {/* Force records */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>REGISTROS DE FUERZA</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        {topRecords.length === 0 ? (
          <Text style={s.emptyText}>Completa entrenamientos para ver tus registros de fuerza estimados (1RM).</Text>
        ) : (
          <>
            <Text style={s.recordSubtitle}>1RM ESTIMADO = kg x (1 + reps/30)</Text>
            {topRecords.map(([name, e1rm], i) => (
              <View key={i} style={s.recordRow}>
                <Text style={s.recordNum}>{i + 1}</Text>
                <Text style={s.recordName}>{name}</Text>
                <Text style={s.recordVal}>{e1rm} kg</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Weekend reinforcement */}
      {lacking.length > 0 && (
        <>
          <View style={s.divider}>
            <Text style={s.dividerLabel}>REFUERZO DE FIN DE SEMANA</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.card}>
            <Text style={s.reinforceIntro}>
              Grupos musculares por debajo del volumen minimo semanal. Completa con estos ejercicios:
            </Text>
            {lacking.map((item) => (
              <View key={item.group} style={s.reinforceBlock}>
                <View style={s.reinforceHeader}>
                  <Text style={s.reinforceGroup}>{item.group}</Text>
                  <Text style={s.reinforceDeficit}>
                    {item.vol}/{item.min} sets  ·  faltan {item.deficit}
                  </Text>
                </View>
                {item.exercises.map((ex, i) => (
                  <Text key={i} style={s.reinforceEx}>
                    {ex.n}  ·  {ex.s}x{ex.r}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </>
      )}
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

  /* Toggle */
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.line2,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    borderColor: theme.accent,
    backgroundColor: theme.accentSoft,
  },
  toggleTxt: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
  },
  toggleTxtActive: {
    color: theme.text,
  },

  /* Card */
  card: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 20,
    marginBottom: 20,
  },

  /* Body map */
  mapWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },

  /* Legend */
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    paddingBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: theme.text3,
  },

  /* Selected muscle detail */
  muscleDetail: {
    backgroundColor: theme.accentSoft,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  muscleDetailName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 2,
  },
  muscleDetailVol: {
    fontSize: 12,
    color: theme.text2,
  },

  /* Volume rows */
  volRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  volGroup: {
    fontSize: 12,
    color: theme.text,
    width: 100,
  },
  volBarOuter: {
    flex: 1,
    height: 4,
    backgroundColor: theme.line2,
    borderRadius: 2,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  volBarInner: {
    height: 4,
    borderRadius: 2,
  },
  volCount: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    width: 24,
    textAlign: 'right',
  },
  volRange: {
    fontSize: 11,
    color: theme.text3,
    fontVariant: ['tabular-nums'],
  },

  /* Weight card */
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightBig: {
    fontSize: 36,
    fontWeight: '200',
    color: theme.text,
    fontVariant: ['tabular-nums'],
  },
  weightUnit: {
    fontSize: 12,
    color: theme.text3,
    letterSpacing: 1,
  },
  rangeBadge: {
    borderWidth: 1,
    borderColor: theme.good,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rangeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.good,
  },

  /* Records */
  emptyText: {
    fontSize: 13,
    color: theme.text3,
    textAlign: 'center',
    lineHeight: 19,
  },
  recordSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.text3,
    marginBottom: 10,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  recordNum: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text3,
    width: 22,
  },
  recordName: {
    fontSize: 13,
    color: theme.text,
    flex: 1,
  },
  recordVal: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.accent,
    fontVariant: ['tabular-nums'],
  },

  /* Reinforcement */
  reinforceIntro: {
    fontSize: 12,
    color: theme.text2,
    lineHeight: 18,
    marginBottom: 14,
  },
  reinforceBlock: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    paddingBottom: 10,
  },
  reinforceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reinforceGroup: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.over,
  },
  reinforceDeficit: {
    fontSize: 11,
    color: theme.text3,
    fontVariant: ['tabular-nums'],
  },
  reinforceEx: {
    fontSize: 12,
    color: theme.text2,
    paddingVertical: 3,
    paddingLeft: 8,
  },
});
