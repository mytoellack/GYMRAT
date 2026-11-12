const bcrypt = require('bcrypt');
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

exports.cambiarPassword = async (usuarioId, { passwordActual, passwordNueva }) => {
  if (!passwordActual || !passwordNueva) throw new AppError(400, 'Completa todos los campos');
  if (passwordNueva.length < 6) throw new AppError(400, 'La contraseña nueva debe tener al menos 6 caracteres');
  if (passwordNueva === passwordActual) throw new AppError(400, 'La contraseña nueva debe ser distinta a la actual');

  const { rows } = await db.query('SELECT password_hash FROM usuarios WHERE id = $1', [usuarioId]);
  if (!rows[0]) throw new AppError(404, 'Usuario no encontrado');

  // 400 y no 401: la app cierra la sesión cuando recibe un 401
  if (!(await bcrypt.compare(passwordActual, rows[0].password_hash))) {
    throw new AppError(400, 'La contraseña actual es incorrecta');
  }

  const hash = await bcrypt.hash(passwordNueva, 10);
  await db.query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hash, usuarioId]);
};