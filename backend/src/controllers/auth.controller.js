const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const firmar = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({ token: firmar(user.id), usuario: { id: user.id, nombre: user.nombre, email: user.email } });
};

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Completa todos los campos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hash]
    );
    res.status(201).json({ token: firmar(rows[0].id), usuario: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'El correo ya está registrado' });
    throw e;
  }
};