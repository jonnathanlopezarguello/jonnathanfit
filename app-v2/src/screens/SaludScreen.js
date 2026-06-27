import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import theme from '../theme';
import { SCHED } from '../data/plan';
import { load, save, KEYS } from '../store';
import { diso, dlbl } from '../utils';

const DOT_COLORS = {
  n: theme.good,
  s: theme.accent,
  e: theme.over,
  r: theme.text3,
  d: theme.text2,
};

const METRICS = [
  { key: 'steps', ic: '\u{1F6B6}', label: 'Pasos', unit: '', target: '8,000 - 10,000' },
  { key: 'heartRate', ic: '\u{2764}', label: 'Frecuencia cardiaca', unit: 'bpm', target: '60 - 100 bpm' },
  { key: 'sleep', ic: '\u{1F634}', label: 'Horas de sueno', unit: 'h', target: '7 - 9 horas' },
  { key: 'calories', ic: '\u{1F525}', label: 'Calorias quemadas', unit: 'kcal', target: '300 - 600 kcal' },
  { key: 'distance', ic: '\u{1F4CF}', label: 'Distancia', unit: 'km', target: '5 - 8 km' },
  { key: 'exercise', ic: '\u{1F3CB}', label: 'Sesiones de ejercicio', unit: '', target: '1 sesion' },
];

export default function SaludScreen() {
  const [remindersOn, setRemindersOn] = useState(true);
  const [allData, setAllData] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [dayOffset, setDayOffset] = useState(0);

  const today = diso(dayOffset);
  const dayData = allData[today] || {};

  useEffect(() => {
    (async () => {
      const saved = await load(KEYS.reminders);
      if (saved !== null) setRemindersOn(saved);
      const hc = await load(KEYS.healthConnect);
      if (hc) setAllData(hc);
    })();
  }, []);

  const toggleReminders = (val) => {
    setRemindersOn(val);
    save(KEYS.reminders, val);
  };

  const startEdit = () => {
    const current = {};
    METRICS.forEach(m => {
      current[m.key] = dayData[m.key] !== undefined ? String(dayData[m.key]) : '';
    });
    setForm(current);
    setEditing(true);
  };

  const saveData = () => {
    const cleaned = {};
    METRICS.forEach(m => {
      const v = parseFloat(form[m.key]);
      if (!isNaN(v) && v > 0) cleaned[m.key] = v;
    });
    const next = { ...allData, [today]: cleaned };
    setAllData(next);
    save(KEYS.healthConnect, next);
    setEditing(false);
  };

  const hasData = Object.keys(dayData).length > 0;

  const formatVal = (key) => {
    const v = dayData[key];
    if (v === undefined || v === null) return null;
    const m = METRICS.find(x => x.key === key);
    if (key === 'steps') return v.toLocaleString();
    return v + (m && m.unit ? ' ' + m.unit : '');
  };

  const weekSummary = () => {
    let totalSteps = 0, totalCal = 0, totalSleep = 0, days = 0;
    for (let i = 0; i < 7; i++) {
      const d = diso(dayOffset - i);
      const dd = allData[d];
      if (dd) {
        days++;
        totalSteps += dd.steps || 0;
        totalCal += dd.calories || 0;
        totalSleep += dd.sleep || 0;
      }
    }
    if (days === 0) return null;
    return {
      avgSteps: Math.round(totalSteps / days),
      avgCal: Math.round(totalCal / days),
      avgSleep: Math.round(totalSleep / days * 10) / 10,
      days,
    };
  };

  const ws = weekSummary();

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      <Text style={s.label}>SAMSUNG GALAXY FIT3</Text>
      <Text style={s.h1}>Salud</Text>

      {/* Date nav */}
      <View style={s.dateNav}>
        <TouchableOpacity onPress={() => setDayOffset(dayOffset - 1)} style={s.dateArrow}>
          <Text style={s.dateArrowText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDayOffset(0)}>
          <Text style={s.dateLabel}>{dlbl(dayOffset)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDayOffset(dayOffset + 1)} style={s.dateArrow}>
          <Text style={s.dateArrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>DATOS DEL DIA</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        {editing ? (
          <>
            {METRICS.map((m) => (
              <View key={m.key} style={s.editRow}>
                <Text style={s.editIcon}>{m.ic}</Text>
                <View style={s.editFieldWrap}>
                  <Text style={s.editLabel}>{m.label}{m.unit ? ' (' + m.unit + ')' : ''}</Text>
                  <TextInput
                    style={s.editInput}
                    keyboardType="numeric"
                    value={form[m.key] || ''}
                    onChangeText={(v) => setForm(prev => ({ ...prev, [m.key]: v }))}
                    placeholder="0"
                    placeholderTextColor={theme.text3}
                  />
                </View>
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
            {METRICS.map((m, i) => {
              const val = formatVal(m.key);
              return (
                <View key={m.key} style={[s.metricRow, i < METRICS.length - 1 && s.metricRowBorder]}>
                  <Text style={s.metricIcon}>{m.ic}</Text>
                  <View style={s.metricInfo}>
                    <Text style={s.metricLabel}>{m.label}</Text>
                    <Text style={s.metricTarget}>{m.target}</Text>
                  </View>
                  {val ? (
                    <View style={s.dataBadge}>
                      <Text style={s.dataText}>{val}</Text>
                    </View>
                  ) : (
                    <View style={s.pendingBadge}>
                      <Text style={s.pendingText}>---</Text>
                    </View>
                  )}
                </View>
              );
            })}
            <TouchableOpacity style={s.syncBtn} onPress={startEdit} activeOpacity={0.7}>
              <Text style={s.syncBtnText}>{hasData ? 'ACTUALIZAR DATOS' : 'REGISTRAR DATOS'}</Text>
            </TouchableOpacity>
            <Text style={s.syncHint}>Ingresa los datos desde Samsung Health</Text>
          </>
        )}
      </View>

      {/* Weekly summary */}
      {ws && (
        <>
          <View style={s.divider}>
            <Text style={s.dividerLabel}>RESUMEN SEMANAL ({ws.days} dias)</Text>
            <View style={s.dividerLine} />
          </View>
          <View style={s.card}>
            <View style={s.weekRow}>
              <Text style={s.weekIcon}>{'\u{1F6B6}'}</Text>
              <Text style={s.weekLabel}>Promedio pasos</Text>
              <Text style={s.weekVal}>{ws.avgSteps.toLocaleString()}</Text>
            </View>
            <View style={[s.weekRow, s.weekRowBorder]}>
              <Text style={s.weekIcon}>{'\u{1F525}'}</Text>
              <Text style={s.weekLabel}>Promedio calorias</Text>
              <Text style={s.weekVal}>{ws.avgCal} kcal</Text>
            </View>
            <View style={s.weekRow}>
              <Text style={s.weekIcon}>{'\u{1F634}'}</Text>
              <Text style={s.weekLabel}>Promedio sueno</Text>
              <Text style={s.weekVal}>{ws.avgSleep} h</Text>
            </View>
          </View>
        </>
      )}

      {/* Reminders */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>RECORDATORIOS</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <View style={s.reminderRow}>
          <View>
            <Text style={s.reminderTitle}>Notificaciones</Text>
            <Text style={s.reminderSub}>
              {remindersOn ? '9 recordatorios activos' : 'Desactivados'}
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

      {/* Schedule */}
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

      <View style={{ height: 40 }} />
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
    color: theme.text, marginBottom: 16,
  },

  dateNav: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
  },
  dateArrow: { padding: 12 },
  dateArrowText: { color: theme.text, fontSize: 18, fontWeight: '600' },
  dateLabel: { color: theme.text, fontSize: 16, fontWeight: '600', marginHorizontal: 16 },

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

  metricRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
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
    fontSize: 11, fontWeight: '600', color: theme.text3,
  },
  dataBadge: {
    backgroundColor: theme.accentSoft,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  dataText: {
    fontSize: 12, fontWeight: '700', color: theme.good,
  },

  syncBtn: {
    backgroundColor: theme.accent, paddingVertical: 14,
    alignItems: 'center', marginTop: 16,
  },
  syncBtnText: {
    fontSize: 12, fontWeight: '700', letterSpacing: 2, color: theme.bg,
  },
  syncHint: {
    fontSize: 11, color: theme.text3, textAlign: 'center', marginTop: 8,
  },

  editRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
  },
  editIcon: { fontSize: 18, marginRight: 12, width: 28, textAlign: 'center' },
  editFieldWrap: { flex: 1 },
  editLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1,
    color: theme.text3, marginBottom: 4,
  },
  editInput: {
    borderWidth: 1, borderColor: theme.line, padding: 10,
    color: theme.text, fontSize: 14,
  },
  editActions: {
    flexDirection: 'row', gap: 10, marginTop: 4,
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

  weekRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
  },
  weekRowBorder: {
    borderBottomWidth: 1, borderBottomColor: theme.line,
    borderTopWidth: 1, borderTopColor: theme.line,
  },
  weekIcon: { fontSize: 16, marginRight: 10, width: 24, textAlign: 'center' },
  weekLabel: { flex: 1, fontSize: 13, color: theme.text },
  weekVal: { fontSize: 14, fontWeight: '600', color: theme.good },

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
});
