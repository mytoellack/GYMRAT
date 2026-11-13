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

exports.terminar = async (req, res) => {
  res.status(201).json(await service.terminar(req.userId, req.params.id));
};

exports.actualizar = async (req, res) => {
  res.json(await service.actualizar(req.userId, req.params.id, req.body));
};