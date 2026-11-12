const db = require('../db');

// Racha = días seguidos con al menos una sesión terminada.
// Sigue viva si entrenaste hoy o ayer (hoy todavía puedes entrenar).
const calcularRacha = async (userId) => {
  const { rows } = await db.query(
    `WITH dias AS (
       SELECT DISTINCT fecha FROM sesiones WHERE usuario_id = $1
     ),
     grupos AS (
       SELECT fecha, fecha - (ROW_NUMBER() OVER (ORDER BY fecha))::int AS g FROM dias
     ),
     rachas AS (
       SELECT MAX(fecha) AS fin, COUNT(*)::int AS dias FROM grupos GROUP BY g
     )
     SELECT
       COALESCE((SELECT dias FROM rachas WHERE fin >= CURRENT_DATE - 1 ORDER BY fin DESC LIMIT 1), 0) AS actual,
       COALESCE((SELECT MAX(dias) FROM rachas), 0) AS mejor,
       EXISTS (SELECT 1 FROM dias WHERE fecha = CURRENT_DATE) AS entreno_hoy`,
    [userId]
  );
  const r = rows[0];
  return { actual: r.actual, mejor: r.mejor, entrenoHoy: r.entreno_hoy };
};

exports.resumen = async (userId) => {
  const { rows } = await db.query(
    `SELECT date_trunc('week', fecha)::date AS semana, COUNT(*)::int AS sesiones
     FROM sesiones WHERE usuario_id = $1
     GROUP BY 1 ORDER BY 1 DESC LIMIT 12`,
    [userId]
  );
  return {
    total: rows.reduce((n, r) => n + r.sesiones, 0),
    semanas: rows,
    racha: await calcularRacha(userId),
  };
};