import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ScrollView, SafeAreaView, Alert,
} from 'react-native';
import theme from '../theme';

const FOOD_EMOJIS = {
  arroz: '🍚', pollo: '🍗', carne: '🥩', pescado: '🐟', salmon: '🐟',
  huevo: '🥚', frijo: '🫘', lenteja: '🫘', ensalada: '🥗', papa: '🥔',
  platano: '🍌', arepa: '🫓', aguacate: '🥑', fruta: '🍎', mango: '🥭',
  naranja: '🍊', pizza: '🍕', hamburguesa: '🍔', taco: '🌮', sopa: '🍲',
  bandeja: '🍽️', chocolate: '🍫', galleta: '🍪', coca: '🥤', agua: '💧',
  cerveza: '🍺', vino: '🍷', cafe: '☕', proteina: '💪', suplemento: '💊',
  popcorn: '🍿', helado: '🍦', pan: '🍞', pasta: '🍝', brocoli: '🥦',
  zanahoria: '🥕', manzana: '🍎', banana: '🍌', default: '🍽️',
};

function getFoodEmoji(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return FOOD_EMOJIS.default;
}

export default function FoodDetailModal({ visible, food, onSave, onDelete, onClose }) {
  const [mode, setMode] = useState('porciones'); // 'porciones' | 'gramos'
  const [portions, setPortions] = useState(1);
  const [grams, setGrams] = useState(food?.g || 100);

  React.useEffect(() => {
    if (food) {
      setPortions(1);
      setGrams(food.g || 100);
      setMode('porciones');
    }
  }, [food?.n]);

  const baseGrams = food?.g || 100;

  const factor = useMemo(() => {
    if (mode === 'porciones') return portions;
    return grams / baseGrams;
  }, [mode, portions, grams, baseGrams]);

  const macros = useMemo(() => ({
    k: Math.round((food?.k || 0) * factor),
    p: +((food?.p || 0) * factor).toFixed(1),
    c: +((food?.c || 0) * factor).toFixed(1),
    f: +((food?.f || 0) * factor).toFixed(1),
  }), [food, factor]);

  const approxGrams = Math.round(baseGrams * factor);

  const adjPortion = (delta) => {
    if (mode === 'porciones') {
      setPortions(prev => Math.max(0.25, +(prev + delta).toFixed(2)));
    } else {
      setGrams(prev => Math.max(10, prev + delta));
    }
  };

  const portionLabel = () => {
    if (mode === 'gramos') return `${grams} g`;
    const frac = portions;
    if (frac === 0.25) return '¼ porción';
    if (frac === 0.5) return '½ porción';
    if (frac === 0.75) return '¾ porción';
    if (Number.isInteger(frac)) return `${frac} ${frac === 1 ? 'porción' : 'porciones'}`;
    return `${frac} porciones`;
  };

  const handleSave = () => {
    onSave({
      ...food,
      k: macros.k,
      p: macros.p,
      c: macros.c,
      f: macros.f,
      g: approxGrams,
    });
    setPortions(1);
    setGrams(food?.g || 100);
  };

  if (!food) return null;
  const isAI = food._ai === true;
  const emoji = getFoodEmoji(food.n);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={s.backdrop} onPress={onClose} activeOpacity={1} />
        <SafeAreaView style={s.sheet}>
          <View style={s.handle} />

          {/* header row */}
          <View style={s.headerRow}>
            <TouchableOpacity onPress={onClose} style={s.iconBtn}>
              <Text style={s.iconBtnTxt}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={() => Alert.alert('Editar', 'Edita las calorías y macros directamente en los campos y guarda.')}>
              <Text style={s.iconBtnTxt}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* food icon */}
          <View style={s.emojiWrap}>
            <View style={s.emojiCircle}>
              <Text style={s.emoji}>{emoji}</Text>
            </View>
            {isAI
              ? <View style={s.aiBadge}><Text style={s.aiBadgeTxt}>✦</Text></View>
              : <View style={s.verBadge}><Text style={s.verBadgeTxt}>✓</Text></View>
            }
          </View>

          {/* food name */}
          <Text style={s.foodName}>{food.n}</Text>

          {/* macros row */}
          <View style={s.macroRow}>
            <Text style={s.macroKcal}>🔥 {macros.k} kcal</Text>
            <View style={[s.macroBadge, { backgroundColor: '#F5C842' }]}>
              <Text style={s.macroBadgeLetter}>C</Text>
            </View>
            <Text style={s.macroVal}>{macros.c} g</Text>
            <View style={[s.macroBadge, { backgroundColor: '#4A90D9' }]}>
              <Text style={s.macroBadgeLetter}>F</Text>
            </View>
            <Text style={s.macroVal}>{macros.f} g</Text>
            <View style={[s.macroBadge, { backgroundColor: '#5CB85C' }]}>
              <Text style={s.macroBadgeLetter}>P</Text>
            </View>
            <Text style={s.macroVal}>{macros.p} g</Text>
          </View>

          {/* adjust with AI */}
          <TouchableOpacity style={s.aiAdjust} onPress={() => Alert.alert('Próximamente', 'El ajuste automático con IA estará disponible pronto.')}>
            <Text style={s.aiAdjustTxt}>✦ Ajustar con IA</Text>
          </TouchableOpacity>

          {/* mode toggle */}
          <View style={s.toggle}>
            <TouchableOpacity
              style={[s.toggleBtn, mode === 'porciones' && s.toggleActive]}
              onPress={() => setMode('porciones')}
            >
              <Text style={[s.toggleTxt, mode === 'porciones' && s.toggleActiveTxt]}>Porciones</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, mode === 'gramos' && s.toggleActive]}
              onPress={() => setMode('gramos')}
            >
              <Text style={[s.toggleTxt, mode === 'gramos' && s.toggleActiveTxt]}>Gramos</Text>
            </TouchableOpacity>
          </View>

          {/* portion control */}
          <View style={s.portionBox}>
            <TouchableOpacity style={s.portionBtn} onPress={() => adjPortion(mode === 'porciones' ? -0.25 : -10)}>
              <Text style={s.portionBtnTxt}>−</Text>
            </TouchableOpacity>
            <Text style={s.portionLabel}>{portionLabel()}</Text>
            <TouchableOpacity style={s.portionBtn} onPress={() => adjPortion(mode === 'porciones' ? 0.25 : 10)}>
              <Text style={s.portionBtnTxt}>+</Text>
            </TouchableOpacity>
          </View>

          {/* tick marks */}
          <View style={s.tickRow}>
            {Array.from({ length: 17 }).map((_, i) => (
              <View key={i} style={[s.tick, i === 8 && s.tickCenter]} />
            ))}
          </View>
          <Text style={s.approxG}>≈ {approxGrams} g</Text>

          {/* bottom actions */}
          <View style={s.bottomRow}>
            <TouchableOpacity style={s.deleteBtn} onPress={onDelete}>
              <Text style={s.deleteBtnTxt}>🗑️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <Text style={s.saveBtnTxt}>✓  Guardar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#E0E0E0', alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  iconBtn: { padding: 8 },
  iconBtnTxt: { fontSize: 18, color: '#999' },

  emojiWrap: { alignItems: 'center', marginBottom: 12, position: 'relative' },
  emojiCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 36 },
  aiBadge: {
    position: 'absolute', bottom: 0, right: '34%',
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#7B61FF', alignItems: 'center', justifyContent: 'center',
  },
  aiBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  verBadge: {
    position: 'absolute', bottom: 0, right: '34%',
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#5CB85C', alignItems: 'center', justifyContent: 'center',
  },
  verBadgeTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },

  foodName: { fontSize: 22, fontWeight: '800', color: '#111', textAlign: 'center', marginBottom: 10 },

  macroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  macroKcal: { fontSize: 15, fontWeight: '700', color: '#333' },
  macroBadge: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', marginLeft: 6,
  },
  macroBadgeLetter: { color: '#fff', fontSize: 11, fontWeight: '800' },
  macroVal: { fontSize: 13, color: '#444', fontWeight: '600' },

  aiAdjust: { alignSelf: 'center', marginBottom: 16 },
  aiAdjustTxt: { color: '#7B61FF', fontSize: 14, fontWeight: '600' },

  toggle: {
    flexDirection: 'row', backgroundColor: '#F0F0F0',
    borderRadius: 20, padding: 3, marginBottom: 16,
  },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 18, alignItems: 'center' },
  toggleActive: { backgroundColor: '#fff' },
  toggleTxt: { fontSize: 14, color: '#888', fontWeight: '600' },
  toggleActiveTxt: { color: '#111' },

  portionBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F8F8F8', borderRadius: 16, padding: 12, marginBottom: 12,
  },
  portionBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center',
  },
  portionBtnTxt: { fontSize: 22, color: '#333', fontWeight: '300', lineHeight: 26 },
  portionLabel: { fontSize: 18, fontWeight: '700', color: '#111' },

  tickRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4, paddingHorizontal: 8 },
  tick: { width: 1.5, height: 8, backgroundColor: '#CCC', borderRadius: 1 },
  tickCenter: { height: 16, backgroundColor: '#888' },
  approxG: { textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 16 },

  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deleteBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#FDECEA', alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnTxt: { fontSize: 20 },
  saveBtn: {
    flex: 1, backgroundColor: '#111', borderRadius: 28,
    paddingVertical: 15, alignItems: 'center',
  },
  saveBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
