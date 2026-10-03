const db = require('../db');

exports.listar = async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM entrenamientos WHERE usuario_id = $1 ORDER BY fecha DESC, id DESC',
    [req.userId]
  );
  res.json(rows);
};

exports.crear = async (req, res) => {
  const { nombre, ejercicios = [], fecha } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  const { rows } = await db.query(
    `INSERT INTO entrenamientos (usuario_id, nombre, ejercicios, fecha)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE)) RETURNING *`,
    [req.userId, nombre, JSON.stringify(ejercicios), fecha]
  );
  res.status(201).json(rows[0]);
};
