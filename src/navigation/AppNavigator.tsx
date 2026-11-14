import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import { Progreso } from '../screens/Progreso';
import { Inicio } from '../screens/Inicio';
import { Entrenamientos } from '../screens/Entrenamientos';
import { Perfil } from '../screens/Perfil';
import { AppStackParamList } from '../types/navigation';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const [rutaInicial, setRutaInicial] = useState<'Login' | 'Inicio' | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync('token')
      .then((token) => setRutaInicial(token ? 'Inicio' : 'Login'))
      .catch(() => setRutaInicial('Login'));
  }, []);

  if (rutaInicial === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={rutaInicial}
        screenOptions={{
          animation: 'none',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Entrenamientos" component={Entrenamientos} />
        <Stack.Screen name="Progreso" component={Progreso} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}