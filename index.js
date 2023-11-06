const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors())

// Socket IO Config
const httpServer = require("http").createServer(app);

// Initialize socket.io
require("./socket")(httpServer);

const io = require("./socket").getIO();

app.get('/trigger', (req, res) => {
  let count = 0;
  const sendMessages = () => {
    count++;
    if (count <= 100) {
      io.sockets.emit("fts_data", count);
      console.log(`sending count of ${count} to front-end`)
    } else {
      console.log('finished sending messages');
      clearInterval(msgInterval);
    }
  }
  const msgInterval = setInterval(sendMessages, 1);
})

const PORT = 3003;
httpServer.listen(3003, async () => {
  console.log(`websocket-be is listening on port ${PORT}`)
});