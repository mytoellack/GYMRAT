import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { AppStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function Perfil() {
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <PerfilButton />
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Gestiona tu perfil</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 8 },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});