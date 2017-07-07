var GameRoom = require('../models/GameRooms.js');

var gameRoom0 = new GameRoom(0);
var gameRooms = [gameRoom0];

module.exports = {

  playGame: (socket) => {
    socket.on('play game', (msg) => {
      if (gameRoom0.isFull()) {
        socket.emit('play game', false);
      } else {
        socket.emit('play game', true, gameRoom0.bodyPartsAvailable(), gameRoom0.getRoomId());
      }
    });
  },

  joinGame: (socket) => {
    socket.on('join game', (bodyPartChosen, roomId) => {
      var gameRoom = gameRooms[roomId];
      if (gameRoom.bodyPartAvailable(bodyPartChosen)) {
        socket.join(`gameRoom${roomId}`);
        gameRoom.addPlayer(socket.id, bodyPartChosen);
        socket.emit('join game', true, bodyPartChosen);
      } else {
        socket.emit('join game', false);
      }
    });
  },

  leaveGame: (socket) => {
    socket.on('leave game', (roomId) => {
      var gameRoom = gameRooms[roomId];
      gameRoom.removePlayer(socket.id);
    });
  },

  disconnect: (socket) => {
    socket.on('disconnecting', () => {
      Object.keys(socket.rooms).forEach((room, index) => {
        if (index > 0) {
          var roomIndex = /\d+/.exec(room);
          gameRooms[parseInt(roomIndex[0])].removePlayer(socket.id);
        }
      });
    });
  }

}

