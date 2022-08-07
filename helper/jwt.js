const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtGenerator = (uid) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { uid },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Error al generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

const checkJWT = (token) => {
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    return [true, uid];
  } catch (error) {
    console.log(error);
    return [false, null];
  }
};

module.exports = {
  jwtGenerator,
  checkJWT,
};
