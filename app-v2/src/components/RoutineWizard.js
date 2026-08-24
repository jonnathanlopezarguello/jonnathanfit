import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import theme from '../theme';
import { save, KEYS } from '../store';

const STEPS = ['Nivel', 'Objetivo', 'Días', 'Equipo'];

const LEVEL_OPTS = [
  { k: 'novato',       l: 'Novato',       d: 'Nunca he entrenado con pesas' },
  { k: 'principiante', l: 'Principiante', d: '3-12 meses de experiencia' },
  { k: 'intermedio',   l: 'Intermedio',   d: '1-3 años entrenando seguido' },
  { k: 'avanzado',     l: 'Avanzado',     d: '3+ años entrenando seguido' },
];

const GOAL_OPTS = [
  { k: 'hipertrofia',    l: 'Ganar músculo',  d: 'Series de 8-15 reps, RIR 0-3' },
  { k: 'fuerza',          l: 'Aumentar fuerza', d: 'Series de 3-6 reps, más peso' },
  { k: 'perdida_grasa',  l: 'Perder grasa',   d: 'Mismo entreno que hipertrofia + déficit calórico' },
];

const DAYS_OPTS = [2, 3, 4, 5, 6];

function daysHint(d) {
  if (d === 2) return 'Rutina de cuerpo completo (Full Body) de 3 días — con 2 días disponibles, haces solo 2 de esas 3 sesiones cada semana.';
  if (d === 3) return 'Rutina de cuerpo completo (Full Body) — cada sesión trabaja todo el cuerpo.';
  if (d === 4) return 'Rutina Torso/Pierna en 4 días — la original de la app.';
  if (d === 5) return 'Rutina Push/Pull/Legs (empuje/tirón/pierna) de 6 días — con 5 días disponibles, se omite el segundo día de pierna.';
  return 'Rutina Push/Pull/Legs (empuje/tirón/pierna) — cada grupo se entrena 2 veces por semana.';
}

const EQUIPMENT_OPTS = [
  { k: 'gym',            l: 'Gimnasio completo', d: 'Barras, máquinas, poleas y mancuernas' },
  { k: 'casa',            l: 'Casa con mancuernas', d: 'Mancuernas y peso corporal' },
  { k: 'peso_corporal',  l: 'Solo peso corporal', d: 'Sin ningún equipo' },
];

export default function RoutineWizard({ visible, profile, onClose, onSaved }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    level: profile.level, trainGoal: profile.trainGoal,
    daysPerWeek: profile.daysPerWeek, equipment: profile.equipment,
  });

  // El modal se monta una sola vez y solo se oculta/muestra con `visible`, así
  // que reseteamos las respuestas al perfil actual cada vez que se abre —
  // si no, se queda pegado a lo que había en el primer render (perfil aún
  // sin cargar) o a una edición cancelada de una apertura anterior.
  useEffect(() => {
    if (visible) {
      setStep(0);
      setAnswers({
        level: profile.level, trainGoal: profile.trainGoal,
        daysPerWeek: profile.daysPerWeek, equipment: profile.equipment,
      });
    }
  }, [visible]);

  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = async () => {
    const next = { ...profile, ...answers };
    if (answers.trainGoal === 'perdida_grasa') {
      next.goal = 'cut';
    } else if (profile.trainGoal === 'perdida_grasa') {
      // Salía de "Perder grasa" hacia otro objetivo — no dejar el déficit pegado.
      next.goal = 'maint';
    }
    await save(KEYS.profile, next);
    onSaved(next);
    setStep(0);
  };

  const canAdvance =
    (step === 0 && !!answers.level) ||
    (step === 1 && !!answers.trainGoal) ||
    (step === 2 && !!answers.daysPerWeek) ||
    (step === 3 && !!answers.equipment);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>

          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Personalizar rutina</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Progress */}
          <View style={s.progressRow}>
            {STEPS.map((label, i) => (
              <View key={label} style={s.progressItem}>
                <View style={[s.progressDot, i <= step && s.progressDotOn]} />
                <Text style={[s.progressLbl, i === step && s.progressLblOn]}>{label}</Text>
              </View>
            ))}
          </View>

          <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
            <View style={s.pad}>

              {step === 0 && (
                <>
                  <Text style={s.question}>¿Cuál es tu experiencia entrenando?</Text>
                  {LEVEL_OPTS.map((opt) => (
                    <OptionCard
                      key={opt.k}
                      label={opt.l}
                      desc={opt.d}
                      active={answers.level === opt.k}
                      onPress={() => set('level', opt.k)}
                    />
                  ))}
                </>
              )}

              {step === 1 && (
                <>
                  <Text style={s.question}>¿Qué quieres lograr?</Text>
                  {GOAL_OPTS.map((opt) => (
                    <OptionCard
                      key={opt.k}
                      label={opt.l}
                      desc={opt.d}
                      active={answers.trainGoal === opt.k}
                      onPress={() => set('trainGoal', opt.k)}
                    />
                  ))}
                  {answers.trainGoal === 'perdida_grasa' && (
                    <Text style={s.hint}>
                      El entrenamiento usa la misma tabla que "Ganar músculo" — perder grasa se
                      logra con el déficit calórico, no con más repeticiones. Al guardar, tu
                      objetivo nutricional en Perfil cambia automáticamente a "Definición".
                    </Text>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={s.question}>¿Cuántos días a la semana puedes entrenar?</Text>
                  <View style={s.daysGrid}>
                    {DAYS_OPTS.map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[s.dayCell, answers.daysPerWeek === d && s.dayCellOn]}
                        onPress={() => set('daysPerWeek', d)}
                        activeOpacity={0.7}
                      >
                        <Text style={[s.dayCellNum, answers.daysPerWeek === d && s.dayCellNumOn]}>{d}</Text>
                        <Text style={[s.dayCellLbl, answers.daysPerWeek === d && s.dayCellLblOn]}>días</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={s.hint}>{daysHint(answers.daysPerWeek)}</Text>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={s.question}>¿Qué equipo tienes disponible?</Text>
                  {EQUIPMENT_OPTS.map((opt) => (
                    <OptionCard
                      key={opt.k}
                      label={opt.l}
                      desc={opt.d}
                      active={answers.equipment === opt.k}
                      onPress={() => set('equipment', opt.k)}
                    />
                  ))}
                </>
              )}

              <View style={{ height: 24 }} />
            </View>
          </ScrollView>

          <View style={s.footer}>
            {step > 0 ? (
              <TouchableOpacity style={s.btnSecondary} onPress={back} activeOpacity={0.7}>
                <Text style={s.btnSecondaryTxt}>ATRÁS</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            <TouchableOpacity
              style={[s.btnPrimary, !canAdvance && s.btnDisabled]}
              onPress={next}
              disabled={!canAdvance}
              activeOpacity={0.7}
            >
              <Text style={s.btnPrimaryTxt}>{step === STEPS.length - 1 ? 'GUARDAR' : 'SIGUIENTE'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function OptionCard({ label, desc, active, onPress }) {
  return (
    <TouchableOpacity style={[s.option, active && s.optionOn]} onPress={onPress} activeOpacity={0.7}>
      <View style={{ flex: 1 }}>
        <Text style={[s.optionLbl, active && s.optionLblOn]}>{label}</Text>
        <Text style={s.optionDesc}>{desc}</Text>
      </View>
      <View style={[s.radio, active && s.radioOn]}>
        {active && <View style={s.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: theme.bg, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.line, height: '90%' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: theme.text, letterSpacing: 0.2 },
  closeBtn:    { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeTxt:    { fontSize: 14, color: theme.text3, fontWeight: '700' },

  progressRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: theme.line, gap: 4 },
  progressItem: { flex: 1, alignItems: 'center', gap: 4 },
  progressDot: { width: '100%', height: 2, backgroundColor: theme.line2 },
  progressDotOn: { backgroundColor: theme.text },
  progressLbl: { fontSize: 9, fontWeight: '600', letterSpacing: 0.5, color: theme.text3, textTransform: 'uppercase' },
  progressLblOn: { color: theme.text },

  content: { flex: 1 },
  pad: { padding: 16 },
  question: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 16, marginTop: 4 },
  hint: { fontSize: 12, color: theme.text3, lineHeight: 18, marginTop: 12, backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.line2, padding: 12 },

  option: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.line2, padding: 14, marginBottom: 10, gap: 12 },
  optionOn: { borderColor: theme.text, backgroundColor: theme.accentSoft },
  optionLbl: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 3 },
  optionLblOn: { color: theme.text },
  optionDesc: { fontSize: 12, color: theme.text3, lineHeight: 16 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: theme.line2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioOn: { borderColor: theme.text },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.text },

  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dayCell: { width: '18%', aspectRatio: 1, borderWidth: 1, borderColor: theme.line2, alignItems: 'center', justifyContent: 'center' },
  dayCellOn: { borderColor: theme.text, backgroundColor: theme.accentSoft },
  dayCellNum: { fontSize: 20, fontWeight: '300', color: theme.text },
  dayCellNumOn: { color: theme.text, fontWeight: '600' },
  dayCellLbl: { fontSize: 9, color: theme.text3, marginTop: 2 },
  dayCellLblOn: { color: theme.text3 },

  footer: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: theme.line },
  btnPrimary: { flex: 1, backgroundColor: theme.accent, paddingVertical: 14, alignItems: 'center' },
  btnDisabled: { opacity: 0.35 },
  btnPrimaryTxt: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, color: theme.bg },
  btnSecondary: { flex: 1, borderWidth: 1, borderColor: theme.line2, paddingVertical: 14, alignItems: 'center' },
  btnSecondaryTxt: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, color: theme.text2 },
});
