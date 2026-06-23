import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import theme from '../theme';
import { SCHED, HMET } from '../data/plan';

const DOT_COLORS = {
  n: theme.good,
  s: theme.accent,
  e: theme.over,
  r: theme.text3,
  d: theme.text2,
};

export default function SaludScreen() {
  const [remindersOn, setRemindersOn] = useState(true);

  const handleConnect = () => {
    Alert.alert(
      'Samsung Galaxy Fit3',
      'Para conectar tu Galaxy Fit3:\n\n' +
        '1. Abre Samsung Health en tu telefono\n' +
        '2. Ve a Ajustes > Accesorios\n' +
        '3. Vincula tu Galaxy Fit3\n' +
        '4. Activa la sincronizacion de datos\n\n' +
        'Los datos se sincronizaran automaticamente con la app.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <Text style={s.label}>INTEGRACIONES</Text>
      <Text style={s.h1}>Salud</Text>

      {/* Reminders section */}
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
            onPress={() => setRemindersOn(!remindersOn)}
            activeOpacity={0.7}
          >
            <View style={[s.toggleThumb, remindersOn && s.toggleThumbOn]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule section */}
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

      {/* Samsung Galaxy Fit3 section */}
      <View style={s.divider}>
        <Text style={s.dividerLabel}>SAMSUNG GALAXY FIT3</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.card}>
        <Text style={s.fitDesc}>
          Conecta tu Samsung Galaxy Fit3 para sincronizar datos de salud automaticamente con tu plan de entrenamiento.
        </Text>

        {/* Health metrics */}
        {HMET.map((metric, i) => (
          <View key={i} style={[s.metricRow, i < HMET.length - 1 && s.metricRowBorder]}>
            <Text style={s.metricIcon}>{metric.ic}</Text>
            <View style={s.metricInfo}>
              <Text style={s.metricLabel}>{metric.l}</Text>
              <Text style={s.metricTarget}>{metric.tg}</Text>
            </View>
            <View style={s.pendingBadge}>
              <Text style={s.pendingText}>PENDIENTE</Text>
            </View>
          </View>
        ))}

        {/* Connect button */}
        <TouchableOpacity style={s.connectBtn} onPress={handleConnect} activeOpacity={0.7}>
          <Text style={s.connectBtnText}>CONECTAR</Text>
        </TouchableOpacity>

        {/* How it works */}
        <View style={s.howCard}>
          <Text style={s.howTitle}>Como funciona</Text>
          <Text style={s.howText}>
            Samsung Galaxy Fit3 monitorea tu actividad diaria, sueno, frecuencia cardiaca y otros indicadores de salud. Al conectarlo con Jonnathan Fit, estos datos se integran con tu plan de entrenamiento para ajustar tus objetivos de calorias quemadas, calidad de descanso y nivel de actividad diaria.
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },

  /* Header */
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 6,
  },
  h1: {
    fontSize: 30,
    fontWeight: '200',
    color: theme.text,
    marginBottom: 24,
  },

  /* Section divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginRight: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.line,
  },

  /* Card */
  card: {
    borderWidth: 1,
    borderColor: theme.line,
    padding: 20,
    marginBottom: 20,
  },

  /* Reminders */
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  reminderSub: {
    fontSize: 12,
    color: theme.text3,
    marginTop: 2,
  },

  /* Toggle switch */
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.line2,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: theme.good,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.text3,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: theme.bg,
  },

  /* Schedule */
  schedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  schedRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  schedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  schedTime: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
    fontVariant: ['tabular-nums'],
    width: 50,
  },
  schedLabel: {
    fontSize: 13,
    color: theme.text2,
    flex: 1,
  },

  /* Fit description */
  fitDesc: {
    fontSize: 13,
    color: theme.text2,
    lineHeight: 19,
    marginBottom: 16,
  },

  /* Health metrics */
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  metricRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
    textAlign: 'center',
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 13,
    color: theme.text,
  },
  metricTarget: {
    fontSize: 11,
    color: theme.text3,
    marginTop: 1,
  },
  pendingBadge: {
    borderWidth: 1,
    borderColor: theme.line2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pendingText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.text3,
  },

  /* Connect button */
  connectBtn: {
    backgroundColor: theme.accent,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  connectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.bg,
  },

  /* How it works */
  howCard: {
    backgroundColor: theme.accentSoft,
    padding: 14,
  },
  howTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 1,
    marginBottom: 6,
  },
  howText: {
    fontSize: 12,
    color: theme.text2,
    lineHeight: 18,
  },
});
