const service = require('../services/auth.service');

exports.login = async (req, res) => {
  res.json(await service.login(req.body));
};

exports.register = async (req, res) => {
  res.status(201).json(await service.register(req.body));
};
