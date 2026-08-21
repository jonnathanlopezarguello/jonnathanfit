import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import Svg, {
  Path, Ellipse, Rect, Defs, LinearGradient, Stop,
} from 'react-native-svg';
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

/* ─────────────────────────────────────────────────────────────────────────
   SHARED GRADIENT DEFS (green glow for active muscles)
───────────────────────────────────────────────────────────────────────── */
function GradientDefs() {
  return (
    <Defs>
      {/* Highlighted muscle — green gradient top→bottom */}
      <LinearGradient id="hiV" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0"   stopColor="#A8D4A3" stopOpacity="1" />
        <Stop offset="0.5" stopColor="#7FB07A" stopOpacity="1" />
        <Stop offset="1"   stopColor="#4E8849" stopOpacity="1" />
      </LinearGradient>
      {/* Highlighted muscle — green gradient left→right */}
      <LinearGradient id="hiH" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0"   stopColor="#A8D4A3" stopOpacity="1" />
        <Stop offset="1"   stopColor="#4E8849" stopOpacity="1" />
      </LinearGradient>
      {/* Body depth — dark gradient left shoulder→right */}
      <LinearGradient id="bodyDepth" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0"   stopColor="#1A1A18" stopOpacity="1" />
        <Stop offset="0.5" stopColor="#282826" stopOpacity="1" />
        <Stop offset="1"   stopColor="#1A1A18" stopOpacity="1" />
      </LinearGradient>
      {/* Muscle resting — subtle definition */}
      <LinearGradient id="muscRest" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0"   stopColor="#353533" stopOpacity="1" />
        <Stop offset="1"   stopColor="#282826" stopOpacity="1" />
      </LinearGradient>
    </Defs>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FRONT BODY — viewBox 0 0 200 480   rendered 120×288
══════════════════════════════════════════════════════════════════════════ */
function BodyFront({ hi = [] }) {
  const LN = '#484846';
  const SK = '#2E2E2C';
  const B  = '#1E1E1C';
  const c  = (z) => hi.includes(z) ? 'url(#hiV)' : 'url(#muscRest)';
  const cs = (z) => hi.includes(z) ? '#6AAA65' : LN;
  const sw = 0.8;

  return (
    <Svg width={120} height={288} viewBox="0 0 200 480">
      <GradientDefs />

      {/* ── Silhouette base ── */}
      {/* Head — proporción correcta */}
      <Ellipse cx={100} cy={28} rx={18} ry={22} fill={SK} stroke={LN} strokeWidth={1} />
      {/* Neck */}
      <Path d="M 91,50 L109,50 L107,66 L93,66 Z" fill={SK} />
      {/* Torso — hombros 108px, cintura visible */}
      <Path d="M 48,66 C 32,74 22,96 20,130 C 18,158 22,174 32,184 L40,196 L160,196 L168,184 C 178,174 182,158 180,130 C 178,96 168,74 152,66 Z"
            fill="url(#bodyDepth)" stroke={LN} strokeWidth={1} />
      {/* Hip block */}
      <Path d="M 42,196 L158,196 L160,222 L40,222 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left thigh */}
      <Path d="M 40,222 C 30,232 24,260 26,294 C 28,316 36,330 48,334 L82,334 C 86,326 86,304 82,280 C 78,256 70,232 60,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right thigh */}
      <Path d="M 160,222 C 170,232 176,260 174,294 C 172,316 164,330 152,334 L118,334 C 114,326 114,304 118,280 C 122,256 130,232 140,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left shin */}
      <Path d="M 38,334 C 30,348 28,376 32,402 C 36,420 46,428 58,426 L78,424 C 82,418 82,398 78,376 C 74,356 66,340 56,336 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right shin */}
      <Path d="M 162,334 C 170,348 172,376 168,402 C 164,420 154,428 142,426 L122,424 C 118,418 118,398 122,376 C 126,356 134,340 144,336 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left upper arm */}
      <Path d="M 24,66 C 12,76 8,104 10,136 C 12,156 18,168 28,168 L42,166 C 46,154 46,130 44,106 C 42,84 38,68 30,66 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right upper arm */}
      <Path d="M 176,66 C 188,76 192,104 190,136 C 188,156 182,168 172,168 L158,166 C 154,154 154,130 156,106 C 158,84 162,68 170,66 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left forearm */}
      <Path d="M 10,134 C 4,150 4,174 10,196 C 14,208 22,214 30,212 L44,210 C 48,200 48,178 44,158 C 42,146 36,136 26,134 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right forearm */}
      <Path d="M 190,134 C 196,150 196,174 190,196 C 186,208 178,214 170,212 L156,210 C 152,200 152,178 156,158 C 158,146 164,136 174,134 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />

      {/* ── PECTORALS ── */}
      <Path d="M 88,68 C 62,74 38,90 26,112 C 20,126 22,144 34,154 C 46,162 62,160 72,150 C 80,142 82,128 80,108 Z"
            fill={c('pec_l')} stroke={cs('pec_l')} strokeWidth={sw} />
      <Path d="M 112,68 C 138,74 162,90 174,112 C 180,126 178,144 166,154 C 154,162 138,160 128,150 C 120,142 118,128 120,108 Z"
            fill={c('pec_r')} stroke={cs('pec_r')} strokeWidth={sw} />
      <Path d="M 100,70 L100,156" stroke="#333331" strokeWidth={0.5} fill="none" />

      {/* ── DELTOIDES ANTERIORES ── */}
      <Path d="M 28,66 C 12,74 6,98 8,126 C 10,146 18,160 30,160 C 40,160 48,150 50,134 C 52,116 48,92 40,76 Z"
            fill={c('delt_l')} stroke={cs('delt_l')} strokeWidth={sw} />
      <Path d="M 172,66 C 188,74 194,98 192,126 C 190,146 182,160 170,160 C 160,160 152,150 150,134 C 148,116 152,92 160,76 Z"
            fill={c('delt_r')} stroke={cs('delt_r')} strokeWidth={sw} />

      {/* ── BÍCEPS ── */}
      <Path d="M 10,132 C 4,150 4,174 10,194 C 14,206 22,212 30,210 C 38,206 42,194 40,176 C 38,158 32,142 24,134 Z"
            fill={c('bicep_l')} stroke={cs('bicep_l')} strokeWidth={sw} />
      <Path d="M 190,132 C 196,150 196,174 190,194 C 186,206 178,212 170,210 C 162,206 158,194 160,176 C 162,158 168,142 176,134 Z"
            fill={c('bicep_r')} stroke={cs('bicep_r')} strokeWidth={sw} />

      {/* ── ABS — 6 segmentos ── */}
      <Rect x={80}  y={162} width={16} height={16} rx={4} fill={c('abs_tl')} stroke={cs('abs_tl')} strokeWidth={0.7} />
      <Rect x={104} y={162} width={16} height={16} rx={4} fill={c('abs_tr')} stroke={cs('abs_tr')} strokeWidth={0.7} />
      <Rect x={80}  y={182} width={16} height={16} rx={4} fill={c('abs_ml')} stroke={cs('abs_ml')} strokeWidth={0.7} />
      <Rect x={104} y={182} width={16} height={16} rx={4} fill={c('abs_mr')} stroke={cs('abs_mr')} strokeWidth={0.7} />
      <Rect x={82}  y={202} width={14} height={14} rx={4} fill={c('abs_bl')} stroke={cs('abs_bl')} strokeWidth={0.7} />
      <Rect x={104} y={202} width={14} height={14} rx={4} fill={c('abs_br')} stroke={cs('abs_br')} strokeWidth={0.7} />

      {/* ── OBLICUOS ── */}
      <Path d="M 50,162 C 36,178 30,206 32,226 C 34,238 42,244 52,242 L62,234 C 56,218 54,196 56,176 Z"
            fill={c('obl_l')} stroke={cs('obl_l')} strokeWidth={sw} />
      <Path d="M 150,162 C 164,178 170,206 168,226 C 166,238 158,244 148,242 L138,234 C 144,218 146,196 144,176 Z"
            fill={c('obl_r')} stroke={cs('obl_r')} strokeWidth={sw} />

      {/* ── CUÁDRICEPS — Vasto Lateral ── */}
      <Path d="M 30,224 C 18,242 14,274 16,306 C 18,326 26,338 38,340 C 50,340 58,330 60,314 C 62,296 58,266 52,244 C 46,226 36,220 30,224 Z"
            fill={c('quad_vl_l')} stroke={cs('quad_vl_l')} strokeWidth={sw} />
      <Path d="M 170,224 C 182,242 186,274 184,306 C 182,326 174,338 162,340 C 150,340 142,330 140,314 C 138,296 142,266 148,244 C 154,226 164,220 170,224 Z"
            fill={c('quad_vl_r')} stroke={cs('quad_vl_r')} strokeWidth={sw} />

      {/* ── CUÁDRICEPS — Recto Femoral ── */}
      <Path d="M 50,222 C 40,242 38,272 42,304 C 44,324 54,336 66,336 C 76,334 82,322 80,304 C 78,282 72,256 66,234 C 60,220 54,216 50,222 Z"
            fill={c('quad_rf_l')} stroke={cs('quad_rf_l')} strokeWidth={sw} />
      <Path d="M 150,222 C 160,242 162,272 158,304 C 156,324 146,336 134,336 C 124,334 118,322 120,304 C 122,282 128,256 134,234 C 140,220 146,216 150,222 Z"
            fill={c('quad_rf_r')} stroke={cs('quad_rf_r')} strokeWidth={sw} />

      {/* ── CUÁDRICEPS — Vasto Medial (lágrima) ── */}
      <Path d="M 72,254 C 64,270 66,300 72,318 C 76,330 84,336 92,334 C 100,330 102,318 98,302 C 94,286 86,264 78,252 Z"
            fill={c('quad_vm_l')} stroke={cs('quad_vm_l')} strokeWidth={sw} />
      <Path d="M 128,254 C 136,270 134,300 128,318 C 124,330 116,336 108,334 C 100,330 98,318 102,302 C 106,286 114,264 122,252 Z"
            fill={c('quad_vm_r')} stroke={cs('quad_vm_r')} strokeWidth={sw} />

      {/* ── TIBIAL ANTERIOR / GEMELO FRONTAL ── */}
      <Path d="M 28,338 C 20,356 18,384 22,408 C 26,422 34,428 44,426 L58,424 C 62,418 62,398 58,376 C 54,358 46,342 36,340 Z"
            fill={c('calf_fl')} stroke={cs('calf_fl')} strokeWidth={sw} />
      <Path d="M 172,338 C 180,356 182,384 178,408 C 174,422 166,428 156,426 L142,424 C 138,418 138,398 142,376 C 146,358 154,342 164,340 Z"
            fill={c('calf_fr')} stroke={cs('calf_fr')} strokeWidth={sw} />
    </Svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BACK BODY — viewBox 0 0 200 480   rendered 120×288
══════════════════════════════════════════════════════════════════════════ */
function BodyBack({ hi = [] }) {
  const LN = '#484846';
  const SK = '#2E2E2C';
  const B  = '#1E1E1C';
  const c  = (z) => hi.includes(z) ? 'url(#hiV)' : 'url(#muscRest)';
  const cs = (z) => hi.includes(z) ? '#6AAA65' : LN;
  const sw = 0.8;

  return (
    <Svg width={120} height={288} viewBox="0 0 200 480">
      <GradientDefs />

      {/* ── Silueta — mismas proporciones que la vista frontal ── */}
      <Ellipse cx={100} cy={28} rx={18} ry={22} fill={SK} stroke={LN} strokeWidth={1} />
      <Path d="M 91,50 L109,50 L107,66 L93,66 Z" fill={SK} />
      <Path d="M 48,66 C 32,74 22,96 20,130 C 18,158 22,174 32,184 L40,196 L160,196 L168,184 C 178,174 182,158 180,130 C 178,96 168,74 152,66 Z"
            fill="url(#bodyDepth)" stroke={LN} strokeWidth={1} />
      <Path d="M 42,196 L158,196 L160,222 L40,222 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 40,222 C 30,232 24,260 26,294 C 28,316 36,330 48,334 L82,334 C 86,326 86,304 82,280 C 78,256 70,232 60,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 160,222 C 170,232 176,260 174,294 C 172,316 164,330 152,334 L118,334 C 114,326 114,304 118,280 C 122,256 130,232 140,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 38,334 C 30,348 28,376 32,402 C 36,420 46,428 58,426 L78,424 C 82,418 82,398 78,376 C 74,356 66,340 56,336 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 162,334 C 170,348 172,376 168,402 C 164,420 154,428 142,426 L122,424 C 118,418 118,398 122,376 C 126,356 134,340 144,336 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 24,66 C 12,76 8,104 10,136 C 12,156 18,168 28,168 L42,166 C 46,154 46,130 44,106 C 42,84 38,68 30,66 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 176,66 C 188,76 192,104 190,136 C 188,156 182,168 172,168 L158,166 C 154,154 154,130 156,106 C 158,84 162,68 170,66 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 10,134 C 4,150 4,174 10,196 C 14,208 22,214 30,212 L44,210 C 48,200 48,178 44,158 C 42,146 36,136 26,134 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 190,134 C 196,150 196,174 190,196 C 186,208 178,214 170,212 L156,210 C 152,200 152,178 156,158 C 158,146 164,136 174,134 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />

      {/* ── TRAPECIO ── */}
      <Path d="M 88,68 C 68,72 44,84 28,98 C 18,110 20,126 32,134 C 44,140 62,138 74,128 C 82,120 86,108 90,90 C 94,108 98,120 106,128 C 118,138 136,140 148,134 C 160,126 162,110 152,98 C 136,84 112,72 112,68 Z"
            fill={c('trap')} stroke={cs('trap')} strokeWidth={sw} />

      {/* ── DELTOIDES POSTERIORES ── */}
      <Path d="M 28,66 C 12,74 6,98 8,126 C 10,146 18,160 30,160 C 40,160 48,150 50,134 C 52,116 48,92 40,76 Z"
            fill={c('rdelt_l')} stroke={cs('rdelt_l')} strokeWidth={sw} />
      <Path d="M 172,66 C 188,74 194,98 192,126 C 190,146 182,160 170,160 C 160,160 152,150 150,134 C 148,116 152,92 160,76 Z"
            fill={c('rdelt_r')} stroke={cs('rdelt_r')} strokeWidth={sw} />

      {/* ── DORSAL ANCHO ── */}
      <Path d="M 44,84 C 22,100 16,134 18,166 C 20,184 28,194 42,196 L54,196 C 56,182 56,160 54,138 C 52,114 48,96 44,84 Z"
            fill={c('lat_l')} stroke={cs('lat_l')} strokeWidth={sw} />
      <Path d="M 156,84 C 178,100 184,134 182,166 C 180,184 172,194 158,196 L146,196 C 144,182 144,160 146,138 C 148,114 152,96 156,84 Z"
            fill={c('lat_r')} stroke={cs('lat_r')} strokeWidth={sw} />

      {/* ── TRÍCEPS ── */}
      <Path d="M 10,132 C 4,150 4,174 10,194 C 14,206 22,212 30,210 C 38,206 42,194 40,176 C 38,158 32,142 24,134 Z"
            fill={c('tricep_l')} stroke={cs('tricep_l')} strokeWidth={sw} />
      <Path d="M 190,132 C 196,150 196,174 190,194 C 186,206 178,212 170,210 C 162,206 158,194 160,176 C 162,158 168,142 176,134 Z"
            fill={c('tricep_r')} stroke={cs('tricep_r')} strokeWidth={sw} />

      {/* ── ERECTORES ESPINALES ── */}
      <Rect x={90}  y={138} width={8} height={52} rx={4} fill={SK} stroke={LN} strokeWidth={0.6} />
      <Rect x={102} y={138} width={8} height={52} rx={4} fill={SK} stroke={LN} strokeWidth={0.6} />

      {/* ── GLÚTEOS ── */}
      <Path d="M 28,222 C 14,234 8,258 12,282 C 16,302 28,314 44,314 C 58,314 70,302 74,286 C 78,268 72,244 60,232 C 50,222 38,218 28,222 Z"
            fill={c('glute_l')} stroke={cs('glute_l')} strokeWidth={sw} />
      <Path d="M 172,222 C 186,234 192,258 188,282 C 184,302 172,314 156,314 C 142,314 130,302 126,286 C 122,268 128,244 140,232 C 150,222 162,218 172,222 Z"
            fill={c('glute_r')} stroke={cs('glute_r')} strokeWidth={sw} />

      {/* ── ISQUIOTIBIALES ── dos capas por lado */}
      <Path d="M 20,312 C 8,330 6,360 10,388 C 14,406 24,416 36,414 C 48,412 56,400 56,384 C 56,364 48,340 40,326 Z"
            fill={c('ham_l')} stroke={cs('ham_l')} strokeWidth={sw} />
      <Path d="M 40,310 C 30,328 28,356 34,382 C 38,396 48,406 60,404 C 70,402 76,390 74,374 C 72,356 64,332 54,318 Z"
            fill={c('ham_l')} stroke={cs('ham_l')} strokeWidth={0.5} />
      <Path d="M 180,312 C 192,330 194,360 190,388 C 186,406 176,416 164,414 C 152,412 144,400 144,384 C 144,364 152,340 160,326 Z"
            fill={c('ham_r')} stroke={cs('ham_r')} strokeWidth={sw} />
      <Path d="M 160,310 C 170,328 172,356 166,382 C 162,396 152,406 140,404 C 130,402 124,390 126,374 C 128,356 136,332 146,318 Z"
            fill={c('ham_r')} stroke={cs('ham_r')} strokeWidth={0.5} />

      {/* ── GASTROCNEMIO — dos cabezas, dentro del viewBox ── */}
      <Path d="M 16,414 C 6,432 6,452 12,462 C 16,470 26,474 38,472 C 48,468 52,456 50,442 C 48,428 40,418 30,414 Z"
            fill={c('calf_l')} stroke={cs('calf_l')} strokeWidth={sw} />
      <Path d="M 36,414 C 44,428 48,450 44,462 C 42,470 52,474 62,470 C 72,464 74,450 70,436 C 66,422 56,414 48,414 Z"
            fill={c('calf_ml')} stroke={cs('calf_ml')} strokeWidth={sw} />
      <Path d="M 184,414 C 194,432 194,452 188,462 C 184,470 174,474 162,472 C 152,468 148,456 150,442 C 152,428 160,418 170,414 Z"
            fill={c('calf_r')} stroke={cs('calf_r')} strokeWidth={sw} />
      <Path d="M 164,414 C 156,428 152,450 156,462 C 158,470 148,474 138,470 C 128,464 126,450 130,436 C 134,422 144,414 152,414 Z"
            fill={c('calf_mr')} stroke={cs('calf_mr')} strokeWidth={sw} />
    </Svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getCategory(name) {
  const n = name.toLowerCase();
  if (/polea|cable|face pull|jalon brazo|jalon agarre|curl en polea|elevacion lateral en polea|jalon al pecho/.test(n)) return 'Polea';
  if (/prensa|hack|predicador|extension de|remo sentado en maquina|pec deck/.test(n)) return 'Máquina';
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
  'Femoral':       'Femoral',
  'Gluteo':        'Glúteo',
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

  if (!exercise || !exercise.g) return null;

  const zones        = ZONES[exercise.g] || { f: [], b: [] };
  const category     = getCategory(exercise.n);
  const instructions = getInstructions(exercise);
  const muscleLabel  = MUSCLE_LABELS[exercise.g] || exercise.g;
  const initial      = exercise.g.charAt(0).toUpperCase();

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
