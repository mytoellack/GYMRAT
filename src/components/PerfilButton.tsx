import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

import profile from '../images/profile.png';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function PerfilButton() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const isActive = route.name === 'Perfil';

  return (
    <TouchableOpacity 
      style={[styles.button, isActive && styles.buttonActive]} 
      onPress={() => navigation.navigate('Perfil')}
    >
      <Image 
        source={profile} 
        style={styles.icon} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    borderColor: '#65A30D',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});