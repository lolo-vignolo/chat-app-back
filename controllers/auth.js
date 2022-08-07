const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { jwtGenerator } = require('../helper/jwt');

const createUser = async (req, res = response) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email }); // busca si existe el email en la base de datos (es otra validación).
    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe',
      });
    }

    const newUser = new User({ name, email, password });

    // encriptar password
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);
    console.log(newUser);

    await newUser.save();

    //comprobacion de la info hecha, usuario gusrdado. Se otorga token

    const token = await jwtGenerator(newUser._id);

    res.json({
      ok: true,
      token,
      newUser,
    });
  } catch (error) {
    //este va a ser problema del servidor, por eso un status 500, debido a que si llegamos hasta ejecutar esta funcion
    //significa que la infi en el body estaba bien, y no hubo error 400.
    return res.status(500).json({
      ok: false,
      msg: 'Problema en el servidor',
      error,
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });

    //valido si el usuario existe
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario no existe',
      });
    }

    //valido si el password es correcto
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'El password es incorrecto',
      });
    }

    // todo bien genero el token
    const token = await jwtGenerator(userDB._id);

    res.json({
      ok: true,
      message: 'Usuario logueado correctamente',
      userDB,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Problema en el servidor',
      error,
    });
  }
};

const renewToken = async (req, res = response) => {
  //si paso el middleware quiere decir dos cosas:
  //1. que el token esta valido
  //2. que el usuario existe, y puedo acceder a su uid que lo agregue en el middleware.
  //3. con ese uid puedo generer un nuevo token

  const { uid } = req;
  const token = await jwtGenerator(uid);

  //en el res enviare el token y el usuario(lo busco de modelo usando el uid)
  const user = await User.findById(uid);

  res.json({
    ok: true,
    message: 'Token renovado correctamente',
    token,
    user,
  });
};

module.exports = { createUser, loginUser, renewToken };
