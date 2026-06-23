import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Linking,
  Alert,
} from 'react-native';
import theme from '../theme';
import { load, save, KEYS } from '../store';
import { T, DT, PD } from '../data/exercises';
import { EI, imgBase } from '../data/images';
import { fe, getDayName, diso } from '../utils';

/* ── helpers ───────────────────────────────────────── */

function todayKey() {
  return getDayName();
}

function todayExercises() {
  const day = todayKey();
  return T[day] || null;
}

function todayTitle() {
  return DT[todayKey()] || null;
}

function allExerciseNames() {
  const names = new Set();
  Object.values(T).forEach(list =>
    list.forEach(ex => names.add(ex.n)),
  );
  return [...names].sort();
}

/* ── component ─────────────────────────────────────── */

export default function EntrenoScreen() {
  const [sess, setSess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [curIdx, setCurIdx] = useState(0);
  const [showTech, setShowTech] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const timer = useRef(null);

  /* ── load persisted session on mount ── */
  useEffect(() => {
    (async () => {
      const s = await load(KEYS.session);
      if (s) {
        setSess(s);
        setCurIdx(0);
      }
      setLoading(false);
    })();
  }, []);

  /* ── tick timer while session active ── */
  useEffect(() => {
    if (sess) {
      timer.current = setInterval(() => {
        setElapsed(Date.now() - sess.st);
      }, 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [sess]);

  /* ── persist session on every change ── */
  useEffect(() => {
    if (sess) save(KEYS.session, sess);
  }, [sess]);

  /* ── session actions ── */

  function startSession() {
    const day = todayKey();
    const exercises = todayExercises();
    const title = todayTitle();
    const iso = diso(0);
    const newSess = {
      id: Date.now(),
      nm: title || 'Sesion personalizada',
      dt: iso,
      st: Date.now(),
      ex: exercises
        ? exercises.map(ex => ({
            name: ex.n,
            plan: ex,
            sets: Array(ex.s)
              .fill(null)
              .map(() => ({ kg: '', rp: '', d: false })),
          }))
        : [],
    };
    setSess(newSess);
    setCurIdx(0);
  }

  function updateSess(fn) {
    setSess(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
  }

  function toggleSet(ei, si) {
    updateSess(s => {
      s.ex[ei].sets[si].d = !s.ex[ei].sets[si].d;
    });
  }

  function updateSetField(ei, si, field, val) {
    updateSess(s => {
      s.ex[ei].sets[si][field] = val;
    });
  }

  function addSet(ei) {
    updateSess(s => {
      s.ex[ei].sets.push({ kg: '', rp: '', d: false });
    });
  }

  function removeSet(ei, si) {
    updateSess(s => {
      if (s.ex[ei].sets.length > 1) {
        s.ex[ei].sets.splice(si, 1);
      }
    });
  }

  function removeExercise(ei) {
    Alert.alert('Quitar ejercicio', 'Eliminar este ejercicio de la sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Quitar',
        style: 'destructive',
        onPress: () => {
          updateSess(s => {
            s.ex.splice(ei, 1);
          });
          if (curIdx >= sess.ex.length - 1 && curIdx > 0) {
            setCurIdx(curIdx - 1);
          }
        },
      },
    ]);
  }

  function addExercise(name) {
    updateSess(s => {
      s.ex.push({
        name,
        plan: { n: name, g: '-', s: 3, r: '-', ri: '-', re: '-', f: '' },
        sets: [
          { kg: '', rp: '', d: false },
          { kg: '', rp: '', d: false },
          { kg: '', rp: '', d: false },
        ],
      });
    });
    setCurIdx(sess.ex.length); // will be the new last index
    setShowPicker(false);
    setSearch('');
  }

  function finalize() {
    const done = sess.ex.filter(e => e.sets.some(s => s.d));
    if (done.length === 0) {
      Alert.alert('Sin datos', 'No hay series completadas.');
      return;
    }
    Alert.alert('Finalizar sesion', 'Guardar el entreno?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: async () => {
          const dur = Math.round((Date.now() - sess.st) / 60000);
          const workout = {
            id: sess.id,
            nm: sess.nm,
            dt: sess.dt,
            dur,
            ex: done.map(e => ({
              name: e.name,
              sets: e.sets.filter(s => s.d),
            })),
          };
          const prev = (await load(KEYS.workouts)) || [];
          prev.unshift(workout);
          await save(KEYS.workouts, prev);
          await save(KEYS.session, null);
          setSess(null);
          setCurIdx(0);
          setElapsed(0);
        },
      },
    ]);
  }

  function discard() {
    Alert.alert('Descartar sesion', 'Perder todo el progreso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Descartar',
        style: 'destructive',
        onPress: async () => {
          await save(KEYS.session, null);
          setSess(null);
          setCurIdx(0);
          setElapsed(0);
        },
      },
    ]);
  }

  /* ── render helpers ── */

  if (loading) {
    return (
      <View style={s.root}>
        <Text style={s.loadTxt}>Cargando...</Text>
      </View>
    );
  }

  /* ═══════════════════════════════════════════════════
     MODE 1 — no active session
     ═══════════════════════════════════════════════════ */
  if (!sess) {
    const day = todayKey();
    const exercises = todayExercises();
    const title = todayTitle();
    const isRest = !exercises;

    return (
      <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
        {/* header */}
        <Text style={s.label}>REGISTRO DE FUERZA</Text>
        <Text style={s.h1}>Entreno</Text>
        <Text style={s.sub}>
          {day}
          {title ? ' — ' + title : ''}
        </Text>

        {isRest ? (
          <View style={s.card}>
            <Text style={s.restTxt}>Dia de descanso</Text>
            <Text style={[s.restTxt, { color: theme.text3, fontSize: 13, marginTop: 6 }]}>
              No hay ejercicios programados para hoy.{'\n'}
              Puedes iniciar una sesion personalizada.
            </Text>
          </View>
        ) : (
          exercises.map((ex, i) => (
            <View key={i} style={s.card}>
              <Text style={s.exName}>{ex.n}</Text>
              <View style={s.row}>
                <Text style={s.pill}>{ex.s} x {ex.r}</Text>
                <Text style={s.pill}>RIR {ex.ri}</Text>
                <Text style={[s.pill, { color: theme.text3 }]}>{ex.g}</Text>
              </View>
              {ex.f ? <Text style={s.focus}>{ex.f}</Text> : null}
            </View>
          ))
        )}

        <TouchableOpacity style={s.btnPrimary} onPress={startSession} activeOpacity={0.7}>
          <Text style={s.btnPrimaryTxt}>INICIAR SESION</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* ═══════════════════════════════════════════════════
     MODE 2 — active session
     ═══════════════════════════════════════════════════ */
  const cur = sess.ex[curIdx];
  const doneCount = sess.ex.filter(e => e.sets.some(st => st.d)).length;

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootPad}>
      {/* ── timer card ── */}
      <View style={s.timerCard}>
        <Text style={s.timerTxt}>{fe(elapsed)}</Text>
        <Text style={s.timerSub}>
          {doneCount}/{sess.ex.length} ejercicios
        </Text>
        <View style={[s.row, { marginTop: 12, gap: 10 }]}>
          <TouchableOpacity
            style={[s.btnSmall, { backgroundColor: theme.good }]}
            onPress={finalize}
            activeOpacity={0.7}
          >
            <Text style={[s.btnSmallTxt, { color: '#121211' }]}>FINALIZAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btnSmall, { backgroundColor: theme.over }]}
            onPress={discard}
            activeOpacity={0.7}
          >
            <Text style={[s.btnSmallTxt, { color: '#121211' }]}>DESCARTAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── current exercise card ── */}
      {cur ? (
        <View style={s.card}>
          <Text style={s.exName}>{cur.name}</Text>
          {cur.plan.g !== '-' && (
            <Text style={[s.focus, { marginBottom: 8 }]}>
              {cur.plan.g} · {cur.plan.r} reps · RIR {cur.plan.ri}
            </Text>
          )}

          {/* set grid header */}
          <View style={s.setRow}>
            <Text style={[s.setH, { width: 28 }]}>Set</Text>
            <Text style={[s.setH, { flex: 1 }]}>Kg</Text>
            <Text style={[s.setH, { flex: 1 }]}>Reps</Text>
            <View style={{ width: 36 }} />
            <View style={{ width: 26 }} />
          </View>

          {/* set rows */}
          {cur.sets.map((st, si) => (
            <View
              key={si}
              style={[s.setRow, st.d && { backgroundColor: theme.accentSoft, borderRadius: 6 }]}
            >
              <Text style={[s.setCellTxt, { width: 28 }]}>{si + 1}</Text>
              <TextInput
                style={[s.setInput, { flex: 1 }]}
                value={st.kg}
                onChangeText={v => updateSetField(curIdx, si, 'kg', v)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.text3}
              />
              <TextInput
                style={[s.setInput, { flex: 1 }]}
                value={st.rp}
                onChangeText={v => updateSetField(curIdx, si, 'rp', v)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.text3}
              />
              <TouchableOpacity
                style={[s.checkBtn, st.d && s.checkBtnDone]}
                onPress={() => toggleSet(curIdx, si)}
                activeOpacity={0.7}
              >
                <Text style={[s.checkTxt, st.d && s.checkTxtDone]}>
                  {st.d ? '✓' : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.delBtn}
                onPress={() => removeSet(curIdx, si)}
                activeOpacity={0.7}
              >
                <Text style={s.delTxt}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* add set */}
          <TouchableOpacity style={s.dashedBtn} onPress={() => addSet(curIdx)} activeOpacity={0.7}>
            <Text style={s.dashedBtnTxt}>+ SERIE</Text>
          </TouchableOpacity>

          {/* controls */}
          <View style={[s.row, { marginTop: 12, gap: 12 }]}>
            <TouchableOpacity
              style={[
                s.toggleBtn,
                showTech[curIdx] && { backgroundColor: theme.accent },
              ]}
              onPress={() =>
                setShowTech(prev => ({ ...prev, [curIdx]: !prev[curIdx] }))
              }
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.toggleTxt,
                  showTech[curIdx] && { color: theme.bg },
                ]}
              >
                TECNICA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeExercise(curIdx)} activeOpacity={0.7}>
              <Text style={[s.toggleTxt, { color: theme.over }]}>QUITAR</Text>
            </TouchableOpacity>
          </View>

          {/* technique panel */}
          {showTech[curIdx] && (
            <View style={s.techPanel}>
              {EI[cur.name] && (
                <Image
                  source={{ uri: imgBase + EI[cur.name] }}
                  style={s.techImg}
                  resizeMode="contain"
                />
              )}
              {cur.plan.f ? (
                <Text style={s.techNote}>{cur.plan.f}</Text>
              ) : null}
              <TouchableOpacity
                style={s.techLink}
                onPress={() =>
                  Linking.openURL(
                    'https://www.youtube.com/results?search_query=' +
                      encodeURIComponent(cur.name + ' shakil ahmed tone garage'),
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={s.techLinkTxt}>Buscar en YouTube</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.techLink}
                onPress={() =>
                  Linking.openURL('https://www.instagram.com/transformwithshakil/')
                }
                activeOpacity={0.7}
              >
                <Text style={s.techLinkTxt}>@transformwithshakil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.restTxt}>No hay ejercicios. Anade uno abajo.</Text>
        </View>
      )}

      {/* ── exercise list ── */}
      <Text style={[s.label, { marginTop: 20 }]}>EJERCICIOS</Text>
      {sess.ex.map((ex, i) => {
        const dSets = ex.sets.filter(st => st.d).length;
        const active = i === curIdx;
        return (
          <TouchableOpacity
            key={i}
            style={[s.exListItem, active && { borderColor: theme.accent }]}
            onPress={() => setCurIdx(i)}
            activeOpacity={0.7}
          >
            <Text style={[s.exListName, active && { color: theme.text }]}>
              {ex.name}
            </Text>
            <Text
              style={[
                s.exListSets,
                dSets === ex.sets.length && dSets > 0 && { color: theme.good },
              ]}
            >
              {dSets}/{ex.sets.length}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* ── add exercise ── */}
      <TouchableOpacity
        style={s.dashedBtn}
        onPress={() => setShowPicker(!showPicker)}
        activeOpacity={0.7}
      >
        <Text style={s.dashedBtnTxt}>+ ANADIR EJERCICIO</Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={s.pickerWrap}>
          <TextInput
            style={s.pickerInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={theme.text3}
            autoFocus
          />
          <ScrollView style={s.pickerList} nestedScrollEnabled>
            {allExerciseNames()
              .filter(n => n.toLowerCase().includes(search.toLowerCase()))
              .map(n => (
                <TouchableOpacity
                  key={n}
                  style={s.pickerItem}
                  onPress={() => addExercise(n)}
                  activeOpacity={0.7}
                >
                  <Text style={s.pickerItemTxt}>{n}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

/* ── styles ─────────────────────────────────────────── */

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  rootPad: { padding: 20, paddingBottom: 60 },
  loadTxt: { color: theme.text3, textAlign: 'center', marginTop: 100 },

  /* header */
  label: { color: theme.text3, fontSize: 11, letterSpacing: 1.2, marginBottom: 4 },
  h1: { color: theme.text, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  sub: { color: theme.text2, fontSize: 14, marginBottom: 20 },

  /* card */
  card: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  exName: { color: theme.text, fontSize: 16, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  pill: {
    color: theme.text2,
    fontSize: 12,
    marginRight: 10,
    backgroundColor: theme.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  focus: { color: theme.text3, fontSize: 12, marginTop: 6 },

  /* rest */
  restTxt: { color: theme.text2, fontSize: 15, textAlign: 'center' },

  /* buttons */
  btnPrimary: {
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  btnPrimaryTxt: { color: theme.bg, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },

  btnSmall: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  btnSmallTxt: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

  /* timer */
  timerCard: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  timerTxt: { color: theme.text, fontSize: 36, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timerSub: { color: theme.text3, fontSize: 13, marginTop: 4 },

  /* set grid */
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 6,
  },
  setH: { color: theme.text3, fontSize: 11, letterSpacing: 0.5 },
  setCellTxt: { color: theme.text2, fontSize: 14, textAlign: 'center' },
  setInput: {
    borderWidth: 1,
    borderColor: theme.line2,
    borderRadius: 6,
    color: theme.text,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  /* check button */
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.line2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDone: { backgroundColor: theme.accent, borderColor: theme.accent },
  checkTxt: { color: theme.text2, fontSize: 16 },
  checkTxtDone: { color: theme.bg, fontWeight: '700' },

  /* delete set button */
  delBtn: {
    width: 26,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delTxt: { color: theme.text3, fontSize: 14 },

  /* dashed button */
  dashedBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.line,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  dashedBtnTxt: { color: theme.text3, fontSize: 12, letterSpacing: 0.5 },

  /* toggle / technique */
  toggleBtn: {
    borderWidth: 1,
    borderColor: theme.line2,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  toggleTxt: { color: theme.text2, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

  techPanel: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.line,
    paddingTop: 14,
  },
  techImg: { width: '100%', height: 180, borderRadius: 8, marginBottom: 10 },
  techNote: { color: theme.text2, fontSize: 13, marginBottom: 10 },
  techLink: {
    paddingVertical: 8,
  },
  techLinkTxt: { color: theme.accent, fontSize: 13, textDecorationLine: 'underline' },

  /* exercise list */
  exListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  exListName: { color: theme.text2, fontSize: 14, flex: 1 },
  exListSets: { color: theme.text3, fontSize: 13, marginLeft: 8 },

  /* picker */
  pickerWrap: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  pickerInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    color: theme.text,
    fontSize: 14,
    padding: 12,
  },
  pickerList: { maxHeight: 260 },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  pickerItemTxt: { color: theme.text2, fontSize: 14 },
});
