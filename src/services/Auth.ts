import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Api';

async function autenticar(ruta: string, body: object) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}/auth/${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de autenticación');

    await SecureStore.setItemAsync('token', data.token);
    return data.usuario;
  } catch (e: any) {
    if (e.name === 'AbortError') throw new Error(`Sin respuesta del servidor\nURL: ${API_URL}`);
    if (e.message?.includes('fetch failed') || e.message?.includes('Network request failed')) {
      throw new Error(`${e.message}\nURL: ${API_URL}`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const login = (email: string, password: string) =>
  autenticar('login', { email, password });

export const register = (nombre: string, email: string, password: string) =>
  autenticar('register', { nombre, email, password });