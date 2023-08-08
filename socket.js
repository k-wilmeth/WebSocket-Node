// singleton instance of socket.io
let ioInstance;

module.exports = function(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000", // Replace <PORT> with the port your front-end httpServer is running on
      methods: ["GET", "POST"]
    }
  });

  // When a new client connects to the server
  io.on("connection", socket => {
    console.log("New Client Connected", socket.id);

    // Handle outgoing messages from custom socket event "socket_data"
    const socketEventName = "socket_data";
    socket.on(socketEventName, function(data) {
      io.sockets.emit("chat", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

  });

  // save in higher scope so it can be obtained later
  ioInstance = io;
  return io;
};

// this getIO method is designed for subsequent
// sharing of the io instance with other modules once the module has been initialized
// other modules can do: let io = require("./io.js").getIO();
module.exports.getIO = () => {
  if (!ioInstance) {
    throw new Error(
      "Must call module constructor function before you can get the IO instance"
    );
  }
  return ioInstance;
};