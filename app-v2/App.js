import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import theme from './src/theme';
import { p2 } from './src/utils';

import HoyScreen from './src/screens/HoyScreen';
import EntrenoScreen from './src/screens/EntrenoScreen';
import ComidaScreen from './src/screens/ComidaScreen';
import PlanScreen from './src/screens/PlanScreen';
import ProgresoScreen from './src/screens/ProgresoScreen';
import FuentesScreen from './src/screens/FuentesScreen';
import SaludScreen from './src/screens/SaludScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const TABS = [
  { k: 'Hoy', l: 'Hoy', icon: (c) => <Path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1z" stroke={c} strokeWidth={1.4} strokeLinejoin="round" fill="none" /> },
  { k: 'Entreno', l: 'Entreno', icon: (c) => <><Path d="M6.5 9v6M17.5 9v6M4 10.5v3M20 10.5v3M6.5 12h11" stroke={c} strokeWidth={1.4} strokeLinecap="round" fill="none" /></> },
  { k: 'Comida', l: 'Comida', icon: (c) => <Path d="M7 3v8M5 3v4a2 2 0 002 2M9 3v4a2 2 0 01-2 2M16.5 3c-1.4 0-2.5 2-2.5 5s1.1 3 2.5 3M17 3v18" stroke={c} strokeWidth={1.4} strokeLinecap="round" fill="none" /> },
  { k: 'Plan', l: 'Plan', icon: (c) => <><Rect x={5} y={3} width={14} height={18} stroke={c} strokeWidth={1.4} fill="none" /><Path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke={c} strokeWidth={1.4} strokeLinecap="round" fill="none" /></> },
  { k: 'Progreso', l: 'Progreso', icon: (c) => <Path d="M4 20V4M4 20h16M7 16l4-5 3 3 5-7" stroke={c} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" fill="none" /> },
  { k: 'Fuentes', l: 'Fuentes', icon: (c) => <><Path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={c} strokeWidth={1.4} strokeLinejoin="round" fill="none" /><Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={c} strokeWidth={1.4} strokeLinejoin="round" fill="none" /><Path d="M8 7h8M8 11h6" stroke={c} strokeWidth={1.4} strokeLinecap="round" fill="none" /></> },
  { k: 'Salud', l: 'Salud', icon: (c) => <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke={c} strokeWidth={1.4} strokeLinejoin="round" fill="none" /> },
];

export default function App() {
  const [tab, setTab] = useState('Hoy');
  const [clock, setClock] = useState('');
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(p2(now.getHours()) + ':' + p2(now.getMinutes()) + ':' + p2(now.getSeconds()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const renderScreen = () => {
    switch (tab) {
      case 'Hoy': return <HoyScreen onNavigate={setTab} />;
      case 'Entreno': return <EntrenoScreen />;
      case 'Comida': return <ComidaScreen />;
      case 'Plan': return <PlanScreen />;
      case 'Progreso': return <ProgresoScreen />;
      case 'Fuentes': return <FuentesScreen />;
      case 'Salud': return <SaludScreen />;
      case 'Perfil': return <PerfilScreen />;
      default: return <HoyScreen onNavigate={setTab} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={s.container}>
        <View style={s.topbar}>
          <View style={s.topbarLeft}>
            <Animated.View style={[s.bdot, { opacity: breathAnim }]} />
            <Text style={s.logo}>Jonnathan <Text style={s.logoBold}>Fit</Text></Text>
          </View>
          <View style={s.topbarRight}>
            <Text style={s.clock}>{clock}</Text>
            <TouchableOpacity style={s.pbtn} onPress={() => setTab('Perfil')}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={8} r={3.4} stroke={theme.text2} strokeWidth={1.4} fill="none" />
                <Path d="M5.5 19c.8-3.4 3.4-5 6.5-5s5.7 1.6 6.5 5" stroke={theme.text2} strokeWidth={1.4} strokeLinecap="round" fill="none" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.hl} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tbar} contentContainerStyle={s.tbarContent}>
          {TABS.map((t) => {
            const active = tab === t.k;
            return (
              <TouchableOpacity key={t.k} style={s.tb} onPress={() => setTab(t.k)} activeOpacity={0.7}>
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  {t.icon(active ? theme.text : theme.text3)}
                </Svg>
                <Text style={[s.tl, active && s.tlActive]}>{t.l}</Text>
                {active && <View style={s.tul} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={s.hl} />

        <ScrollView style={s.ca} contentContainerStyle={s.caContent}>
          {renderScreen()}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 48 },
  topbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topbarRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bdot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: theme.text },
  logo: { fontSize: 15, fontWeight: '300', color: theme.text },
  logoBold: { fontWeight: '700' },
  clock: { fontSize: 12, color: theme.text3, fontVariant: ['tabular-nums'] },
  pbtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: theme.line2, alignItems: 'center', justifyContent: 'center' },
  hl: { height: 1, backgroundColor: theme.line },
  tbar: { height: 50, flexGrow: 0 },
  tbarContent: { paddingHorizontal: 4 },
  tb: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  tl: { fontSize: 9, fontWeight: '500', letterSpacing: 0.5, marginTop: 2, color: theme.text3 },
  tlActive: { color: theme.text },
  tul: { width: 14, height: 1.5, backgroundColor: theme.accent, marginTop: 3 },
  ca: { flex: 1 },
  caContent: { padding: 24, paddingBottom: 60 },
});
