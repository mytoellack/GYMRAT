const db = require('../db');
const AppError = require('../utils/AppError');

exports.listar = async (usuarioId) => {
  const { rows } = await db.query(
    'SELECT * FROM entrenamientos WHERE usuario_id = $1 ORDER BY fecha DESC, id DESC',
    [usuarioId]
  );
  return rows;
};

exports.crear = async (usuarioId, { nombre, ejercicios = [], fecha }) => {
  if (!nombre) throw new AppError(400, 'El nombre es obligatorio');
  if (!Array.isArray(ejercicios)) throw new AppError(400, 'Los ejercicios deben ser una lista');

  const { rows } = await db.query(
    `INSERT INTO entrenamientos (usuario_id, nombre, ejercicios, fecha)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE)) RETURNING *`,
    [usuarioId, nombre, JSON.stringify(ejercicios), fecha]
  );
  return rows[0];
};
