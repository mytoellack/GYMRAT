import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register'; // <--- 1. Importa la pantalla Register
import { Progreso } from '../screens/Progreso';
import { Inicio } from '../screens/Inicio';
import { Entrenamientos } from '../screens/Entrenamientos';
import { Perfil } from '../screens/Perfil';
import { AppStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: true, animation: 'none' }}
      >
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: true }} 
        />
        {/* 2. Añade esta línea dentro del Stack.Navigator */}
        <Stack.Screen 
          name="Register" 
          component={Register} 
        />
        <Stack.Screen 
          name="Inicio" 
          component={Inicio} 
        />
        <Stack.Screen 
          name="Entrenamientos" 
          component={Entrenamientos} 
        />
        <Stack.Screen 
          name="Progreso" 
          component={Progreso} 
        />
        <Stack.Screen 
          name="Perfil" 
          component={Perfil} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}