const db = require('../db');

exports.obtener = async (req, res) => {
  const { rows } = await db.query('SELECT id, nombre, email FROM usuarios WHERE id = $1', [req.userId]);
  res.json(rows[0]);
};

exports.actualizar = async (req, res) => {
  const { nombre, email } = req.body;
  const { rows } = await db.query(
    `UPDATE usuarios SET nombre = COALESCE($1, nombre), email = COALESCE($2, email)
     WHERE id = $3 RETURNING id, nombre, email`,
    [nombre, email, req.userId]
  );
  res.json(rows[0]);
};
