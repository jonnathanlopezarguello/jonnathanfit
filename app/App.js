import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadState } from './src/store';
import { colors } from './src/theme';

import HoyScreen from './src/screens/HoyScreen';
import EntrenoScreen from './src/screens/EntrenoScreen';
import ComidaScreen from './src/screens/ComidaScreen';
import PlanScreen from './src/screens/PlanScreen';
import ProgresoScreen from './src/screens/ProgresoScreen';
import PerfilScreen from './src/screens/PerfilScreen';

let Svg, Path, Rect, Circle;
let hasSvg = false;
try {
  const svgModule = require('react-native-svg');
  Svg = svgModule.Svg || svgModule.default;
  Path = svgModule.Path;
  Rect = svgModule.Rect;
  Circle = svgModule.Circle;
  hasSvg = !!(Svg && Path);
} catch (e) {
  hasSvg = false;
}

const TABS = [
  { key: 'Hoy', label: 'Hoy', fallback: '⌂' },
  { key: 'Entreno', label: 'Entreno', fallback: '≡' },
  { key: 'Comida', label: 'Comida', fallback: '⑂' },
  { key: 'Plan', label: 'Plan', fallback: '☷' },
  { key: 'Progreso', label: 'Progreso', fallback: '➚' },
];

const SCREENS = {
  Hoy: HoyScreen,
  Entreno: EntrenoScreen,
  Comida: ComidaScreen,
  Plan: PlanScreen,
  Progreso: ProgresoScreen,
  Perfil: PerfilScreen,
};

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatTime(d) {
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

/* --- SVG Tab Icons --- */
function TabIcon({ tabKey, color, size }) {
  if (!hasSvg) {
    const fallback = TABS.find(t => t.key === tabKey);
    return (
      <Text style={{ fontSize: size, color, textAlign: 'center' }}>
        {fallback ? fallback.fallback : '?'}
      </Text>
    );
  }

  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' };
  const s = { stroke: color, strokeWidth: 1.4 };

  switch (tabKey) {
    case 'Hoy':
      return (
        <Svg {...props}>
          <Path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1z" {...s} strokeLinejoin="round" />
        </Svg>
      );
    case 'Entreno':
      return (
        <Svg {...props}>
          <Path d="M6.5 9v6M17.5 9v6M4 10.5v3M20 10.5v3M6.5 12h11" {...s} strokeLinecap="round" />
        </Svg>
      );
    case 'Comida':
      return (
        <Svg {...props}>
          <Path d="M7 3v8M5 3v4a2 2 0 002 2M9 3v4a2 2 0 01-2 2M16.5 3c-1.4 0-2.5 2-2.5 5s1.1 3 2.5 3M17 3v18" {...s} strokeLinecap="round" />
        </Svg>
      );
    case 'Plan':
      return (
        <Svg {...props}>
          <Rect x="5" y="3" width="14" height="18" {...s} />
          <Path d="M8.5 8h7M8.5 12h7M8.5 16h4" {...s} strokeLinecap="round" />
        </Svg>
      );
    case 'Progreso':
      return (
        <Svg {...props}>
          <Path d="M4 20V4M4 20h16M7 16l4-5 3 3 5-7" {...s} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
}

/* --- Profile Icon --- */
function ProfileIcon({ color, size }) {
  if (!hasSvg) {
    return <Text style={{ fontSize: size * 0.6, color, textAlign: 'center' }}>{'☺'}</Text>;
  }
  const s = { stroke: color, strokeWidth: 1.4, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.4} {...s} />
      <Path d="M5.5 19c.8-3.4 3.4-5 6.5-5s5.7 1.6 6.5 5" {...s} strokeLinecap="round" />
    </Svg>
  );
}

/* --- Breathing Dot --- */
function BreathingDot({ color }) {
  const [opacity, setOpacity] = useState(1);
  const dir = useRef(1);
  const val = useRef(1);

  useEffect(() => {
    const id = setInterval(() => {
      val.current += dir.current * 0.04;
      if (val.current >= 1) { val.current = 1; dir.current = -1; }
      if (val.current <= 0.3) { val.current = 0.3; dir.current = 1; }
      setOpacity(val.current);
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={{
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: color,
      opacity,
    }} />
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('Hoy');
  const [secs, setSecs] = useState(0);

  useEffect(() => { loadState().then(() => setReady(true)); }, []);

  useEffect(() => {
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <MainLayout tab={tab} setTab={setTab} theme={colors} />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

function MainLayout({ tab, setTab, theme }) {
  const insets = useSafeAreaInsets();
  const Screen = SCREENS[tab];
  const clock = formatTime(new Date());

  return (
    <View style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <BreathingDot color={theme.text} />
          <Text style={[styles.logoText, { color: theme.text }]}>
            Jonnathan <Text style={{ fontWeight: '700' }}>Fit</Text>
          </Text>
        </View>

        <View style={styles.topBarRight}>
          <Text style={[styles.clock, { color: theme.text3 }]}>{clock}</Text>
          <TouchableOpacity
            style={[styles.profileBtn, { borderColor: theme.line2 }]}
            onPress={() => setTab('Perfil')}
            activeOpacity={0.7}
          >
            <ProfileIcon color={theme.text2} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hairline */}
      <View style={{ height: 1, backgroundColor: theme.line }} />

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Screen theme={theme} setTab={setTab} />
      </View>

      {/* Bottom Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: insets.bottom || 8 }]}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.tabItem}
              onPress={() => setTab(t.key)}
              activeOpacity={0.7}
            >
              {active && (
                <View style={[styles.tabAccentLine, { backgroundColor: theme.accent }]} />
              )}
              <View style={{ marginTop: active ? 6 : 8 }}>
                <TabIcon tabKey={t.key} color={active ? theme.text : theme.text3} size={22} />
              </View>
              <Text style={[
                styles.tabLabel,
                { color: active ? theme.text : theme.text3 },
              ]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 48,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoText: {
    fontSize: 15,
    fontWeight: '300',
  },
  clock: {
    fontSize: 12,
    fontWeight: '400',
    fontVariant: ['tabular-nums'],
  },
  profileBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Bottom Tab Bar */
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'rgba(18,18,17,.92)',
    borderTopWidth: 0,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  tabAccentLine: {
    width: 14,
    height: 1.5,
    marginTop: 0,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
