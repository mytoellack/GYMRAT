# GYMRAT

App móvil de entrenamiento personal. Permite registrar rutinas semanales por día, marcar los ejercicios durante el entrenamiento, terminarlo y consultar el progreso (barras por semana y racha de días consecutivos).

- **App:** React Native (Expo, TypeScript), Android
- **API:** Node.js + Express 5, desplegada en Render
- **Base de datos:** PostgreSQL, alojada en Neon
- **API en producción:** `https://gymrat-ndke.onrender.com/api/v1`

> La API corre en el plan gratuito de Render: tras 15 minutos sin uso se duerme y la primera petición puede tardar cerca de un minuto.

## Funcionalidades

- Registro e inicio de sesión (JWT, sesión persistente en el dispositivo)
- Rutinas semanales por día de la semana: crear, editar y eliminar (con confirmación)
- Inicio: rutina de hoy con lista de ejercicios, checkboxes y botón "Terminar entrenamiento" (con confirmación)
- Progreso: sesiones por semana (últimas 12 semanas) y racha de días consecutivos
- Perfil: ver y editar nombre y correo, cambiar contraseña, cerrar sesión
- Temporizador de descanso

## Arquitectura

```
App (React Native)  ──HTTPS/JSON──▶  API REST (Express)  ──SQL──▶  PostgreSQL (Neon)
```

El backend está separado en capas:

| Capa | Responsabilidad |
|---|---|
| `routes` | Define las rutas y qué middleware usa cada una |
| `controllers` | Recibe la petición, llama al servicio y responde con el código HTTP |
| `services` | Lógica de negocio y consultas a la base de datos |
| `db` | Pool de conexión a PostgreSQL |
| `middleware` | `verificarToken` (JWT) y `errorHandler` (errores centralizados) |

El id del usuario siempre sale del token (`req.userId`), nunca de la URL ni del body.

## Modelo de datos

```mermaid
erDiagram
    usuarios ||--o{ entrenamientos : tiene
    usuarios ||--o{ sesiones : registra
    entrenamientos ||--o{ sesiones : genera

    usuarios {
        int id PK
        text nombre
        text email UK
        text password_hash
    }
    entrenamientos {
        int id PK
        int usuario_id FK
        text nombre
        jsonb ejercicios
        date fecha
        smallint dia_semana "0=domingo ... 6=sábado"
    }
    sesiones {
        int id PK
        int usuario_id FK
        int entrenamiento_id FK
        date fecha
    }
```

- `entrenamientos` es la rutina semanal; `dia_semana` va de 0 (domingo) a 6 (sábado).
- `sesiones` guarda cada entrenamiento terminado. Tiene una restricción `UNIQUE (entrenamiento_id, fecha)`: un entrenamiento solo se termina una vez por día.
- Si se elimina un entrenamiento, sus sesiones se conservan (`ON DELETE SET NULL`) para no perder el historial.
- El esquema completo está en [`backend/schema.sql`](backend/schema.sql).

## API

Base URL: `/api/v1`. Todas las rutas, excepto `login` y `register`, requieren el header `Authorization: Bearer <token>`.

| Método | Ruta | Descripción | Éxito | Errores |
|---|---|---|---|---|
| POST | `/auth/register` | Crea un usuario y devuelve el token | 201 | 400, 409 |
| POST | `/auth/login` | Inicia sesión y devuelve el token | 200 | 400, 401 |
| GET | `/entrenamientos` | Lista las rutinas del usuario (incluye `terminado_hoy`) | 200 | 401 |
| POST | `/entrenamientos` | Crea una rutina | 201 | 400, 401 |
| PUT | `/entrenamientos/:id` | Edita nombre, ejercicios y día | 200 | 400, 401, 404 |
| DELETE | `/entrenamientos/:id` | Elimina una rutina | 204 | 401, 404 |
| POST | `/entrenamientos/:id/terminar` | Marca el entrenamiento de hoy como terminado | 201 | 401, 404, 409 |
| GET | `/progreso` | Sesiones por semana y racha | 200 | 401 |
| GET | `/perfil` | Datos del usuario | 200 | 401 |
| PUT | `/perfil` | Actualiza nombre y correo | 200 | 400, 401, 409 |
| PUT | `/perfil/password` | Cambia la contraseña | 204 | 400, 401 |

### Ejemplos

`POST /auth/login`

```json
{ "email": "demo@test.com", "password": "123456" }
```

Respuesta `200`:

```json
{ "token": "eyJhbGciOi...", "usuario": { "id": 1, "nombre": "Demo", "email": "demo@test.com" } }
```

`POST /entrenamientos`

```json
{
  "nombre": "Pecho y tríceps",
  "dia_semana": 1,
  "ejercicios": [
    { "nombre": "Press banca", "series": 4, "reps": 10, "peso": 60 }
  ]
}
```

### Errores

Todos los errores tienen el mismo formato:

```json
{ "error": "mensaje descriptivo" }
```

| Código | Cuándo ocurre |
|---|---|
| 400 | Datos inválidos o incompletos |
| 401 | Token ausente, inválido o vencido; credenciales incorrectas |
| 404 | El recurso no existe o no pertenece al usuario |
| 409 | Conflicto: correo ya registrado o entrenamiento ya terminado hoy |
| 500 | Error interno del servidor |

### Racha y progreso

- La **racha** cuenta días consecutivos con al menos una sesión terminada; devuelve la actual, la mejor y si ya se entrenó hoy.
- `total` es el número de sesiones de las últimas 12 semanas, y `semanas` es el desglose por semana.

## Ejecutar en local

Requisitos: Node.js 20+, PostgreSQL y Expo Go en el celular.

### Backend

```bash
cd backend
npm install
```

Crea `backend/.env` (no se sube al repo):

```
DATABASE_URL=postgres://usuario:clave@localhost:5432/gymrat
JWT_SECRET=un_secreto_largo_y_aleatorio
PORT=3000
```

Crea la base y carga el esquema:

```bash
createdb gymrat
psql gymrat -f schema.sql
npm run dev
```

### App

Desde la raíz del proyecto:

```bash
npm install
npx expo start -c
```

La URL de la API se toma de la variable `EXPO_PUBLIC_API_URL`. Para usar la API desplegada:

```powershell
$env:EXPO_PUBLIC_API_URL="https://gymrat-ndke.onrender.com/api/v1"
npx expo start --tunnel -c
```

## Despliegue

| Parte | Servicio | Notas |
|---|---|---|
| Base de datos | Neon (PostgreSQL) | Esquema cargado con `psql -f schema.sql` |
| API | Render (Web Service) | Root Directory `backend`, build `npm install`, start `npm start` |
| App | EAS Build (Expo) | APK de Android |

Variables de entorno en Render: `DATABASE_URL` y `JWT_SECRET`.

### Generar el APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

El perfil `preview` de `eas.json` genera un `.apk` y define `EXPO_PUBLIC_API_URL` con la URL de Render.

## Seguridad

- Contraseñas almacenadas con `bcrypt`, nunca en texto plano.
- Autenticación con JWT (vigencia de 7 días); el token se guarda en el dispositivo con `expo-secure-store`.
- Consultas SQL parametrizadas, para evitar inyección SQL.
- Cada consulta filtra por el usuario del token, así que un usuario no puede ver ni modificar datos de otro.
- Los secretos viven en variables de entorno y `.env` está excluido del repositorio.

## Autor

Thomas Calle Ayala — Institución Universitaria Pascual Bravo