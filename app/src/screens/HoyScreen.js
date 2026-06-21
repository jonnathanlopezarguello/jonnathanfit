import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';
import { PLAN_DAYS, DAY_TITLE, TEMPLATES } from '../data/templates';

const DAY_ES = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
const DAY_SHORT = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
const MONTH_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { word: 'dias', rest: 'Buenos ' };
  if (h < 19) return { word: 'tardes', rest: 'Buenas ' };
  return { word: 'noches', rest: 'Buenas ' };
}

function SectionDivider({ label, theme }) {
  return (
    <View style={s.dividerRow}>
      <Text style={[s.dividerLabel, { color: theme.text3 }]}>{label}</Text>
      <View style={[s.dividerLine, { backgroundColor: theme.line }]} />
    </View>
  );
}

export default function HoyScreen({ theme, setTab }) {
  const [state, setState] = useState(getState());

  useEffect(() => { setState(getState()); }, []);

  const today = new Date();
  const dateStr = `${DAY_SHORT[today.getDay()]} ${today.getDate()} ${MONTH_SHORT[today.getMonth()]}`;
  const dayName = DAY_ES[today.getDay()];
  const isTrainDay = PLAN_DAYS.includes(['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'][today.getDay()] === dayName ? DAY_ES[today.getDay()] : dayName);
  const realDayName = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][today.getDay()];
  const isTraining = PLAN_DAYS.includes(realDayName);
  const t = calc(state.profile);
  const greeting = getGreeting();
  const userName = state.profile.name || 'Atleta';

  const todayISO = today.toLocaleDateString('en-CA');
  const logged = state.nutrition[todayISO] || [];
  const kcalLogged = Math.round(logged.reduce((a, it) => a + it.kcal, 0));
  const protLogged = Math.round(logged.reduce((a, it) => a + it.p, 0));
  const carbLogged = Math.round(logged.reduce((a, it) => a + (it.c || 0), 0));
  const fatLogged = Math.round(logged.reduce((a, it) => a + (it.f || 0), 0));
  const fiberLogged = Math.round(logged.reduce((a, it) => a + (it.fb || 0), 0));

  const kcalRemaining = Math.max(0, t.kcal - kcalLogged);
  const kcalPct = t.kcal > 0 ? Math.min(1, kcalLogged / t.kcal) : 0;

  // Overload objectives: pick first 3 exercises from today's template
  const planEx = TEMPLATES[realDayName];
  const overloadExercises = (planEx || []).slice(0, 3);

  // Find last workout data for overload targets
  function getLastData(exName) {
    for (const w of state.workouts) {
      const ex = w.exercises && w.exercises.find(e => e.name === exName);
      if (ex && ex.sets) {
        const best = ex.sets.filter(ss => ss.done).sort((a, b) => (+b.kg || 0) - (+a.kg || 0))[0];
        if (best) return { kg: +best.kg || 0, reps: +best.reps || 0 };
      }
    }
    return null;
  }

  const macros = [
    { label: 'PROTEINA', value: protLogged, target: t.protein, color: theme.accent, barColor: theme.accent },
    { label: 'CARBOS', value: carbLogged, target: t.carbs, color: theme.text, barColor: theme.text3 },
    { label: 'GRASA', value: fatLogged, target: t.fat, color: theme.text, barColor: theme.text3 },
    { label: 'FIBRA', value: fiberLogged, target: t.fiber, color: theme.good, barColor: theme.good },
  ];

  return (
    <ScrollView style={[s.container, { backgroundColor: theme.bg }]} contentContainerStyle={s.content}>
      {/* Greeting section */}
      <Text style={[s.dateText, { color: theme.text3 }]}>{dateStr}</Text>
      <Text style={s.greetingLine}>
        <Text style={{ color: theme.text, fontSize: 30, fontWeight: '300' }}>{greeting.rest}</Text>
        <Text style={{ color: theme.text3, fontSize: 30, fontWeight: '300' }}>{greeting.word}</Text>
        <Text style={{ color: theme.text, fontSize: 30, fontWeight: '300' }}>, {userName}</Text>
      </Text>

      {/* Nutrition section */}
      <SectionDivider label="NUTRICION DE HOY" theme={theme} />

      <View style={[s.card, { borderColor: theme.line, backgroundColor: theme.surface }]}>
        {/* Kcal ring + remaining */}
        <View style={s.kcalRow}>
          <View style={[s.kcalRing, { borderColor: kcalPct > 0 ? theme.accent : theme.line }]}>
            <Text style={[s.kcalCenter, { color: theme.text }]}>{kcalLogged}</Text>
            <Text style={[s.kcalLabel, { color: theme.text3 }]}>KCAL</Text>
          </View>
          <View style={s.kcalRight}>
            <Text style={[s.restantesLabel, { color: theme.text3 }]}>RESTANTES</Text>
            <Text style={[s.restantesNum, { color: theme.text }]}>{kcalRemaining}</Text>
            <Text style={[s.restantesSub, { color: theme.text3 }]}>
              de {t.kcal.toLocaleString()} kcal {'·'} {GOAL_LABEL[state.profile.goal] || 'Volumen'}
            </Text>
          </View>
        </View>

        {/* 4-column macro grid */}
        <View style={s.macroGrid}>
          {macros.map((m, i) => {
            const pct = m.target > 0 ? Math.min(1, m.value / m.target) : 0;
            return (
              <View key={i} style={s.macroCol}>
                <Text style={{ fontSize: 18, fontWeight: '300', color: m.color }}>{m.value}</Text>
                <Text style={{ fontSize: 10, color: theme.text3 }}>/{m.target}</Text>
                <Text style={[s.macroLabel, { color: theme.text3 }]}>{m.label}</Text>
                <View style={[s.macroTrack, { backgroundColor: theme.line }]}>
                  <View style={[s.macroFill, { width: `${Math.round(pct * 100)}%`, backgroundColor: m.barColor }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Training section */}
      <SectionDivider label="ENTRENAMIENTO" theme={theme} />

      <View style={[s.card, { borderColor: theme.line, backgroundColor: theme.surface }]}>
        {isTraining ? (
          <>
            <Text style={[s.sugLabel, { color: theme.text3 }]}>SUGERIDO HOY</Text>
            <Text style={[s.sessionName, { color: theme.text }]}>
              {DAY_TITLE[realDayName] || realDayName}
            </Text>

            <TouchableOpacity style={[s.iniciarBtn, { backgroundColor: theme.accent }]} activeOpacity={0.8} onPress={() => setTab && setTab('Entreno')}>
              <Text style={[s.iniciarText, { color: theme.bg }]}>INICIAR</Text>
            </TouchableOpacity>

            {overloadExercises.length > 0 && (
              <>
                <Text style={[s.overloadLabel, { color: theme.text3 }]}>OBJETIVOS DE SOBRECARGA</Text>
                {overloadExercises.map((ex, i) => {
                  const last = getLastData(ex.n);
                  const targetKg = last ? last.kg : '?';
                  const targetReps = last ? last.reps : ex.reps;
                  return (
                    <View key={i} style={[s.overloadRow, i < overloadExercises.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
                      <Text style={[s.overloadName, { color: theme.text2 }]}>{ex.n}</Text>
                      <Text style={[s.overloadTarget, { color: theme.text3 }]}>
                        {targetKg} kg {'×'} {targetReps}
                      </Text>
                    </View>
                  );
                })}
              </>
            )}
          </>
        ) : (
          <Text style={{ fontSize: 13, color: theme.text2, lineHeight: 20 }}>
            Dia de descanso {'—'} aprovecha para recuperar
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },

  // Greeting
  dateText: { fontSize: 11, fontWeight: '500', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 },
  greetingLine: { fontSize: 30, fontWeight: '300', lineHeight: 38, marginBottom: 32 },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  dividerLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginRight: 12 },
  dividerLine: { flex: 1, height: 1 },

  // Card
  card: { borderWidth: 1, padding: 20, marginBottom: 24 },

  // Kcal ring area
  kcalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  kcalRing: {
    width: 98, height: 98, borderRadius: 49, borderWidth: 4,
    justifyContent: 'center', alignItems: 'center', marginRight: 20,
  },
  kcalCenter: { fontSize: 25, fontWeight: '300' },
  kcalLabel: { fontSize: 9, letterSpacing: 1.5 },
  kcalRight: { flex: 1 },
  restantesLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  restantesNum: { fontSize: 30, fontWeight: '300', marginBottom: 2 },
  restantesSub: { fontSize: 12 },

  // Macro grid
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  macroCol: { flex: 1, marginRight: 8 },
  macroLabel: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2, marginBottom: 6 },
  macroTrack: { height: 2, borderRadius: 1 },
  macroFill: { height: 2, borderRadius: 1 },

  // Training
  sugLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginBottom: 6 },
  sessionName: { fontSize: 26, fontWeight: '300', lineHeight: 32, marginBottom: 20 },
  iniciarBtn: { minHeight: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  iniciarText: { fontSize: 12, fontWeight: '600', letterSpacing: 2.5, textTransform: 'uppercase' },

  // Overload
  overloadLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginBottom: 12, color: '#8A8A82' },
  overloadRow: { paddingVertical: 10 },
  overloadName: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  overloadTarget: { fontSize: 12 },
});
