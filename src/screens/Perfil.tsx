import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { AppStackParamList } from '../types/navigation';
import { useManejarError } from '../hooks/useManejarError';
import { obtenerPerfil, actualizarPerfil, cerrarSesion } from '../services/Backend';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function Perfil() {
  const navigation = useNavigation<NavigationProp>();
  const manejarError = useManejarError();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useFocusEffect(useCallback(() => {
    obtenerPerfil()
      .then((u) => { setNombre(u.nombre); setEmail(u.email); })
      .catch(manejarError)
      .finally(() => setCargando(false));
  }, [manejarError]));

  const guardar = async () => {
    if (!nombre.trim() || !email.trim()) return Alert.alert('Error', 'Completa nombre y correo');
    setGuardando(true);
    try {
      const u = await actualizarPerfil({ nombre: nombre.trim(), email: email.trim().toLowerCase() });
      setNombre(u.nombre);
      setEmail(u.email);
      Alert.alert('Listo', 'Perfil actualizado');
    } catch (e) {
      manejarError(e);
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = async () => {
    await cerrarSesion();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <PerfilButton />
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Gestiona tu perfil</Text>

        {cargando ? (
          <ActivityIndicator color="#84CC16" style={{ marginTop: 30 }} />
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={Colors.textSecondary} value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={Colors.textSecondary} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TouchableOpacity style={styles.button} onPress={guardar} disabled={guardando}>
              <Text style={styles.buttonText}>{guardando ? 'Guardando...' : 'Guardar cambios'}</Text>
            </TouchableOpacity>
          </>
        )}

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
  content: { flex: 1, padding: 20, paddingTop: 70 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 4, marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', color: Colors.textPrimary, paddingHorizontal: 15, height: 50, marginBottom: 15 },
  button: { backgroundColor: '#65A30D', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { marginTop: 24, alignSelf: 'center', backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  logoutText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' },
});