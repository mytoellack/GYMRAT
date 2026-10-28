const service = require('../services/perfil.service');

exports.obtener = async (req, res) => {
  res.json(await service.obtener(req.userId));
};

exports.actualizar = async (req, res) => {
  res.json(await service.actualizar(req.userId, req.body));
};