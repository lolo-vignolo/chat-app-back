const Server = require('./models/server');
require('dotenv').config();

const server = new Server(process.env.PORT || 8081);

server.start();
