import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Api';

export type Ejercicio = { nombre: string; series: number; reps: number; peso: number };
export type Entrenamiento = { id: number; nombre: string; ejercicios: Ejercicio[]; dia_semana: number };
export type ResumenProgreso = { total: number; semanas: { semana: string; sesiones: number }[] };
export type Usuario = { id: number; nombre: string; email: string };

class ErrorApi extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function pedir<T>(ruta: string, metodo = 'GET', body?: object): Promise<T> {
  const token = await SecureStore.getItemAsync('token');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (res.status === 204) return undefined as T;
    const data = await res.json();
    if (!res.ok) throw new ErrorApi(data.error || 'Error del servidor', res.status);
    return data;
  } catch (e: any) {
    if (e.name === 'AbortError') throw new ErrorApi('Sin respuesta del servidor');
    if (e.status) throw e;
    throw new ErrorApi('No se pudo conectar con el servidor');
  } finally {
    clearTimeout(timer);
  }
}

export const listarEntrenamientos = () => pedir<Entrenamiento[]>('/entrenamientos');
export const crearEntrenamiento = (nombre: string, ejercicios: Ejercicio[], dia_semana: number) =>
  pedir<Entrenamiento>('/entrenamientos', 'POST', { nombre, ejercicios, dia_semana });
export const eliminarEntrenamiento = (id: number) =>
  pedir<void>(`/entrenamientos/${id}`, 'DELETE');
export const obtenerProgreso = () => pedir<ResumenProgreso>('/progreso');
export const obtenerPerfil = () => pedir<Usuario>('/perfil');
export const actualizarPerfil = (datos: { nombre?: string; email?: string }) =>
  pedir<Usuario>('/perfil', 'PUT', datos);
export const cerrarSesion = () => SecureStore.deleteItemAsync('token');