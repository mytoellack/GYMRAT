module.exports = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.code === '23505') return res.status(409).json({ error: 'El correo ya está registrado' });
  if (err.code === '22007' || err.code === '22008') {
    return res.status(400).json({ error: 'Fecha inválida' });
  }
  if (err.status) return res.status(err.status).json({ error: err.message });

  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
};
