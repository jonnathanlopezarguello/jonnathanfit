import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import theme from '../theme';
import { load, save, KEYS } from '../store';
import { FOODS, FCAT, FCATS } from '../data/foods';
import { MPLAN } from '../data/plan';
import { calc, diso, dlbl, GL } from '../utils';

const MEALS = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'];

const DEF_PROFILE = {
  weight: 79, height: 176, age: 25, sex: 'male',
  activity: 1.55, goal: 'bulk', ppk: 2, fpk: 1,
};

export default function ComidaScreen() {
  const [cdo, setCdo] = useState(0);
  const [nutr, setNutr] = useState({});
  const [cmode, setCmode] = useState('v');
  const [csq, setCsq] = useState('');
  const [csc, setCsc] = useState(null);
  const [cfm, setCfm] = useState('Almuerzo');
  const [profile, setProfile] = useState(DEF_PROFILE);

  // manual entry fields
  const [mName, setMName] = useState('');
  const [mK, setMK] = useState('');
  const [mP, setMP] = useState('');
  const [mC, setMC] = useState('');
  const [mF, setMF] = useState('');

  useEffect(() => {
    (async () => {
      const n = await load(KEYS.nutrition);
      if (n) setNutr(n);
      const p = await load(KEYS.profile);
      if (p) setProfile({ ...DEF_PROFILE, ...p });
    })();
  }, []);

  const iso = diso(cdo);
  const dayItems = nutr[iso] || [];
  const targets = calc(profile);

  const totK = dayItems.reduce((s, i) => s + (i.k || 0), 0);
  const totP = dayItems.reduce((s, i) => s + (i.p || 0), 0);
  const totC = dayItems.reduce((s, i) => s + (i.c || 0), 0);
  const totF = dayItems.reduce((s, i) => s + (i.f || 0), 0);

  const persist = (next) => {
    setNutr(next);
    save(KEYS.nutrition, next);
  };

  const addItem = (fd, k, p, c, f, meal) => {
    const entry = { fd, k: +k, p: +p, c: +c, f: +f, ml: meal || cfm };
    const next = { ...nutr, [iso]: [...dayItems, entry] };
    persist(next);
    setCmode('v');
    setCsq('');
    setCsc(null);
  };

  const removeItem = (idx) => {
    Alert.alert('Eliminar', 'Eliminar este alimento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: () => {
          const arr = [...dayItems];
          arr.splice(idx, 1);
          persist({ ...nutr, [iso]: arr });
        },
      },
    ]);
  };

  const loadPlan = () => {
    const items = [];
    MPLAN.forEach((mg) => {
      mg.it.forEach((it) => {
        items.push({ fd: it.fd, k: it.k, p: it.p, c: it.c, f: it.f, ml: mg.m });
      });
    });
    persist({ ...nutr, [iso]: [...dayItems, ...items] });
  };

  const saveManual = () => {
    if (!mName.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del alimento.');
      return;
    }
    addItem(mName.trim(), mK || 0, mP || 0, mC || 0, mF || 0, cfm);
    setMName(''); setMK(''); setMP(''); setMC(''); setMF('');
  };

  // --- search filtering ---
  const filtered = FOODS.filter((f) => {
    if (csc && f.c2 !== csc) return false;
    if (csq.trim()) {
      return f.n.toLowerCase().includes(csq.trim().toLowerCase());
    }
    return true;
  });

  // --- weekly summary ---
  const weekStart = () => {
    const d = new Date();
    d.setDate(d.getDate() + cdo);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  };

  const weekTotals = () => {
    const ws = weekStart();
    let wk = 0, wp = 0, wc = 0, wf = 0;
    for (let i = 0; i < 7; i++) {
      const dd = new Date(ws);
      dd.setDate(dd.getDate() + i);
      const key = dd.toISOString().slice(0, 10);
      const items = nutr[key] || [];
      items.forEach((it) => { wk += it.k || 0; wp += it.p || 0; wc += it.c || 0; wf += it.f || 0; });
    }
    return { wk, wp, wc, wf };
  };

  const wt = weekTotals();
  const weeklyTargets = {
    k: targets.kcal * 7,
    p: targets.protein * 7,
    c: targets.carbs * 7,
    f: targets.fat * 7,
  };

  // --- progress bar helper ---
  const Bar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.min(value / max, 1) : 0;
    return (
      <View style={s.barBg}>
        <View style={[s.barFill, { width: pct * 100 + '%', backgroundColor: color || theme.accent }]} />
      </View>
    );
  };

  // --- chip helper ---
  const Chip = ({ label, active, onPress }) => (
    <TouchableOpacity
      style={[s.chip, active && s.chipActive]}
      onPress={onPress}
    >
      <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  // ===================== SEARCH MODE =====================
  if (cmode === 's') {
    return (
      <ScrollView style={s.root} contentContainerStyle={s.pad}>
        <Text style={s.title}>BUSCAR ALIMENTO</Text>

        {/* meal selector */}
        <View style={s.chipRow}>
          {MEALS.map((m) => (
            <Chip key={m} label={m} active={cfm === m} onPress={() => setCfm(m)} />
          ))}
        </View>

        {/* search input */}
        <TextInput
          style={s.input}
          placeholder="Buscar..."
          placeholderTextColor={theme.text3}
          value={csq}
          onChangeText={setCsq}
        />

        {/* category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
          <Chip label="Todos" active={csc === null} onPress={() => setCsc(null)} />
          {FCATS.map((c) => (
            <Chip key={c} label={FCAT[c]} active={csc === c} onPress={() => setCsc(c)} />
          ))}
        </ScrollView>

        {/* food list */}
        {filtered.map((f, i) => (
          <TouchableOpacity
            key={i}
            style={s.foodRow}
            onPress={() => addItem(f.n, f.k, f.p, f.c, f.f, cfm)}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.foodName}>{f.n}</Text>
              <Text style={s.foodPo}>{f.po}</Text>
            </View>
            <View style={s.foodMacros}>
              <Text style={s.foodMacro}>{f.k} kcal</Text>
              <Text style={s.foodMacroSub}>P{f.p} C{f.c} G{f.f}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={s.cancelBtn} onPress={() => { setCmode('v'); setCsq(''); setCsc(null); }}>
          <Text style={s.cancelBtnText}>CANCELAR</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ===================== MANUAL MODE =====================
  if (cmode === 'm') {
    return (
      <ScrollView style={s.root} contentContainerStyle={s.pad}>
        <Text style={s.title}>ENTRADA MANUAL</Text>

        {/* meal selector */}
        <View style={s.chipRow}>
          {MEALS.map((m) => (
            <Chip key={m} label={m} active={cfm === m} onPress={() => setCfm(m)} />
          ))}
        </View>

        <TextInput
          style={s.input}
          placeholder="Nombre del alimento"
          placeholderTextColor={theme.text3}
          value={mName}
          onChangeText={setMName}
        />

        <View style={s.manualRow}>
          <View style={s.manualField}>
            <Text style={s.manualLabel}>Kcal</Text>
            <TextInput
              style={s.manualInput}
              keyboardType="numeric"
              placeholderTextColor={theme.text3}
              placeholder="0"
              value={mK}
              onChangeText={setMK}
            />
          </View>
          <View style={s.manualField}>
            <Text style={s.manualLabel}>Prot</Text>
            <TextInput
              style={s.manualInput}
              keyboardType="numeric"
              placeholderTextColor={theme.text3}
              placeholder="0"
              value={mP}
              onChangeText={setMP}
            />
          </View>
          <View style={s.manualField}>
            <Text style={s.manualLabel}>Carb</Text>
            <TextInput
              style={s.manualInput}
              keyboardType="numeric"
              placeholderTextColor={theme.text3}
              placeholder="0"
              value={mC}
              onChangeText={setMC}
            />
          </View>
          <View style={s.manualField}>
            <Text style={s.manualLabel}>Grasa</Text>
            <TextInput
              style={s.manualInput}
              keyboardType="numeric"
              placeholderTextColor={theme.text3}
              placeholder="0"
              value={mF}
              onChangeText={setMF}
            />
          </View>
        </View>

        <View style={s.manualActions}>
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setCmode('v'); setMName(''); setMK(''); setMP(''); setMC(''); setMF(''); }}>
            <Text style={s.cancelBtnText}>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.saveBtn} onPress={saveManual}>
            <Text style={s.saveBtnText}>GUARDAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ===================== VIEW MODE =====================
  const grouped = {};
  MEALS.forEach((m) => { grouped[m] = []; });
  dayItems.forEach((it, idx) => {
    const ml = it.ml || 'Almuerzo';
    if (!grouped[ml]) grouped[ml] = [];
    grouped[ml].push({ ...it, _idx: idx });
  });

  return (
    <ScrollView style={s.root} contentContainerStyle={s.pad}>
      {/* header */}
      <Text style={s.sectionLabel}>REGISTRO DE ALIMENTACION</Text>
      <Text style={s.title}>Comida</Text>

      {/* date navigator */}
      <View style={s.dateNav}>
        <TouchableOpacity onPress={() => setCdo(cdo - 1)} style={s.dateArrow}>
          <Text style={s.dateArrowText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCdo(0)}>
          <Text style={s.dateLabel}>{dlbl(cdo)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCdo(cdo + 1)} style={s.dateArrow}>
          <Text style={s.dateArrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* load plan */}
      <TouchableOpacity style={s.planBtn} onPress={loadPlan}>
        <Text style={s.planBtnText}>CARGAR PLAN</Text>
      </TouchableOpacity>

      {/* summary card */}
      <View style={s.card}>
        <View style={s.summaryHeader}>
          <Text style={s.summaryKcal}>{totK}</Text>
          <Text style={s.summaryKcalLabel}> / {targets.kcal} kcal</Text>
        </View>
        <Bar value={totK} max={targets.kcal} color={totK > targets.kcal ? theme.over : theme.good} />
        <View style={s.macroRow}>
          <View style={s.macroCol}>
            <Text style={s.macroLabel}>P</Text>
            <Text style={s.macroVal}>{totP}g</Text>
            <Text style={s.macroTarget}>/ {targets.protein}g</Text>
          </View>
          <View style={s.macroCol}>
            <Text style={s.macroLabel}>C</Text>
            <Text style={s.macroVal}>{totC}g</Text>
            <Text style={s.macroTarget}>/ {targets.carbs}g</Text>
          </View>
          <View style={s.macroCol}>
            <Text style={s.macroLabel}>G</Text>
            <Text style={s.macroVal}>{totF}g</Text>
            <Text style={s.macroTarget}>/ {targets.fat}g</Text>
          </View>
        </View>
      </View>

      {/* meal groups */}
      {MEALS.map((ml) => {
        const items = grouped[ml];
        if (!items || items.length === 0) return null;
        return (
          <View key={ml} style={s.card}>
            <Text style={s.mealTitle}>{ml}</Text>
            {items.map((it, i) => (
              <TouchableOpacity key={i} style={s.mealItem} onPress={() => removeItem(it._idx)}>
                <Text style={s.mealItemName} numberOfLines={1}>{it.fd}</Text>
                <View style={s.mealItemRight}>
                  <Text style={s.mealItemKcal}>{it.k} kcal</Text>
                  <Text style={s.mealItemMacros}>P{it.p} C{it.c} G{it.f}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}

      {/* bottom actions */}
      <View style={s.actionRow}>
        <TouchableOpacity style={s.actionBtn} onPress={() => setCmode('s')}>
          <Text style={s.actionBtnText}>BUSCAR ALIMENTO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={() => setCmode('m')}>
          <Text style={s.actionBtnText}>ENTRADA MANUAL</Text>
        </TouchableOpacity>
      </View>

      {/* weekly summary */}
      <View style={s.card}>
        <Text style={s.weekTitle}>RESUMEN SEMANAL</Text>
        {[
          { label: 'KCAL', val: wt.wk, tgt: weeklyTargets.k },
          { label: 'PROTEINA', val: wt.wp, tgt: weeklyTargets.p },
          { label: 'CARBOS', val: wt.wc, tgt: weeklyTargets.c },
          { label: 'GRASA', val: wt.wf, tgt: weeklyTargets.f },
        ].map((row) => (
          <View key={row.label} style={s.weekRow}>
            <View style={s.weekLabelRow}>
              <Text style={s.weekLabel}>{row.label}</Text>
              <Text style={s.weekVal}>
                {Math.round(row.val)} / {Math.round(row.tgt)}
                {row.label === 'KCAL' ? '' : 'g'}
              </Text>
            </View>
            <Bar value={row.val} max={row.tgt} color={row.val > row.tgt ? theme.over : theme.good} />
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  pad: { padding: 24, paddingBottom: 60 },

  sectionLabel: { color: theme.text3, fontSize: 11, letterSpacing: 1.5, marginBottom: 2 },
  title: { color: theme.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },

  // date nav
  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  dateArrow: { padding: 12 },
  dateArrowText: { color: theme.text, fontSize: 18, fontWeight: '600' },
  dateLabel: { color: theme.text, fontSize: 16, fontWeight: '600', marginHorizontal: 16 },

  // plan button
  planBtn: { borderWidth: 1, borderColor: theme.line2, borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: 16 },
  planBtnText: { color: theme.text, fontSize: 12, fontWeight: '600', letterSpacing: 1 },

  // card
  card: { borderWidth: 1, borderColor: theme.line, borderRadius: 10, padding: 14, marginBottom: 14 },

  // summary
  summaryHeader: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  summaryKcal: { color: theme.text, fontSize: 28, fontWeight: '700' },
  summaryKcalLabel: { color: theme.text3, fontSize: 14 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  macroCol: { alignItems: 'center' },
  macroLabel: { color: theme.text3, fontSize: 11, letterSpacing: 1, marginBottom: 2 },
  macroVal: { color: theme.text, fontSize: 16, fontWeight: '600' },
  macroTarget: { color: theme.text3, fontSize: 11, marginTop: 1 },

  // meal groups
  mealTitle: { color: theme.text, fontSize: 14, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  mealItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.line },
  mealItemName: { color: theme.text, fontSize: 13, flex: 1, marginRight: 8 },
  mealItemRight: { alignItems: 'flex-end' },
  mealItemKcal: { color: theme.text, fontSize: 13, fontWeight: '600' },
  mealItemMacros: { color: theme.text3, fontSize: 11, marginTop: 1 },

  // bottom actions
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: { flex: 1, borderWidth: 1, borderColor: theme.line2, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  actionBtnText: { color: theme.text, fontSize: 12, fontWeight: '600', letterSpacing: 0.8 },

  // weekly summary
  weekTitle: { color: theme.text3, fontSize: 11, letterSpacing: 1.5, marginBottom: 12 },
  weekRow: { marginBottom: 10 },
  weekLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  weekLabel: { color: theme.text, fontSize: 12, fontWeight: '600' },
  weekVal: { color: theme.text3, fontSize: 12 },

  // progress bar
  barBg: { height: 3, backgroundColor: theme.line, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: 3, borderRadius: 2 },

  // chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: theme.line2, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipActive: { borderColor: theme.accent, backgroundColor: theme.accentSoft },
  chipText: { color: theme.text3, fontSize: 12 },
  chipTextActive: { color: theme.text },
  catScroll: { marginBottom: 14 },

  // input
  input: { borderWidth: 1, borderColor: theme.line, borderRadius: 8, padding: 10, color: theme.text, fontSize: 14, marginBottom: 14 },

  // food search list
  foodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.line },
  foodName: { color: theme.text, fontSize: 14, fontWeight: '500' },
  foodPo: { color: theme.text3, fontSize: 11, marginTop: 1 },
  foodMacros: { alignItems: 'flex-end', marginLeft: 8 },
  foodMacro: { color: theme.text, fontSize: 13, fontWeight: '600' },
  foodMacroSub: { color: theme.text3, fontSize: 11, marginTop: 1 },

  // cancel / save buttons
  cancelBtn: { borderWidth: 1, borderColor: theme.line2, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16, flex: 1 },
  cancelBtnText: { color: theme.text3, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  saveBtn: { borderWidth: 1, borderColor: theme.accent, backgroundColor: theme.accentSoft, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16, flex: 1, marginLeft: 10 },
  saveBtnText: { color: theme.text, fontSize: 12, fontWeight: '600', letterSpacing: 1 },

  // manual entry
  manualRow: { flexDirection: 'row', gap: 8 },
  manualField: { flex: 1 },
  manualLabel: { color: theme.text3, fontSize: 11, marginBottom: 4, letterSpacing: 0.5 },
  manualInput: { borderWidth: 1, borderColor: theme.line, borderRadius: 8, padding: 8, color: theme.text, fontSize: 14, textAlign: 'center' },
  manualActions: { flexDirection: 'row', gap: 10 },
});
