import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ScrollView, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import theme from '../theme';
import FoodDetailModal, { getFoodEmoji } from './FoodDetailModal';

const getEmoji = getFoodEmoji;

function fmt() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `Hoy a las ${h}:${m}`;
}

export default function FoodScanModal({ visible, foods: initialFoods, loading, onRegister, onClose }) {
  const [foods, setFoods] = useState(initialFoods || []);
  const [detailFood, setDetailFood] = useState(null);
  const [detailIdx, setDetailIdx] = useState(null);

  // Sync foods when prop changes
  React.useEffect(() => {
    setFoods(initialFoods || []);
  }, [initialFoods]);

  const totalKcal = foods.reduce((s, f) => s + (f.k || 0), 0);

  const openDetail = (food, idx) => {
    setDetailFood({ ...food, _ai: true });
    setDetailIdx(idx);
  };

  const saveDetail = (updated) => {
    const next = [...foods];
    next[detailIdx] = { ...updated, _ai: true };
    setFoods(next);
    setDetailFood(null);
    setDetailIdx(null);
  };

  const deleteDetail = () => {
    const next = foods.filter((_, i) => i !== detailIdx);
    setFoods(next);
    setDetailFood(null);
    setDetailIdx(null);
  };

  const handleRegister = () => {
    onRegister(foods);
    setFoods([]);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={s.overlay}>
          <TouchableOpacity style={s.backdrop} onPress={onClose} activeOpacity={1} />
          <SafeAreaView style={s.sheet}>
            <View style={s.handle} />

            {loading ? (
              <View style={s.loadingBox}>
                <ActivityIndicator size="large" color="#7B61FF" />
                <Text style={s.loadingTxt}>Analizando foto...</Text>
                <Text style={s.loadingHint}>FULGOR IA está identificando los alimentos</Text>
              </View>
            ) : (
              <>
                {/* header */}
                <View style={s.titleRow}>
                  <View style={s.titleLeft}>
                    <Text style={s.title}>Mi comida</Text>
                    <View style={s.countBadge}>
                      <Text style={s.countTxt}>×{foods.length}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={s.closeBtn}>
                    <Text style={s.closeBtnTxt}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.timestamp}>{fmt()}</Text>

                {/* food list */}
                <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
                  {foods.map((food, idx) => (
                    <View key={food.n + idx} style={s.foodRow}>
                      <View style={s.foodIcon}>
                        <Text style={s.foodEmoji}>{getEmoji(food.n)}</Text>
                      </View>
                      <View style={s.foodInfo}>
                        <View style={s.foodNameRow}>
                          <Text style={s.foodName} numberOfLines={1}>{food.n}</Text>
                          <View style={s.aiBadge}>
                            <Text style={s.aiBadgeTxt}>✦</Text>
                          </View>
                        </View>
                        <Text style={s.foodMeta}>
                          {food.po || `1 porción (${food.g || 100}g)`} · {food.k} kcal
                        </Text>
                      </View>
                      <TouchableOpacity style={s.editBtn} onPress={() => openDetail(food, idx)}>
                        <Text style={s.editBtnTxt}>✏️</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={{ height: 20 }} />
                </ScrollView>

                {/* bottom */}
                <View style={s.bottomRow}>
                  <TouchableOpacity style={s.addBtn} onPress={() => Alert.alert('Agregar manualmente', 'Para agregar un alimento manualmente, cierra este diálogo y usa el botón + en la pantalla de Comida.')}>
                    <Text style={s.addBtnTxt}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.registerBtn} onPress={handleRegister} disabled={foods.length === 0}>
                    <Text style={s.registerBtnTxt}>Registrar {totalKcal} kcal</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </Modal>

      <FoodDetailModal
        visible={detailFood !== null}
        food={detailFood}
        onSave={saveDetail}
        onDelete={deleteDetail}
        onClose={() => { setDetailFood(null); setDetailIdx(null); }}
      />
    </>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    maxHeight: '85%',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#E0E0E0', alignSelf: 'center', marginTop: 10, marginBottom: 12,
  },

  loadingBox: { alignItems: 'center', paddingVertical: 48 },
  loadingTxt: { fontSize: 18, fontWeight: '700', color: '#111', marginTop: 16 },
  loadingHint: { fontSize: 13, color: '#888', marginTop: 6 },

  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  countBadge: {
    backgroundColor: '#F0F0F0', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  countTxt: { fontSize: 13, fontWeight: '700', color: '#555' },
  closeBtn: { padding: 6 },
  closeBtnTxt: { fontSize: 18, color: '#999' },
  timestamp: { fontSize: 13, color: '#888', marginBottom: 14 },

  list: { flexGrow: 0 },
  foodRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  foodIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  foodEmoji: { fontSize: 22 },
  foodInfo: { flex: 1 },
  foodNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  foodName: { fontSize: 14, fontWeight: '700', color: '#111', flexShrink: 1 },
  aiBadge: {
    backgroundColor: '#7B61FF', borderRadius: 8,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  aiBadgeTxt: { color: '#fff', fontSize: 9, fontWeight: '700' },
  foodMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center',
  },
  editBtnTxt: { fontSize: 16 },

  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12 },
  addBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center',
  },
  addBtnTxt: { fontSize: 26, color: '#555', lineHeight: 30 },
  registerBtn: {
    flex: 1, backgroundColor: '#111', borderRadius: 28,
    paddingVertical: 15, alignItems: 'center',
  },
  registerBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
