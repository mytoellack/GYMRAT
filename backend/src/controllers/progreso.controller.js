const service = require('../services/progreso.service');

exports.resumen = async (req, res) => {
  res.json(await service.resumen(req.userId));
};
