import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { TemporizadorDescanso } from '../components/TemporizadorDescanso';
import { AppStackParamList } from '../types/navigation';
import { useManejarError } from '../hooks/useManejarError';
import { diaHoy, etiquetaHoy } from '../utils/fecha';
import { Entrenamiento, listarEntrenamientos, terminarEntrenamiento } from '../services/Backend';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function Inicio() {
  const navigation = useNavigation<NavigationProp>();
  const manejarError = useManejarError();
  const [deHoy, setDeHoy] = useState<Entrenamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});

  useFocusEffect(useCallback(() => {
    listarEntrenamientos()
      .then((lista) => setDeHoy(lista.filter((t) => t.dia_semana === diaHoy())))
      .catch(manejarError)
      .finally(() => setCargando(false));
  }, [manejarError]));

  const clave = (id: number, i: number) => `${id}-${i}`;
  const alternar = (id: number, i: number) =>
    setMarcados((prev) => ({ ...prev, [clave(id, i)]: !prev[clave(id, i)] }));

  const terminar = (t: Entrenamiento) => {
    const faltan = t.ejercicios.filter((_, i) => !marcados[clave(t.id, i)]).length;
    const pregunta = '¿Estás seguro de que ya terminaste?';

    Alert.alert(
      'Terminar entrenamiento',
      faltan > 0 ? `Aún tienes ${faltan} ejercicio(s) sin marcar.\n${pregunta}` : pregunta,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, terminé',
          onPress: async () => {
            try {
              await terminarEntrenamiento(t.id);
              setDeHoy((prev) => prev.map((x) => (x.id === t.id ? { ...x, terminado_hoy: true } : x)));
            } catch (e) {
              manejarError(e);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <PerfilButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Inicio</Text>
        <Text style={styles.dia}>{etiquetaHoy()}</Text>

        <TemporizadorDescanso />

        {cargando && <ActivityIndicator color="#84CC16" style={{ marginTop: 30 }} />}

        {!cargando && deHoy.length === 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No tienes entrenamiento para hoy</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Entrenamientos')}>
              <Text style={styles.buttonText}>Crear entrenamiento</Text>
            </TouchableOpacity>
          </View>
        )}

        {deHoy.map((t) => {
          const hechos = t.terminado_hoy
            ? t.ejercicios.length
            : t.ejercicios.filter((_, i) => marcados[clave(t.id, i)]).length;

          return (
            <View key={t.id} style={styles.card}>
              <Text style={styles.cardTitle}>{t.nombre}</Text>
              <Text style={styles.subtitle}>{hechos} de {t.ejercicios.length} ejercicios hechos</Text>

              {t.ejercicios.map((x, i) => {
                const hecho = t.terminado_hoy || !!marcados[clave(t.id, i)];
                return (
                  <TouchableOpacity key={i} style={styles.fila} onPress={() => alternar(t.id, i)} disabled={t.terminado_hoy}>
                    <View style={[styles.caja, hecho && styles.cajaOn]}>
                      {hecho && <Text style={styles.check}>✓</Text>}
                    </View>
                    <Text style={[styles.item, hecho && styles.itemHecho]}>
                      {x.nombre} — {x.series}x{x.reps} · {x.peso} kg
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {t.terminado_hoy ? (
                <View style={styles.terminado}>
                  <Text style={styles.terminadoText}>✓ Entrenamiento terminado hoy</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.button} onPress={() => terminar(t)}>
                  <Text style={styles.buttonText}>Terminar entrenamiento</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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
  fila: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  caja: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#84CC16', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cajaOn: { backgroundColor: '#65A30D', borderColor: '#65A30D' },
  check: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  item: { color: Colors.textPrimary, fontSize: 15, flex: 1 },
  itemHecho: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  button: { backgroundColor: '#65A30D', height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  terminado: { borderWidth: 1, borderColor: '#84CC16', borderRadius: 8, height: 46, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  terminadoText: { color: '#84CC16', fontWeight: 'bold', fontSize: 15 },
});