import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { AppStackParamList } from '../types/navigation';
import { useManejarError } from '../hooks/useManejarError';
import { diaHoy, etiquetaHoy } from '../utils/fecha';
import { Entrenamiento, listarEntrenamientos } from '../services/Backend';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function Inicio() {
  const navigation = useNavigation<NavigationProp>();
  const manejarError = useManejarError();
  const [deHoy, setDeHoy] = useState<Entrenamiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(useCallback(() => {
    listarEntrenamientos()
      .then((lista) => setDeHoy(lista.filter((t) => t.dia_semana === diaHoy())))
      .catch(manejarError)
      .finally(() => setCargando(false));
  }, [manejarError]));

  return (
    <View style={styles.container}>
      <PerfilButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Inicio</Text>
        <Text style={styles.dia}>{etiquetaHoy()}</Text>

        {cargando && <ActivityIndicator color="#84CC16" style={{ marginTop: 30 }} />}

        {!cargando && deHoy.length === 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No tienes entrenamiento para hoy</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Entrenamientos')}>
              <Text style={styles.buttonText}>Crear entrenamiento</Text>
            </TouchableOpacity>
          </View>
        )}

        {deHoy.map((t) => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.cardTitle}>{t.nombre}</Text>
            <Text style={styles.subtitle}>{t.ejercicios.length} ejercicios por hacer</Text>
            {t.ejercicios.map((x, i) => (
              <Text key={i} style={styles.item}>• {x.nombre} — {x.series}x{x.reps} · {x.peso} kg</Text>
            ))}
          </View>
        ))}
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 70 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' },
  dia: { color: '#84CC16', fontSize: 16, fontWeight: 'bold', marginTop: 4, marginBottom: 12 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 14, marginTop: 12 },
  cardTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 2, marginBottom: 8 },
  item: { color: Colors.textPrimary, fontSize: 15, marginTop: 4 },
  button: { backgroundColor: '#65A30D', height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});