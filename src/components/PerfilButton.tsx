import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function PerfilButton() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => navigation.navigate('Perfil')}
    >
      <Text style={styles.icon}>👤</Text>
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
    borderColor: '#65A30D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
});