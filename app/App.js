import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loadState } from './src/store';
import { colors } from './src/theme';

import HoyScreen from './src/screens/HoyScreen';
import EntrenoScreen from './src/screens/EntrenoScreen';
import ComidaScreen from './src/screens/ComidaScreen';
import ProgresoScreen from './src/screens/ProgresoScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Tab = createBottomTabNavigator();

const ICONS = { Hoy: '◉', Entreno: '▣', Comida: '◆', Progreso: '◈', Perfil: '◎' };

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => { loadState().then(() => setReady(true)); }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bg,
              borderTopColor: colors.line,
              borderTopWidth: 1,
              height: 85,
              paddingBottom: 28,
              paddingTop: 4,
            },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.text3,
            tabBarLabelStyle: {
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              fontWeight: '500',
            },
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>{ICONS[route.name]}</Text>
            ),
          })}
        >
          <Tab.Screen name="Hoy" component={HoyScreen} />
          <Tab.Screen name="Entreno" component={EntrenoScreen} />
          <Tab.Screen name="Comida" component={ComidaScreen} />
          <Tab.Screen name="Progreso" component={ProgresoScreen} />
          <Tab.Screen name="Perfil" component={PerfilScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
