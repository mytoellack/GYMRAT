import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

import home from '../images/home.png';
import rutines from '../images/rutines.png';
import progreso from '../images/progreso.png';

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
        <Image 
          source={home} 
          style={[
            styles.iconImage, 
            { tintColor: currentScreen === 'Inicio' ? '#A3E635' : '#9CA3AF' }
          ]} 
        />
      </TouchableOpacity>

      {/* Botón Entrenamientos*/}
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'Entrenamientos' && styles.activeButton]} 
        onPress={() => navigation.navigate('Entrenamientos')}
      >
        <Image 
          source={rutines} 
          style={[
            styles.iconImage, 
            { tintColor: currentScreen === 'Entrenamientos' ? '#A3E635' : '#9CA3AF' }
          ]} 
        />
      </TouchableOpacity>

      {/* Botón Progreso */}
      <TouchableOpacity 
        style={[styles.navButton, currentScreen === 'Progreso' && styles.activeButton]} 
        onPress={() => navigation.navigate('Progreso')}
      >
        <Image 
          source={progreso} 
          style={[
            styles.iconImage, 
            { tintColor: currentScreen === 'Progreso' ? '#A3E635' : '#9CA3AF' }
          ]} 
        />
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
    borderTopColor: '#65A30D',
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
    backgroundColor: 'transparent',
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});