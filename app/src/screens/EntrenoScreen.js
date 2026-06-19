import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getState, updateState } from '../store';
import { PLAN_DAYS, DAY_TITLE, TEMPLATES } from '../data/templates';

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
  const [sets, setSets] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { setState(getState()); }, []);

  // Timer for active session
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

  async function startSession() {
    if (!planEx) return;
    const exercises = planEx.map(e => ({
      name: e.n, plan: e,
      sets: Array.from({ length: e.s }, () => ({ kg: '', reps: '', done: false }))
    }));
    const s = await updateState(s => {
      s.active = {
        id: Date.now(), name: DAY_TITLE[dayName] || dayName,
        date: new Date().toLocaleDateString('en-CA'),
        start: Date.now(), exercises
      };
    });
    setState({ ...s });
    setExIdx(0);
    setSets({});
  }

  async function finishWorkout() {
    Alert.alert('Finalizar sesion', 'Guardar este entrenamiento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Guardar', onPress: async () => {
        const s = await updateState(s => {
          const a = s.active;
          a.exercises = a.exercises.filter(e => e.sets.some(ss => ss.done));
          a.dur = Math.round((Date.now() - a.start) / 60000);
          s.workouts.unshift(a);
          s.active = null;
        });
        setState({ ...s });
        setSets({});
        setExIdx(0);
      }}
    ]);
  }

  function toggleSet(ei, si) {
    const key = `${ei}-${si}`;
    const next = { ...sets, [key]: !sets[key] };
    setSets(next);
    // Also update store
    updateState(s => {
      if (s.active && s.active.exercises[ei]) {
        s.active.exercises[ei].sets[si].done = !s.active.exercises[ei].sets[si].done;
      }
    }).then(s => setState({ ...s }));
  }

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
  const completedSets = currentSets.filter((_, si) => sets[`${exIdx}-${si}`]).length;
  const totalSets = currentSets.length;

  // Find last workout data for the current exercise
  function getLastData(exName) {
    for (const w of state.workouts) {
      const ex = w.exercises && w.exercises.find(e => e.name === exName);
      if (ex && ex.sets) {
        const best = ex.sets.filter(ss => ss.done).sort((a, b) => (+b.kg || 0) - (+a.kg || 0))[0];
        if (best) return `${best.kg} kg x ${best.reps}`;
      }
    }
    return null;
  }

  const lastStr = currentEx ? getLastData(currentEx.name) : null;
  const targetStr = currentPlan ? `${currentPlan.s} x ${currentPlan.reps}` : '';

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
          </View>
          <TouchableOpacity style={[st.finishBtn, { backgroundColor: theme.accent }]} onPress={finishWorkout} activeOpacity={0.8}>
            <Text style={[st.finishBtnText, { color: theme.bg }]}>FINALIZAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise technique card */}
      {currentEx && (
        <View style={[st.techCard, { borderColor: theme.line, backgroundColor: theme.surface }]}>
          <View style={st.techHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[st.techName, { color: theme.text }]}>{currentEx.name}</Text>
              <Text style={[st.techSub, { color: theme.text3 }]}>
                {lastStr ? `Ultima ${lastStr}` : 'Sin datos previos'}
                {' · '}Objetivo {targetStr}
              </Text>
            </View>
            {currentPlan && currentPlan.foco ? (
              <View style={[st.techBadge, { borderColor: theme.line }]}>
                <Text style={[st.techBadgeText, { color: theme.text3 }]}>TECNICA</Text>
              </View>
            ) : null}
          </View>

          {/* Set chips */}
          <View style={st.chipRow}>
            {currentSets.map((set, si) => {
              const key = `${exIdx}-${si}`;
              const marked = !!sets[key];
              return (
                <TouchableOpacity
                  key={si}
                  style={[
                    st.chip,
                    { borderColor: marked ? theme.accent : theme.line },
                    marked && { backgroundColor: theme.accentSoft },
                  ]}
                  onPress={() => toggleSet(exIdx, si)}
                  activeOpacity={0.7}
                >
                  {marked ? (
                    <Text style={[st.chipText, { color: theme.text }]}>
                      {'✓'} {set.kg || '?'} {'×'} {set.reps || '?'}
                    </Text>
                  ) : (
                    <Text style={[st.chipText, { color: theme.text2 }]}>Serie {si + 1}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[st.chipHint, { color: theme.text3 }]}>
            {completedSets > 0
              ? `${completedSets} de ${totalSets} series completadas`
              : 'Toca una serie para marcarla como completada.'}
          </Text>
        </View>
      )}

      {/* Exercise list */}
      <Text style={[st.exListLabel, { color: theme.text3 }]}>EJERCICIOS</Text>
      {exercises.map((ex, ei) => {
        const isActive = ei === exIdx;
        const exCompletedSets = ex.sets.filter((_, si) => sets[`${ei}-${si}`]).length;
        return (
          <TouchableOpacity
            key={ei}
            style={[
              st.exRow,
              { borderColor: isActive ? theme.accent : theme.line, backgroundColor: theme.surface },
            ]}
            onPress={() => setExIdx(ei)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1 }}>
              <Text style={[st.exRowName, { color: isActive ? theme.text : theme.text2 }]}>{ex.name}</Text>
              <Text style={[st.exRowSub, { color: theme.text3 }]}>
                Objetivo {ex.plan ? `${ex.plan.s} x ${ex.plan.reps}` : '?'}
              </Text>
            </View>
            <Text style={[st.exRowCount, { color: exCompletedSets === ex.sets.length ? theme.good : theme.text3 }]}>
              {exCompletedSets}/{ex.sets.length}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },

  // Header
  headerLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginBottom: 6 },
  headerTitle: { fontSize: 30, fontWeight: '300', marginBottom: 24 },

  // No-session
  dayLabel: { fontSize: 14, marginBottom: 8 },
  hint: { fontSize: 13, marginBottom: 16 },
  exCard: { borderWidth: 1, padding: 16, marginBottom: 8 },
  exName: { fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  exDetail: { fontSize: 12 },
  startBtn: { minHeight: 42, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  startBtnText: { fontSize: 12, fontWeight: '600', letterSpacing: 2.5, textTransform: 'uppercase' },

  // Session banner
  bannerCard: { borderWidth: 1, padding: 16, marginBottom: 16 },
  bannerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerLeft: { flex: 1 },
  bannerLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  blinkDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  bannerLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  timerText: { fontSize: 24, fontWeight: '300', fontVariant: ['tabular-nums'] },
  finishBtn: { paddingHorizontal: 16, paddingVertical: 10, marginLeft: 12 },
  finishBtnText: { fontSize: 11, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },

  // Technique card
  techCard: { borderWidth: 1, padding: 16, marginBottom: 16 },
  techHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  techName: { fontSize: 13, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  techSub: { fontSize: 12 },
  techBadge: { borderWidth: 1, paddingVertical: 6, paddingHorizontal: 9, marginLeft: 8 },
  techBadgeText: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '500' },

  // Set chips
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  chip: { borderWidth: 1, paddingVertical: 10, paddingHorizontal: 14, minWidth: 80, alignItems: 'center' },
  chipText: { fontSize: 12, fontWeight: '500' },
  chipHint: { fontSize: 11, marginTop: 2 },

  // Exercise list
  exListLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginBottom: 12, marginTop: 8 },
  exRow: { borderWidth: 1, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  exRowName: { fontSize: 12, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2 },
  exRowSub: { fontSize: 11 },
  exRowCount: { fontSize: 14, fontWeight: '500', marginLeft: 8 },
});
