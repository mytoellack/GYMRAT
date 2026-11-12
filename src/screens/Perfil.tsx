import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import { BottomNavigation } from '../components/BottomNavigation';
import { PerfilButton } from '../components/PerfilButton';
import { AppStackParamList } from '../types/navigation';
import { useManejarError } from '../hooks/useManejarError';
import { obtenerPerfil, actualizarPerfil, cambiarPassword, cerrarSesion } from '../services/Backend';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function Perfil() {
  const navigation = useNavigation<NavigationProp>();
  const manejarError = useManejarError();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [cambiando, setCambiando] = useState(false);

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

  const limpiarPassword = () => {
    setPasswordActual('');
    setPasswordNueva('');
    setPasswordConfirmar('');
    setMostrarPassword(false);
  };

  const guardarPassword = async () => {
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      return Alert.alert('Error', 'Completa todos los campos');
    }
    if (passwordNueva.length < 6) {
      return Alert.alert('Error', 'La contraseña nueva debe tener al menos 6 caracteres');
    }
    if (passwordNueva !== passwordConfirmar) {
      return Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
    }
    if (passwordNueva === passwordActual) {
      return Alert.alert('Error', 'La contraseña nueva debe ser distinta a la actual');
    }

    setCambiando(true);
    try {
      await cambiarPassword(passwordActual, passwordNueva);
      limpiarPassword();
      Alert.alert('Listo', 'Contraseña actualizada');
    } catch (e) {
      manejarError(e);
    } finally {
      setCambiando(false);
    }
  };

  const handleLogout = async () => {
    await cerrarSesion();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <PerfilButton />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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

            {!mostrarPassword ? (
              <TouchableOpacity style={styles.buttonOutline} onPress={() => setMostrarPassword(true)}>
                <Text style={styles.buttonOutlineText}>Cambiar contraseña</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.passwordBox}>
                <Text style={styles.passwordTitle}>Cambiar contraseña</Text>
                <TextInput style={styles.input} placeholder="Contraseña actual" placeholderTextColor={Colors.textSecondary} value={passwordActual} onChangeText={setPasswordActual} secureTextEntry autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Contraseña nueva" placeholderTextColor={Colors.textSecondary} value={passwordNueva} onChangeText={setPasswordNueva} secureTextEntry autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Confirmar contraseña nueva" placeholderTextColor={Colors.textSecondary} value={passwordConfirmar} onChangeText={setPasswordConfirmar} secureTextEntry autoCapitalize="none" />
                <TouchableOpacity style={styles.button} onPress={guardarPassword} disabled={cambiando}>
                  <Text style={styles.buttonText}>{cambiando ? 'Guardando...' : 'Actualizar contraseña'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={limpiarPassword} disabled={cambiando}>
                  <Text style={styles.cancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 70, paddingBottom: 40 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 4, marginBottom: 20 },
  input: { backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', color: Colors.textPrimary, paddingHorizontal: 15, height: 50, marginBottom: 15 },
  button: { backgroundColor: '#65A30D', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonOutline: { height: 50, borderRadius: 8, borderWidth: 1, borderColor: '#84CC16', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  buttonOutlineText: { color: '#84CC16', fontSize: 16, fontWeight: 'bold' },
  passwordBox: { marginTop: 24, backgroundColor: '#1E1E1E', borderRadius: 8, borderWidth: 1, borderColor: '#333', padding: 14 },
  passwordTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  cancelar: { color: Colors.textSecondary, textAlign: 'center', marginTop: 14, fontSize: 14 },
  logoutButton: { marginTop: 24, alignSelf: 'center', backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#DC2626', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  logoutText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' },
});