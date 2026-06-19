import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadState } from './src/store';
import { colors as lightColors } from './src/theme';

import HoyScreen from './src/screens/HoyScreen';
import EntrenoScreen from './src/screens/EntrenoScreen';
import ComidaScreen from './src/screens/ComidaScreen';
import ProgresoScreen from './src/screens/ProgresoScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const darkColors = {
  bg: '#1A1A1A',
  surface: '#2A2A2A',
  surface2: '#333333',
  text: '#FAF3E8',
  text2: '#AAAAAA',
  text3: '#777777',
  line: '#3A3A3A',
  accent: '#FAF3E8',
  good: '#4CAF50',
  over: '#FF9800',
  danger: '#E53935',
  sand: '#C4A882',
};

const TABS = [
  { key: 'Hoy', label: 'HOY' },
  { key: 'Entreno', label: 'ENTRENO' },
  { key: 'Comida', label: 'COMIDA' },
  { key: 'Progreso', label: 'PROGRESO' },
  { key: 'Perfil', label: 'PERFIL' },
];

const SCREENS = {
  Hoy: HoyScreen,
  Entreno: EntrenoScreen,
  Comida: ComidaScreen,
  Progreso: ProgresoScreen,
  Perfil: PerfilScreen,
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('Hoy');
  const [dark, setDark] = useState(false);

  useEffect(() => { loadState().then(() => setReady(true)); }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightColors.bg }}>
        <ActivityIndicator size="large" color={lightColors.text} />
      </View>
    );
  }

  const theme = dark ? darkColors : lightColors;

  return (
    <SafeAreaProvider>
      <MainLayout
        tab={tab}
        setTab={setTab}
        dark={dark}
        setDark={setDark}
        theme={theme}
      />
      <StatusBar style={dark ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

function MainLayout({ tab, setTab, dark, setDark, theme }) {
  const insets = useSafeAreaInsets();
  const Screen = SCREENS[tab];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: theme.line }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={[styles.logoDot, { backgroundColor: theme.sand }]} />
            <Text style={[styles.logoText, { color: theme.text }]}>J O N N A T H A N {'  '} F I T</Text>
          </View>
          <View style={[styles.themeToggle, { borderColor: theme.line }]}>
            <TouchableOpacity
              style={[styles.themeBtn, dark && { backgroundColor: theme.surface2 }]}
              onPress={() => setDark(true)}
            >
              <Text style={[styles.themeBtnText, { color: dark ? theme.text : theme.text3 }]}>DARK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, !dark && { backgroundColor: theme.line }]}
              onPress={() => setDark(false)}
            >
              <Text style={[styles.themeBtnText, { color: !dark ? theme.text : theme.text3 }]}>LIGHT</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map(t => (
            <TouchableOpacity
              key={t.key}
              style={styles.tabItem}
              onPress={() => setTab(t.key)}
            >
              <Text style={[
                styles.tabLabel,
                { color: tab === t.key ? theme.text : theme.text3 }
              ]}>
                {t.label}
              </Text>
              {tab === t.key && <View style={[styles.tabIndicator, { backgroundColor: theme.text }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Screen theme={theme} dark={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoDot: { width: 10, height: 10, marginRight: 10 },
  logoText: { fontSize: 13, letterSpacing: 4, fontWeight: '400' },
  themeToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 0,
  },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  themeBtnText: { fontSize: 10, letterSpacing: 2, fontWeight: '500' },
  tabScroll: { paddingLeft: 20 },
  tabRow: { flexDirection: 'row', gap: 28, paddingRight: 20 },
  tabItem: { paddingVertical: 12, position: 'relative' },
  tabLabel: { fontSize: 12, letterSpacing: 2.5, fontWeight: '500' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 28,
    height: 2.5,
  },
});
