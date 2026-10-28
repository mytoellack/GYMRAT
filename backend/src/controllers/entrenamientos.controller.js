const service = require('../services/entrenamientos.service');

exports.listar = async (req, res) => {
  res.json(await service.listar(req.userId));
};

exports.crear = async (req, res) => {
  res.status(201).json(await service.crear(req.userId, req.body));
};

exports.eliminar = async (req, res) => {
  await service.eliminar(req.userId, req.params.id);
  res.status(204).end();
};