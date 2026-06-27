import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import theme from '../theme';
import { SCHED, HMET } from '../data/plan';
import { load, save, KEYS } from '../store';

let HC = null;
if (Platform.OS === 'android') {
  try { HC = require('react-native-health-connect'); } catch (e) {}
}

const DOT_COLORS = {
  n: theme.good,
  s: theme.accent,
  e: theme.over,
  r: theme.text3,
  d: theme.text2,
};

const HC_KEYS = ['steps', 'heartRate', 'sleep', 'calories', 'distance', 'exercise'];

export default function SaludScreen() {
  const [remindersOn, setRemindersOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [healthData, setHealthData] = useState({});

  useEffect(() => {
    (async () => {
      const saved = await load(KEYS.reminders);
      if (saved !== null) setRemindersOn(saved);
      const hc = await load(KEYS.healthConnect);
      if (hc) {
        setHealthData(hc);
        setConnected(true);
      }
    })();
  }, []);

  const toggleReminders = (val) => {
    setRemindersOn(val);
    save(KEYS.reminders, val);
  };

  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return {
      operator: 'between',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
  };

  const syncHealthConnect = useCallback(async () => {
    if (!HC) {
      Alert.alert(
        'No disponible',
        'Health Connect no esta disponible. Asegurate de estar usando el APK nativo (no Expo Go) y tener Health Connect instalado.'
      );
      return;
    }

    setSyncing(true);

    try {
      const status = await HC.getSdkStatus();
      if (status !== 3) {
        Alert.alert(
          'Health Connect',
          'Health Connect no esta disponible o necesita actualizacion. Instalalo desde Play Store.'
        );
        setSyncing(false);
        return;
      }

      await HC.initialize();

      const granted = await HC.requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'SleepSession' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'ExerciseSession' },
      ]);

      if (!granted || granted.length === 0) {
        Alert.alert('Permisos', 'Debes aceptar los permisos para sincronizar.');
        setSyncing(false);
        return;
      }

      const range = getTodayRange();
      const data = {};

      try {
        const r = await HC.readRecords('Steps', { timeRangeFilter: range });
        if (r.records && r.records.length > 0) {
          data.steps = r.records.reduce((s, rec) => s + (rec.count || 0), 0);
        }
      } catch (e) {}

      try {
        const r = await HC.readRecords('HeartRate', { timeRangeFilter: range });
        if (r.records && r.records.length > 0) {
          const last = r.records[r.records.length - 1];
          if (last.samples && last.samples.length > 0) {
            data.heartRate = last.samples[last.samples.length - 1].beatsPerMinute;
          }
        }
      } catch (e) {}

      try {
        const r = await HC.readRecords('SleepSession', { timeRangeFilter: range });
        if (r.records && r.records.length > 0) {
          const rec = r.records[0];
          const ms = new Date(rec.endTime) - new Date(rec.startTime);
          data.sleep = Math.round(ms / 3600000 * 10) / 10;
        }
      } catch (e) {}

      try {
        const r = await HC.readRecords('ActiveCaloriesBurned', { timeRangeFilter: range });
        if (r.records && r.records.length > 0) {
          data.calories = Math.round(r.records.reduce((s, rec) => s + (rec.energy?.inKilocalories || 0), 0));
        }
      } catch (e) {}

      try {
        const r = await HC.readRecords('Distance', { timeRangeFilter: range });
        if (r.records && r.records.length > 0) {
          data.distance = Math.round(r.records.reduce((s, rec) => s + (rec.distance?.inKilometers || 0), 0) * 10) / 10;
        }
      } catch (e) {}

      try {
        const r = await HC.readRecords('ExerciseSession', { timeRangeFilter: range });
        if (r.records && r.records.length > 0) {
          data.exercise = r.records.length;
        }
      } catch (e) {}

      setHealthData(data);
      setConnected(true);
      save(KEYS.healthConnect, data);
      Alert.alert('Sincronizado', 'Datos actualizados desde Health Connect.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo sincronizar: ' + (err.message || 'Error desconocido'));
    }

    setSyncing(false);
  }, []);

  const formatVal = (key) => {
    const v = healthData[key];
    if (v === undefined || v === null) return null;
    switch (key) {
      case 'steps': return v.toLocaleString() + ' pasos';
      case 'heartRate': return v + ' bpm';
      case 'sleep': return v + ' h';
      case 'calories': return v + ' kcal';
      case 'distance': return v + ' km';
      case 'exercise': return v + ' sesion(es)';
      default: return String(v);
    }
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
          {connected
            ? 'Conectado a Health Connect. Toca sincronizar para actualizar.'
            : 'Conecta tu Galaxy Fit3 via Health Connect para ver tus datos de salud automaticamente.'}
        </Text>

        {HMET.map((metric, i) => {
          const key = HC_KEYS[i];
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
                  <Text style={s.pendingText}>PENDIENTE</Text>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={[s.connectBtn, syncing && s.connectBtnDisabled]}
          onPress={syncHealthConnect}
          activeOpacity={0.7}
          disabled={syncing}
        >
          <Text style={s.connectBtnText}>
            {syncing ? 'SINCRONIZANDO...' : connected ? 'SINCRONIZAR' : 'CONECTAR'}
          </Text>
        </TouchableOpacity>

        <View style={s.howCard}>
          <Text style={s.howTitle}>Configuracion</Text>
          <Text style={s.howText}>
            1. Instala "Health Connect" desde Play Store{'\n'}
            2. Abre Samsung Health {'>'} Ajustes{'\n'}
            3. Activa sincronizacion con Health Connect{'\n'}
            4. Toca "CONECTAR" y acepta los permisos{'\n'}
            5. Tus datos se sincronizaran automaticamente
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
  connectBtnDisabled: { opacity: 0.5 },
  connectBtnText: {
    fontSize: 12, fontWeight: '700', letterSpacing: 2, color: theme.bg,
  },

  howCard: { backgroundColor: theme.accentSoft, padding: 14 },
  howTitle: {
    fontSize: 12, fontWeight: '700', color: theme.text,
    letterSpacing: 1, marginBottom: 6,
  },
  howText: { fontSize: 12, color: theme.text2, lineHeight: 18 },
});
