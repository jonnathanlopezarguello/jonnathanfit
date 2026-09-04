import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import Body from 'react-native-body-highlighter';
import { EXERCISE_MUSCLE_MAP, MUSCLE_MAP, MUSCLE_TO_SLUG } from '../data/bodymap';
import { getCategory } from '../utils';
import theme from '../theme';

const SECONDARY_COLOR = 'rgba(127,176,122,0.4)';

const MUSCLE_LABELS = {
  'Cuadriceps':    'Cuádriceps',
  'Femoral/Gluteo':'Femoral & Glúteo',
  'Femoral':       'Femoral',
  'Gluteo':        'Glúteo',
  'Hombro':        'Deltoides',
  'Abdomen':       'Abdominales',
  'Gemelo':        'Gemelo',
  'Espalda':       'Dorsal Ancho',
  'Biceps':        'Bíceps',
  'Triceps':       'Tríceps',
  'Pecho':         'Pectorales',
  'Trapecio':      'Trapecio',
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getInstructions(ex) {
  const cues = (ex.f || '').split(';').map(s => s.trim()).filter(Boolean);
  return [
    `Ajusta el equipo y ubícate en posición correcta para ${ex.n}.`,
    ...cues.map(c => c.charAt(0).toUpperCase() + c.slice(1) + '.'),
    `Realiza ${ex.r} repeticiones controlando el movimiento — 2-3 seg en la fase excéntrica (bajada).`,
    `Descansa ${ex.re} entre series para recuperación muscular óptima.`,
    'Mantén la técnica en todas las series. La calidad supera al peso.',
  ];
}

/* ── Main Modal ──────────────────────────────────────────────────────────── */
export default function ExerciseDetailModal({ visible, exercise, onClose }) {
  const [tab, setTab] = useState('musculatura');

  if (!exercise || !exercise.g) return null;

  const muscleEntries = EXERCISE_MUSCLE_MAP[exercise.n] || MUSCLE_MAP[exercise.g] || [];
  const primaryMuscles   = muscleEntries.filter(([, w]) => w >= 1.0).map(([m]) => m);
  const secondaryMuscles = muscleEntries.filter(([, w]) => w < 1.0).map(([m]) => m);

  const slugColors = {};
  muscleEntries.forEach(([muscle, weight]) => {
    const slug = MUSCLE_TO_SLUG[muscle];
    if (!slug) return;
    if (weight >= 1.0) slugColors[slug] = theme.good;
    else if (!slugColors[slug]) slugColors[slug] = SECONDARY_COLOR;
  });
  const bodyData = Object.entries(slugColors).map(([slug, color]) => ({ slug, color }));

  const category     = getCategory(exercise.n);
  const instructions = getInstructions(exercise);
  const groupLabel    = MUSCLE_LABELS[exercise.g] || exercise.g;
  const initial       = exercise.g.charAt(0).toUpperCase();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>

          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Detalles del ejercicio</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Exercise identifier */}
          <View style={s.exHeader}>
            <View style={s.exIcon}>
              <Text style={s.exIconTxt}>{initial}</Text>
            </View>
            <View style={s.exMeta}>
              <Text style={s.exName}>{exercise.n}</Text>
              <Text style={s.exCat}>{category}</Text>
            </View>
          </View>

          <View style={s.divLine} />

          {/* Tabs */}
          <View style={s.tabRow}>
            {[
              { k: 'informacion',   l: 'Información' },
              { k: 'instrucciones', l: 'Instrucciones' },
              { k: 'musculatura',   l: 'Musculatura' },
            ].map(t => (
              <TouchableOpacity
                key={t.k}
                style={[s.tabBtn, tab === t.k && s.tabBtnOn]}
                onPress={() => setTab(t.k)}
                activeOpacity={0.7}
              >
                <Text style={[s.tabTxt, tab === t.k && s.tabTxtOn]}>{t.l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.divLine} />

          <ScrollView style={s.content} showsVerticalScrollIndicator={false}>

            {/* ── Información ── */}
            {tab === 'informacion' && (
              <View style={s.pad}>
                <InfoRow label="Grupo muscular"      value={groupLabel} />
                <InfoRow label="Músculo específico"  value={primaryMuscles.join(' · ') || groupLabel} />
                <InfoRow label="Series"              value={`${exercise.s} series`} />
                <InfoRow label="Repeticiones"        value={exercise.r} />
                <InfoRow label="RIR objetivo"        value={`${exercise.ri} reps en reserva`} />
                <InfoRow label="Descanso"            value={exercise.re} />
                <InfoRow label="Equipamiento"        value={category} last />
                {exercise.f ? (
                  <View style={s.noteBox}>
                    <Text style={s.noteLabel}>FOCO DE EJECUCIÓN</Text>
                    <Text style={s.noteTxt}>{exercise.f}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* ── Instrucciones ── */}
            {tab === 'instrucciones' && (
              <View style={s.pad}>
                {instructions.map((step, i) => (
                  <View key={i} style={s.stepRow}>
                    <View style={s.stepNum}>
                      <Text style={s.stepNumTxt}>{i + 1}</Text>
                    </View>
                    <Text style={s.stepTxt}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── Musculatura ── */}
            {tab === 'musculatura' && (
              <View style={s.pad}>
                <View style={s.bodiesRow}>
                  <View style={s.bodyCol}>
                    <Text style={s.bodyLbl}>FRONTAL</Text>
                    <Body data={bodyData} side="front" scale={0.75} defaultFill={theme.line2} defaultStroke={theme.bg} defaultStrokeWidth={1.5} border={theme.bg} />
                  </View>
                  <View style={s.bodyCol}>
                    <Text style={s.bodyLbl}>POSTERIOR</Text>
                    <Body data={bodyData} side="back" scale={0.75} defaultFill={theme.line2} defaultStroke={theme.bg} defaultStrokeWidth={1.5} border={theme.bg} />
                  </View>
                </View>

                <View style={s.divLine} />

                <Text style={s.muscTitle}>Músculos trabajados</Text>
                {primaryMuscles.map((m) => (
                  <View key={m} style={s.muscPill}>
                    <View style={[s.muscDot, { backgroundColor: theme.good }]} />
                    <Text style={s.muscName}>{m}</Text>
                    <Text style={s.muscTag}>PRIMARIO</Text>
                  </View>
                ))}
                {secondaryMuscles.map((m) => (
                  <View key={m} style={s.muscPill}>
                    <View style={[s.muscDot, { backgroundColor: SECONDARY_COLOR }]} />
                    <Text style={s.muscName}>{m}</Text>
                    <Text style={s.muscTag}>SECUNDARIO</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 48 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <View style={[s.infoRow, !last && s.infoRowBorder]}>
      <Text style={s.infoLbl}>{label}</Text>
      <Text style={s.infoVal}>{value}</Text>
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: theme.bg, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.line, height: '85%' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: theme.text, letterSpacing: 0.2 },
  closeBtn:    { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeTxt:    { fontSize: 14, color: theme.text3, fontWeight: '700' },
  exHeader:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, gap: 12 },
  exIcon:      { width: 48, height: 48, borderRadius: 8, backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.line2, alignItems: 'center', justifyContent: 'center' },
  exIconTxt:   { fontSize: 22, fontWeight: '700', color: theme.text },
  exMeta:      { flex: 1 },
  exName:      { fontSize: 15, fontWeight: '600', color: theme.text, lineHeight: 20 },
  exCat:       { fontSize: 12, color: theme.text3, marginTop: 2 },
  divLine:     { height: 1, backgroundColor: theme.line },
  tabRow:      { flexDirection: 'row' },
  tabBtn:      { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnOn:    { borderBottomColor: theme.text },
  tabTxt:      { fontSize: 12, fontWeight: '500', color: theme.text3, letterSpacing: 0.3 },
  tabTxtOn:    { color: theme.text, fontWeight: '700' },
  content:     { flex: 1 },
  pad:         { padding: 16 },
  infoRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.line },
  infoLbl:     { fontSize: 13, color: theme.text3 },
  infoVal:     { fontSize: 13, fontWeight: '500', color: theme.text, flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  noteBox:     { marginTop: 14, backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.line2, padding: 12 },
  noteLabel:   { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: theme.text3, marginBottom: 6 },
  noteTxt:     { fontSize: 13, color: theme.text2, lineHeight: 20 },
  stepRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  stepNum:     { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: theme.line2, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  stepNumTxt:  { fontSize: 11, fontWeight: '700', color: theme.text2 },
  stepTxt:     { flex: 1, fontSize: 13, color: theme.text2, lineHeight: 21 },
  bodiesRow:   { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingVertical: 8 },
  bodyCol:     { alignItems: 'center', gap: 6 },
  bodyLbl:     { fontSize: 9, fontWeight: '700', letterSpacing: 2, color: theme.text3, marginBottom: 2 },
  muscTitle:   { fontSize: 14, fontWeight: '700', color: theme.text, marginTop: 14, marginBottom: 10 },
  muscPill:    { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.line2, padding: 12, gap: 10, borderRadius: 6, marginBottom: 8 },
  muscName:    { flex: 1, fontSize: 13, fontWeight: '600', color: theme.text },
  muscTag:     { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: theme.text3 },
  muscDot:     { width: 8, height: 8, borderRadius: 4 },
});
