import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import {PerfilButton} from '../components/PerfilButton';


export function Inicio() {
  return (
    <View style={styles.container}>
      <PerfilButton />
      <View style={styles.content}>
        <Text style={styles.title}>Inicio</Text>
        <Text style={styles.subtitle}>Bienvenido a GYMRAT</Text>
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
});