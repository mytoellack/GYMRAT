const router = require('express').Router();
const verificarToken = require('../middleware/verificarToken');
const auth = require('../controllers/auth.controller');
const entrenamientos = require('../controllers/entrenamientos.controller');
const progreso = require('../controllers/progreso.controller');
const perfil = require('../controllers/perfil.controller');

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);

router.use(verificarToken); // todo lo de abajo requiere token

router.get('/entrenamientos', entrenamientos.listar);
router.post('/entrenamientos', entrenamientos.crear);
router.delete('/entrenamientos/:id', entrenamientos.eliminar);
router.get('/progreso', progreso.resumen);
router.get('/perfil', perfil.obtener);
router.put('/perfil', perfil.actualizar);

module.exports = router;