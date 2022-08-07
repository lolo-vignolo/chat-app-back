const { checkJWT } = require('../helper/jwt');
const {
  userConected,
  userDisconected,
  getUsers,
  saveMessage,
} = require('../controllers/socket');

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    //on conecta el socket
    this.io.on('connection', async (socket) => {
      const token = socket.handshake.query['x-Token'];
      //VALIDO JWT PARA CONECTAR O NO(COMPLETED)
      const [valido, uid] = checkJWT(token);
      if (!valido) {
        return socket.disconnect();
      }

      //escuchar (recibir /enviar) envento: mensaje-to-server
      console.log('Socket conectado', uid);

      await userConected(uid);

      // UNO EL USUARION A UNA SALA DE SOCKET.IO, uid ES EL NOMBRE QUE LE PNGO A LA SALA
      socket.join(uid);

      //SABER QUE USUARIO ESTA ACTIVO (COMPLETED) - SE MANDA LA LISA DE USUARIOS, Y EL FRONT CONTROLA
      //emitir todos los usuarios conectados(por eso usi el this.io)
      this.io.emit('lista-usuarios', await getUsers());

      //escuchar (recibir /enviar) MENSAJES PERSONALES

      socket.on('personal-message', async (objet_msg) => {
        const newMessage = await saveMessage(objet_msg);
        //to relacionado con la sala, mensaje se emitira a la persona con este UID
        this.io.to(objet_msg.to).emit('personal-message', newMessage);
        this.io.to(objet_msg.from).emit('personal-message', newMessage);
      });

      //DESCONEXIONES
      socket.on('disconnect', async () => {
        await userDisconected(uid);
        console.log('Socket desconectado', uid);
        this.io.emit('lista-usuarios', await getUsers());
        //se encvia toda la lista de nuevo, pero aqui abra algunos que ahora aparecen con online:false ,FRONT CONTROLA
      });
    });
  }
}

module.exports = Sockets;
