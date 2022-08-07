const User = require('../models/user');
const Message = require('../models/message');

const userConected = async (uid) => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();
  return user;
};

const userDisconected = async (uid) => {
  const user = await User.findById(uid);
  user.online = false;
  await user.save();
  return user;
};

const getUsers = async () => {
  const users = await User.find().sort('-online'); //el - los ordena primero a los online, si no le pongo el - trae todos desordenados
  return users;
};

//grabar mensajes en DB, ya los recibo en el socket back, ahora guardatlos para poder recuperarlos

const saveMessage = async (message_object) => {
  try {
    const newMessage = new Message(message_object);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  userConected,
  userDisconected,
  getUsers,
  saveMessage,
};
