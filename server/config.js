const mongoose = require('mongoose');
require('dotenv').config();

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB is connected');
  } catch (error) {
    throw new Error(error);
  }
};

//ponerlo siempre entre {}
module.exports = { dbConection };
