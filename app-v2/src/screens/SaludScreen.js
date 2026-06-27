import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import theme from '../theme';
import { SCHED, HMET } from '../data/plan';
import { load, save, KEYS } from '../store';
import { diso } from '../utils';

const DOT_COLORS = {
  n: theme.good,
  s: theme.accent,
  e: theme.over,
  r: theme.text3,
  d: theme.text2,
};

const HC_FIELDS = [
  { key: 'steps', label: 'Pasos', unit: '', kb: 'numeric' },
  { key: 'heartRate', label: 'Frecuencia cardiaca', unit: 'bpm', kb: 'numeric' },
  { key: 'sleep', label: 'Horas de sueno', unit: 'h', kb: 'numeric' },
  { key: 'calories', label: 'Calorias quemadas', unit: 'kcal', kb: 'numeric' },
  { key: 'distance', label: 'Distancia', unit: 'km', kb: 'numeric' },
  { key: 'exercise', label: 'Sesiones', unit: '', kb: 'numeric' },
];

export default function SaludScreen() {
  const [remindersOn, setRemindersOn] = useState(true);
  const [healthData, setHealthData] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const today = diso(0);

  useEffect(() => {
    (async () => {
      const saved = await load(KEYS.reminders);
      if (saved !== null) setRemindersOn(saved);
      const hc = await load(KEYS.healthConnect);
      if (hc) setHealthData(hc);
    })();
  }, []);

  const toggleReminders = (val) => {
    setRemindersOn(val);
    save(KEYS.reminders, val);
  };

  const todayData = healthData[today] || {};

  const startEdit = () => {
    setForm({ ...todayData });
    setEditing(true);
  };

  const saveData = () => {
    const cleaned = {};
    HC_FIELDS.forEach(f => {
      const v = parseFloat(form[f.key]);
      if (!isNaN(v) && v > 0) cleaned[f.key] = v;
    });
    const next = { ...healthData, [today]: cleaned };
    setHealthData(next);
    save(KEYS.healthConnect, next);
    setEditing(false);
    Alert.alert('Guardado', 'Datos de salud actualizados.');
  };

  const formatVal = (key) => {
    const v = todayData[key];
    if (v === undefined || v === null) return null;
    const field = HC_FIELDS.find(f => f.key === key);
    if (key === 'steps') return v.toLocaleString() + ' pasos';
    return v + ' ' + (field ? field.unit : '');
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      <Text style={s.label}>INTEGRACIONES</Text>
      <Text style={s.h1}>Salud</Text>

      <View style={s.divider}>
        <Text style={s.dividerLabel}>RECORDATORIOS DIARIOS</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <View style={s.reminderRow}>
          <View>
            <Text style={s.reminderTitle}>Notificaciones</Text>
            <Text style={s.reminderSub}>
              {remindersOn ? '9 recordatorios activos' : 'Recordatorios desactivados'}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.toggle, remindersOn && s.toggleOn]}
            onPress={() => toggleReminders(!remindersOn)}
            activeOpacity={0.7}
          >
            <View style={[s.toggleThumb, remindersOn && s.toggleThumbOn]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.divider}>
        <Text style={s.dividerLabel}>HORARIO DEL DIA</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        {SCHED.map((item, i) => (
          <View key={i} style={[s.schedRow, i < SCHED.length - 1 && s.schedRowBorder]}>
            <View style={[s.schedDot, { backgroundColor: DOT_COLORS[item.ty] || theme.text3 }]} />
            <Text style={s.schedTime}>{item.t}</Text>
            <Text style={s.schedLabel}>{item.l}</Text>
          </View>
        ))}
      </View>

      <View style={s.divider}>
        <Text style={s.dividerLabel}>SAMSUNG GALAXY FIT3</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <Text style={s.fitDesc}>
          Ingresa los datos de tu Galaxy Fit3 desde Samsung Health para llevar el seguimiento diario.
        </Text>

        {editing ? (
          <>
            {HC_FIELDS.map((field) => (
              <View key={field.key} style={s.editRow}>
                <Text style={s.editLabel}>{field.label}{field.unit ? ' (' + field.unit + ')' : ''}</Text>
                <TextInput
                  style={s.editInput}
                  keyboardType={field.kb}
                  value={form[field.key] !== undefined ? String(form[field.key]) : ''}
                  onChangeText={(v) => setForm(prev => ({ ...prev, [field.key]: v }))}
                  placeholder="0"
                  placeholderTextColor={theme.text3}
                />
              </View>
            ))}
            <View style={s.editActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setEditing(false)} activeOpacity={0.7}>
                <Text style={s.cancelBtnText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={saveData} activeOpacity={0.7}>
                <Text style={s.saveBtnText}>GUARDAR</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {HMET.map((metric, i) => {
              const key = HC_FIELDS[i] ? HC_FIELDS[i].key : null;
              const val = key ? formatVal(key) : null;
              return (
                <View key={i} style={[s.metricRow, i < HMET.length - 1 && s.metricRowBorder]}>
                  <Text style={s.metricIcon}>{metric.ic}</Text>
                  <View style={s.metricInfo}>
                    <Text style={s.metricLabel}>{metric.l}</Text>
                    <Text style={s.metricTarget}>{metric.tg}</Text>
                  </View>
                  {val ? (
                    <View style={s.connectedBadge}>
                      <Text style={s.connectedText}>{val}</Text>
                    </View>
                  ) : (
                    <View style={s.pendingBadge}>
                      <Text style={s.pendingText}>SIN DATOS</Text>
                    </View>
                  )}
                </View>
              );
            })}

            <TouchableOpacity style={s.connectBtn} onPress={startEdit} activeOpacity={0.7}>
              <Text style={s.connectBtnText}>REGISTRAR DATOS</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={s.howCard}>
          <Text style={s.howTitle}>Como registrar</Text>
          <Text style={s.howText}>
            1. Abre Samsung Health en tu celular{'\n'}
            2. Revisa tus datos del dia (pasos, sueno, etc.){'\n'}
            3. Toca "REGISTRAR DATOS" e ingresa los valores{'\n'}
            4. Los datos se guardan por dia automaticamente
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  rootPad: { padding: 24, paddingBottom: 60 },

  label: {
    fontSize: 11, fontWeight: '600', letterSpacing: 2,
    color: theme.text3, marginBottom: 6,
  },
  h1: {
    fontSize: 30, fontWeight: '200',
    color: theme.text, marginBottom: 24,
  },

  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 8, marginBottom: 14,
  },
  dividerLabel: {
    fontSize: 10, fontWeight: '600', letterSpacing: 2,
    color: theme.text3, marginRight: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.line },

  card: {
    borderWidth: 1, borderColor: theme.line,
    padding: 20, marginBottom: 20,
  },

  reminderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  reminderTitle: { fontSize: 14, fontWeight: '600', color: theme.text },
  reminderSub: { fontSize: 12, color: theme.text3, marginTop: 2 },

  toggle: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: theme.line2, justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleOn: { backgroundColor: theme.good },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: theme.text3 },
  toggleThumbOn: { alignSelf: 'flex-end', backgroundColor: theme.bg },

  schedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  schedRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.line },
  schedDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  schedTime: {
    fontSize: 13, fontWeight: '600', color: theme.text,
    fontVariant: ['tabular-nums'], width: 50,
  },
  schedLabel: { fontSize: 13, color: theme.text2, flex: 1 },

  fitDesc: { fontSize: 13, color: theme.text2, lineHeight: 19, marginBottom: 16 },

  metricRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  metricRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.line },
  metricIcon: { fontSize: 20, marginRight: 12, width: 28, textAlign: 'center' },
  metricInfo: { flex: 1 },
  metricLabel: { fontSize: 13, color: theme.text },
  metricTarget: { fontSize: 11, color: theme.text3, marginTop: 1 },

  pendingBadge: {
    borderWidth: 1, borderColor: theme.line2,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  pendingText: {
    fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: theme.text3,
  },
  connectedBadge: {
    backgroundColor: theme.accentSoft,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  connectedText: {
    fontSize: 11, fontWeight: '600', color: theme.good,
  },

  connectBtn: {
    backgroundColor: theme.accent, paddingVertical: 14,
    alignItems: 'center', marginTop: 16, marginBottom: 16,
  },
  connectBtnText: {
    fontSize: 12, fontWeight: '700', letterSpacing: 2, color: theme.bg,
  },

  editRow: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1,
    color: theme.text3, marginBottom: 4,
  },
  editInput: {
    borderWidth: 1, borderColor: theme.line, padding: 10,
    color: theme.text, fontSize: 14,
  },
  editActions: {
    flexDirection: 'row', gap: 10, marginTop: 8,
  },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: theme.line2,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12, fontWeight: '700', letterSpacing: 2, color: theme.text3,
  },
  saveBtn: {
    flex: 1, backgroundColor: theme.accent,
    paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 12, fontWeight: '700', letterSpacing: 2, color: theme.bg,
  },

  howCard: { backgroundColor: theme.accentSoft, padding: 14 },
  howTitle: {
    fontSize: 12, fontWeight: '700', color: theme.text,
    letterSpacing: 1, marginBottom: 6,
  },
  howText: { fontSize: 12, color: theme.text2, lineHeight: 18 },
});
