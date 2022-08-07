/* 
Path: api/messages
*/
const { Router } = require('express');
const getMessages = require('../controllers/messages');
const validarJWT = require('../middlewares/validar-token');

const router = Router();

router.get('/:id', validarJWT, getMessages);

module.exports = router;
