const service = require('../services/entrenamientos.service');

exports.listar = async (req, res) => {
  res.json(await service.listar(req.userId));
};

exports.crear = async (req, res) => {
  res.status(201).json(await service.crear(req.userId, req.body));
};
