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
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import theme from '../theme';
import { load, save, KEYS } from '../store';
import { T, DT, PD, EXERCISE_LIBRARY } from '../data/exercises';
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

/* ── component ─────────────────────────────────────── */

export default function EntrenoScreen() {
  const [sess, setSess] = useState(null);
  const [units, setUnits] = useState('kg');
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [curIdx, setCurIdx] = useState(0);
  const [showTech, setShowTech] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [search, setSearch] = useState('');
  const [pickerGroup, setPickerGroup] = useState(null);
  const [dayOverride, setDayOverride] = useState(null);
  const [detailEx, setDetailEx] = useState(null);
  const timer = useRef(null);

  const activeDay = dayOverride || getDayName();

  /* ── load persisted session on mount ── */
  useEffect(() => {
    (async () => {
      const s = await load(KEYS.session);
      if (s) {
        setSess(s);
        setCurIdx(0);
      }
      const p = await load(KEYS.profile);
      if (p?.units) setUnits(p.units);
      setLoading(false);
    })();
  }, []);

  /* ── tick timer while session active ── */
  useEffect(() => {
    const startTime = sess?.st;
    if (startTime) {
      timer.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [sess?.st]);

  /* ── persist session on every change ── */
  useEffect(() => {
    if (sess) save(KEYS.session, sess);
  }, [sess]);

  /* ── session actions ── */

  async function startSession() {
    const exercises = T[activeDay] || null;
    const title = DT[activeDay] || null;
    const iso = diso(0);

    const history = (await load(KEYS.workouts)) || [];
    const lastSets = {};
    for (const w of history) {
      for (const ex of (w.ex || [])) {
        if (!lastSets[ex.name]) lastSets[ex.name] = ex.sets;
      }
    }

    const makeSets = (name, count, plan) => {
      const prev = lastSets[name];
      const riHint = plan?.ri ?? '';
      return Array(count).fill(null).map((_, i) => ({
        kg: prev?.[i]?.kg ?? prev?.[prev.length - 1]?.kg ?? '',
        rp: prev?.[i]?.rp ?? prev?.[prev.length - 1]?.rp ?? '',
        rir: '',
        d: false,
        riHint,
      }));
    };

    const newSess = {
      id: Date.now(),
      nm: title || 'Sesion personalizada',
      dt: iso,
      st: Date.now(),
      ex: exercises
        ? exercises.map(ex => ({
            name: ex.n,
            plan: ex,
            sets: makeSets(ex.n, ex.s, ex),
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
      // Auto-propagate kg to subsequent empty sets
      if (field === 'kg' && val !== '') {
        for (let j = si + 1; j < s.ex[ei].sets.length; j++) {
          if (s.ex[ei].sets[j].kg === '') {
            s.ex[ei].sets[j].kg = val;
          }
        }
      }
    });
  }

  function addSet(ei) {
    updateSess(s => {
      const sets = s.ex[ei].sets;
      const last = sets[sets.length - 1];
      sets.push({ kg: last?.kg ?? '', rp: '', rir: '', d: false });
    });
  }

  function removeSet(ei, si) {
    updateSess(s => {
      if (s.ex[ei].sets.length > 1) {
        s.ex[ei].sets.splice(si, 1);
      }
    });
  }

  function updateExNote(ei, text) {
    updateSess(s => {
      s.ex[ei].note = text;
    });
  }

  function swapExercise(ei, newName) {
    const libEntry = EXERCISE_LIBRARY.find(e => e.n === newName);
    updateSess(s => {
      const ex = s.ex[ei];
      ex.name = newName;
      ex.plan = libEntry || ex.plan;
    });
    setShowSwap(false);
    setSearch('');
  }

  function removeExercise(ei) {
    const snapshotLen = sess.ex.length;
    const snapshotIdx = curIdx;
    Alert.alert('Quitar ejercicio', 'Eliminar este ejercicio de la sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Quitar',
        style: 'destructive',
        onPress: () => {
          updateSess(s => { s.ex.splice(ei, 1); });
          if (snapshotIdx >= snapshotLen - 1 && snapshotIdx > 0) {
            setCurIdx(snapshotIdx - 1);
          }
        },
      },
    ]);
  }

  async function addExercise(name) {
    const history = (await load(KEYS.workouts)) || [];
    let prevSets = null;
    for (const w of history) {
      const found = (w.ex || []).find(e => e.name === name);
      if (found) { prevSets = found.sets; break; }
    }
    const libEntry = EXERCISE_LIBRARY.find(e => e.n === name);
    updateSess(s => {
      s.ex.push({
        name,
        plan: libEntry || { n: name, g: '-', s: 3, r: '-', ri: '-', re: '-', f: '' },
        sets: prevSets
          ? prevSets.map(st => ({ kg: st.kg || '', rp: st.rp || '', rir: '', d: false }))
          : [{ kg: '', rp: '', rir: '', d: false }, { kg: '', rp: '', rir: '', d: false }, { kg: '', rp: '', rir: '', d: false }],
      });
    });
    setCurIdx(sess.ex.length); // sess.ex.length before push = index of new item
    setShowPicker(false);
    setSearch('');
    setPickerGroup(null);
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
              note: e.note ?? '',
              sets: e.sets.filter(s => s.d).map(st => ({ kg: st.kg, rp: st.rp, rir: st.rir ?? '' })),
            })),
          };
          const prev = (await load(KEYS.workouts)) || [];
          prev.unshift(workout);
          await save(KEYS.workouts, prev);
          await save(KEYS.session, null);
          setSess(null);
          setCurIdx(0);
          setElapsed(0);
          setDayOverride(null);
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
          setDayOverride(null);
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
    const day = activeDay;
    const exercises = T[day] || null;
    const title = DT[day] || null;
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

        {/* day selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.dayScroll}
          contentContainerStyle={s.dayScrollContent}
        >
          {PD.map(d => (
            <TouchableOpacity
              key={d}
              style={[s.dayChip, activeDay === d && s.dayChipOn]}
              onPress={() => setDayOverride(d)}
              activeOpacity={0.7}
            >
              <Text style={[s.dayChipTxt, activeDay === d && s.dayChipTxtOn]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isRest ? (
          <View style={s.card}>
            <Text style={s.restTxt}>Dia de descanso</Text>
            <Text style={[s.restTxt, { color: theme.text3, fontSize: 13, marginTop: 6 }]}>
              Selecciona una rutina de arriba para entrenar hoy.
            </Text>
          </View>
        ) : (
          exercises.map((ex, i) => (
            <View key={i} style={s.card}>
              <View style={[s.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
                <Text style={[s.exName, { flex: 1, marginBottom: 0 }]}>{ex.n}</Text>
                <TouchableOpacity
                  style={s.infoBtn}
                  onPress={() => setDetailEx(ex)}
                  activeOpacity={0.7}
                >
                  <Text style={s.infoBtnTxt}>i</Text>
                </TouchableOpacity>
              </View>
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

        <ExerciseDetailModal
          visible={!!detailEx}
          exercise={detailEx}
          onClose={() => setDetailEx(null)}
        />
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
          <View style={[s.row, { justifyContent: 'space-between', marginBottom: 4 }]}>
            <Text style={[s.exName, { flex: 1, marginBottom: 0 }]}>{cur.name}</Text>
            <TouchableOpacity
              style={s.infoBtn}
              onPress={() => setDetailEx(cur.plan)}
              activeOpacity={0.7}
            >
              <Text style={s.infoBtnTxt}>i</Text>
            </TouchableOpacity>
          </View>
          {cur.plan.g !== '-' && (
            <Text style={[s.focus, { marginBottom: 8 }]}>
              {cur.plan.g} · {cur.plan.r} reps · RIR {cur.plan.ri}
            </Text>
          )}

          {/* set grid header */}
          {(() => {
            const isTime = cur.name === 'Rueda abdominal' || cur.name === 'Plancha lastrada' || cur.name === 'Plancha lateral';
            return isTime ? (
              <View style={s.setRow}>
                <Text style={[s.setH, { width: 28 }]}>Set</Text>
                <Text style={[s.setH, { flex: 1 }]}>Min</Text>
                <Text style={[s.setH, { width: 44 }]}>RIR</Text>
                <View style={{ width: 36 }} />
                <View style={{ width: 26 }} />
              </View>
            ) : (
              <View style={s.setRow}>
                <Text style={[s.setH, { width: 28 }]}>Set</Text>
                <Text style={[s.setH, { flex: 1 }]}>{units === 'lbs' ? 'Lbs' : 'Kg'}</Text>
                <Text style={[s.setH, { flex: 1 }]}>Reps</Text>
                <Text style={[s.setH, { width: 44 }]}>RIR</Text>
                <View style={{ width: 36 }} />
                <View style={{ width: 26 }} />
              </View>
            );
          })()}

          {/* set rows */}
          {cur.sets.map((st, si) => {
            const isTime = cur.name === 'Rueda abdominal' || cur.name === 'Plancha lastrada' || cur.name === 'Plancha lateral';
            return (
            <View
              key={si}
              style={[s.setRow, st.d && { backgroundColor: theme.accentSoft, borderRadius: 6 }]}
            >
              <Text style={[s.setCellTxt, { width: 28 }]}>{si + 1}</Text>
              {isTime ? (
                <TextInput
                  style={[s.setInput, { flex: 1 }]}
                  value={st.rp}
                  onChangeText={v => updateSetField(curIdx, si, 'rp', v)}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={theme.text3}
                />
              ) : (
                <>
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
                </>
              )}
              <TextInput
                style={[s.setInput, { width: 44 }]}
                value={st.rir ?? ''}
                onChangeText={v => updateSetField(curIdx, si, 'rir', v)}
                keyboardType="numeric"
                placeholder={st.riHint ?? '?'}
                placeholderTextColor={theme.text3}
                maxLength={2}
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
            );
          })}

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
            <TouchableOpacity
              style={[s.toggleBtn, showSwap && { backgroundColor: theme.accentSoft }]}
              onPress={() => { setShowSwap(!showSwap); setSearch(''); }}
              activeOpacity={0.7}
            >
              <Text style={s.toggleTxt}>CAMBIAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeExercise(curIdx)} activeOpacity={0.7}>
              <Text style={[s.toggleTxt, { color: theme.over }]}>QUITAR</Text>
            </TouchableOpacity>
          </View>

          {/* swap panel */}
          {showSwap && cur && (
            <View style={s.swapPanel}>
              <Text style={s.swapTitle}>Alternativas · {cur.plan.g}</Text>
              <TextInput
                style={s.pickerInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar..."
                placeholderTextColor={theme.text3}
              />
              <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled>
                {EXERCISE_LIBRARY
                  .filter(ex =>
                    ex.n !== cur.name &&
                    (ex.g === cur.plan.g || (search.trim() && ex.n.toLowerCase().includes(search.trim().toLowerCase()))) &&
                    (!search.trim() || ex.n.toLowerCase().includes(search.trim().toLowerCase()))
                  )
                  .map(ex => (
                    <TouchableOpacity
                      key={ex.n}
                      style={s.swapItem}
                      onPress={() => swapExercise(curIdx, ex.n)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={s.swapItemName}>{ex.n}</Text>
                        <Text style={s.swapItemSub}>{ex.s}×{ex.r} · RIR {ex.ri}</Text>
                      </View>
                      <Text style={s.swapArrow}>›</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* exercise note */}
          <TextInput
            style={s.noteInput}
            value={cur.note ?? ''}
            onChangeText={(t) => updateExNote(curIdx, t)}
            placeholder="Notas del ejercicio..."
            placeholderTextColor={theme.text3}
            multiline
            numberOfLines={2}
          />

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
                      encodeURIComponent(cur.name + ' técnica correcta'),
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={s.techLinkTxt}>Ver técnica en YouTube</Text>
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
            onPress={() => { setCurIdx(i); setShowSwap(false); setShowTech({}); }}
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
        onPress={() => { setShowPicker(!showPicker); setPickerGroup(null); setSearch(''); }}
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.pickerGroups}
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
          >
            {[null, 'Pecho', 'Espalda', 'Biceps', 'Triceps', 'Hombro', 'Cuadriceps', 'Femoral/Gluteo', 'Gemelo', 'Abdomen'].map(g => (
              <TouchableOpacity
                key={g ?? 'todos'}
                onPress={() => setPickerGroup(g)}
                style={[s.pgChip, pickerGroup === g && s.pgChipOn]}
                activeOpacity={0.7}
              >
                <Text style={[s.pgText, pickerGroup === g && s.pgTextOn]}>{g ?? 'Todos'}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView style={s.pickerList} nestedScrollEnabled>
            {EXERCISE_LIBRARY
              .filter(ex =>
                (!pickerGroup || ex.g === pickerGroup) &&
                (!search.trim() || ex.n.toLowerCase().includes(search.trim().toLowerCase()))
              )
              .map(ex => (
                <TouchableOpacity
                  key={ex.n}
                  style={s.pickerItem}
                  onPress={() => addExercise(ex.n)}
                  activeOpacity={0.7}
                >
                  {EI[ex.n] ? (
                    <Image
                      source={{ uri: imgBase + EI[ex.n] }}
                      style={s.pickerThumb}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[s.pickerThumb, { backgroundColor: theme.line }]} />
                  )}
                  <View style={s.pickerInfo}>
                    <Text style={s.pickerItemTxt} numberOfLines={2}>{ex.n}</Text>
                    <Text style={s.pickerItemGroup}>{ex.g}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      <View style={{ height: 60 }} />

      <ExerciseDetailModal
        visible={!!detailEx}
        exercise={detailEx}
        onClose={() => setDetailEx(null)}
      />
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
  pickerGroups: {
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    flexGrow: 0,
  },
  pgChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line2,
  },
  pgChipOn: { borderColor: theme.accent, backgroundColor: theme.accentSoft },
  pgText: { color: theme.text3, fontSize: 11, fontWeight: '600' },
  pgTextOn: { color: theme.text },
  pickerList: { maxHeight: 320 },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  pickerThumb: {
    width: 54,
    height: 54,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: theme.line,
  },
  pickerInfo: { flex: 1 },
  pickerItemTxt: { color: theme.text2, fontSize: 13 },
  pickerItemGroup: { color: theme.text3, fontSize: 11, marginTop: 3 },

  /* info button */
  infoBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.line2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },
  infoBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    color: theme.text3,
  },

  /* note input */
  noteInput: {
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 6,
    color: theme.text2,
    fontSize: 12,
    padding: 10,
    marginTop: 10,
    minHeight: 40,
    textAlignVertical: 'top',
  },

  /* swap panel */
  swapPanel: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.line,
    paddingTop: 12,
  },
  swapTitle: {
    color: theme.text3,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
  },
  swapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  swapItemName: { color: theme.text2, fontSize: 13 },
  swapItemSub: { color: theme.text3, fontSize: 11, marginTop: 2 },
  swapArrow: { color: theme.text3, fontSize: 20, paddingLeft: 8 },

  /* day selector */
  dayScroll: { marginBottom: 16, marginHorizontal: -20 },
  dayScrollContent: { paddingHorizontal: 20, gap: 8 },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.line2,
  },
  dayChipOn: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  dayChipTxt: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: theme.text3,
  },
  dayChipTxtOn: {
    color: theme.bg,
  },
});
