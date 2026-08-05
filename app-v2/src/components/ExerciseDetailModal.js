import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, G, Defs, LinearGradient, Stop,
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
  const LN  = '#484846';
  const SK  = '#2E2E2C';
  const B   = '#1E1E1C';
  const c   = (z) => hi.includes(z) ? 'url(#hiV)' : 'url(#muscRest)';
  const cH  = (z) => hi.includes(z) ? 'url(#hiH)' : 'url(#muscRest)';
  const cs  = (z) => hi.includes(z) ? '#6AAA65' : LN;
  const sw  = 0.8;

  return (
    <Svg width={120} height={288} viewBox="0 0 200 480">
      <GradientDefs />

      {/* ── Silhouette base ── */}
      {/* Head */}
      <Ellipse cx={100} cy={28} rx={22} ry={26} fill={SK} stroke={LN} strokeWidth={1} />
      {/* Neck */}
      <Path d="M 88,52 L112,52 L114,72 L86,72 Z" fill={SK} />
      {/* Upper torso block */}
      <Path d="M 28,68 C 14,80 10,110 12,144 C 14,168 20,178 28,184
               L 32,196 L 168,196 L 172,184
               C 180,178 186,168 188,144 C 190,110 186,80 172,68 Z"
            fill="url(#bodyDepth)" stroke={LN} strokeWidth={1} />
      {/* Hip block */}
      <Path d="M 30,196 L 170,196 L 174,224 L 26,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left thigh */}
      <Path d="M 26,224 C 18,232 14,260 16,296 C 18,320 24,334 34,340 L 88,340 C 92,332 92,310 88,286 C 84,260 78,236 72,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right thigh */}
      <Path d="M 174,224 C 182,232 186,260 184,296 C 182,320 176,334 166,340 L 112,340 C 108,332 108,310 112,286 C 116,260 122,236 128,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left shin */}
      <Path d="M 28,340 C 22,352 20,380 22,408 C 24,428 32,438 44,440 L 74,440 C 80,436 82,416 80,392 C 78,368 72,348 66,340 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right shin */}
      <Path d="M 172,340 C 178,352 180,380 178,408 C 176,428 168,438 156,440 L 126,440 C 120,436 118,416 120,392 C 122,368 128,348 134,340 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left upper arm */}
      <Path d="M 12,72 C 2,82 -2,108 2,140 C 4,158 10,170 20,174 L 36,174 C 40,162 40,138 38,112 C 36,88 32,74 24,70 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right upper arm */}
      <Path d="M 188,72 C 198,82 202,108 198,140 C 196,158 190,170 180,174 L 164,174 C 160,162 160,138 162,112 C 164,88 168,74 176,70 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Left forearm */}
      <Path d="M 2,142 C -4,156 -4,180 2,202 C 6,214 14,220 22,218 L 36,216 C 40,206 40,184 36,164 C 34,152 28,142 20,140 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      {/* Right forearm */}
      <Path d="M 198,142 C 204,156 204,180 198,202 C 194,214 186,220 178,218 L 164,216 C 160,206 160,184 164,164 C 166,152 172,142 180,140 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />

      {/* ── PECTORALS ── fan shape, two halves meeting at sternum */}
      <Path d="M 86,71 C 58,76 32,92 22,116 C 16,134 20,152 34,162 C 48,172 66,170 78,160 C 86,152 88,138 86,116 Z"
            fill={c('pec_l')} stroke={cs('pec_l')} strokeWidth={sw} />
      <Path d="M 114,71 C 142,76 168,92 178,116 C 184,134 180,152 166,162 C 152,172 134,170 122,160 C 114,152 112,138 114,116 Z"
            fill={c('pec_r')} stroke={cs('pec_r')} strokeWidth={sw} />
      {/* Sternum line detail */}
      <Path d="M 100,72 L 100,168" stroke="#333331" strokeWidth={0.5} fill="none" />

      {/* ── ANTERIOR DELTOIDS ── */}
      <Path d="M 24,68 C 6,76 0,100 2,126 C 4,148 12,164 26,166 C 38,168 48,158 52,140 C 56,120 52,94 44,78 C 38,68 30,66 24,68 Z"
            fill={c('delt_l')} stroke={cs('delt_l')} strokeWidth={sw} />
      <Path d="M 176,68 C 194,76 200,100 198,126 C 196,148 188,164 174,166 C 162,168 152,158 148,140 C 144,120 148,94 156,78 C 162,68 170,66 176,68 Z"
            fill={c('delt_r')} stroke={cs('delt_r')} strokeWidth={sw} />

      {/* ── BICEPS ── elongated convex shape */}
      <Path d="M 2,128 C -6,148 -4,176 4,196 C 8,210 18,218 28,216 C 38,212 44,200 42,182 C 40,162 34,144 24,132 C 16,122 6,122 2,128 Z"
            fill={c('bicep_l')} stroke={cs('bicep_l')} strokeWidth={sw} />
      <Path d="M 198,128 C 206,148 204,176 196,196 C 192,210 182,218 172,216 C 162,212 156,200 158,182 C 160,162 166,144 176,132 C 184,122 194,122 198,128 Z"
            fill={c('bicep_r')} stroke={cs('bicep_r')} strokeWidth={sw} />

      {/* ── ABS — 6 segments with linea alba ── */}
      <Rect x={74}  y={170} width={23} height={19} rx={5} fill={c('abs_tl')} stroke={cs('abs_tl')} strokeWidth={0.7} />
      <Rect x={103} y={170} width={23} height={19} rx={5} fill={c('abs_tr')} stroke={cs('abs_tr')} strokeWidth={0.7} />
      <Rect x={74}  y={193} width={23} height={19} rx={5} fill={c('abs_ml')} stroke={cs('abs_ml')} strokeWidth={0.7} />
      <Rect x={103} y={193} width={23} height={19} rx={5} fill={c('abs_mr')} stroke={cs('abs_mr')} strokeWidth={0.7} />
      <Rect x={76}  y={216} width={21} height={17} rx={5} fill={c('abs_bl')} stroke={cs('abs_bl')} strokeWidth={0.7} />
      <Rect x={103} y={216} width={21} height={17} rx={5} fill={c('abs_br')} stroke={cs('abs_br')} strokeWidth={0.7} />

      {/* ── OBLIQUES ── */}
      <Path d="M 52,168 C 36,188 30,220 32,248 C 34,264 40,272 52,272 L 66,264 C 58,246 56,218 60,192 Z"
            fill={c('obl_l')} stroke={cs('obl_l')} strokeWidth={sw} />
      <Path d="M 148,168 C 164,188 170,220 168,248 C 166,264 160,272 148,272 L 134,264 C 142,246 144,218 140,192 Z"
            fill={c('obl_r')} stroke={cs('obl_r')} strokeWidth={sw} />

      {/* ── QUADS — Vastus Lateralis (outer sweep) ── */}
      <Path d="M 28,226 C 14,244 10,280 14,314 C 18,336 28,348 42,352 C 54,356 64,348 68,334 C 72,318 68,288 62,260 C 56,238 44,224 36,224 Z"
            fill={c('quad_vl_l')} stroke={cs('quad_vl_l')} strokeWidth={sw} />
      <Path d="M 172,226 C 186,244 190,280 186,314 C 182,336 172,348 158,352 C 146,356 136,348 132,334 C 128,318 132,288 138,260 C 144,238 156,224 164,224 Z"
            fill={c('quad_vl_r')} stroke={cs('quad_vl_r')} strokeWidth={sw} />

      {/* ── QUADS — Rectus Femoris (center) ── */}
      <Path d="M 48,224 C 38,244 36,278 40,312 C 44,336 56,350 70,352 C 82,352 90,342 90,320 C 90,296 82,264 76,242 C 70,226 58,220 48,224 Z"
            fill={c('quad_rf_l')} stroke={cs('quad_rf_l')} strokeWidth={sw} />
      <Path d="M 152,224 C 162,244 164,278 160,312 C 156,336 144,350 130,352 C 118,352 110,342 110,320 C 110,296 118,264 124,242 C 130,226 142,220 152,224 Z"
            fill={c('quad_rf_r')} stroke={cs('quad_rf_r')} strokeWidth={sw} />

      {/* ── QUADS — Vastus Medialis (inner teardrop) ── */}
      <Path d="M 72,252 C 64,272 66,306 72,328 C 76,342 86,350 96,348 C 106,344 110,330 106,312 C 102,294 92,270 84,254 C 80,242 76,244 72,252 Z"
            fill={c('quad_vm_l')} stroke={cs('quad_vm_l')} strokeWidth={sw} />
      <Path d="M 128,252 C 136,272 134,306 128,328 C 124,342 114,350 104,348 C 94,344 90,330 94,312 C 98,294 108,270 116,254 C 120,242 124,244 128,252 Z"
            fill={c('quad_vm_r')} stroke={cs('quad_vm_r')} strokeWidth={sw} />

      {/* ── FRONT CALVES / TIBIALIS ── */}
      <Path d="M 20,344 C 12,364 12,396 18,418 C 22,432 32,440 44,438 C 52,436 56,424 54,406 C 52,388 44,366 36,348 C 30,336 24,336 20,344 Z"
            fill={c('calf_fl')} stroke={cs('calf_fl')} strokeWidth={sw} />
      <Path d="M 180,344 C 188,364 188,396 182,418 C 178,432 168,440 156,438 C 148,436 144,424 146,406 C 148,388 156,366 164,348 C 170,336 176,336 180,344 Z"
            fill={c('calf_fr')} stroke={cs('calf_fr')} strokeWidth={sw} />
    </Svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BACK BODY — viewBox 0 0 200 480   rendered 120×288
══════════════════════════════════════════════════════════════════════════ */
function BodyBack({ hi = [] }) {
  const LN  = '#484846';
  const SK  = '#2E2E2C';
  const B   = '#1E1E1C';
  const c   = (z) => hi.includes(z) ? 'url(#hiV)' : 'url(#muscRest)';
  const cs  = (z) => hi.includes(z) ? '#6AAA65' : LN;
  const sw  = 0.8;

  return (
    <Svg width={120} height={288} viewBox="0 0 200 480">
      <GradientDefs />

      {/* ── Silhouette base ── */}
      <Ellipse cx={100} cy={28} rx={22} ry={26} fill={SK} stroke={LN} strokeWidth={1} />
      <Path d="M 88,52 L112,52 L114,72 L86,72 Z" fill={SK} />
      <Path d="M 28,68 C 14,80 10,110 12,144 C 14,168 20,178 28,184
               L 32,196 L 168,196 L 172,184
               C 180,178 186,168 188,144 C 190,110 186,80 172,68 Z"
            fill="url(#bodyDepth)" stroke={LN} strokeWidth={1} />
      <Path d="M 30,196 L 170,196 L 174,224 L 26,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 26,224 C 18,232 14,260 16,296 C 18,320 24,334 34,340 L 88,340 C 92,332 92,310 88,286 C 84,260 78,236 72,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 174,224 C 182,232 186,260 184,296 C 182,320 176,334 166,340 L 112,340 C 108,332 108,310 112,286 C 116,260 122,236 128,224 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 28,340 C 22,352 20,380 22,408 C 24,428 32,438 44,440 L 74,440 C 80,436 82,416 80,392 C 78,368 72,348 66,340 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 172,340 C 178,352 180,380 178,408 C 176,428 168,438 156,440 L 126,440 C 120,436 118,416 120,392 C 122,368 128,348 134,340 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 12,72 C 2,82 -2,108 2,140 C 4,158 10,170 20,174 L 36,174 C 40,162 40,138 38,112 C 36,88 32,74 24,70 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 188,72 C 198,82 202,108 198,140 C 196,158 190,170 180,174 L 164,174 C 160,162 160,138 162,112 C 164,88 168,74 176,70 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 2,142 C -4,156 -4,180 2,202 C 6,214 14,220 22,218 L 36,216 C 40,206 40,184 36,164 C 34,152 28,142 20,140 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />
      <Path d="M 198,142 C 204,156 204,180 198,202 C 194,214 186,220 178,218 L 164,216 C 160,206 160,184 164,164 C 166,152 172,142 180,140 Z"
            fill={B} stroke={LN} strokeWidth={0.8} />

      {/* ── TRAPEZIUS — diamond spanning upper back ── */}
      <Path d="M 86,70 C 68,74 44,86 30,100 C 20,112 22,128 34,136 C 48,144 68,140 80,130 C 90,122 96,108 100,90
               C 104,108 110,122 120,130 C 132,140 152,144 166,136 C 178,128 180,112 170,100 C 156,86 132,74 114,70 Z"
            fill={c('trap')} stroke={cs('trap')} strokeWidth={sw} />

      {/* ── REAR DELTOIDS ── */}
      <Path d="M 24,68 C 6,76 0,100 2,126 C 4,148 12,164 26,166 C 38,168 48,158 52,140 C 56,120 52,94 44,78 C 38,68 30,66 24,68 Z"
            fill={c('rdelt_l')} stroke={cs('rdelt_l')} strokeWidth={sw} />
      <Path d="M 176,68 C 194,76 200,100 198,126 C 196,148 188,164 174,166 C 162,168 152,158 148,140 C 144,120 148,94 156,78 C 162,68 170,66 176,68 Z"
            fill={c('rdelt_r')} stroke={cs('rdelt_r')} strokeWidth={sw} />

      {/* ── LATS — V-shape wings ── */}
      <Path d="M 26,84 C 10,100 6,132 8,166 C 10,186 16,198 28,202 L 48,200 C 52,188 52,166 50,144 C 48,120 44,100 38,86 Z"
            fill={c('lat_l')} stroke={cs('lat_l')} strokeWidth={sw} />
      <Path d="M 174,84 C 190,100 194,132 192,166 C 190,186 184,198 172,202 L 152,200 C 148,188 148,166 150,144 C 152,120 156,100 162,86 Z"
            fill={c('lat_r')} stroke={cs('lat_r')} strokeWidth={sw} />

      {/* ── TRICEPS ── horseshoe visible from back */}
      <Path d="M 2,128 C -6,148 -4,176 4,196 C 8,210 18,218 28,216 C 38,212 44,200 42,182 C 40,162 34,144 24,132 C 16,122 6,122 2,128 Z"
            fill={c('tricep_l')} stroke={cs('tricep_l')} strokeWidth={sw} />
      <Path d="M 198,128 C 206,148 204,176 196,196 C 192,210 182,218 172,216 C 162,212 156,200 158,182 C 160,162 166,144 176,132 C 184,122 194,122 198,128 Z"
            fill={c('tricep_r')} stroke={cs('tricep_r')} strokeWidth={sw} />

      {/* ── SPINAL ERECTORS — two columns ── */}
      <Rect x={88}  y={136} width={9} height={54} rx={4.5} fill={SK} stroke={LN} strokeWidth={0.6} />
      <Rect x={103} y={136} width={9} height={54} rx={4.5} fill={SK} stroke={LN} strokeWidth={0.6} />

      {/* ── GLUTES — large rounded ── */}
      <Path d="M 26,222 C 12,232 6,258 10,282 C 14,302 28,316 46,318 C 62,318 76,306 80,288 C 84,268 78,244 66,232 C 56,222 40,218 26,222 Z"
            fill={c('glute_l')} stroke={cs('glute_l')} strokeWidth={sw} />
      <Path d="M 174,222 C 188,232 194,258 190,282 C 186,302 172,316 154,318 C 138,318 124,306 120,288 C 116,268 122,244 134,232 C 144,222 160,218 174,222 Z"
            fill={c('glute_r')} stroke={cs('glute_r')} strokeWidth={sw} />

      {/* ── HAMSTRINGS ── two overlapping paths per side */}
      <Path d="M 18,318 C 6,336 4,368 10,398 C 14,416 26,428 40,428 C 54,426 62,414 62,396 C 62,374 54,350 44,334 C 36,320 26,316 18,318 Z"
            fill={c('ham_l')} stroke={cs('ham_l')} strokeWidth={sw} />
      <Path d="M 40,316 C 30,334 28,364 36,394 C 40,410 52,422 66,420 C 78,418 84,406 82,388 C 80,368 70,344 60,328 C 52,316 46,312 40,316 Z"
            fill={c('ham_l')} stroke={cs('ham_l')} strokeWidth={0.5} />
      <Path d="M 182,318 C 194,336 196,368 190,398 C 186,416 174,428 160,428 C 146,426 138,414 138,396 C 138,374 146,350 156,334 C 164,320 174,316 182,318 Z"
            fill={c('ham_r')} stroke={cs('ham_r')} strokeWidth={sw} />
      <Path d="M 160,316 C 170,334 172,364 164,394 C 160,410 148,422 134,420 C 122,418 116,406 118,388 C 120,368 130,344 140,328 C 148,316 154,312 160,316 Z"
            fill={c('ham_r')} stroke={cs('ham_r')} strokeWidth={0.5} />

      {/* ── GASTROCNEMIUS — two heads per side ── */}
      <Path d="M 14,428 C 4,448 4,466 10,476 C 14,484 24,488 36,486 C 48,482 52,468 50,452 C 48,436 40,424 30,424 Z"
            fill={c('calf_l')} stroke={cs('calf_l')} strokeWidth={sw} />
      <Path d="M 36,424 C 46,440 50,460 46,474 C 44,484 56,488 66,484 C 76,478 78,462 74,446 C 70,430 60,420 50,422 Z"
            fill={c('calf_ml')} stroke={cs('calf_ml')} strokeWidth={sw} />
      <Path d="M 186,428 C 196,448 196,466 190,476 C 186,484 176,488 164,486 C 152,482 148,468 150,452 C 152,436 160,424 170,424 Z"
            fill={c('calf_r')} stroke={cs('calf_r')} strokeWidth={sw} />
      <Path d="M 164,424 C 154,440 150,460 154,474 C 156,484 144,488 134,484 C 124,478 122,462 126,446 C 130,430 140,420 150,422 Z"
            fill={c('calf_mr')} stroke={cs('calf_mr')} strokeWidth={sw} />
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
