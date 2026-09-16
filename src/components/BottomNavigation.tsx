import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function BottomNavigation() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const currentScreen = route.name;

  return (
    <View style={styles.navContainer}>
      {/* Botón Inicio */}
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'Inicio' && styles.activeButton]} 
        onPress={() => navigation.navigate('Inicio')}
      >
        <Text style={styles.icon}>🏠</Text>
      </TouchableOpacity>

      {/* Botón Entrenamientos */}
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'Entrenamientos' && styles.activeButton]} 
        onPress={() => navigation.navigate('Entrenamientos')}
      >
        <Text style={styles.icon}>🏋️‍♂️</Text>
      </TouchableOpacity>

      {/* Botón Principal */}
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'Progreso' && styles.activeButton]} 
        onPress={() => navigation.navigate('Progreso')}
      >
        <Text style={styles.icon}>📈</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor:  '#65A30D',

    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },
  navButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#2A2A2A',
  },
  icon: {
    fontSize: 24,
  },
});