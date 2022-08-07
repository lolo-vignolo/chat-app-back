const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Sockets = require('./sockets');
const cors = require('cors');
const path = require('path');
const { dbConection } = require('../server/config');

class Server {
  constructor(port) {
    this.port = port;
    this.app = express();

    //CONECT DB
    dbConection();

    //creo el http server
    this.serverSocket = http.createServer(this.app);
    //socket config
    this.io = socketio(this.serverSocket, {
      /*Config adicionales */
    });
  }

  middleware() {
    //deplegar el directorio publico
    this.app.use(express.static(path.resolve(__dirname, '../public')));

    //CORS
    this.app.use(cors());

    //LEER BODY
    this.app.use(express.json());

    //ROUTES - endpoints
    this.app.use('/api/login', require('../router/auth'));
    this.app.use('/api/messages', require('../router/messages'));
  }
  //congiguracion de socket para inicio de chat
  configSocket() {
    new Sockets(this.io);
  }

  //este start se llama en index.js
  start() {
    //inicializa el middleware
    this.middleware();
    //inicializa el socket
    this.configSocket();
    //inicializa el server
    this.serverSocket.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

module.exports = Server;
