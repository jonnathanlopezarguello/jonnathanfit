import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { spacing } from '../theme';
import { getState } from '../store';
import { PLAN_DAYS } from '../data/templates';
import { setupNotifications, scheduleReminders, scheduleWorkoutReminder, cancelAllReminders, getScheduledReminders } from '../utils/reminders';

const HEALTH_METRICS = [
  { key: 'pasos', label: 'Pasos diarios', icon: '👟', target: '8,000 - 10,000', source: 'Galaxy Fit3' },
  { key: 'fc', label: 'Frecuencia cardiaca', icon: '❤️', target: 'Zona: 60-85% FCmax', source: 'Galaxy Fit3' },
  { key: 'sueno', label: 'Calidad de sueno', icon: '😴', target: '7-9 horas', source: 'Galaxy Fit3' },
  { key: 'calorias', label: 'Calorias quemadas', icon: '🔥', target: 'TDEE estimado', source: 'Galaxy Fit3' },
  { key: 'estres', label: 'Nivel de estres', icon: '🧘', target: 'Bajo-Medio', source: 'Galaxy Fit3' },
  { key: 'spo2', label: 'Oxigeno en sangre', icon: '🫁', target: '95-100%', source: 'Galaxy Fit3' },
];

const DAILY_SCHEDULE = [
  { time: '07:00', label: 'Desayuno + Creatina', type: 'nutricion' },
  { time: '09:00', label: 'Snack de media manana', type: 'nutricion' },
  { time: '12:00', label: 'Almuerzo', type: 'nutricion' },
  { time: '15:00', label: 'Snack de la tarde', type: 'nutricion' },
  { time: '17:00', label: 'Pre-entreno (Cafeina)', type: 'suplemento' },
  { time: '17:30', label: 'Sesion de entrenamiento', type: 'entreno' },
  { time: '19:00', label: 'Cena + Proteina Whey', type: 'nutricion' },
  { time: '21:00', label: 'Revision diaria', type: 'revision' },
  { time: '22:30', label: 'Preparar para dormir', type: 'descanso' },
];

function SectionDivider({ label, theme }) {
  return (
    <View style={st.dividerRow}>
      <Text style={[st.dividerLabel, { color: theme.text3 }]}>{label}</Text>
      <View style={[st.dividerLine, { backgroundColor: theme.line }]} />
    </View>
  );
}

export default function SaludScreen({ theme }) {
  const [state] = useState(getState());
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [healthConnected, setHealthConnected] = useState(false);

  useEffect(() => {
    getScheduledReminders().then(list => {
      setScheduledCount(list.length);
      setRemindersEnabled(list.length > 0);
    });
  }, []);

  async function toggleReminders() {
    if (remindersEnabled) {
      await cancelAllReminders();
      setRemindersEnabled(false);
      setScheduledCount(0);
      Alert.alert('Recordatorios desactivados', 'Se cancelaron todos los recordatorios.');
    } else {
      const ok = await setupNotifications();
      if (!ok) {
        Alert.alert('Permisos', 'No se pudieron obtener permisos de notificaciones. Habilitalos en la configuracion del dispositivo.');
        return;
      }
      await scheduleReminders(state.profile);
      for (const day of PLAN_DAYS) {
        await scheduleWorkoutReminder(day, 17, 0);
      }
      const list = await getScheduledReminders();
      setScheduledCount(list.length);
      setRemindersEnabled(true);
      Alert.alert('Recordatorios activados', list.length + ' recordatorios programados. Recibiras notificaciones de comidas, suplementos y entrenamientos.');
    }
  }

  function connectHealth() {
    Alert.alert(
      'Samsung Health Connect',
      'Para conectar tu Galaxy Fit3 necesitas:\n\n' +
      '1. Instalar Samsung Health en tu celular\n' +
      '2. Instalar Health Connect (Google)\n' +
      '3. Sincronizar tu Galaxy Fit3 con Samsung Health\n' +
      '4. Generar un build de desarrollo de la app\n\n' +
      'Esto requiere "npx expo prebuild" y compilar la app nativamente. Quieres abrir Samsung Health?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Samsung Health', onPress: () => {
          Linking.openURL('https://play.google.com/store/apps/details?id=com.sec.android.app.shealth').catch(() => {
            Alert.alert('Error', 'No se pudo abrir el enlace.');
          });
        }},
      ]
    );
  }

  const typeColors = {
    nutricion: theme.good,
    suplemento: theme.accent,
    entreno: theme.over,
    revision: theme.text3,
    descanso: theme.text2,
  };

  return (
    <ScrollView style={[st.container, { backgroundColor: theme.bg }]} contentContainerStyle={st.content}>
      <Text style={[st.supra, { color: theme.text3 }]}>INTEGRACIONES</Text>
      <Text style={[st.title, { color: theme.text }]}>Salud</Text>

      <SectionDivider label="RECORDATORIOS DIARIOS" theme={theme} />

      <View style={[st.card, { borderColor: theme.line }]}>
        <View style={st.reminderHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[st.reminderTitle, { color: theme.text }]}>Notificaciones</Text>
            <Text style={[st.reminderSub, { color: theme.text3 }]}>
              {remindersEnabled
                ? scheduledCount + ' recordatorios activos'
                : 'Desactivados'}
            </Text>
          </View>
          <TouchableOpacity
            style={[st.toggleBtn, { backgroundColor: remindersEnabled ? theme.accent : 'transparent', borderColor: remindersEnabled ? theme.accent : theme.line }]}
            onPress={toggleReminders}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: '500', color: remindersEnabled ? theme.bg : theme.text3 }}>
              {remindersEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {remindersEnabled && (
          <Text style={[st.reminderInfo, { color: theme.text3 }]}>
            Recibiras recordatorios de comidas (7am, 12pm, 3pm, 7pm), entrenamientos ({PLAN_DAYS.join(', ')} a las 5pm) y revision diaria (9pm).
          </Text>
        )}
      </View>

      <SectionDivider label="HORARIO DEL DIA" theme={theme} />

      <View style={[st.card, { borderColor: theme.line }]}>
        {DAILY_SCHEDULE.map((item, i) => (
          <View key={i} style={[st.scheduleRow, i < DAILY_SCHEDULE.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={[st.scheduleTime, { color: theme.text3 }]}>{item.time}</Text>
            <View style={[st.scheduleDot, { backgroundColor: typeColors[item.type] || theme.text3 }]} />
            <Text style={[st.scheduleLabel, { color: theme.text }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <SectionDivider label="SAMSUNG GALAXY FIT3" theme={theme} />

      <View style={[st.card, { borderColor: theme.line }]}>
        <Text style={[st.healthIntro, { color: theme.text2 }]}>
          Conecta tu Galaxy Fit3 para obtener datos de salud automaticamente y optimizar tu plan de entrenamiento y nutricion.
        </Text>

        {HEALTH_METRICS.map((m, i) => (
          <View key={m.key} style={[st.metricRow, i < HEALTH_METRICS.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line }]}>
            <Text style={st.metricIcon}>{m.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[st.metricLabel, { color: theme.text }]}>{m.label}</Text>
              <Text style={[st.metricTarget, { color: theme.text3 }]}>Objetivo: {m.target}</Text>
            </View>
            <View style={[st.metricBadge, { backgroundColor: healthConnected ? theme.good + '29' : theme.line }]}>
              <Text style={{ fontSize: 9, color: healthConnected ? theme.good : theme.text3 }}>
                {healthConnected ? 'CONECTADO' : 'PENDIENTE'}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[st.connectBtn, { backgroundColor: healthConnected ? theme.line : theme.accent }]}
          onPress={connectHealth}
          activeOpacity={0.8}
        >
          <Text style={[st.connectBtnText, { color: healthConnected ? theme.text3 : theme.bg }]}>
            {healthConnected ? 'DESCONECTAR' : 'CONECTAR GALAXY FIT3'}
          </Text>
        </TouchableOpacity>

        <Text style={[st.healthNote, { color: theme.text3 }]}>
          Requiere Samsung Health + Health Connect instalados. La sincronizacion usa Android Health Connect API.
        </Text>
      </View>

      <SectionDivider label="COMO FUNCIONA" theme={theme} />

      <View style={[st.card, { borderColor: theme.line }]}>
        <Text style={[st.howLabel, { color: theme.text2 }]}>
          {'1. '}<Text style={{ color: theme.text }}>Galaxy Fit3</Text>{' recolecta datos 24/7\n'}
          {'2. '}<Text style={{ color: theme.text }}>Samsung Health</Text>{' sincroniza al celular\n'}
          {'3. '}<Text style={{ color: theme.text }}>Health Connect</Text>{' comparte con la app\n'}
          {'4. '}<Text style={{ color: theme.text }}>Jonnathan Fit</Text>{' ajusta tu plan automaticamente'}
        </Text>
        <Text style={[st.howDetail, { color: theme.text3 }]}>
          Con tus datos de sueno, frecuencia cardiaca y actividad, la app puede ajustar tus calorias de entrenamiento vs descanso, sugerir dias de descarga, y optimizar tus horarios de comida.
        </Text>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 60 },

  supra: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: '500', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '300', marginBottom: spacing.lg },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  dividerLabel: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '500', marginRight: 12 },
  dividerLine: { flex: 1, height: 1 },

  card: { borderWidth: 1, padding: 20, marginBottom: spacing.md },

  reminderHeader: { flexDirection: 'row', alignItems: 'center' },
  reminderTitle: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  reminderSub: { fontSize: 12 },
  reminderInfo: { fontSize: 11, lineHeight: 16, marginTop: 12 },
  toggleBtn: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, minWidth: 56, alignItems: 'center' },

  scheduleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  scheduleTime: { fontSize: 12, fontVariant: ['tabular-nums'], width: 50, fontWeight: '500' },
  scheduleDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  scheduleLabel: { fontSize: 13, flex: 1 },

  healthIntro: { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  metricRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  metricIcon: { fontSize: 20, marginRight: 14, width: 28, textAlign: 'center' },
  metricLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  metricTarget: { fontSize: 11 },
  metricBadge: { paddingHorizontal: 8, paddingVertical: 4 },

  connectBtn: { paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  connectBtnText: { fontSize: 11, letterSpacing: 2, fontWeight: '600', textTransform: 'uppercase' },
  healthNote: { fontSize: 10, lineHeight: 14, marginTop: 12, textAlign: 'center' },

  howLabel: { fontSize: 13, lineHeight: 22 },
  howDetail: { fontSize: 11, lineHeight: 16, marginTop: 12 },
});
