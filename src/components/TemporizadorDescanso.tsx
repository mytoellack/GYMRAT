import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { Colors } from '../constants/Colors';

const PRESETS = [30, 60, 90, 120];

const formato = (seg: number) =>
  `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;

export function TemporizadorDescanso() {
  const [duracion, setDuracion] = useState(60);
  const [restante, setRestante] = useState(60);
  const [corriendo, setCorriendo] = useState(false);
  const finRef = useRef(0); // hora en que termina; no se desajusta si la app pasa a segundo plano

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((finRef.current - Date.now()) / 1000));
      setRestante(r);
      if (r === 0) {
        setCorriendo(false);
        Vibration.vibrate([0, 400, 200, 400]);
      }
    }, 250);
    return () => clearInterval(id);
  }, [corriendo]);

  const iniciar = () => {
    const seg = restante > 0 ? restante : duracion;
    setRestante(seg);
    finRef.current = Date.now() + seg * 1000;
    setCorriendo(true);
  };

  const pausar = () => setCorriendo(false);

  const reiniciar = () => {
    setCorriendo(false);
    setRestante(duracion);
  };

  const elegir = (seg: number) => {
    setDuracion(seg);
    setRestante(seg);
  };

  const terminado = restante === 0;

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Descanso</Text>
      <Text style={[styles.tiempo, terminado && styles.tiempoFin]}>{formato(restante)}</Text>
      {terminado && <Text style={styles.fin}>¡A entrenar!</Text>}

      <View style={styles.presets}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p}
            disabled={corriendo}
            onPress={() => elegir(p)}
            style={[styles.preset, duracion === p && styles.presetOn, corriendo && styles.deshabilitado]}
          >
            <Text style={[styles.presetText, duracion === p && styles.presetTextOn]}>{p}s</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.botones}>
        <TouchableOpacity style={[styles.boton, { flex: 2 }]} onPress={corriendo ? pausar : iniciar}>
          <Text style={styles.botonText}>{corriendo ? 'Pausar' : terminado ? 'Repetir' : 'Iniciar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonSec, { flex: 1 }]} onPress={reiniciar}>
          <Text style={styles.botonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 14, marginTop: 4, alignItems: 'center' },
  titulo: { color: Colors.textSecondary, fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  tiempo: { color: Colors.textPrimary, fontSize: 48, fontWeight: 'bold', marginVertical: 4 },
  tiempoFin: { color: '#84CC16' },
  fin: { color: '#84CC16', fontWeight: 'bold', marginBottom: 4 },
  presets: { flexDirection: 'row', gap: 8, marginTop: 6 },
  preset: { borderWidth: 1, borderColor: '#374151', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14 },
  presetOn: { borderColor: '#84CC16', backgroundColor: '#1F2937' },
  presetText: { color: Colors.textSecondary, fontWeight: 'bold' },
  presetTextOn: { color: '#84CC16' },
  deshabilitado: { opacity: 0.5 },
  botones: { flexDirection: 'row', gap: 8, marginTop: 12, width: '100%' },
  boton: { backgroundColor: '#65A30D', height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  botonSec: { backgroundColor: '#374151' },
  botonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});