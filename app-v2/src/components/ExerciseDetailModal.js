import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, G } from 'react-native-svg';
import theme from '../theme';

/* ── Muscle zone mapping ──────────────────────────────────────────────────── */
const ZONES = {
  'Cuadriceps':     { f: ['quad_vl_l','quad_rf_l','quad_vm_l','quad_vl_r','quad_rf_r','quad_vm_r'], b: [] },
  'Femoral/Gluteo': { f: [], b: ['glute_l','glute_r','ham_l','ham_r'] },
  'Femoral':        { f: [], b: ['ham_l','ham_r'] },
  'Gluteo':         { f: [], b: ['glute_l','glute_r'] },
  'Hombro':         { f: ['delt_l','delt_r'], b: ['rdelt_l','rdelt_r'] },
  'Abdomen':        { f: ['abs_tl','abs_tr','abs_ml','abs_mr','abs_bl','abs_br','obl_l','obl_r'], b: [] },
  'Gemelo':         { f: ['calf_fl','calf_fr'], b: ['calf_l','calf_r','calf_ml','calf_mr'] },
  'Espalda':        { f: [], b: ['trap','lat_l','lat_r'] },
  'Biceps':         { f: ['bicep_l','bicep_r'], b: [] },
  'Triceps':        { f: [], b: ['tricep_l','tricep_r'] },
  'Pecho':          { f: ['pec_l','pec_r'], b: [] },
  'Trapecio':       { f: [], b: ['trap'] },
};

/* ══════════════════════════════════════════════════════
   FRONT BODY — detailed muscle paths
   viewBox 0 0 120 280
════════════════════════════════════════════════════════ */
function BodyFront({ hi = [] }) {
  const B  = '#1E1E1C';   // body base
  const SK = '#2E2E2C';   // skin / silhouette
  const LN = '#404040';   // outline
  const H  = theme.good;  // highlight
  const c  = (z) => hi.includes(z) ? H : SK;
  const cs = (z) => hi.includes(z) ? H : LN;

  return (
    <Svg width={100} height={234} viewBox="0 0 120 280">
      {/* ── Body silhouette base ── */}
      {/* Head */}
      <Circle cx={60} cy={16} r={14} fill={SK} stroke={LN} strokeWidth={1} />
      {/* Neck */}
      <Path d="M 53 29 L 67 29 L 69 43 L 51 43 Z" fill={SK} />
      {/* Torso */}
      <Path d="M 20 41 Q 60 35 100 41 L 103 138 Q 60 145 17 138 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Hip area */}
      <Path d="M 17 138 L 103 138 L 106 158 L 14 158 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left leg */}
      <Path d="M 14 158 L 56 158 L 54 232 L 12 230 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right leg */}
      <Path d="M 64 158 L 106 158 L 108 230 L 66 232 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left shin */}
      <Path d="M 12 230 L 54 230 L 52 270 L 10 268 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right shin */}
      <Path d="M 66 230 L 108 230 L 110 268 L 68 270 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left arm */}
      <Path d="M 8 43 L 22 43 L 18 110 L 4 108 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right arm */}
      <Path d="M 98 43 L 112 43 L 116 110 L 102 108 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left forearm */}
      <Path d="M 4 108 L 18 110 L 14 146 L 0 144 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right forearm */}
      <Path d="M 102 108 L 116 110 L 120 146 L 106 144 Z" fill={B} stroke={LN} strokeWidth={0.8} />

      {/* ── PECTORALS ── */}
      <Path d="M 50 41 Q 30 45 20 57 Q 14 70 18 86 Q 22 98 34 104 Q 44 108 54 104 Q 60 100 60 90 L 60 41 Z"
            fill={c('pec_l')} stroke={cs('pec_l')} strokeWidth={0.7} />
      <Path d="M 70 41 Q 90 45 100 57 Q 106 70 102 86 Q 98 98 86 104 Q 76 108 66 104 Q 60 100 60 90 L 60 41 Z"
            fill={c('pec_r')} stroke={cs('pec_r')} strokeWidth={0.7} />

      {/* ── ANTERIOR DELTOIDS ── */}
      <Path d="M 14 43 Q 4 49 2 65 Q 0 82 6 96 Q 10 106 20 106 Q 30 104 34 88 Q 38 70 32 50 Z"
            fill={c('delt_l')} stroke={cs('delt_l')} strokeWidth={0.7} />
      <Path d="M 106 43 Q 116 49 118 65 Q 120 82 114 96 Q 110 106 100 106 Q 90 104 86 88 Q 82 70 88 50 Z"
            fill={c('delt_r')} stroke={cs('delt_r')} strokeWidth={0.7} />

      {/* ── BICEPS ── */}
      <Path d="M 2 96 Q -4 110 0 128 Q 2 142 10 146 Q 18 148 22 136 Q 26 122 22 106 Q 18 96 10 94 Z"
            fill={c('bicep_l')} stroke={cs('bicep_l')} strokeWidth={0.7} />
      <Path d="M 118 96 Q 124 110 120 128 Q 118 142 110 146 Q 102 148 98 136 Q 94 122 98 106 Q 102 96 110 94 Z"
            fill={c('bicep_r')} stroke={cs('bicep_r')} strokeWidth={0.7} />

      {/* ── ABS (6-pack) ── */}
      <Rect x={47} y={106} width={12} height={13} rx={3} fill={c('abs_tl')} stroke={cs('abs_tl')} strokeWidth={0.6} />
      <Rect x={61} y={106} width={12} height={13} rx={3} fill={c('abs_tr')} stroke={cs('abs_tr')} strokeWidth={0.6} />
      <Rect x={47} y={121} width={12} height={13} rx={3} fill={c('abs_ml')} stroke={cs('abs_ml')} strokeWidth={0.6} />
      <Rect x={61} y={121} width={12} height={13} rx={3} fill={c('abs_mr')} stroke={cs('abs_mr')} strokeWidth={0.6} />
      <Rect x={47} y={136} width={12} height={13} rx={3} fill={c('abs_bl')} stroke={cs('abs_bl')} strokeWidth={0.6} />
      <Rect x={61} y={136} width={12} height={13} rx={3} fill={c('abs_br')} stroke={cs('abs_br')} strokeWidth={0.6} />

      {/* ── OBLIQUES ── */}
      <Path d="M 36 106 Q 28 120 26 144 Q 26 156 34 160 L 44 154 Q 38 140 40 116 Z"
            fill={c('obl_l')} stroke={cs('obl_l')} strokeWidth={0.6} />
      <Path d="M 84 106 Q 92 120 94 144 Q 94 156 86 160 L 76 154 Q 82 140 80 116 Z"
            fill={c('obl_r')} stroke={cs('obl_r')} strokeWidth={0.6} />

      {/* ── QUADS — Vastus Lateralis (outer) ── */}
      <Path d="M 16 162 Q 6 178 6 210 Q 8 228 18 234 Q 28 238 36 230 Q 40 220 38 196 Q 36 172 26 160 Z"
            fill={c('quad_vl_l')} stroke={cs('quad_vl_l')} strokeWidth={0.7} />
      <Path d="M 104 162 Q 114 178 114 210 Q 112 228 102 234 Q 92 238 84 230 Q 80 220 82 196 Q 84 172 94 160 Z"
            fill={c('quad_vl_r')} stroke={cs('quad_vl_r')} strokeWidth={0.7} />

      {/* ── QUADS — Rectus Femoris (center) ── */}
      <Path d="M 30 158 Q 22 174 22 206 Q 22 224 32 232 Q 40 238 50 232 Q 56 224 54 202 Q 52 174 46 158 Z"
            fill={c('quad_rf_l')} stroke={cs('quad_rf_l')} strokeWidth={0.7} />
      <Path d="M 90 158 Q 98 174 98 206 Q 98 224 88 232 Q 80 238 70 232 Q 64 224 66 202 Q 68 174 74 158 Z"
            fill={c('quad_rf_r')} stroke={cs('quad_rf_r')} strokeWidth={0.7} />

      {/* ── QUADS — Vastus Medialis (inner teardrop) ── */}
      <Path d="M 44 176 Q 38 194 40 216 Q 42 230 52 234 Q 62 236 64 224 Q 66 210 60 194 Q 56 178 50 174 Z"
            fill={c('quad_vm_l')} stroke={cs('quad_vm_l')} strokeWidth={0.7} />
      <Path d="M 76 176 Q 82 194 80 216 Q 78 230 68 234 Q 58 236 56 224 Q 54 210 60 194 Q 64 178 70 174 Z"
            fill={c('quad_vm_r')} stroke={cs('quad_vm_r')} strokeWidth={0.7} />

      {/* ── CALVES (front / tibialis) ── */}
      <Path d="M 10 232 Q 4 246 6 260 Q 8 268 18 268 Q 28 266 28 256 Q 28 244 20 230 Z"
            fill={c('calf_fl')} stroke={cs('calf_fl')} strokeWidth={0.6} />
      <Path d="M 110 232 Q 116 246 114 260 Q 112 268 102 268 Q 92 266 92 256 Q 92 244 100 230 Z"
            fill={c('calf_fr')} stroke={cs('calf_fr')} strokeWidth={0.6} />
    </Svg>
  );
}

/* ══════════════════════════════════════════════════════
   BACK BODY — detailed muscle paths
════════════════════════════════════════════════════════ */
function BodyBack({ hi = [] }) {
  const B  = '#1E1E1C';
  const SK = '#2E2E2C';
  const LN = '#404040';
  const H  = theme.good;
  const c  = (z) => hi.includes(z) ? H : SK;
  const cs = (z) => hi.includes(z) ? H : LN;

  return (
    <Svg width={100} height={234} viewBox="0 0 120 280">
      {/* ── Body silhouette base ── */}
      <Circle cx={60} cy={16} r={14} fill={SK} stroke={LN} strokeWidth={1} />
      <Path d="M 53 29 L 67 29 L 69 43 L 51 43 Z" fill={SK} />
      <Path d="M 20 41 Q 60 35 100 41 L 103 138 Q 60 145 17 138 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 17 138 L 103 138 L 106 158 L 14 158 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 14 158 L 56 158 L 54 232 L 12 230 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 64 158 L 106 158 L 108 230 L 66 232 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 12 230 L 54 230 L 52 270 L 10 268 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 66 230 L 108 230 L 110 268 L 68 270 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 8 43 L 22 43 L 18 110 L 4 108 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 98 43 L 112 43 L 116 110 L 102 108 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 4 108 L 18 110 L 14 146 L 0 144 Z" fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 102 108 L 116 110 L 120 146 L 106 144 Z" fill={B} stroke={LN} strokeWidth={0.8} />

      {/* ── TRAPEZIUS (large diamond shape) ── */}
      <Path d="M 54 41 Q 38 46 26 58 Q 20 68 26 78 Q 34 84 48 80 Q 58 76 60 60 Q 62 76 72 80 Q 86 84 94 78 Q 100 68 94 58 Q 82 46 66 41 Z"
            fill={c('trap')} stroke={cs('trap')} strokeWidth={0.7} />

      {/* ── REAR DELTOIDS ── */}
      <Path d="M 14 43 Q 4 49 2 65 Q 0 82 6 96 Q 10 106 20 106 Q 30 104 34 88 Q 38 70 32 50 Z"
            fill={c('rdelt_l')} stroke={cs('rdelt_l')} strokeWidth={0.7} />
      <Path d="M 106 43 Q 116 49 118 65 Q 120 82 114 96 Q 110 106 100 106 Q 90 104 86 88 Q 82 70 88 50 Z"
            fill={c('rdelt_r')} stroke={cs('rdelt_r')} strokeWidth={0.7} />

      {/* ── LATS (wing shapes) ── */}
      <Path d="M 20 60 Q 8 78 6 112 Q 6 134 14 142 L 28 138 Q 34 130 34 112 Q 36 90 32 68 Z"
            fill={c('lat_l')} stroke={cs('lat_l')} strokeWidth={0.7} />
      <Path d="M 100 60 Q 112 78 114 112 Q 114 134 106 142 L 92 138 Q 86 130 86 112 Q 84 90 88 68 Z"
            fill={c('lat_r')} stroke={cs('lat_r')} strokeWidth={0.7} />

      {/* ── TRICEPS (horseshoe visible from back) ── */}
      <Path d="M 2 96 Q -4 112 0 130 Q 2 144 10 148 Q 18 150 22 138 Q 26 124 22 106 Q 18 96 10 94 Z"
            fill={c('tricep_l')} stroke={cs('tricep_l')} strokeWidth={0.7} />
      <Path d="M 118 96 Q 124 112 120 130 Q 118 144 110 148 Q 102 150 98 138 Q 94 124 98 106 Q 102 96 110 94 Z"
            fill={c('tricep_r')} stroke={cs('tricep_r')} strokeWidth={0.7} />

      {/* ── SPINAL ERECTORS ── */}
      <Rect x={53} y={116} width={6} height={24} rx={3} fill={SK} stroke={LN} strokeWidth={0.5} />
      <Rect x={61} y={116} width={6} height={24} rx={3} fill={SK} stroke={LN} strokeWidth={0.5} />

      {/* ── GLUTES (large rounded shapes) ── */}
      <Path d="M 14 156 Q 4 162 2 180 Q 2 200 14 210 Q 26 218 40 212 Q 54 206 56 188 Q 58 168 46 156 Z"
            fill={c('glute_l')} stroke={cs('glute_l')} strokeWidth={0.7} />
      <Path d="M 106 156 Q 116 162 118 180 Q 118 200 106 210 Q 94 218 80 212 Q 66 206 64 188 Q 62 168 74 156 Z"
            fill={c('glute_r')} stroke={cs('glute_r')} strokeWidth={0.7} />

      {/* ── HAMSTRINGS (bicep femoris + semimembranosus) ── */}
      <Path d="M 14 212 Q 4 224 6 248 Q 8 260 18 264 Q 30 266 36 256 Q 42 244 38 222 Q 34 208 24 210 Z"
            fill={c('ham_l')} stroke={cs('ham_l')} strokeWidth={0.7} />
      <Path d="M 26 210 Q 20 226 22 250 Q 24 262 34 264 Q 44 264 48 252 Q 52 240 46 218 Q 40 208 32 210 Z"
            fill={c('ham_l')} stroke={cs('ham_l')} strokeWidth={0.6} />
      <Path d="M 106 212 Q 116 224 114 248 Q 112 260 102 264 Q 90 266 84 256 Q 78 244 82 222 Q 86 208 96 210 Z"
            fill={c('ham_r')} stroke={cs('ham_r')} strokeWidth={0.7} />
      <Path d="M 94 210 Q 100 226 98 250 Q 96 262 86 264 Q 76 264 72 252 Q 68 240 74 218 Q 80 208 88 210 Z"
            fill={c('ham_r')} stroke={cs('ham_r')} strokeWidth={0.6} />

      {/* ── CALVES (gastrocnemius — two heads) ── */}
      <Path d="M 10 262 Q 2 274 4 284 Q 6 292 16 292 Q 28 290 28 278 Q 28 266 18 260 Z"
            fill={c('calf_l')} stroke={cs('calf_l')} strokeWidth={0.7} />
      <Path d="M 22 260 Q 30 272 28 282 Q 26 290 36 290 Q 46 288 46 276 Q 44 264 36 258 Z"
            fill={c('calf_ml')} stroke={cs('calf_ml')} strokeWidth={0.7} />
      <Path d="M 110 262 Q 118 274 116 284 Q 114 292 104 292 Q 92 290 92 278 Q 92 266 102 260 Z"
            fill={c('calf_r')} stroke={cs('calf_r')} strokeWidth={0.7} />
      <Path d="M 98 260 Q 90 272 92 282 Q 94 290 84 290 Q 74 288 74 276 Q 76 264 84 258 Z"
            fill={c('calf_mr')} stroke={cs('calf_mr')} strokeWidth={0.7} />
    </Svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getCategory(name) {
  const n = name.toLowerCase();
  if (/prensa|hack|predicador|extension de|jalon|remo sentado en maquina/.test(n)) return 'Máquina';
  if (/polea|cable|face pull|jalon brazo|curl en polea|elevacion lateral en polea/.test(n)) return 'Polea';
  if (/barra|press militar|peso muerto|remo con barra|curl con barra/.test(n)) return 'Barra';
  if (/mancuerna|curl inclinado|elevacion lateral man|curl martillo/.test(n)) return 'Mancuerna';
  if (/dominadas|fondos|crunch|rueda|elevacion de piernas|plancha|hip thrust|bulgara/.test(n)) return 'Peso corporal';
  return 'Libre';
}

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

const MUSCLE_LABELS = {
  'Cuadriceps':    'Cuádriceps',
  'Femoral/Gluteo':'Femoral & Glúteo',
  'Hombro':        'Deltoides',
  'Abdomen':       'Abdominales',
  'Gemelo':        'Gemelo (Gastrocnemio)',
  'Espalda':       'Dorsal Ancho',
  'Biceps':        'Bíceps',
  'Triceps':       'Tríceps',
  'Pecho':         'Pectorales',
  'Trapecio':      'Trapecio',
};

/* ── Main Modal ──────────────────────────────────────────────────────────── */
export default function ExerciseDetailModal({ visible, exercise, onClose }) {
  const [tab, setTab] = useState('musculatura');

  if (!exercise) return null;

  const zones       = ZONES[exercise.g] || { f: [], b: [] };
  const category    = getCategory(exercise.n);
  const instructions = getInstructions(exercise);
  const muscleLabel = MUSCLE_LABELS[exercise.g] || exercise.g;
  const initial     = exercise.g.charAt(0).toUpperCase();

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
                <InfoRow label="Grupo muscular"      value={muscleLabel} />
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
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: theme.bg, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.line, maxHeight: '92%' },
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
  infoVal:     { fontSize: 13, fontWeight: '500', color: theme.text },
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
  muscPill:    { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.accentSoft, borderWidth: 1, borderColor: theme.line2, padding: 12, gap: 12, borderRadius: 6 },
  muscIcon:    { width: 38, height: 38, borderRadius: 6, backgroundColor: theme.line, alignItems: 'center', justifyContent: 'center' },
  muscIconTxt: { fontSize: 16, fontWeight: '700', color: theme.text },
  muscName:    { flex: 1, fontSize: 14, fontWeight: '600', color: theme.text },
  muscDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.good },
});
