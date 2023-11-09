const socketIo = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO is not initialized. Call init(server) to initialize.');
    }
    return io;
  },
};
