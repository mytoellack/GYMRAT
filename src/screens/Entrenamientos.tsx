import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { useManejarError } from '../hooks/useManejarError';
import { DIAS, diaHoy } from '../utils/fecha';
import { Entrenamiento, Ejercicio, listarEntrenamientos, crearEntrenamiento, eliminarEntrenamiento } from '../services/Backend';

const EJ_VACIO = { nombre: '', series: '', reps: '', peso: '' };
const ORDEN = [1, 2, 3, 4, 5, 6, 0]; // semana de lunes a domingo

export function Entrenamientos() {
  const manejarError = useManejarError();
  const [lista, setLista] = useState<Entrenamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [dia, setDia] = useState(diaHoy());
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [ej, setEj] = useState(EJ_VACIO);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      setLista(await listarEntrenamientos());
    } catch (e) {
      manejarError(e);
    } finally {
      setCargando(false);
    }
  }, [manejarError]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const agregarEjercicio = () => {
    if (!ej.nombre.trim()) return Alert.alert('Error', 'Escribe el nombre del ejercicio');
    setEjercicios([...ejercicios, {
      nombre: ej.nombre.trim(),
      series: Number(ej.series) || 0,
      reps: Number(ej.reps) || 0,
      peso: Number(ej.peso) || 0,
    }]);
    setEj(EJ_VACIO);
  };

  const guardar = async () => {
    if (!nombre.trim()) return Alert.alert('Error', 'Escribe el nombre del entrenamiento');
    setGuardando(true);
    try {
      await crearEntrenamiento(nombre.trim(), ejercicios, dia);
      setNombre('');
      setDia(diaHoy());
      setEjercicios([]);
      setForm(false);
      await cargar();
    } catch (e) {
      manejarError(e);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = (t: Entrenamiento) =>
    Alert.alert('Eliminar entrenamiento', `¿Seguro que quieres eliminar "${t.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarEntrenamiento(t.id);
            setLista((prev) => prev.filter((x) => x.id !== t.id));
          } catch (e) {
            manejarError(e);
          }
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <PerfilButton />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Entrenamientos</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setForm(!form)}>
            <Text style={styles.addText}>{form ? 'Cancelar' : '+ Nuevo'}</Text>
          </TouchableOpacity>
        </View>

        {form && (
          <View style={styles.card}>
            <TextInput style={styles.input} placeholder="Nombre (ej. Pierna)" placeholderTextColor={Colors.textSecondary} value={nombre} onChangeText={setNombre} />

            <Text style={styles.label}>Se repite todos los...</Text>
            <View style={styles.dias}>
              {ORDEN.map((d) => (
                <TouchableOpacity key={d} style={[styles.chip, dia === d && styles.chipSel]} onPress={() => setDia(d)}>
                  <Text style={[styles.chipText, dia === d && styles.chipTextSel]}>{DIAS[d].slice(0, 3)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {ejercicios.map((x, i) => (
              <View key={i} style={styles.filaEj}>
                <Text style={[styles.item, { flex: 1 }]}>• {x.nombre} — {x.series}x{x.reps} · {x.peso} kg</Text>
                <TouchableOpacity onPress={() => setEjercicios(ejercicios.filter((_, j) => j !== i))}>
                  <Text style={styles.quitar}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TextInput style={styles.input} placeholder="Ejercicio" placeholderTextColor={Colors.textSecondary} value={ej.nombre} onChangeText={(t) => setEj({ ...ej, nombre: t })} />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.small]} placeholder="Series" placeholderTextColor={Colors.textSecondary} keyboardType="numeric" value={ej.series} onChangeText={(t) => setEj({ ...ej, series: t })} />
              <TextInput style={[styles.input, styles.small]} placeholder="Reps" placeholderTextColor={Colors.textSecondary} keyboardType="numeric" value={ej.reps} onChangeText={(t) => setEj({ ...ej, reps: t })} />
              <TextInput style={[styles.input, styles.small]} placeholder="Kg" placeholderTextColor={Colors.textSecondary} keyboardType="numeric" value={ej.peso} onChangeText={(t) => setEj({ ...ej, peso: t })} />
            </View>

            <TouchableOpacity style={styles.secondary} onPress={agregarEjercicio}>
              <Text style={styles.secondaryText}>Agregar ejercicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={guardar} disabled={guardando}>
              <Text style={styles.buttonText}>{guardando ? 'Guardando...' : 'Guardar entrenamiento'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {cargando && <ActivityIndicator color="#84CC16" style={{ marginTop: 30 }} />}
        {!cargando && lista.length === 0 && <Text style={styles.vacio}>Aún no tienes entrenamientos</Text>}

        {lista.map((t) => (
          <View key={t.id} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{t.nombre}</Text>
                <Text style={styles.fecha}>Todos los {DIAS[t.dia_semana].toLowerCase()}{t.dia_semana === diaHoy() ? ' · HOY' : ''}</Text>
              </View>
              <TouchableOpacity style={styles.eliminar} onPress={() => confirmarEliminar(t)}>
                <Text style={styles.eliminarText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#65A30D', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 14, marginBottom: 12 },
  cardTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  fecha: { color: '#84CC16', fontSize: 12, marginBottom: 6 },
  label: { color: Colors.textSecondary, fontSize: 12, marginTop: 12 },
  item: { color: Colors.textSecondary, fontSize: 14, marginTop: 2 },
  vacio: { color: Colors.textSecondary, textAlign: 'center', marginTop: 30 },
  input: { backgroundColor: '#121212', borderRadius: 8, borderWidth: 1, borderColor: '#333', color: Colors.textPrimary, paddingHorizontal: 12, height: 44, marginTop: 10 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  small: { flex: 1 },
  dias: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { borderWidth: 1, borderColor: '#84CC16', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  chipSel: { backgroundColor: '#65A30D', borderColor: '#65A30D' },
  chipText: { color: '#84CC16', fontWeight: 'bold', fontSize: 13 },
  chipTextSel: { color: '#fff' },
  filaEj: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  quitar: { color: '#DC2626', fontSize: 16, paddingHorizontal: 8 },
  button: { backgroundColor: '#65A30D', height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  secondary: { borderWidth: 1, borderColor: '#84CC16', height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  secondaryText: { color: '#84CC16', fontWeight: 'bold' },
  eliminar: { borderWidth: 1, borderColor: '#DC2626', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  eliminarText: { color: '#DC2626', fontWeight: 'bold', fontSize: 12 },
});