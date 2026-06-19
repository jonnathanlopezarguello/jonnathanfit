import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import { getState } from '../store';
import { calc, GOAL_LABEL } from '../data/calc';
import { PLAN_DAYS, DAY_TITLE } from '../data/templates';

const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MONTH_ES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { before: 'BUENOS ', highlight: 'DÍAS', after: ',' };
  if (h < 19) return { before: 'BUENAS ', highlight: 'TARDES', after: ',' };
  return { before: 'BUENAS ', highlight: 'NOCHES', after: ',' };
}

export default function HoyScreen({ theme }) {
  const [state, setState] = useState(getState());

  useEffect(() => { setState(getState()); }, []);

  const today = new Date();
  const dayName = DAY_ES[today.getDay()].toUpperCase();
  const dateStr = `${dayName}, ${today.getDate()} DE ${MONTH_ES[today.getMonth()]}`;
  const isTrainDay = PLAN_DAYS.includes(DAY_ES[today.getDay()]);
  const t = calc(state.profile);
  const greeting = getGreeting();
  const userName = (state.profile.name || 'ATLETA').toUpperCase();

  const todayISO = today.toLocaleDateString('en-CA');
  const logged = state.nutrition[todayISO] || [];
  const kcalLogged = logged.reduce((a, it) => a + it.kcal, 0);
  const protLogged = logged.reduce((a, it) => a + it.p, 0);
  const carbLogged = logged.reduce((a, it) => a + (it.c || 0), 0);
  const fatLogged = logged.reduce((a, it) => a + (it.f || 0), 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.date, { color: theme.text2 }]}>{dateStr}</Text>
      <Text style={styles.greeting}>
        <Text style={{ color: theme.text }}>{greeting.before}</Text>
        <Text style={{ color: theme.sand }}>{greeting.highlight}</Text>
        <Text style={{ color: theme.text }}>{greeting.after}</Text>
      </Text>
      <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>

      <View style={[styles.divider, { borderColor: theme.line }]}>
        <Text style={[styles.sectionLabel, { color: theme.text2, backgroundColor: theme.bg }]}>NUTRICIÓN DE HOY</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <View style={styles.kcalRow}>
          <View>
            <Text style={styles.kcalBig}>
              <Text style={{ color: theme.text }}>{Math.round(kcalLogged)}</Text>
              <Text style={{ color: theme.text3 }}> / {t.kcal} KCAL</Text>
            </Text>
            <Text style={[styles.goalLabel, { color: theme.text3 }]}>OBJETIVO {(GOAL_LABEL[state.profile.goal] || '').toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={[styles.registerBtn, { borderColor: theme.line }]}>
            <Text style={[styles.registerText, { color: theme.text }]}>REGISTRAR →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.kcalTrack, { backgroundColor: theme.line }]}>
          <View style={[styles.kcalFill, { width: `${Math.min(100, Math.round(kcalLogged / t.kcal * 100))}%`, backgroundColor: theme.sand }]} />
        </View>

        <View style={styles.macroGrid}>
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={[styles.macroLabel, { color: theme.text2 }]}>PROTEÍNA</Text>
              <Text>
                <Text style={{ color: theme.text, fontSize: 28, fontWeight: '200' }}>{Math.round(protLogged)}</Text>
                <Text style={{ color: theme.text3, fontSize: 13 }}> / {t.protein} g</Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.line }]}>
              <View style={[styles.macroFill, { width: `${Math.min(100, Math.round(protLogged / t.protein * 100))}%`, backgroundColor: theme.sand }]} />
            </View>
          </View>

          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={[styles.macroLabel, { color: theme.text2 }]}>CARBOS</Text>
              <Text>
                <Text style={{ color: theme.text, fontSize: 28, fontWeight: '200' }}>{Math.round(carbLogged)}</Text>
                <Text style={{ color: theme.text3, fontSize: 13 }}> / {t.carbs} g</Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.line }]}>
              <View style={[styles.macroFill, { width: `${Math.min(100, Math.round(carbLogged / t.carbs * 100))}%`, backgroundColor: theme.sand }]} />
            </View>
          </View>
        </View>

        <View style={styles.macroGrid}>
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={[styles.macroLabel, { color: theme.text2 }]}>GRASA</Text>
              <Text>
                <Text style={{ color: theme.text, fontSize: 28, fontWeight: '200' }}>{Math.round(fatLogged)}</Text>
                <Text style={{ color: theme.text3, fontSize: 13 }}> / {t.fat} g</Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.line }]}>
              <View style={[styles.macroFill, { width: `${Math.min(100, t.fat > 0 ? Math.round(fatLogged / t.fat * 100) : 0)}%`, backgroundColor: theme.sand }]} />
            </View>
          </View>

          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text style={[styles.macroLabel, { color: theme.text2 }]}>FIBRA</Text>
              <Text>
                <Text style={{ color: theme.text, fontSize: 28, fontWeight: '200' }}>0</Text>
                <Text style={{ color: theme.text3, fontSize: 13 }}> / {t.fiber} g</Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.line }]}>
              <View style={[styles.macroFill, { width: '0%', backgroundColor: theme.sand }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { borderColor: theme.line }]}>
        <Text style={[styles.sectionLabel, { color: theme.text2, backgroundColor: theme.bg }]}>ENTRENAMIENTO</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        {isTrainDay ? (
          <>
            <Text style={[styles.trainTitle, { color: theme.text }]}>{DAY_TITLE[DAY_ES[today.getDay()]]}</Text>
            <Text style={[styles.trainHint, { color: theme.text2 }]}>Ve a la pestaña Entreno para empezar tu sesión</Text>
          </>
        ) : (
          <Text style={[styles.trainHint, { color: theme.text2 }]}>Día de descanso — aprovecha para recuperar</Text>
        )}
      </View>

      <View style={[styles.divider, { borderColor: theme.line }]}>
        <Text style={[styles.sectionLabel, { color: theme.text2, backgroundColor: theme.bg }]}>OBJETIVO</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text style={[styles.goalText, { color: theme.text }]}>{GOAL_LABEL[state.profile.goal]}</Text>
        <Text style={[styles.trainHint, { color: theme.text3 }]}>BMR {t.bmr} · TDEE {t.tdee} · Objetivo {t.kcal} kcal</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  date: { fontSize: 12, letterSpacing: 3, marginBottom: 8 },
  greeting: { fontSize: 32, fontWeight: '200', letterSpacing: -0.5, lineHeight: 40 },
  userName: { fontSize: 32, fontWeight: '200', letterSpacing: -0.5, marginBottom: 32, lineHeight: 40 },
  divider: { borderTopWidth: 1, marginBottom: 20, marginTop: 8 },
  sectionLabel: {
    position: 'absolute',
    top: -9,
    left: 0,
    paddingRight: 12,
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '400',
  },
  card: { borderWidth: 1, padding: 24, marginBottom: 24 },
  kcalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  kcalBig: { fontSize: 36, fontWeight: '200' },
  goalLabel: { fontSize: 10, letterSpacing: 2.5, marginTop: 4 },
  registerBtn: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  registerText: { fontSize: 11, letterSpacing: 2.5, fontWeight: '500' },
  kcalTrack: { height: 3, marginTop: 16, marginBottom: 28 },
  kcalFill: { height: 3 },
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 20 },
  macroCol: { flex: 1 },
  macroLabelRow: { marginBottom: 8 },
  macroLabel: { fontSize: 10, letterSpacing: 2.5, marginBottom: 4 },
  macroTrack: { height: 2.5 },
  macroFill: { height: 2.5 },
  trainTitle: { fontSize: 15, fontWeight: '400', marginBottom: 6 },
  trainHint: { fontSize: 13, lineHeight: 20 },
  goalText: { fontSize: 20, fontWeight: '300', marginBottom: 6 },
});
