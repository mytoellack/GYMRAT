import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const [rutaInicial, setRutaInicial] = useState<'Login' | 'Inicio' | null>(null);

  useEffect(() => {
    // Al abrir la app: si hay un token guardado, entra directo a Inicio.
    SecureStore.getItemAsync('token')
      .then((token) => setRutaInicial(token ? 'Inicio' : 'Login'))
      .catch(() => setRutaInicial('Login'));
  }, []);

  // Mientras se lee el token, se muestra una pantalla de carga
  if (rutaInicial === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={rutaInicial}
        screenOptions={{ headerShown: true, animation: 'none' }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Entrenamientos" component={Entrenamientos} />
        <Stack.Screen name="Progreso" component={Progreso} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}