import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Api';

async function autenticar(ruta: string, body: object) {
  const res = await fetch(`${API_URL}/auth/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de autenticación');

  await SecureStore.setItemAsync('token', data.token);
  return data.usuario;
}

export const login = (email: string, password: string) =>
  autenticar('login', { email, password });

export const register = (nombre: string, email: string, password: string) =>
  autenticar('register', { nombre, email, password });