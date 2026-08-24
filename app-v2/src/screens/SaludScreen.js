import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import theme from '../theme';
import { SCHED } from '../data/plan';
import { load, save, KEYS } from '../store';
import { dlbl, diso } from '../utils';

const DOT_COLORS = {
  n: theme.good,
  s: theme.accent,
  e: theme.over,
  r: theme.text3,
  d: theme.text2,
};

const PERMISSIONS = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  { accessType: 'read', recordType: 'ExerciseSession' },
];

const METRICS = [
  { key: 'steps',     ic: '🚶', label: 'Pasos',                unit: '',     target: '8,000 - 10,000' },
  { key: 'heartRate', ic: '❤️', label: 'Frecuencia cardíaca',  unit: 'bpm',  target: '60 - 100 bpm' },
  { key: 'sleep',     ic: '😴', label: 'Horas de sueño',       unit: 'h',    target: '7 - 9 horas' },
  { key: 'calories',  ic: '🔥', label: 'Calorías quemadas',    unit: 'kcal', target: '300 - 600 kcal' },
  { key: 'distance',  ic: '📏', label: 'Distancia',            unit: 'km',   target: '5 - 8 km' },
  { key: 'exercise',  ic: '🏋️', label: 'Sesiones de ejercicio',unit: '',     target: '1 sesión' },
];

function getDateRange(offset) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 0, 0, 0, 0);
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 23, 59, 59, 999);
  return { startTime: start.toISOString(), endTime: end.toISOString() };
}

export default function SaludScreen() {
  const [remindersOn, setRemindersOn]   = useState(true);
  const [connected, setConnected]       = useState(false);
  const [syncing, setSyncing]           = useState(false);
  const [healthData, setHealthData]     = useState({});
  const [dayOffset, setDayOffset]       = useState(0);
  const [hcStatus, setHcStatus]         = useState('unknown'); // 'unknown'|'unavailable'|'ready'

  useEffect(() => {
    (async () => {
      const saved = await load(KEYS.reminders);
      if (saved !== null) setRemindersOn(saved);
      const hc = await load(KEYS.healthConnect);
      if (hc) { setHealthData(hc); setConnected(true); }

      // check Health Connect availability
      try {
        const status = await getSdkStatus();
        if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
          const ok = await initialize();
          setHcStatus(ok ? 'ready' : 'unavailable');
          if (ok) setConnected(true);
        } else {
          setHcStatus('unavailable');
        }
      } catch (_) {
        setHcStatus('unavailable');
      }
    })();
  }, []);

  const syncDay = useCallback(async (offset) => {
    setSyncing(true);
    try {
      const { startTime, endTime } = getDateRange(offset);
      const timeRangeFilter = { operator: 'between', startTime, endTime };
      const key = diso(offset);

      // Steps
      const stepsRes = await readRecords('Steps', { timeRangeFilter });
      const steps = (stepsRes.records || []).reduce((s, r) => s + (r.count || 0), 0);

      // Heart Rate (average)
      const hrRes = await readRecords('HeartRate', { timeRangeFilter });
      const hrSamples = (hrRes.records || []).flatMap(r => r.samples || []);
      const heartRate = hrSamples.length > 0
        ? Math.round(hrSamples.reduce((s, r) => s + (r.beatsPerMinute || 0), 0) / hrSamples.length)
        : null;

      // Sleep (hours)
      const sleepRes = await readRecords('SleepSession', { timeRangeFilter });
      const sleepMs = (sleepRes.records || []).reduce((s, r) => {
        const st = new Date(r.startTime).getTime();
        const et = new Date(r.endTime).getTime();
        return s + (et - st);
      }, 0);
      const sleep = sleepMs > 0 ? Math.round(sleepMs / 3600000 * 10) / 10 : null;

      // Calories burned
      const calRes = await readRecords('TotalCaloriesBurned', { timeRangeFilter });
      const calories = (calRes.records || []).length > 0
        ? Math.round((calRes.records || []).reduce((s, r) => s + (r.energy?.inKilocalories || 0), 0))
        : null;

      // Distance
      const distRes = await readRecords('Distance', { timeRangeFilter });
      const distance = (distRes.records || []).length > 0
        ? Math.round((distRes.records || []).reduce((s, r) => s + (r.distance?.inMeters || 0), 0) / 100) / 10
        : null;

      // Exercise sessions
      const exRes = await readRecords('ExerciseSession', { timeRangeFilter });
      const exercise = (exRes.records || []).length;

      const dayData = { steps, heartRate, sleep, calories, distance, exercise };

      const next = { ...healthData, [key]: dayData };
      setHealthData(next);
      save(KEYS.healthConnect, next);
      setConnected(true);
    } catch (e) {
      Alert.alert('Error al sincronizar', e.message || 'Verifica los permisos de Health Connect.');
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (connected && hcStatus === 'ready') syncDay(dayOffset);
  }, [dayOffset, connected, hcStatus, syncDay]);

  const toggleReminders = (val) => {
    setRemindersOn(val);
    save(KEYS.reminders, val);
  };

  const connectHealthConnect = async () => {
    if (hcStatus === 'unavailable') {
      Alert.alert(
        'Health Connect no disponible',
        'Instala Health Connect desde Google Play Store para sincronizar tus datos de salud.',
        [{ text: 'OK' }]
      );
      return;
    }
    setSyncing(true);
    try {
      const ok = await initialize();
      if (!ok) throw new Error('No se pudo inicializar Health Connect');
      const granted = await requestPermission(PERMISSIONS);
      if (!granted || granted.length === 0) {
        Alert.alert(
          'Permisos denegados',
          'Ve a Configuración > Apps > Health Connect y otorga los permisos de salud.',
          [{ text: 'OK' }]
        );
        return;
      }
      await syncDay(dayOffset);
      setConnected(true);
      Alert.alert('✓ Conectado', 'Health Connect sincronizado correctamente.');
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo conectar con Health Connect.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncBtn = () => {
    if (!connected) {
      connectHealthConnect();
    } else {
      syncDay(dayOffset);
    }
  };

  const dateKey = diso(dayOffset);
  const dayData = healthData[dateKey] || {};

  const formatVal = (key) => {
    const v = dayData[key];
    if (v === undefined || v === null) return null;
    const m = METRICS.find(x => x.key === key);
    if (key === 'steps') return v.toLocaleString();
    if (key === 'exercise') return v === 0 ? null : `${v} sesión${v !== 1 ? 'es' : ''}`;
    return v + (m?.unit ? ' ' + m.unit : '');
  };

  const weekSummary = () => {
    let totalSteps = 0, totalCal = 0, totalSleep = 0, days = 0;
    for (let i = 0; i < 7; i++) {
      const dk = diso(dayOffset - i);
      const dd = healthData[dk];
      if (dd && Object.keys(dd).length > 0) {
        days++;
        totalSteps += dd.steps || 0;
        totalCal   += dd.calories || 0;
        totalSleep += dd.sleep || 0;
      }
    }
    if (days === 0) return null;
    return {
      avgSteps: Math.round(totalSteps / days),
      avgCal:   Math.round(totalCal / days),
      avgSleep: Math.round(totalSleep / days * 10) / 10,
      days,
    };
  };

  const ws = weekSummary();

  const statusLabel = () => {
    if (hcStatus === 'unavailable') return 'Health Connect no instalado';
    if (syncing) return 'Sincronizando...';
    if (connected) return 'Sincronización automática activa';
    return null;
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      <Text style={s.label}>HEALTH CONNECT</Text>
      <Text style={s.h1}>Salud</Text>

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

      <View style={s.divider}>
        <Text style={s.dividerLabel}>DATOS DEL DÍA</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
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

        <TouchableOpacity
          style={[s.syncBtn, (syncing || hcStatus === 'unavailable') && { opacity: 0.5 }]}
          onPress={handleSyncBtn}
          activeOpacity={0.7}
          disabled={syncing}
        >
          <Text style={s.syncBtnText}>
            {syncing
              ? 'SINCRONIZANDO...'
              : connected
                ? 'SINCRONIZAR AHORA'
                : 'CONECTAR HEALTH CONNECT'}
          </Text>
        </TouchableOpacity>

        {statusLabel() && (
          <Text style={[s.syncHint, hcStatus === 'unavailable' && { color: theme.over }]}>
            {statusLabel()}
          </Text>
        )}
      </View>

      {ws && (
        <>
          <View style={s.divider}>
            <Text style={s.dividerLabel}>RESUMEN SEMANAL ({ws.days} días)</Text>
            <View style={s.dividerLine} />
          </View>
          <View style={s.card}>
            <View style={s.weekRow}>
              <Text style={s.weekIcon}>🚶</Text>
              <Text style={s.weekLabel}>Promedio pasos</Text>
              <Text style={s.weekVal}>{ws.avgSteps.toLocaleString()}</Text>
            </View>
            <View style={[s.weekRow, s.weekRowBorder]}>
              <Text style={s.weekIcon}>🔥</Text>
              <Text style={s.weekLabel}>Promedio calorías</Text>
              <Text style={s.weekVal}>{ws.avgCal} kcal</Text>
            </View>
            <View style={s.weekRow}>
              <Text style={s.weekIcon}>😴</Text>
              <Text style={s.weekLabel}>Promedio sueño</Text>
              <Text style={s.weekVal}>{ws.avgSleep} h</Text>
            </View>
          </View>
        </>
      )}

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

      <View style={s.divider}>
        <Text style={s.dividerLabel}>HORARIO DEL DÍA</Text>
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

  label: { fontSize: 11, fontWeight: '600', letterSpacing: 2, color: theme.text3, marginBottom: 6 },
  h1: { fontSize: 30, fontWeight: '200', color: theme.text, marginBottom: 16 },

  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  dateArrow: { padding: 12 },
  dateArrowText: { color: theme.text, fontSize: 18, fontWeight: '600' },
  dateLabel: { color: theme.text, fontSize: 16, fontWeight: '600', marginHorizontal: 16 },

  divider: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 14 },
  dividerLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 2, color: theme.text3, marginRight: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.line },

  card: { borderWidth: 1, borderColor: theme.line, padding: 20, marginBottom: 20 },

  metricRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  metricRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.line },
  metricIcon: { fontSize: 20, marginRight: 12, width: 28, textAlign: 'center' },
  metricInfo: { flex: 1 },
  metricLabel: { fontSize: 13, color: theme.text },
  metricTarget: { fontSize: 11, color: theme.text3, marginTop: 1 },

  pendingBadge: { borderWidth: 1, borderColor: theme.line2, paddingHorizontal: 8, paddingVertical: 3 },
  pendingText: { fontSize: 11, fontWeight: '600', color: theme.text3 },
  dataBadge: { backgroundColor: theme.accentSoft, paddingHorizontal: 10, paddingVertical: 4 },
  dataText: { fontSize: 12, fontWeight: '700', color: theme.good },

  syncBtn: {
    backgroundColor: theme.accent, paddingVertical: 14,
    alignItems: 'center', marginTop: 16,
  },
  syncBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 2, color: theme.bg },
  syncHint: { fontSize: 11, color: theme.good, textAlign: 'center', marginTop: 8 },

  weekRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  weekRowBorder: {
    borderBottomWidth: 1, borderBottomColor: theme.line,
    borderTopWidth: 1, borderTopColor: theme.line,
  },
  weekIcon: { fontSize: 16, marginRight: 10, width: 24, textAlign: 'center' },
  weekLabel: { flex: 1, fontSize: 13, color: theme.text },
  weekVal: { fontSize: 14, fontWeight: '600', color: theme.good },

  reminderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  schedTime: { fontSize: 13, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'], width: 50 },
  schedLabel: { fontSize: 13, color: theme.text2, flex: 1 },
});
