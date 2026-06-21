import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Linking, Image } from 'react-native';
import { getState, updateState } from '../store';
import { PLAN_DAYS, DAY_TITLE, TEMPLATES, EXERCISE_LIB } from '../data/templates';
import { e1rm } from '../data/calc';
import { YOUTUBE_VIDEOS, SHAKIL_INSTAGRAM, SHAKIL_YOUTUBE_CHANNEL } from '../data/videos';

const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function fmtElapsed(ms) {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(ss)}`;
}

export default function EntrenoScreen({ theme }) {
  const [state, setState] = useState(getState());
  const [exIdx, setExIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { setState(getState()); }, []);

  useEffect(() => {
    if (state.active) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - state.active.start);
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
  }, [state.active]);

  const dayName = DAY_ES[new Date().getDay()];
  const planEx = TEMPLATES[dayName];
  const active = state.active;

  function getLastPerf(exName, excludeId) {
    for (const w of state.workouts) {
      if (excludeId && w.id === excludeId) continue;
      const ex = w.exercises && w.exercises.find(e => e.name === exName);
      if (ex && ex.sets) {
        const done = ex.sets.filter(s => s.done && +s.kg > 0 && +s.reps > 0);
        if (done.length > 0) {
          const best = done.sort((a, b) => (+b.kg || 0) - (+a.kg || 0))[0];
          return { kg: +best.kg, reps: +best.reps };
        }
      }
    }
    return null;
  }

  async function startSession() {
    if (!planEx) return;
    const exercises = planEx.map(e => {
      const last = getLastPerf(e.n);
      return {
        name: e.n, plan: e,
        sets: Array.from({ length: e.s }, () => ({
          kg: last ? String(last.kg) : '',
          reps: last ? String(last.reps) : '',
          done: false,
        }))
      };
    });
    const s = await updateState(s => {
      s.active = {
        id: Date.now(), name: DAY_TITLE[dayName] || dayName,
        date: new Date().toLocaleDateString('en-CA'),
        start: Date.now(), exercises
      };
    });
    setState({ ...s });
    setExIdx(0);
  }

  async function finishWorkout() {
    Alert.alert('Finalizar sesion', 'Guardar este entrenamiento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Guardar', onPress: async () => {
        const prs = [];
        const a = state.active;
        if (a) {
          a.exercises.forEach(e => {
            const doneSets = e.sets.filter(s => s.done && +s.kg > 0 && +s.reps > 0);
            let bestE1rm = 0;
            doneSets.forEach(s => {
              const v = e1rm(+s.kg, +s.reps);
              if (v > bestE1rm) bestE1rm = v;
            });
            if (bestE1rm > 0) {
              const prior = getLastPerf(e.name, a.id);
              const priorBest = prior ? e1rm(prior.kg, prior.reps) : 0;
              if (bestE1rm > priorBest) prs.push(`${e.name} · ${bestE1rm} kg (1RM est.)`);
            }
          });
        }
        const s = await updateState(s => {
          const a = s.active;
          a.exercises = a.exercises.filter(e => e.sets.some(ss => ss.done));
          a.dur = Math.round((Date.now() - a.start) / 60000);
          s.workouts.unshift(a);
          s.active = null;
        });
        setState({ ...s });
        setExIdx(0);
        if (prs.length > 0) {
          setTimeout(() => Alert.alert('Nuevo record!', prs.join('\n')), 300);
        }
      }}
    ]);
  }

  async function discardWorkout() {
    Alert.alert('Descartar', 'Descartar este entrenamiento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: async () => {
        const s = await updateState(s => { s.active = null; });
        setState({ ...s });
        setExIdx(0);
      }}
    ]);
  }

  function setVal(ei, si, key, value) {
    updateState(s => {
      if (s.active && s.active.exercises[ei]) {
        s.active.exercises[ei].sets[si][key] = value;
      }
    }).then(s => setState({ ...s }));
  }

  function toggleSet(ei, si) {
    updateState(s => {
      if (s.active && s.active.exercises[ei]) {
        s.active.exercises[ei].sets[si].done = !s.active.exercises[ei].sets[si].done;
      }
    }).then(s => setState({ ...s }));
  }

  function addSet(ei) {
    updateState(s => {
      if (s.active && s.active.exercises[ei]) {
        const sets = s.active.exercises[ei].sets;
        const last = sets[sets.length - 1] || {};
        sets.push({ kg: last.kg || '', reps: last.reps || '', done: false });
      }
    }).then(s => setState({ ...s }));
  }

  function delSet(ei, si) {
    updateState(s => {
      if (s.active && s.active.exercises[ei]) {
        s.active.exercises[ei].sets.splice(si, 1);
        if (s.active.exercises[ei].sets.length === 0) {
          s.active.exercises[ei].sets.push({ kg: '', reps: '', done: false });
        }
      }
    }).then(s => setState({ ...s }));
  }

  function delExercise(ei) {
    Alert.alert('Quitar ejercicio', 'Quitar este ejercicio de la sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: () => {
        updateState(s => {
          if (s.active) {
            s.active.exercises.splice(ei, 1);
          }
        }).then(s => {
          setState({ ...s });
          if (exIdx >= (s.active ? s.active.exercises.length : 0)) {
            setExIdx(Math.max(0, (s.active ? s.active.exercises.length : 1) - 1));
          }
        });
      }}
    ]);
  }

  function addExercise(name) {
    updateState(s => {
      if (s.active) {
        const last = getLastPerf(name);
        s.active.exercises.push({
          name,
          plan: null,
          sets: [{ kg: last ? String(last.kg) : '', reps: last ? String(last.reps) : '', done: false }]
        });
      }
    }).then(s => {
      setState({ ...s });
      if (s.active) setExIdx(s.active.exercises.length - 1);
    });
  }

  const [showPicker, setShowPicker] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [showTech, setShowTech] = useState(false);

  // ─── NO ACTIVE SESSION ───
  if (!active) {
    return (
      <ScrollView style={[st.container, { backgroundColor: theme.bg }]} contentContainerStyle={st.content}>
        <Text style={[st.headerLabel, { color: theme.text3 }]}>REGISTRO DE FUERZA</Text>
        <Text style={[st.headerTitle, { color: theme.text }]}>Entreno</Text>

        {planEx ? (
          <>
            <Text style={[st.dayLabel, { color: theme.text2 }]}>{dayName} {'—'} {DAY_TITLE[dayName]}</Text>
            <Text style={[st.hint, { color: theme.text3 }]}>{planEx.length} ejercicios planificados</Text>

            {planEx.map((e, i) => (
              <View key={i} style={[st.exCard, { borderColor: theme.line, backgroundColor: theme.surface }]}>
                <Text style={[st.exName, { color: theme.text }]}>{e.n}</Text>
                <Text style={[st.exDetail, { color: theme.text3 }]}>{e.s} x {e.reps} {'·'} RIR {e.rir} {'·'} {e.g}</Text>
                {e.foco ? <Text style={[st.focoText, { color: theme.text3 }]}>{e.foco}</Text> : null}
              </View>
            ))}

            <TouchableOpacity style={[st.startBtn, { backgroundColor: theme.accent }]} onPress={startSession} activeOpacity={0.8}>
              <Text style={[st.startBtnText, { color: theme.bg }]}>INICIAR SESION</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={[st.exCard, { borderColor: theme.line, backgroundColor: theme.surface }]}>
            <Text style={{ fontSize: 13, color: theme.text3 }}>
              Dia de descanso {'—'} entrenas {PLAN_DAYS.join(', ')}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }

  // ─── ACTIVE SESSION ───
  const exercises = active.exercises || [];
  const currentEx = exercises[exIdx];
  const currentPlan = currentEx ? currentEx.plan : null;
  const currentSets = currentEx ? currentEx.sets : [];
  const completedSets = currentSets.filter(s => s.done).length;
  const totalSets = currentSets.length;
  const totalExCompleted = exercises.filter(e => e.sets.some(s => s.done)).length;

  const lastPerf = currentEx ? getLastPerf(currentEx.name, active.id) : null;
  const targetStr = currentPlan ? `${currentPlan.s} x ${currentPlan.reps}` : '';

  // Exercise picker overlay
  if (showPicker) {
    const q = searchQ.toLowerCase();
    const filtered = q ? EXERCISE_LIB.filter(n => n.toLowerCase().includes(q)) : EXERCISE_LIB;
    return (
      <ScrollView style={[st.container, { backgroundColor: theme.bg }]} contentContainerStyle={st.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={[st.headerLabel, { color: theme.text3 }]}>AÑADIR EJERCICIO</Text>
          <TouchableOpacity onPress={() => { setShowPicker(false); setSearchQ(''); }}>
            <Text style={{ color: theme.text3, fontSize: 14 }}>{'✕'}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[st.searchInput, { borderColor: theme.line, color: theme.text }]}
          placeholder="Buscar ejercicio..."
          placeholderTextColor={theme.text3}
          value={searchQ}
          onChangeText={setSearchQ}
          autoFocus
        />
        {filtered.map((name, i) => (
          <TouchableOpacity
            key={i}
            style={[st.pickerItem, { borderColor: theme.line }]}
            onPress={() => { addExercise(name); setShowPicker(false); setSearchQ(''); }}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.text, fontSize: 13 }}>{name}</Text>
            <Text style={{ color: theme.text3, fontSize: 12 }}>+</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[st.container, { backgroundColor: theme.bg }]} contentContainerStyle={st.content}>
      {/* Session banner card */}
      <View style={[st.bannerCard, { borderColor: theme.line, backgroundColor: theme.surface }]}>
        <View style={st.bannerTop}>
          <View style={st.bannerLeft}>
            <View style={st.bannerLabelRow}>
              <View style={[st.blinkDot, { backgroundColor: theme.over }]} />
              <Text style={[st.bannerLabel, { color: theme.text3 }]}>
                EN CURSO {'·'} {active.name}
              </Text>
            </View>
            <Text style={[st.timerText, { color: theme.text }]}>{fmtElapsed(elapsed)}</Text>
            <Text style={[st.progressText, { color: theme.text3 }]}>
              {totalExCompleted}/{exercises.length} ejercicios completados
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <TouchableOpacity style={[st.finishBtn, { backgroundColor: theme.accent }]} onPress={finishWorkout} activeOpacity={0.8}>
              <Text style={[st.finishBtnText, { color: theme.bg }]}>FINALIZAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={discardWorkout} activeOpacity={0.7}>
              <Text style={{ color: theme.text3, fontSize: 10, letterSpacing: 1 }}>DESCARTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Exercise sets card */}
      {currentEx && (
        <View style={[st.techCard, { borderColor: theme.line, backgroundColor: theme.surface }]}>
          <View style={st.techHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[st.techName, { color: theme.text }]}>{currentEx.name}</Text>
              <Text style={[st.techSub, { color: theme.text3 }]}>
                {lastPerf ? `Ultima ${lastPerf.kg} kg x ${lastPerf.reps}` : 'Sin datos previos'}
                {targetStr ? ` · Objetivo ${targetStr}` : ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setShowTech(!showTech)} activeOpacity={0.7}>
                <Text style={{ color: showTech ? theme.accent : theme.text3, fontSize: 10, letterSpacing: 1 }}>T{'É'}CNICA</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => delExercise(exIdx)} activeOpacity={0.7}>
                <Text style={{ color: theme.text3, fontSize: 10, letterSpacing: 1 }}>QUITAR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Set grid */}
          <View style={st.setGridHeader}>
            <Text style={[st.setHeaderText, { color: theme.text3, width: 30 }]}>Set</Text>
            <Text style={[st.setHeaderText, { color: theme.text3, flex: 1 }]}>Kg</Text>
            <Text style={[st.setHeaderText, { color: theme.text3, flex: 1 }]}>Reps</Text>
            <Text style={[st.setHeaderText, { color: theme.text3, width: 36, textAlign: 'center' }]}>OK</Text>
            <View style={{ width: 28 }} />
          </View>

          {currentSets.map((set, si) => (
            <View key={si} style={[st.setRow, set.done && { backgroundColor: theme.accentSoft }]}>
              <Text style={[st.setNum, { color: theme.text3 }]}>{si + 1}</Text>
              <TextInput
                style={[st.setInput, { borderColor: set.done ? theme.accent : theme.line, color: theme.text }]}
                value={String(set.kg || '')}
                onChangeText={v => setVal(exIdx, si, 'kg', v)}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={theme.text3}
              />
              <TextInput
                style={[st.setInput, { borderColor: set.done ? theme.accent : theme.line, color: theme.text }]}
                value={String(set.reps || '')}
                onChangeText={v => setVal(exIdx, si, 'reps', v)}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={theme.text3}
              />
              <TouchableOpacity
                style={[st.doneBtn, set.done ? { backgroundColor: theme.accent } : { borderColor: theme.line, borderWidth: 1 }]}
                onPress={() => toggleSet(exIdx, si)}
                activeOpacity={0.7}
              >
                <Text style={{ color: set.done ? theme.bg : theme.text3, fontSize: 14 }}>{'✓'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => delSet(exIdx, si)} activeOpacity={0.7}>
                <Text style={{ color: theme.text3, fontSize: 12 }}>{'✕'}</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={[st.addSetBtn, { borderColor: theme.line }]} onPress={() => addSet(exIdx)} activeOpacity={0.7}>
            <Text style={{ color: theme.text3, fontSize: 11, letterSpacing: 1 }}>+ SERIE</Text>
          </TouchableOpacity>

          <Text style={[st.chipHint, { color: theme.text3 }]}>
            {completedSets > 0
              ? `${completedSets} de ${totalSets} series completadas`
              : 'Ingresa kg y reps, luego marca cada serie.'}
          </Text>
        </View>
      )}

      {/* Exercise list */}
      <Text style={[st.exListLabel, { color: theme.text3 }]}>EJERCICIOS</Text>
      {exercises.map((ex, ei) => {
        const isActive = ei === exIdx;
        const exCompletedSets = ex.sets.filter(s => s.done).length;
        return (
          <View key={ei} style={[st.exRow, { borderColor: isActive ? theme.accent : theme.line, backgroundColor: theme.surface }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setExIdx(ei)} activeOpacity={0.7}>
              <Text style={[st.exRowName, { color: isActive ? theme.text : theme.text2 }]}>{ex.name}</Text>
              <Text style={[st.exRowSub, { color: theme.text3 }]}>
                {ex.plan ? `Objetivo ${ex.plan.s} x ${ex.plan.reps}` : 'Personalizado'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setExIdx(ei); setShowTech(true); }} activeOpacity={0.7} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: theme.text3, fontSize: 10, letterSpacing: 1 }}>T{'é'}cnica</Text>
            </TouchableOpacity>
            <Text style={[st.exRowCount, { color: exCompletedSets === ex.sets.length && exCompletedSets > 0 ? theme.good : theme.text3 }]}>
              {exCompletedSets}/{ex.sets.length}
            </Text>
          </View>
        );
      })}

      {/* Add exercise button */}
      <TouchableOpacity
        style={[st.addExBtn, { borderColor: theme.line2 }]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: theme.text3, fontSize: 11, letterSpacing: 1.5 }}>+ A{'Ñ'}ADIR EJERCICIO</Text>
      </TouchableOpacity>

      {/* Technique card - shown when Técnica is toggled */}
      {showTech && currentEx && (
        <View style={[st.techCard, { borderColor: theme.line, backgroundColor: theme.surface, marginTop: 8 }]}>
          <Text style={[st.techTitle, { color: theme.text3 }]}>
            T{'É'}CNICA {'—'} {currentEx.name.toUpperCase()}
          </Text>

          <TouchableOpacity
            style={st.videoCard}
            activeOpacity={0.8}
            onPress={() => {
              const vid = YOUTUBE_VIDEOS[currentEx.name];
              const q = vid ? vid.q : encodeURIComponent(currentEx.name + ' shakil ahmed tone garage').replace(/%20/g, '+');
              Linking.openURL('https://www.youtube.com/results?search_query=' + q);
            }}
          >
            <Image
              source={{ uri: (YOUTUBE_VIDEOS[currentEx.name] || {}).img || '' }}
              style={st.vcImage}
              resizeMode="cover"
            />
            <View style={st.vcOverlay}>
              <View style={st.vcPlayBtn}>
                <View style={st.vcTriangle} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={st.linkRow}>
            <TouchableOpacity
              style={[st.linkBtn, { borderColor: theme.line }]}
              onPress={() => {
                const vid = YOUTUBE_VIDEOS[currentEx.name];
                const q = vid ? vid.q : encodeURIComponent(currentEx.name + ' shakil ahmed').replace(/%20/g, '+');
                Linking.openURL('https://www.youtube.com/results?search_query=' + q);
              }}
              activeOpacity={0.7}
            >
              <Text style={[st.linkBtnText, { color: theme.text2 }]}>
                {'▶'} YOUTUBE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.linkBtn, { borderColor: theme.line }]}
              onPress={() => Linking.openURL('https://www.instagram.com/' + SHAKIL_INSTAGRAM + '/')}
              activeOpacity={0.7}
            >
              <Text style={[st.linkBtnText, { color: theme.text2 }]}>
                {'◉'} INSTAGRAM
              </Text>
            </TouchableOpacity>
          </View>

          {currentPlan ? (
            <Text style={[st.techDesc, { color: theme.text3 }]}>
              {currentPlan.foco ? currentPlan.foco + '. ' : ''}
              {'Objetivo ' + currentPlan.s + '×' + currentPlan.reps}
              {currentPlan.rir ? ' · RIR ' + currentPlan.rir : ''}
              {currentPlan.rest ? ' · descanso ' + currentPlan.rest : ''}
              {'.'}
            </Text>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },

  headerLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginBottom: 6 },
  headerTitle: { fontSize: 30, fontWeight: '300', marginBottom: 24 },

  dayLabel: { fontSize: 14, marginBottom: 8 },
  hint: { fontSize: 13, marginBottom: 16 },
  exCard: { borderWidth: 1, padding: 16, marginBottom: 8 },
  exName: { fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  exDetail: { fontSize: 12 },
  focoText: { fontSize: 11, marginTop: 4, fontStyle: 'italic' },
  startBtn: { minHeight: 42, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  startBtnText: { fontSize: 12, fontWeight: '600', letterSpacing: 2.5, textTransform: 'uppercase' },

  bannerCard: { borderWidth: 1, padding: 16, marginBottom: 16 },
  bannerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  bannerLeft: { flex: 1 },
  bannerLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  blinkDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  bannerLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  timerText: { fontSize: 24, fontWeight: '300', fontVariant: ['tabular-nums'] },
  progressText: { fontSize: 11, marginTop: 4 },
  finishBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  finishBtnText: { fontSize: 11, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },

  techCard: { borderWidth: 1, padding: 16, marginBottom: 16 },
  techHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  techName: { fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  techSub: { fontSize: 12 },

  techTitle: { fontSize: 13, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  videoCard: { width: '100%', aspectRatio: 4 / 3, backgroundColor: '#0f0f0f', marginBottom: 8, overflow: 'hidden', position: 'relative' },
  vcImage: { width: '100%', height: '100%' },
  vcOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
  vcPlayBtn: { width: 56, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  vcTriangle: { width: 0, height: 0, borderLeftWidth: 14, borderTopWidth: 9, borderBottomWidth: 9, borderLeftColor: '#fff', borderTopColor: 'transparent', borderBottomColor: 'transparent', marginLeft: 3 },
  linkRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  linkBtn: { flex: 1, borderWidth: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: 'rgba(28,28,26,.5)' },
  linkBtnText: { fontSize: 11, letterSpacing: 2, fontWeight: '500' },
  techDesc: { fontSize: 13, lineHeight: 20 },

  setGridHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, marginBottom: 2 },
  setHeaderText: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '500' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 6 },
  setNum: { width: 30, fontSize: 13, fontWeight: '500' },
  setInput: { flex: 1, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 8, fontSize: 14, textAlign: 'center', fontVariant: ['tabular-nums'] },
  doneBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  addSetBtn: { borderWidth: 1, borderStyle: 'dashed', paddingVertical: 10, alignItems: 'center', marginTop: 8, marginBottom: 8 },

  chipHint: { fontSize: 11, marginTop: 2 },

  exListLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginBottom: 12, marginTop: 8 },
  exRow: { borderWidth: 1, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  exRowName: { fontSize: 12, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2 },
  exRowSub: { fontSize: 11 },
  exRowCount: { fontSize: 14, fontWeight: '500', marginLeft: 8 },

  addExBtn: { borderWidth: 1, borderStyle: 'dashed', paddingVertical: 14, alignItems: 'center', marginTop: 4 },

  searchInput: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 12 },
  pickerItem: { borderBottomWidth: 1, paddingVertical: 14, paddingHorizontal: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
