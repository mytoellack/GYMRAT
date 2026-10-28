import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { useManejarError } from '../hooks/useManejarError';
import { ResumenProgreso, obtenerProgreso } from '../services/Backend';

export function Progreso() {
  const manejarError = useManejarError();
  const [datos, setDatos] = useState<ResumenProgreso | null>(null);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(useCallback(() => {
    obtenerProgreso()
      .then(setDatos)
      .catch(manejarError)
      .finally(() => setCargando(false));
  }, [manejarError]));

  const max = Math.max(1, ...(datos?.semanas.map((s) => s.sesiones) ?? [1]));

  return (
    <View style={styles.container}>
      <PerfilButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Progreso</Text>
        <Text style={styles.subtitle}>Seguimiento de tu progreso</Text>

        {cargando && <ActivityIndicator color="#84CC16" style={{ marginTop: 30 }} />}

        {datos && (
          <>
            <View style={styles.card}>
              <Text style={styles.total}>{datos.total}</Text>
              <Text style={styles.subtitle}>sesiones registradas</Text>
            </View>

            {datos.semanas.length === 0 && <Text style={styles.vacio}>Aún no hay sesiones</Text>}

            {datos.semanas.map((s) => (
              <View key={s.semana} style={styles.card}>
                <Text style={styles.item}>Semana del {String(s.semana).slice(0, 10)} — {s.sesiones} sesiones</Text>
                <View style={styles.barra}>
                  <View style={[styles.relleno, { width: `${(s.sesiones / max) * 100}%` }]} />
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 70 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 14, marginTop: 12 },
  total: { color: '#84CC16', fontSize: 40, fontWeight: 'bold' },
  item: { color: Colors.textPrimary, fontSize: 14 },
  vacio: { color: Colors.textSecondary, textAlign: 'center', marginTop: 30 },
  barra: { height: 8, backgroundColor: '#333', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  relleno: { height: 8, backgroundColor: '#65A30D', borderRadius: 4 },
});