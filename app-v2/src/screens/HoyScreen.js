import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import theme from '../theme';
import { calc, greet, diso, GL, getDayName } from '../utils';
import { load, save, KEYS } from '../store';
import { T, DT, PD } from '../data/exercises';
import { SUPPS } from '../data/plan';

const DEFAULT_PROFILE = {
  name: 'Jonnathan', weight: 79, height: 176, age: 25,
  sex: 'male', activity: 1.55, goal: 'bulk', ppk: 2, fpk: 1,
};

const MACRO_COLORS = {
  PROTEINA: '#7FB07A',
  CARBOS: '#F2F2EE',
  GRASA: '#D26A45',
  FIBRA: '#B9B9B2',
};

function dateLbl() {
  const d = new Date();
  const ds = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const ms = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return ds[d.getDay()] + ' ' + d.getDate() + ' ' + ms[d.getMonth()];
}

function SectionDivider({ label }) {
  return (
    <View style={s.divider}>
      <Text style={s.dividerLabel}>{label}</Text>
      <View style={s.dividerLine} />
    </View>
  );
}

function MacroBar({ label, current, target, color }) {
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const isOver = current > target;
  return (
    <View style={s.macroRow}>
      <Text style={s.macroLabel}>{label}</Text>
      <View style={s.macroBarOuter}>
        <View style={[s.macroBarInner, { width: (pct * 100) + '%', backgroundColor: isOver ? theme.over : color }]} />
      </View>
      <Text style={[s.macroValue, isOver && { color: theme.over }]}>{current}<Text style={s.macroUnit}>/{target}g</Text></Text>
    </View>
  );
}

function KcalRing({ current, target }) {
  const remaining = Math.max(0, target - current);
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const isOver = current > target;
  const size = 140;
  const strokeW = 6;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * pct;

  return (
    <View style={s.ringWrap}>
      <Svg width={size} height={size}>
        <SvgCircle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={theme.line2} strokeWidth={strokeW} fill="none"
        />
        <SvgCircle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={isOver ? theme.over : theme.good}
          strokeWidth={strokeW} fill="none"
          strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={s.ringCenter}>
        <Text style={[s.ringNumber, isOver && { color: theme.over }]}>{current}</Text>
        <Text style={s.ringUnit}>kcal</Text>
      </View>
      <Text style={s.ringRemaining}>
        {isOver ? 'Excedido' : remaining + ' restantes'}
      </Text>
    </View>
  );
}

export default function HoyScreen({ onNavigate }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [supChecked, setSupChecked] = useState([]);
  const [nutrition, setNutrition] = useState(null);
  const [activity, setActivity] = useState({ steps: '', cardio: '' });

  const today = diso(0);

  useEffect(() => {
    (async () => {
      const p = await load(KEYS.profile);
      if (p) setProfile({ ...DEFAULT_PROFILE, ...p });

      const sc = await load(KEYS.supplements);
      if (sc && sc[today]) setSupChecked(sc[today]);

      const n = await load(KEYS.nutrition);
      if (n && n[today]) setNutrition(n[today]);

      const a = await load(KEYS.activity);
      if (a && a[today]) setActivity(a[today]);
    })();
  }, []);

  const targets = calc(profile);

  // Sum consumed from nutrition log
  const consumed = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  if (nutrition && nutrition.meals) {
    for (const meal of nutrition.meals) {
      if (meal.items) {
        for (const item of meal.items) {
          consumed.kcal += item.k || 0;
          consumed.protein += item.p || 0;
          consumed.carbs += item.c || 0;
          consumed.fat += item.f || 0;
          consumed.fiber += item.fi || 0;
        }
      }
    }
  }

  const toggleSup = async (key) => {
    const next = supChecked.includes(key)
      ? supChecked.filter((k) => k !== key)
      : [...supChecked, key];
    setSupChecked(next);
    const all = (await load(KEYS.supplements)) || {};
    all[today] = next;
    await save(KEYS.supplements, all);
  };

  const updateActivity = async (field, value) => {
    const next = { ...activity, [field]: value };
    setActivity(next);
    const all = (await load(KEYS.activity)) || {};
    all[today] = next;
    await save(KEYS.activity, all);
  };

  // Training day
  const dayName = getDayName();
  const isTrainingDay = !!T[dayName];
  const dayExercises = isTrainingDay ? T[dayName].slice(0, 3) : [];
  const dayTitle = isTrainingDay ? DT[dayName] : null;

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      {/* DATE + GREETING */}
      <Text style={s.dateLabel}>{dateLbl()}</Text>
      <Text style={s.greeting}>{greet()}, {profile.name}</Text>

      {/* NUTRICION */}
      <SectionDivider label="NUTRICION DE HOY" />

      <View style={s.card}>
        <KcalRing current={consumed.kcal} target={targets.kcal} />

        <View style={s.macros}>
          <MacroBar label="PROTEINA" current={consumed.protein} target={targets.protein} color={MACRO_COLORS.PROTEINA} />
          <MacroBar label="CARBOS" current={consumed.carbs} target={targets.carbs} color={MACRO_COLORS.CARBOS} />
          <MacroBar label="GRASA" current={consumed.fat} target={targets.fat} color={MACRO_COLORS.GRASA} />
          <MacroBar label="FIBRA" current={consumed.fiber} target={targets.fiber} color={MACRO_COLORS.FIBRA} />
        </View>

        <TouchableOpacity style={s.btnAccent} onPress={() => onNavigate && onNavigate('Comida')} activeOpacity={0.7}>
          <Text style={s.btnAccentText}>REGISTRAR COMIDA</Text>
        </TouchableOpacity>
      </View>

      {/* SUPLEMENTOS */}
      <SectionDivider label="SUPLEMENTOS DEL DIA" />

      <View style={s.card}>
        {SUPPS.map((sup) => {
          const checked = supChecked.includes(sup.k);
          return (
            <TouchableOpacity
              key={sup.k}
              style={s.supRow}
              onPress={() => toggleSup(sup.k)}
              activeOpacity={0.7}
            >
              <View style={[s.checkbox, checked && s.checkboxChecked]}>
                {checked && <Text style={s.checkmark}>{'✓'}</Text>}
              </View>
              <View style={s.supInfo}>
                <Text style={[s.supName, checked && s.supNameChecked]}>{sup.n}</Text>
                <Text style={s.supDose}>{sup.d}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ENTRENAMIENTO */}
      <SectionDivider label="ENTRENAMIENTO" />

      <View style={s.card}>
        {isTrainingDay ? (
          <>
            <Text style={s.trainDay}>{dayName}</Text>
            <Text style={s.trainTitle}>{dayTitle}</Text>

            {dayExercises.map((ex, i) => (
              <View key={i} style={s.exRow}>
                <Text style={s.exNum}>{i + 1}</Text>
                <View style={s.exInfo}>
                  <Text style={s.exName}>{ex.n}</Text>
                  <Text style={s.exDetail}>{ex.s}x{ex.r}  RIR {ex.ri}</Text>
                </View>
              </View>
            ))}

            {T[dayName].length > 3 && (
              <Text style={s.moreEx}>+{T[dayName].length - 3} ejercicios mas</Text>
            )}

            <TouchableOpacity style={s.btnAccent} onPress={() => onNavigate && onNavigate('Entreno')} activeOpacity={0.7}>
              <Text style={s.btnAccentText}>IR A ENTRENAR</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={s.restDay}>
            <Text style={s.restEmoji}>{'💤'}</Text>
            <Text style={s.restText}>Dia de descanso</Text>
            <Text style={s.restSub}>Recuperacion y crecimiento muscular</Text>
          </View>
        )}
      </View>

      {/* ACTIVIDAD DIARIA */}
      <SectionDivider label="ACTIVIDAD DIARIA" />

      <View style={s.card}>
        <View style={s.actRow}>
          <Text style={s.actLabel}>PASOS</Text>
          <TextInput
            style={s.actInput}
            value={activity.steps}
            onChangeText={(v) => updateActivity('steps', v)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.text3}
          />
        </View>
        <View style={s.actRow}>
          <Text style={s.actLabel}>CARDIO (min)</Text>
          <TextInput
            style={s.actInput}
            value={activity.cardio}
            onChangeText={(v) => updateActivity('cardio', v)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.text3}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  rootPad: {
    padding: 24,
    paddingBottom: 60,
  },

  /* Date + Greeting */
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 6,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '200',
    color: theme.text,
    marginBottom: 28,
  },

  /* Section Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
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
    borderRadius: 0,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },

  /* Kcal Ring */
  ringWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNumber: {
    fontSize: 25,
    fontWeight: '300',
    color: theme.text,
    fontVariant: ['tabular-nums'],
  },
  ringUnit: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginTop: 2,
  },
  ringRemaining: {
    fontSize: 11,
    color: theme.text3,
    marginTop: 8,
  },

  /* Macros */
  macros: {
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    width: 72,
  },
  macroBarOuter: {
    flex: 1,
    height: 4,
    backgroundColor: theme.line2,
    borderRadius: 2,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  macroBarInner: {
    height: 4,
    borderRadius: 2,
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.text2,
    fontVariant: ['tabular-nums'],
    width: 70,
    textAlign: 'right',
  },
  macroUnit: {
    fontSize: 10,
    color: theme.text3,
  },

  /* Accent Button */
  btnAccent: {
    backgroundColor: theme.accent,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnAccentText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.bg,
  },

  /* Supplements */
  supRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: theme.line2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: theme.good,
    borderColor: theme.good,
  },
  checkmark: {
    fontSize: 13,
    color: theme.bg,
    fontWeight: '700',
  },
  supInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supName: {
    fontSize: 14,
    color: theme.text,
  },
  supNameChecked: {
    color: theme.text3,
    textDecorationLine: 'line-through',
  },
  supDose: {
    fontSize: 12,
    color: theme.text3,
  },

  /* Training */
  trainDay: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
    marginBottom: 4,
  },
  trainTitle: {
    fontSize: 14,
    color: theme.text2,
    marginBottom: 16,
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  exNum: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text3,
    width: 22,
  },
  exInfo: {
    flex: 1,
  },
  exName: {
    fontSize: 14,
    color: theme.text,
  },
  exDetail: {
    fontSize: 11,
    color: theme.text3,
    marginTop: 2,
  },
  moreEx: {
    fontSize: 12,
    color: theme.text3,
    textAlign: 'center',
    paddingVertical: 10,
  },

  /* Rest Day */
  restDay: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  restEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  restText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 4,
  },
  restSub: {
    fontSize: 12,
    color: theme.text3,
  },

  /* Activity */
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  actLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.text3,
  },
  actInput: {
    fontSize: 16,
    color: theme.text,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    minWidth: 80,
    borderBottomWidth: 1,
    borderBottomColor: theme.line2,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
