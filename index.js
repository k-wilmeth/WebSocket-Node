const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your front-end client PORT
  methods: ["GET", "POST"]
}))

// Socket IO Config
const httpServer = require("http").createServer();

// Initialize socket.io
require("./socket")(httpServer);

// If not using rabbitmq, you don't need this.
// const smartGroupId = process.env.SMART_GROUP_ID || "*";


// let connectedToRabbit = false;
// const connectToRabbitMQAndSendMessages = async (smartGroupId) => {
//   try {
//     const io = require("./socket").getIO();

//     if (!connectedToRabbit) {
//       connection = await amqp.connect(process.env.RABBITMQ_URL);
//       console.log('Connected to RabbitMQ');
//       connectedToRabbit = true;
    
//       channel = await connection.createChannel();
//       console.log('Created RabbitMQ channel');
//       const exchangeName = 'topic';
//       const routingKey = `dim.*.smartgroups.${smartGroupId}.exports.*`;
    
//       await channel.assertExchange(exchangeName, 'topic', { durable: true });
//       const queueResult = await channel.assertQueue('', { exclusive: true });
//       const queueName = queueResult.queue;  
    
//       await channel.bindQueue(queueName, exchangeName, routingKey);
//       console.log('Waiting for messages...');
    
//       channel.consume(queueName, (message) => {
//         try {
//           const content = message.content.toString();
//           let body = JSON.parse(content);
//           console.log(body?.status + " -> progress: " + body?.progress);
      
//           /* Send messages to WebSocket */
//           /* NOTE: If you don't need RabbitMQ, just comment out the entire 
//           connectToRabbitMQAndSendMessages method and just use this line replacing the body variable with a test message*/
//           io.sockets.emit("socket_data", body);
    
//           // Acknowledge the message to remove it from the queue
//           channel.ack(message);
//         } catch (error) {
//           console.error('Error processing message:', error);
      
//           // Reject the message and do not requeue it
//           channel.reject(message, false);
//         }
//       });
//     }
//   } catch(err) {
//     console.error('Error On RabbitMQ execution method: ', err);
//   }
// }

const sendMessagesToFrontEnd = async () => {
  const io = require("./socket").getIO();
  let count = 0;
  const sendMessages = () => {
    count++;
    if (count <= 100) {
      io.sockets.emit("socket_data", count);
      console.log(`sending count of ${count} to front-end`)
    } else {
      console.log('finish. Restart server to retrigger');
      clearInterval(msgInterval);
    }
  }
  const msgInterval = setInterval(sendMessages, 50);

}


const PORT = 3003;
httpServer.listen(3003, async () => {
  console.log(`websocket-be is listening on port ${PORT}`)
  await sendMessagesToFrontEnd();
});