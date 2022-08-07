const Message = require('../models/message');

const getMessages = async (req, res) => {
  //tengo que buscar los mensajes en la base de datos, para lo cual, va a haber mensajes mios y de un tercero.
  //para buscar los mensajes mios, necesito el id del usuario que esta logueado. Para eso, necesito el token.
  //para buscar los mensajes de un tercero, necesito el id del usuario que quiero buscar. que viene en el params.

  const myUid = req.uid;
  const mensaggesFrom = req.params.id;

  // condicion dificil. Esto me devolvera mensajes si estos fuero creados o recibidos por mi. En relacion al tercero.
  // se ordena por fecha de creacion. y se limitan los ultimos 30 mensajes.
  const last30 = await Message.find({
    $or: [
      { from: myUid, to: mensaggesFrom },
      { from: mensaggesFrom, to: myUid },
    ],
  })
    .sort({ createdAt: 'asc' })
    .limit(30);

  res.json({
    ok: true,
    messages: last30,
  });
};

module.exports = getMessages;
