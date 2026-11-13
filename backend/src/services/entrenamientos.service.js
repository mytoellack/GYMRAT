const db = require('../db');
const AppError = require('../utils/AppError');

const validarId = (id) => {
  if (!Number.isInteger(Number(id))) throw new AppError(400, 'Id inválido');
};

const validar = ({ nombre, ejercicios = [], dia_semana }) => {
  if (!nombre) throw new AppError(400, 'El nombre es obligatorio');
  if (!Array.isArray(ejercicios)) throw new AppError(400, 'ejercicios debe ser una lista');
  if (!Number.isInteger(dia_semana) || dia_semana < 0 || dia_semana > 6)
    throw new AppError(400, 'dia_semana debe ser un número de 0 (domingo) a 6 (sábado)');
};

exports.listar = async (userId) => {
  const { rows } = await db.query(
    `SELECT e.id, e.nombre, e.ejercicios, e.dia_semana,
            EXISTS (SELECT 1 FROM sesiones s
                    WHERE s.entrenamiento_id = e.id AND s.fecha = CURRENT_DATE) AS terminado_hoy
     FROM entrenamientos e WHERE e.usuario_id = $1
     ORDER BY (e.dia_semana + 6) % 7, e.id`,
    [userId]
  );
  return rows;
};

exports.crear = async (userId, datos) => {
  validar(datos);
  const { nombre, ejercicios = [], dia_semana } = datos;

  const { rows } = await db.query(
    `INSERT INTO entrenamientos (usuario_id, nombre, ejercicios, dia_semana, fecha)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, nombre, ejercicios, dia_semana, false AS terminado_hoy`,
    [userId, nombre, JSON.stringify(ejercicios), dia_semana]
  );
  return rows[0];
};

exports.actualizar = async (userId, id, datos) => {
  validarId(id);
  validar(datos);
  const { nombre, ejercicios = [], dia_semana } = datos;

  const { rows } = await db.query(
    `UPDATE entrenamientos SET nombre = $1, ejercicios = $2, dia_semana = $3
     WHERE id = $4 AND usuario_id = $5
     RETURNING id, nombre, ejercicios, dia_semana`,
    [nombre, JSON.stringify(ejercicios), dia_semana, id, userId]
  );
  if (!rows[0]) throw new AppError(404, 'Entrenamiento no encontrado');
  return rows[0];
};

exports.eliminar = async (userId, id) => {
  validarId(id);
  const { rowCount } = await db.query(
    'DELETE FROM entrenamientos WHERE id = $1 AND usuario_id = $2',
    [id, userId]
  );
  if (!rowCount) throw new AppError(404, 'Entrenamiento no encontrado');
};

exports.terminar = async (userId, id) => {
  validarId(id);

  const existe = await db.query(
    'SELECT 1 FROM entrenamientos WHERE id = $1 AND usuario_id = $2',
    [id, userId]
  );
  if (!existe.rowCount) throw new AppError(404, 'Entrenamiento no encontrado');

  const { rows } = await db.query(
    `INSERT INTO sesiones (usuario_id, entrenamiento_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING RETURNING id, to_char(fecha, 'YYYY-MM-DD') AS fecha`,
    [userId, id]
  );
  if (!rows[0]) throw new AppError(409, 'Este entrenamiento ya se terminó hoy');
  return rows[0];
};