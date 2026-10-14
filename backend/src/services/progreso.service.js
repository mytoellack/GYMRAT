const db = require('../db');

exports.resumen = async (usuarioId) => {
  const { rows } = await db.query(
    `SELECT date_trunc('week', fecha)::date AS semana, COUNT(*)::int AS sesiones
     FROM entrenamientos WHERE usuario_id = $1
     GROUP BY 1 ORDER BY 1 DESC LIMIT 12`,
    [usuarioId]
  );
  return { total: rows.reduce((n, r) => n + r.sesiones, 0), semanas: rows };
};
