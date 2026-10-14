const db = require('../db');
const AppError = require('../utils/AppError');

exports.obtener = async (usuarioId) => {
  const { rows } = await db.query('SELECT id, nombre, email FROM usuarios WHERE id = $1', [usuarioId]);
  if (!rows[0]) throw new AppError(404, 'Usuario no encontrado');
  return rows[0];
};

exports.actualizar = async (usuarioId, { nombre, email }) => {
  if (!nombre && !email) throw new AppError(400, 'Envía el nombre o el correo a actualizar');

  const { rows } = await db.query(
    `UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email)
     WHERE id = $3 RETURNING id, nombre, email`,
    [nombre, email, usuarioId]
  );
  if (!rows[0]) throw new AppError(404, 'Usuario no encontrado');
  return rows[0];
};
