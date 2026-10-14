const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const AppError = require('../utils/AppError');

const firmar = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new AppError(400, 'Correo y contraseña son obligatorios');

  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError(401, 'Credenciales inválidas');
  }
  return { token: firmar(user.id), usuario: { id: user.id, nombre: user.nombre, email: user.email } };
};

exports.register = async ({ nombre, email, password }) => {
  if (!nombre || !email || !password) throw new AppError(400, 'Completa todos los campos');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError(400, 'Correo inválido');
  if (password.length < 6) throw new AppError(400, 'La contraseña debe tener al menos 6 caracteres');

  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email',
    [nombre, email, hash]
  );
  return { token: firmar(rows[0].id), usuario: rows[0] };
};
