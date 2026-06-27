import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import theme from '../theme';
import { SCHED, HMET } from '../data/plan';
import { load, save, KEYS } from '../store';

let HealthConnect = null;
try {
  HealthConnect = require('react-native-health-connect');
} catch (e) {}

const DOT_COLORS = {
  n: theme.good,
  s: theme.accent,
  e: theme.over,
  r: theme.text3,
  d: theme.text2,
};

export default function SaludScreen() {
  const [remindersOn, setRemindersOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [healthData, setHealthData] = useState({
    steps: null,
    heartRate: null,
    sleep: null,
    calories: null,
    distance: null,
    exercise: null,
  });

  useEffect(() => {
    (async () => {
      const saved = await load(KEYS.reminders);
      if (saved !== null) setRemindersOn(saved);
      const hc = await load(KEYS.healthConnect);
      if (hc) {
        setConnected(true);
        setHealthData(hc);
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

  const readHealthData = async () => {
    if (!HealthConnect) {
      Alert.alert('No disponible', 'Health Connect no esta disponible en esta version. Necesitas instalar el APK nativo.');
      return;
    }

    try {
      const isAvailable = await HealthConnect.getSdkStatus();
      if (isAvailable !== 3) {
        Alert.alert(
          'Health Connect no disponible',
          'Instala o actualiza Health Connect desde Play Store.',
        );
        return;
      }

      const granted = await HealthConnect.requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'SleepSession' },
        { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'ExerciseSession' },
      ]);

      if (!granted || granted.length === 0) {
        Alert.alert('Permisos', 'Debes aceptar los permisos para sincronizar datos.');
        return;
      }

      const range = getTodayRange();
      const data = { steps: null, heartRate: null, sleep: null, calories: null, distance: null, exercise: null };

      try {
        const stepsResult = await HealthConnect.readRecords('Steps', { timeRangeFilter: range });
        if (stepsResult.records && stepsResult.records.length > 0) {
          data.steps = stepsResult.records.reduce((sum, r) => sum + (r.count || 0), 0);
        }
      } catch (e) {}

      try {
        const hrResult = await HealthConnect.readRecords('HeartRate', { timeRangeFilter: range });
        if (hrResult.records && hrResult.records.length > 0) {
          const last = hrResult.records[hrResult.records.length - 1];
          if (last.samples && last.samples.length > 0) {
            data.heartRate = last.samples[last.samples.length - 1].beatsPerMinute;
          }
        }
      } catch (e) {}

      try {
        const sleepResult = await HealthConnect.readRecords('SleepSession', { timeRangeFilter: range });
        if (sleepResult.records && sleepResult.records.length > 0) {
          const rec = sleepResult.records[0];
          const start = new Date(rec.startTime);
          const end = new Date(rec.endTime);
          data.sleep = Math.round((end - start) / 3600000 * 10) / 10;
        }
      } catch (e) {}

      try {
        const calResult = await HealthConnect.readRecords('ActiveCaloriesBurned', { timeRangeFilter: range });
        if (calResult.records && calResult.records.length > 0) {
          data.calories = Math.round(calResult.records.reduce((sum, r) => sum + (r.energy?.inKilocalories || 0), 0));
        }
      } catch (e) {}

      try {
        const distResult = await HealthConnect.readRecords('Distance', { timeRangeFilter: range });
        if (distResult.records && distResult.records.length > 0) {
          data.distance = Math.round(distResult.records.reduce((sum, r) => sum + (r.distance?.inKilometers || 0), 0) * 10) / 10;
        }
      } catch (e) {}

      try {
        const exResult = await HealthConnect.readRecords('ExerciseSession', { timeRangeFilter: range });
        if (exResult.records && exResult.records.length > 0) {
          data.exercise = exResult.records.length;
        }
      } catch (e) {}

      setHealthData(data);
      setConnected(true);
      save(KEYS.healthConnect, data);
      Alert.alert('Sincronizado', 'Datos de Health Connect actualizados.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar con Health Connect: ' + (err.message || ''));
    }
  };

  const formatMetricValue = (metric) => {
    const key = metric.hcKey;
    const val = healthData[key];
    if (val === null || val === undefined) return null;
    switch (key) {
      case 'steps': return val.toLocaleString() + ' pasos';
      case 'heartRate': return val + ' bpm';
      case 'sleep': return val + ' horas';
      case 'calories': return val + ' kcal';
      case 'distance': return val + ' km';
      case 'exercise': return val + ' sesion(es)';
      default: return String(val);
    }
  };

  const HC_KEYS = ['steps', 'heartRate', 'sleep', 'calories', 'distance', 'exercise'];
  const metricsWithKeys = HMET.map((m, i) => ({ ...m, hcKey: HC_KEYS[i] || null }));

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
            ? 'Conectado a Health Connect. Toca "SINCRONIZAR" para actualizar los datos.'
            : 'Conecta tu Samsung Galaxy Fit3 para sincronizar datos de salud automaticamente con tu plan de entrenamiento.'}
        </Text>

        {metricsWithKeys.map((metric, i) => {
          const val = formatMetricValue(metric);
          return (
            <View key={i} style={[s.metricRow, i < metricsWithKeys.length - 1 && s.metricRowBorder]}>
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

        <TouchableOpacity style={s.connectBtn} onPress={readHealthData} activeOpacity={0.7}>
          <Text style={s.connectBtnText}>{connected ? 'SINCRONIZAR' : 'CONECTAR'}</Text>
        </TouchableOpacity>

        <View style={s.howCard}>
          <Text style={s.howTitle}>Como funciona</Text>
          <Text style={s.howText}>
            1. Asegurate de tener Health Connect instalado{'\n'}
            2. En Samsung Health, activa sincronizacion con Health Connect{'\n'}
            3. Toca "CONECTAR" y acepta los permisos{'\n'}
            4. Los datos de tu Galaxy Fit3 se mostraran aqui
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

  howCard: { backgroundColor: theme.accentSoft, padding: 14 },
  howTitle: {
    fontSize: 12, fontWeight: '700', color: theme.text,
    letterSpacing: 1, marginBottom: 6,
  },
  howText: { fontSize: 12, color: theme.text2, lineHeight: 18 },
});
