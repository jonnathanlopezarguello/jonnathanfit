import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect } from 'react-native-svg';
import theme from '../theme';

/* ── Muscle zone mapping ──────────────────────────────────────────────────── */
const ZONES = {
  'Cuadriceps':     { f: ['quad_l', 'quad_r'], b: [] },
  'Femoral/Gluteo': { f: [], b: ['ham_l', 'ham_r', 'glute_l', 'glute_r'] },
  'Femoral':        { f: [], b: ['ham_l', 'ham_r'] },
  'Gluteo':         { f: [], b: ['glute_l', 'glute_r'] },
  'Hombro':         { f: ['delt_l', 'delt_r'], b: ['rdelt_l', 'rdelt_r'] },
  'Abdomen':        { f: ['abs'], b: [] },
  'Gemelo':         { f: ['calf_l', 'calf_r'], b: ['calf_bl', 'calf_br'] },
  'Espalda':        { f: [], b: ['lat_l', 'lat_r', 'trap'] },
  'Biceps':         { f: ['bicep_l', 'bicep_r'], b: [] },
  'Triceps':        { f: [], b: ['tricep_l', 'tricep_r'] },
  'Pecho':          { f: ['chest_l', 'chest_r'], b: [] },
  'Trapecio':       { f: [], b: ['trap'] },
};

/* ── SVG Front Body ──────────────────────────────────────────────────────── */
function BodyFront({ hi = [] }) {
  const B = '#252523';
  const L = '#3A3A38';
  const H = theme.good;
  const c = (z) => hi.includes(z) ? H : B;
  const s = (z) => hi.includes(z) ? H : L;

  return (
    <Svg width={90} height={210} viewBox="0 0 90 210">
      {/* Head */}
      <Circle cx={45} cy={13} r={11} fill={B} stroke={L} strokeWidth={1} />
      {/* Neck */}
      <Rect x={40} y={23} width={10} height={9} fill={B} />
      {/* Torso */}
      <Path d="M21 32 Q45 27 69 32 L72 100 Q45 105 18 100 Z" fill={B} stroke={L} strokeWidth={1} />
      {/* Chest L */}
      <Ellipse cx={34} cy={52} rx={13} ry={11} fill={c('chest_l')} stroke={s('chest_l')} strokeWidth={0.6} />
      {/* Chest R */}
      <Ellipse cx={56} cy={52} rx={13} ry={11} fill={c('chest_r')} stroke={s('chest_r')} strokeWidth={0.6} />
      {/* Delt L */}
      <Ellipse cx={20} cy={39} rx={8} ry={8} fill={c('delt_l')} stroke={s('delt_l')} strokeWidth={0.6} />
      {/* Delt R */}
      <Ellipse cx={70} cy={39} rx={8} ry={8} fill={c('delt_r')} stroke={s('delt_r')} strokeWidth={0.6} />
      {/* Left arm */}
      <Path d="M11 35 L21 35 L18 82 L8 80 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right arm */}
      <Path d="M69 35 L79 35 L82 82 L72 80 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Bicep L */}
      <Ellipse cx={13} cy={58} rx={5} ry={14} fill={c('bicep_l')} stroke={s('bicep_l')} strokeWidth={0.6} />
      {/* Bicep R */}
      <Ellipse cx={77} cy={58} rx={5} ry={14} fill={c('bicep_r')} stroke={s('bicep_r')} strokeWidth={0.6} />
      {/* Left forearm */}
      <Path d="M8 80 L18 82 L16 108 L6 106 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right forearm */}
      <Path d="M72 80 L82 82 L84 108 L74 106 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Abs */}
      <Rect x={36} y={65} width={18} height={31} rx={4} fill={c('abs')} stroke={s('abs')} strokeWidth={0.6} />
      {/* Hip */}
      <Path d="M17 100 L73 100 L75 117 L15 117 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Left quad outline */}
      <Path d="M14 117 L44 117 L43 175 L12 173 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right quad outline */}
      <Path d="M46 117 L76 117 L78 173 L47 175 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Quad L */}
      <Ellipse cx={28} cy={146} rx={13} ry={25} fill={c('quad_l')} stroke={s('quad_l')} strokeWidth={0.6} />
      {/* Quad R */}
      <Ellipse cx={62} cy={146} rx={13} ry={25} fill={c('quad_r')} stroke={s('quad_r')} strokeWidth={0.6} />
      {/* Left shin */}
      <Path d="M12 175 L43 175 L42 203 L11 201 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right shin */}
      <Path d="M47 175 L78 175 L79 201 L48 203 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Calf front L */}
      <Ellipse cx={27} cy={188} rx={10} ry={12} fill={c('calf_l')} stroke={s('calf_l')} strokeWidth={0.6} />
      {/* Calf front R */}
      <Ellipse cx={63} cy={188} rx={10} ry={12} fill={c('calf_r')} stroke={s('calf_r')} strokeWidth={0.6} />
    </Svg>
  );
}

/* ── SVG Back Body ───────────────────────────────────────────────────────── */
function BodyBack({ hi = [] }) {
  const B = '#252523';
  const L = '#3A3A38';
  const H = theme.good;
  const c = (z) => hi.includes(z) ? H : B;
  const s = (z) => hi.includes(z) ? H : L;

  return (
    <Svg width={90} height={210} viewBox="0 0 90 210">
      {/* Head */}
      <Circle cx={45} cy={13} r={11} fill={B} stroke={L} strokeWidth={1} />
      {/* Neck */}
      <Rect x={40} y={23} width={10} height={9} fill={B} />
      {/* Torso */}
      <Path d="M21 32 Q45 27 69 32 L72 100 Q45 105 18 100 Z" fill={B} stroke={L} strokeWidth={1} />
      {/* Trap */}
      <Ellipse cx={45} cy={41} rx={23} ry={11} fill={c('trap')} stroke={s('trap')} strokeWidth={0.6} />
      {/* Rear delt L */}
      <Ellipse cx={20} cy={41} rx={8} ry={8} fill={c('rdelt_l')} stroke={s('rdelt_l')} strokeWidth={0.6} />
      {/* Rear delt R */}
      <Ellipse cx={70} cy={41} rx={8} ry={8} fill={c('rdelt_r')} stroke={s('rdelt_r')} strokeWidth={0.6} />
      {/* Lat L */}
      <Path d="M21 50 Q12 73 17 98 L31 98 L33 50 Z" fill={c('lat_l')} stroke={s('lat_l')} strokeWidth={0.6} />
      {/* Lat R */}
      <Path d="M69 50 Q78 73 73 98 L59 98 L57 50 Z" fill={c('lat_r')} stroke={s('lat_r')} strokeWidth={0.6} />
      {/* Left arm */}
      <Path d="M11 35 L21 35 L18 82 L8 80 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right arm */}
      <Path d="M69 35 L79 35 L82 82 L72 80 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Tricep L */}
      <Ellipse cx={13} cy={58} rx={5} ry={15} fill={c('tricep_l')} stroke={s('tricep_l')} strokeWidth={0.6} />
      {/* Tricep R */}
      <Ellipse cx={77} cy={58} rx={5} ry={15} fill={c('tricep_r')} stroke={s('tricep_r')} strokeWidth={0.6} />
      {/* Left forearm */}
      <Path d="M8 80 L18 82 L16 108 L6 106 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right forearm */}
      <Path d="M72 80 L82 82 L84 108 L74 106 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Hip */}
      <Path d="M17 100 L73 100 L75 119 L15 119 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Glute L */}
      <Ellipse cx={31} cy={117} rx={15} ry={13} fill={c('glute_l')} stroke={s('glute_l')} strokeWidth={0.6} />
      {/* Glute R */}
      <Ellipse cx={59} cy={117} rx={15} ry={13} fill={c('glute_r')} stroke={s('glute_r')} strokeWidth={0.6} />
      {/* Left ham outline */}
      <Path d="M14 130 L44 130 L43 175 L12 173 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right ham outline */}
      <Path d="M46 130 L76 130 L78 173 L47 175 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Ham L */}
      <Ellipse cx={28} cy={152} rx={13} ry={22} fill={c('ham_l')} stroke={s('ham_l')} strokeWidth={0.6} />
      {/* Ham R */}
      <Ellipse cx={62} cy={152} rx={13} ry={22} fill={c('ham_r')} stroke={s('ham_r')} strokeWidth={0.6} />
      {/* Left shin */}
      <Path d="M12 175 L43 175 L42 203 L11 201 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Right shin */}
      <Path d="M47 175 L78 175 L79 201 L48 203 Z" fill={B} stroke={L} strokeWidth={0.8} />
      {/* Calf back L */}
      <Ellipse cx={27} cy={188} rx={10} ry={12} fill={c('calf_bl')} stroke={s('calf_bl')} strokeWidth={0.6} />
      {/* Calf back R */}
      <Ellipse cx={63} cy={188} rx={10} ry={12} fill={c('calf_br')} stroke={s('calf_br')} strokeWidth={0.6} />
    </Svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getCategory(name) {
  const n = name.toLowerCase();
  if (/prensa|hack|predicador|extension de|jalon|polea|curl en polea|remo sentado en maquina|sentado en maquina/.test(n)) return 'Máquina';
  if (/barra|press militar|peso muerto|remo con barra/.test(n)) return 'Barra';
  if (/mancuerna|inclinado mancuerna|curl inclinado|elevacion lateral man/.test(n)) return 'Mancuerna';
  if (/dominadas|fondos|crunch|rueda|elevacion de piernas|plancha|hip thrust|bulgara/.test(n)) return 'Peso corporal';
  if (/polea|cable|face pull|jalon brazo/.test(n)) return 'Polea';
  return 'Libre';
}

function getInstructions(ex) {
  const cues = (ex.f || '').split(';').map(s => s.trim()).filter(Boolean);
  const base = [
    `Ajusta la carga y colócate en posición correcta para ${ex.n}.`,
    ...cues.map(c => c.charAt(0).toUpperCase() + c.slice(1) + '.'),
    `Ejecuta ${ex.r} repeticiones controlando el movimiento en excéntrico (bajada) e isométrico.`,
    `Descansa ${ex.re} entre series para recuperación óptima.`,
    'Mantén la técnica en todas las series. Prioriza calidad sobre peso.',
  ];
  return base;
}

const MUSCLE_LABELS = {
  'Cuadriceps': 'Cuádriceps',
  'Femoral/Gluteo': 'Femoral & Glúteo',
  'Hombro': 'Deltoides',
  'Abdomen': 'Abdominales',
  'Gemelo': 'Gemelo (Gastrocnemio)',
  'Espalda': 'Dorsal Ancho',
  'Biceps': 'Bíceps',
  'Triceps': 'Tríceps',
  'Pecho': 'Pectorales',
  'Trapecio': 'Trapecio',
};

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function ExerciseDetailModal({ visible, exercise, onClose }) {
  const [tab, setTab] = useState('musculatura');

  if (!exercise) return null;

  const zones = ZONES[exercise.g] || { f: [], b: [] };
  const category = getCategory(exercise.n);
  const instructions = getInstructions(exercise);
  const muscleLabel = MUSCLE_LABELS[exercise.g] || exercise.g;
  const initial = exercise.g.charAt(0).toUpperCase();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
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
              { k: 'informacion', l: 'Información' },
              { k: 'instrucciones', l: 'Instrucciones' },
              { k: 'musculatura', l: 'Musculatura' },
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

          {/* Content */}
          <ScrollView style={s.content} showsVerticalScrollIndicator={false}>

            {/* ── TAB: Información ── */}
            {tab === 'informacion' && (
              <View style={s.pad}>
                <InfoRow label="Grupo muscular" value={muscleLabel} />
                <InfoRow label="Series planificadas" value={`${exercise.s} series`} />
                <InfoRow label="Repeticiones" value={exercise.r} />
                <InfoRow label="RIR objetivo" value={`${exercise.ri} reps en reserva`} />
                <InfoRow label="Descanso entre series" value={exercise.re} />
                <InfoRow label="Equipamiento" value={category} last />
                {exercise.f ? (
                  <View style={s.noteBox}>
                    <Text style={s.noteLabel}>FOCO DE EJECUCIÓN</Text>
                    <Text style={s.noteTxt}>{exercise.f}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* ── TAB: Instrucciones ── */}
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

            {/* ── TAB: Musculatura ── */}
            {tab === 'musculatura' && (
              <View style={s.pad}>
                <View style={s.bodiesRow}>
                  <View style={s.bodyCol}>
                    <Text style={s.bodyLbl}>FRONTAL</Text>
                    <BodyFront hi={zones.f} />
                  </View>
                  <View style={s.bodyCol}>
                    <Text style={s.bodyLbl}>POSTERIOR</Text>
                    <BodyBack hi={zones.b} />
                  </View>
                </View>

                <View style={s.divLine} />

                <Text style={s.muscTitle}>Músculo Objetivo</Text>
                <View style={s.muscPill}>
                  <View style={s.muscIcon}>
                    <Text style={s.muscIconTxt}>{initial}</Text>
                  </View>
                  <Text style={s.muscName}>{muscleLabel}</Text>
                  <View style={s.muscDot} />
                </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.line,
    maxHeight: '92%',
  },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
    letterSpacing: 0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: { fontSize: 14, color: theme.text3, fontWeight: '700' },

  /* exercise header */
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  exIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: theme.accentSoft,
    borderWidth: 1,
    borderColor: theme.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exIconTxt: { fontSize: 22, fontWeight: '700', color: theme.text },
  exMeta: { flex: 1 },
  exName: { fontSize: 15, fontWeight: '600', color: theme.text, lineHeight: 20 },
  exCat: { fontSize: 12, color: theme.text3, marginTop: 2 },

  divLine: { height: 1, backgroundColor: theme.line },

  /* tabs */
  tabRow: { flexDirection: 'row' },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnOn: { borderBottomColor: theme.text },
  tabTxt: { fontSize: 12, fontWeight: '500', color: theme.text3, letterSpacing: 0.3 },
  tabTxtOn: { color: theme.text, fontWeight: '700' },

  content: { flex: 1 },
  pad: { padding: 18 },

  /* info tab */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.line },
  infoLbl: { fontSize: 13, color: theme.text3 },
  infoVal: { fontSize: 13, fontWeight: '500', color: theme.text },
  noteBox: {
    marginTop: 14,
    backgroundColor: theme.accentSoft,
    borderWidth: 1,
    borderColor: theme.line2,
    padding: 12,
  },
  noteLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 6,
  },
  noteTxt: { fontSize: 13, color: theme.text2, lineHeight: 20 },

  /* instrucciones tab */
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.line2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumTxt: { fontSize: 11, fontWeight: '700', color: theme.text2 },
  stepTxt: { flex: 1, fontSize: 13, color: theme.text2, lineHeight: 21 },

  /* musculatura tab */
  bodiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 8,
  },
  bodyCol: { alignItems: 'center', gap: 6 },
  bodyLbl: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 2,
  },
  muscTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginTop: 14,
    marginBottom: 10,
  },
  muscPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accentSoft,
    borderWidth: 1,
    borderColor: theme.line2,
    padding: 12,
    gap: 12,
    borderRadius: 6,
  },
  muscIcon: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscIconTxt: { fontSize: 16, fontWeight: '700', color: theme.text },
  muscName: { flex: 1, fontSize: 14, fontWeight: '600', color: theme.text },
  muscDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.good,
  },
});
