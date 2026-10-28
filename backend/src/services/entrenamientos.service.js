const db = require('../db');
const AppError = require('../utils/AppError');

const COLUMNAS = 'id, nombre, ejercicios, dia_semana';

exports.listar = async (userId) => {
  const { rows } = await db.query(
    `SELECT ${COLUMNAS} FROM entrenamientos WHERE usuario_id = $1
     ORDER BY (dia_semana + 6) % 7, id`,
    [userId]
  );
  return rows;
};

exports.crear = async (userId, { nombre, ejercicios = [], dia_semana }) => {
  if (!nombre) throw new AppError(400, 'El nombre es obligatorio');
  if (!Array.isArray(ejercicios)) throw new AppError(400, 'ejercicios debe ser una lista');
  if (!Number.isInteger(dia_semana) || dia_semana < 0 || dia_semana > 6)
    throw new AppError(400, 'dia_semana debe ser un número de 0 (domingo) a 6 (sábado)');

  const { rows } = await db.query(
    `INSERT INTO entrenamientos (usuario_id, nombre, ejercicios, dia_semana, fecha)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING ${COLUMNAS}`,
    [userId, nombre, JSON.stringify(ejercicios), dia_semana]
  );
  return rows[0];
};

exports.eliminar = async (userId, id) => {
  if (!Number.isInteger(Number(id))) throw new AppError(400, 'Id inválido');
  const { rowCount } = await db.query(
    'DELETE FROM entrenamientos WHERE id = $1 AND usuario_id = $2',
    [id, userId]
  );
  if (!rowCount) throw new AppError(404, 'Entrenamiento no encontrado');
};