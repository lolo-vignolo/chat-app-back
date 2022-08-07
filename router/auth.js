/* 
    http://localhost:8080/api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-token');
const router = Router();

//CREO USUARIOS
router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],

  createUser
);

//LOGIN
router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  loginUser
);

//REVALIDAR TOKEN - middleware para validar el token
router.get('/renew', [validarJWT], renewToken);

module.exports = router;
