import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../theme';
import { load, KEYS } from '../store';
import { T, DT } from '../data/exercises';
import { SKEL, FM, BM, VR, MUSCLE_MAP } from '../data/bodymap';
import { DEFAULT_PROFILE } from '../utils';

export default function ProgresoScreen() {
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE });
  const [workouts, setWorkouts] = useState([]);
  const [view, setView] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exSearch, setExSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await load(KEYS.profile);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...p });
      const w = await load(KEYS.workouts);
      if (w) setWorkouts(w);
    })();
  }, []);

  const AMBER = '#C8943A';

  // Mapa ejercicio → grupo muscular
  const exToGroup = {};
  Object.values(T).forEach((dayExercises) => {
    dayExercises.forEach((ex) => { exToGroup[ex.n] = ex.g; });
  });

  // Volumen semanal (últimos 7 días) por músculo individual
  // Series directas × 1.0 · Series indirectas × 0.5
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoISO = weekAgo.toISOString().slice(0, 10);

  const muscleVol = {};
  Object.keys(VR).forEach((m) => { muscleVol[m] = 0; });

  workouts.forEach((w) => {
    if (w.dt >= weekAgoISO) {
      (w.ex || []).forEach((exercise) => {
        const group = exToGroup[exercise.name];
        const muscles = group ? MUSCLE_MAP[group] : null;
        if (muscles) {
          const sets = (exercise.sets || []).length;
          muscles.forEach(([muscle, weight]) => {
            if (muscleVol[muscle] !== undefined) {
              muscleVol[muscle] += sets * weight;
            }
          });
        }
      });
    }
  });

  // Color por zona MEV/MAV/MRV
  const zoneColor = (muscle) => {
    const vol = muscleVol[muscle] || 0;
    const vr = VR[muscle];
    if (!vr) return theme.text3;
    if (vol === 0) return theme.text3;
    if (vol < vr.mev) return theme.over;
    if (vol < vr.mav[0]) return AMBER;
    if (vol <= vr.mrv) return theme.good;
    return theme.over; // encima del MRV
  };

  const zoneLabel = (muscle) => {
    const vol = muscleVol[muscle] || 0;
    const vr = VR[muscle];
    if (!vr) return '';
    if (vol === 0) return 'Sin volumen';
    if (vol < vr.mev) return 'Bajo MEV';
    if (vol < vr.mav[0]) return 'Acercándose';
    if (vol <= vr.mrv) return 'Zona óptima';
    return 'Encima MRV';
  };

  // Para el mapa SVG — traducir grupo → color predominante
  const muscleColor = (group) => {
    const muscles = MUSCLE_MAP[group];
    if (!muscles) return theme.text3;
    const primary = muscles.find(([, w]) => w >= 1.0);
    if (!primary) return theme.text3;
    return zoneColor(primary[0]);
  };

  // Mapa músculo → grupos de ejercicios que lo trabajan directamente
  const muscleToGroups = {};
  Object.entries(MUSCLE_MAP).forEach(([group, muscles]) => {
    muscles.forEach(([muscle, weight]) => {
      if (weight >= 1.0) {
        if (!muscleToGroups[muscle]) muscleToGroups[muscle] = [];
        muscleToGroups[muscle].push(group);
      }
    });
  });

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
  const units = profile.units || 'kg';
  const topRecords = Object.entries(records)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, e1rm]) => [name, units === 'lbs' ? Math.round(e1rm * 2.2046) : e1rm]);

  // Refuerzo: músculos individuales por debajo del MEV
  const lacking = Object.entries(VR)
    .filter(([muscle, vr]) => {
      if (vr.mev === 0) return false; // músculos sin MEV definido no se alertan
      return (muscleVol[muscle] || 0) < vr.mev;
    })
    .map(([muscle, vr]) => {
      const vol = Math.round(muscleVol[muscle] || 0);
      const deficit = vr.mev - vol;
      const groups = muscleToGroups[muscle] || [];
      const exercises = [];
      Object.values(T).forEach((dayEx) => {
        dayEx.forEach((ex) => {
          if (groups.includes(ex.g) && !exercises.find((e) => e.n === ex.n)) {
            exercises.push(ex);
          }
        });
      });
      return { muscle, vol, mev: vr.mev, deficit, exercises: exercises.slice(0, 2) };
    })
    .sort((a, b) => b.deficit - a.deficit);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
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
        {selectedMuscle && (() => {
          const muscles = MUSCLE_MAP[selectedMuscle] || [];
          return (
            <View style={s.muscleDetail}>
              <Text style={s.muscleDetailName}>{selectedMuscle}</Text>
              {muscles.map(([m]) => {
                const vr = VR[m];
                const vol = Math.round(muscleVol[m] || 0);
                const color = zoneColor(m);
                if (!vr) return null;
                return (
                  <View key={m} style={s.muscleDetailRow}>
                    <Text style={[s.muscleDetailMuscle, { color }]}>{m}</Text>
                    <Text style={s.muscleDetailVol}>
                      {vol} series · MEV {vr.mev} · MAV {vr.mav[0]}–{vr.mav[1]}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })()}

        {/* Leyenda de zonas */}
        <View style={s.zoneLegend}>
          <View style={s.zoneLegendItem}>
            <View style={[s.zoneDot, { backgroundColor: theme.over }]} />
            <Text style={s.zoneLegendTxt}>Bajo MEV</Text>
          </View>
          <View style={s.zoneLegendItem}>
            <View style={[s.zoneDot, { backgroundColor: AMBER }]} />
            <Text style={s.zoneLegendTxt}>Acercándose</Text>
          </View>
          <View style={s.zoneLegendItem}>
            <View style={[s.zoneDot, { backgroundColor: theme.good }]} />
            <Text style={s.zoneLegendTxt}>Zona MAV</Text>
          </View>
        </View>

        {/* Tabla por músculo individual */}
        {Object.entries(VR).map(([muscle, vr]) => {
          const vol = muscleVol[muscle] || 0;
          const volRound = Math.round(vol);
          const color = zoneColor(muscle);
          const pctFill = Math.min(vol / vr.mrv, 1);
          const pctMev = vr.mev > 0 ? (vr.mev / vr.mrv) * 100 : 0;
          const pctMavLow = (vr.mav[0] / vr.mrv) * 100;
          return (
            <View key={muscle} style={s.volRow}>
              <Text style={s.volName} numberOfLines={1}>{muscle}</Text>
              <View style={s.volBarOuter}>
                {/* Zona MEV (rojo) */}
                {pctMev > 0 && (
                  <View style={[s.volZoneBg, {
                    left: 0, width: pctMev + '%',
                    backgroundColor: theme.over + '22',
                  }]} />
                )}
                {/* Zona pre-MAV (ámbar) */}
                <View style={[s.volZoneBg, {
                  left: pctMev + '%',
                  width: (pctMavLow - pctMev) + '%',
                  backgroundColor: AMBER + '18',
                }]} />
                {/* Zona MAV (verde) */}
                <View style={[s.volZoneBg, {
                  left: pctMavLow + '%',
                  right: 0,
                  backgroundColor: theme.good + '18',
                }]} />
                {/* Relleno actual */}
                <View style={[s.volBarFill, {
                  width: (pctFill * 100) + '%',
                  backgroundColor: color,
                }]} />
                {/* Marcador MEV */}
                {pctMev > 0 && (
                  <View style={[s.volTick, { left: pctMev + '%' }]} />
                )}
                {/* Marcador MAV inicio */}
                <View style={[s.volTick, { left: pctMavLow + '%', backgroundColor: theme.good + 'AA' }]} />
              </View>
              <Text style={[s.volCount, { color }]}>{volRound}</Text>
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
                <Text style={s.recordVal}>{e1rm} {units}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Per-exercise history */}
      {workouts.length > 0 && (
        <>
          <View style={s.divider}>
            <Text style={s.dividerLabel}>HISTORIAL POR EJERCICIO</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.card}>
            <TextInput
              style={s.exSearchInput}
              value={exSearch}
              onChangeText={(t) => { setExSearch(t); setSelectedEx(null); }}
              placeholder="Buscar ejercicio..."
              placeholderTextColor={theme.text3}
            />
            {exSearch.trim().length > 0 && !selectedEx && (
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                {Object.keys(records)
                  .filter((n) => n.toLowerCase().includes(exSearch.trim().toLowerCase()))
                  .slice(0, 8)
                  .map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={s.exPickItem}
                      onPress={() => { setSelectedEx(n); setExSearch(n); }}
                      activeOpacity={0.7}
                    >
                      <Text style={s.exPickTxt}>{n}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}
            {selectedEx && (() => {
              const sessions = workouts
                .filter((w) => (w.ex || []).some((e) => e.name === selectedEx))
                .slice(0, 8)
                .map((w) => {
                  const ex = (w.ex || []).find((e) => e.name === selectedEx);
                  const doneSets = (ex?.sets || []).filter((st) => st.kg || st.rp);
                  const bestKg = Math.max(...doneSets.map((st) => parseFloat(st.kg) || 0), 0);
                  const totalVol = doneSets.reduce((s, st) => s + (parseFloat(st.kg) || 0) * (parseFloat(st.rp) || 0), 0);
                  const dispKg = units === 'lbs' ? Math.round(bestKg * 2.2046 * 10) / 10 : bestKg;
                  return { dt: w.dt, sets: doneSets.length, bestKg: dispKg, vol: Math.round(totalVol) };
                });
              if (sessions.length === 0) return <Text style={s.emptyText}>Sin historial para este ejercicio.</Text>;
              return (
                <>
                  <View style={s.exHistHeader}>
                    <Text style={[s.exHistCell, { flex: 2 }]}>Fecha</Text>
                    <Text style={[s.exHistCell, { width: 34 }]}>Series</Text>
                    <Text style={[s.exHistCell, { width: 60, textAlign: 'right' }]}>Mejor {units}</Text>
                  </View>
                  {sessions.map((row, i) => (
                    <View key={i} style={[s.exHistRow, i % 2 === 0 && { backgroundColor: theme.accentSoft }]}>
                      <Text style={[s.exHistVal, { flex: 2 }]}>{row.dt}</Text>
                      <Text style={[s.exHistVal, { width: 34 }]}>{row.sets}</Text>
                      <Text style={[s.exHistVal, { width: 60, textAlign: 'right', color: theme.good }]}>{row.bestKg}</Text>
                    </View>
                  ))}
                </>
              );
            })()}
          </View>
        </>
      )}

      {/* Workout history */}
      {workouts.length > 0 && (
        <>
          <View style={s.divider}>
            <Text style={s.dividerLabel}>HISTORIAL</Text>
            <View style={s.dividerLine} />
          </View>

          {workouts.slice(0, 10).map((w, wi) => {
            const totalSets = (w.ex || []).reduce((n, e) => n + (e.sets || []).length, 0);
            const exWithNotes = (w.ex || []).filter((e) => e.note && e.note.trim());
            return (
              <View key={w.id || wi} style={[s.card, { marginBottom: 8 }]}>
                <View style={s.histRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.histName}>{w.nm}</Text>
                    <Text style={s.histDate}>{w.dt} · {w.dur || '—'} min</Text>
                  </View>
                  <Text style={s.histSets}>{totalSets} series</Text>
                </View>
                {(w.ex || []).map((e, ei) => {
                  const best = (e.sets || []).reduce((b, st) => {
                    const v = parseFloat(st.kg) || 0;
                    return v > b ? v : b;
                  }, 0);
                  const dispKg = units === 'lbs' ? Math.round(best * 2.2046 * 10) / 10 : best;
                  return (
                    <View key={ei} style={s.histExRow}>
                      <Text style={s.histExName} numberOfLines={1}>{e.name}</Text>
                      {best > 0 && <Text style={s.histExVal}>{dispKg} {units}</Text>}
                      {e.note ? <Text style={s.histExNote} numberOfLines={1}>{e.note}</Text> : null}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </>
      )}

      {/* Weekend reinforcement */}
      {lacking.length > 0 && (
        <>
          <View style={s.divider}>
            <Text style={s.dividerLabel}>REFUERZO DE FIN DE SEMANA</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.card}>
            <Text style={s.reinforceIntro}>
              Músculos por debajo del MEV semanal. Agrega estas series antes del domingo:
            </Text>
            {lacking.map((item) => (
              <View key={item.muscle} style={s.reinforceBlock}>
                <View style={s.reinforceHeader}>
                  <Text style={s.reinforceGroup}>{item.muscle}</Text>
                  <Text style={s.reinforceDeficit}>
                    {item.vol}/{item.mev} series · faltan {item.deficit}
                  </Text>
                </View>
                {item.exercises.map((ex, i) => (
                  <Text key={i} style={s.reinforceEx}>
                    {ex.n}  ·  {ex.s}×{ex.r}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </>
      )}
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
    marginBottom: 10,
    borderRadius: 4,
  },
  muscleDetailName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 6,
  },
  muscleDetailRow: {
    marginBottom: 4,
  },
  muscleDetailMuscle: {
    fontSize: 12,
    fontWeight: '600',
  },
  muscleDetailVol: {
    fontSize: 11,
    color: theme.text3,
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },

  /* Leyenda de zonas MEV/MAV */
  zoneLegend: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  zoneLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  zoneDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  zoneLegendTxt: {
    fontSize: 10,
    color: theme.text3,
    letterSpacing: 0.3,
  },

  /* Volume rows */
  volRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    gap: 8,
  },
  volName: {
    fontSize: 11,
    color: theme.text2,
    width: 138,
  },
  volBarOuter: {
    flex: 1,
    height: 6,
    backgroundColor: theme.line,
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  volZoneBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  volBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 3,
  },
  volTick: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 1.5,
    backgroundColor: theme.line2,
    borderRadius: 1,
  },
  volCount: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    width: 22,
    textAlign: 'right',
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

  /* Exercise history search */
  exSearchInput: {
    borderWidth: 1,
    borderColor: theme.line2,
    borderRadius: 6,
    color: theme.text,
    fontSize: 13,
    padding: 10,
    marginBottom: 8,
  },
  exPickItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  exPickTxt: { color: theme.text2, fontSize: 13 },
  exHistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    marginTop: 8,
  },
  exHistCell: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: theme.text3,
  },
  exHistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  exHistVal: {
    fontSize: 12,
    color: theme.text2,
    fontVariant: ['tabular-nums'],
  },

  /* History */
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  histName: { fontSize: 13, color: theme.text, fontWeight: '600' },
  histDate: { fontSize: 11, color: theme.text3, marginTop: 2, fontVariant: ['tabular-nums'] },
  histSets: { fontSize: 12, color: theme.text3, fontVariant: ['tabular-nums'] },
  histExRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  histExName: { flex: 1, fontSize: 12, color: theme.text2 },
  histExVal: { fontSize: 12, color: theme.good, fontVariant: ['tabular-nums'] },
  histExNote: { flex: 1, fontSize: 11, color: theme.text3, fontStyle: 'italic' },

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
