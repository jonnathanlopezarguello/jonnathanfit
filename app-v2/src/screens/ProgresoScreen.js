import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import theme from '../theme';
import { load, save, KEYS } from '../store';
import { T, DT, EXERCISE_LIBRARY } from '../data/exercises';
import { VR, MUSCLE_MAP, EXERCISE_MUSCLE_MAP } from '../data/bodymap';
import Body from 'react-native-body-highlighter';
import { DEFAULT_PROFILE } from '../utils';

const AMBER = '#C8943A';

export default function ProgresoScreen({ onNavigate }) {
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE });
  const [workouts, setWorkouts] = useState([]);
  const [view, setView] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exSearch, setExSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState(null);
  const [expandedMuscle, setExpandedMuscle] = useState(null);
  const [quickPlan, setQuickPlan] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await load(KEYS.profile);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...p });
      const w = await load(KEYS.workouts);
      if (w) setWorkouts(w);
      const qp = await load(KEYS.quickPlan);
      if (qp) setQuickPlan(qp);
    })();
  }, []);

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
        const sets = (exercise.sets || []).length;
        if (sets === 0) return;
        // Usar mapa por ejercicio individual primero; si no existe, caer en mapa de grupo
        const exMuscles = EXERCISE_MUSCLE_MAP[exercise.name];
        const muscles = exMuscles || (() => {
          const group = exToGroup[exercise.name];
          return group ? MUSCLE_MAP[group] : null;
        })();
        if (muscles) {
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

  // Ejercicios hechos esta semana por músculo (para el panel expandido)
  const muscleWeekEx = {};
  Object.keys(VR).forEach((m) => { muscleWeekEx[m] = []; });
  workouts.forEach((w) => {
    if (w.dt >= weekAgoISO) {
      (w.ex || []).forEach((exercise) => {
        const sets = (exercise.sets || []).length;
        if (sets === 0) return;
        const exMuscles = EXERCISE_MUSCLE_MAP[exercise.name];
        const muscles = exMuscles || (() => {
          const group = exToGroup[exercise.name];
          return group ? MUSCLE_MAP[group] : null;
        })();
        if (!muscles) return;
        muscles.forEach(([muscle]) => {
          if (!muscleWeekEx[muscle]) return;
          const existing = muscleWeekEx[muscle].find((e) => e.name === exercise.name);
          if (existing) { existing.sets += sets; }
          else { muscleWeekEx[muscle].push({ name: exercise.name, sets }); }
        });
      });
    }
  });

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

  // Todos los ejercicios de la librería que trabajan directamente un músculo
  const exercisesForMuscle = (muscle) => {
    const result = [];
    const seen = new Set();
    EXERCISE_LIBRARY.forEach((ex) => {
      const muscles = EXERCISE_MUSCLE_MAP[ex.n];
      if (!muscles) return;
      const isPrimary = muscles.some(([m, w]) => m === muscle && w >= 1.0);
      if (isPrimary && !seen.has(ex.n)) {
        seen.add(ex.n);
        result.push(ex);
      }
    });
    return result;
  };

  const toggleQuickPlan = async (ex, muscle) => {
    const exists = quickPlan.find((p) => p.n === ex.n);
    const next = exists
      ? quickPlan.filter((p) => p.n !== ex.n)
      : [...quickPlan, { ...ex, muscle }];
    setQuickPlan(next);
    await save(KEYS.quickPlan, next);
  };

  // Mapeo VR muscle → slug del paquete body-highlighter
  const MUSCLE_TO_SLUG = {
    'Pectoral Mayor':     'chest',
    'Deltoides Lateral':  'deltoids',
    'Deltoides Anterior': 'deltoids',
    'Deltoides Posterior':'deltoids',
    'Bíceps Braquial':    'biceps',
    'Tríceps Braquial':   'triceps',
    'Dorsal Ancho':       'upper-back',
    'Trapecio':           'trapezius',
    'Recto Abdominal':    'abs',
    'Oblicuos':           'obliques',
    'Cuádriceps':         'quadriceps',
    'Femoral':            'hamstring',
    'Glúteo Mayor':       'gluteal',
    'Gastrocnemio':       'calves',
  };

  // Reverso: slug → músculos VR para el panel de detalle
  const SLUG_TO_MUSCLES = {
    'chest':      ['Pectoral Mayor'],
    'deltoids':   ['Deltoides Anterior', 'Deltoides Lateral', 'Deltoides Posterior'],
    'biceps':     ['Bíceps Braquial'],
    'triceps':    ['Tríceps Braquial'],
    'upper-back': ['Dorsal Ancho'],
    'trapezius':  ['Trapecio'],
    'abs':        ['Recto Abdominal'],
    'obliques':   ['Oblicuos'],
    'quadriceps': ['Cuádriceps'],
    'hamstring':  ['Femoral'],
    'gluteal':    ['Glúteo Mayor'],
    'calves':     ['Gastrocnemio'],
  };

  // Datos para el Body component: un entry por slug mostrando el color más crítico
  const bodyData = (() => {
    const colorPriority = [theme.over, theme.text3, AMBER, theme.good];
    const slugColors = {};
    Object.entries(MUSCLE_TO_SLUG).forEach(([muscle, slug]) => {
      const color = zoneColor(muscle);
      if (!slugColors[slug]) {
        slugColors[slug] = color;
      } else {
        const existing = slugColors[slug];
        if (colorPriority.indexOf(color) < colorPriority.indexOf(existing)) {
          slugColors[slug] = color;
        }
      }
    });
    return Object.entries(slugColors).map(([slug, color]) => ({ slug, color }));
  })();

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

      {/* Body Map */}
      <View style={s.card}>
        <View style={s.mapWrap}>
          <Body
            data={bodyData}
            side={view}
            scale={1.2}
            defaultFill={theme.line2}
            defaultStroke={theme.bg}
            defaultStrokeWidth={1.5}
            border={theme.bg}
            onBodyPartPress={(part) => {
              const slug = part.slug;
              setSelectedMuscle(selectedMuscle === slug ? null : slug);
            }}
          />
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
          const muscles = SLUG_TO_MUSCLES[selectedMuscle] || [];
          return (
            <View style={s.muscleDetail}>
              <Text style={s.muscleDetailName}>{selectedMuscle}</Text>
              {muscles.map((m) => {
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

        {/* Tabla por músculo — acordeón */}
        {Object.entries(VR).map(([muscle, vr]) => {
          const vol = muscleVol[muscle] || 0;
          const volRound = Math.round(vol);
          const color = zoneColor(muscle);
          const pctFill = Math.min(vol / vr.mrv, 1);
          const pctMev = vr.mev > 0 ? (vr.mev / vr.mrv) * 100 : 0;
          const pctMavLow = (vr.mav[0] / vr.mrv) * 100;
          const isOpen = expandedMuscle === muscle;
          const doneExs = muscleWeekEx[muscle] || [];
          const availExs = exercisesForMuscle(muscle);
          return (
            <View key={muscle}>
              <TouchableOpacity
                style={s.volRow}
                onPress={() => setExpandedMuscle(isOpen ? null : muscle)}
                activeOpacity={0.75}
              >
                <Text style={s.volName} numberOfLines={1}>{muscle}</Text>
                <View style={s.volBarOuter}>
                  {pctMev > 0 && (
                    <View style={[s.volZoneBg, { left: 0, width: pctMev + '%', backgroundColor: theme.over + '22' }]} />
                  )}
                  <View style={[s.volZoneBg, {
                    left: pctMev + '%',
                    width: (pctMavLow - pctMev) + '%',
                    backgroundColor: AMBER + '18',
                  }]} />
                  <View style={[s.volZoneBg, { left: pctMavLow + '%', right: 0, backgroundColor: theme.good + '18' }]} />
                  <View style={[s.volBarFill, { width: (pctFill * 100) + '%', backgroundColor: color }]} />
                  {pctMev > 0 && <View style={[s.volTick, { left: pctMev + '%' }]} />}
                  <View style={[s.volTick, { left: pctMavLow + '%', backgroundColor: theme.good + 'AA' }]} />
                </View>
                <Text style={[s.volCount, { color }]}>{volRound}</Text>
                <Text style={s.volChevron}>{isOpen ? '▴' : '▾'}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={[s.expandPanel, { borderLeftColor: color }]}>
                  {/* Resumen de zona */}
                  <View style={s.expandStats}>
                    <Text style={[s.expandVolNum, { color }]}>{volRound}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.expandZoneLabel, { color }]}>{zoneLabel(muscle)}</Text>
                      <Text style={s.expandRanges}>
                        MEV {vr.mev} · MAV {vr.mav[0]}–{vr.mav[1]} · MRV {vr.mrv} series/sem
                      </Text>
                    </View>
                  </View>

                  {/* Ejercicios hechos esta semana */}
                  {doneExs.length > 0 && (
                    <View style={s.expandSection}>
                      <Text style={s.expandSectionLabel}>ESTA SEMANA</Text>
                      {doneExs.map((ex, i) => (
                        <View key={i} style={s.doneRow}>
                          <View style={[s.doneDot, { backgroundColor: color }]} />
                          <Text style={s.doneName} numberOfLines={1}>{ex.name}</Text>
                          <Text style={s.doneSets}>{ex.sets} series</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Ejercicios disponibles para este músculo */}
                  {availExs.length > 0 && (
                    <View style={s.expandSection}>
                      <Text style={s.expandSectionLabel}>PUEDES HACER</Text>
                      {availExs.map((ex, i) => {
                        const inPlan = quickPlan.some((p) => p.n === ex.n);
                        return (
                          <View key={i} style={[s.availRow, i === availExs.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                              <Text style={s.availName} numberOfLines={1}>{ex.n}</Text>
                              <Text style={s.availMeta} numberOfLines={1}>
                                {ex.s}×{ex.r} · {ex.f}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={[s.addBtn, inPlan && s.addBtnDone]}
                              onPress={() => toggleQuickPlan(ex, muscle)}
                              activeOpacity={0.7}
                            >
                              <Text style={[s.addBtnTxt, inPlan && { color: theme.good }]}>
                                {inPlan ? '✓' : '+'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Lista de ejercicios guardados para hacer */}
        {quickPlan.length > 0 && (
          <View style={s.quickPlanBox}>
            <View style={s.qpHeader}>
              <Text style={s.qpTitle}>POR HACER</Text>
              <TouchableOpacity onPress={() => { setQuickPlan([]); save(KEYS.quickPlan, []); }}>
                <Text style={s.qpClear}>Borrar todo</Text>
              </TouchableOpacity>
            </View>
            {quickPlan.map((ex, i) => (
              <View key={i} style={s.qpRow}>
                <Text style={s.qpMuscle} numberOfLines={1}>{ex.muscle}</Text>
                <Text style={s.qpExName} numberOfLines={1}>{ex.n}</Text>
                <Text style={s.qpSets}>{ex.s}×{ex.r}</Text>
              </View>
            ))}
          </View>
        )}
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
    width: 118,
  },
  volChevron: {
    fontSize: 9,
    color: theme.text3,
    width: 14,
    textAlign: 'center',
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

  /* Acordeón muscular — panel expandido */
  expandPanel: {
    backgroundColor: theme.accentSoft,
    padding: 14,
    marginBottom: 2,
    borderLeftWidth: 2,
  },
  expandStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  expandVolNum: {
    fontSize: 30,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    lineHeight: 32,
  },
  expandZoneLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 3,
  },
  expandRanges: {
    fontSize: 10,
    color: theme.text3,
    fontVariant: ['tabular-nums'],
  },
  expandSection: {
    marginTop: 10,
  },
  expandSectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 8,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  doneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  doneName: {
    flex: 1,
    fontSize: 12,
    color: theme.text2,
  },
  doneSets: {
    fontSize: 11,
    color: theme.text3,
    fontVariant: ['tabular-nums'],
  },
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  availName: {
    fontSize: 12,
    color: theme.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  availMeta: {
    fontSize: 10,
    color: theme.text3,
    lineHeight: 14,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.line2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addBtnDone: {
    borderColor: theme.good,
    backgroundColor: theme.good + '18',
  },
  addBtnTxt: {
    fontSize: 16,
    color: theme.text3,
    lineHeight: 20,
  },

  /* Plan rápido guardado */
  quickPlanBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.line,
  },
  qpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  qpTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text3,
  },
  qpClear: {
    fontSize: 11,
    color: theme.over,
  },
  qpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  qpMuscle: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.text3,
    width: 80,
    flexShrink: 0,
  },
  qpExName: {
    flex: 1,
    fontSize: 12,
    color: theme.text,
  },
  qpSets: {
    fontSize: 11,
    color: theme.text3,
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
