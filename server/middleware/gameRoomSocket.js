var GameRoom = require('../models/GameRooms.js');

var gameRoom0 = new GameRoom(0);
var gameRooms = [gameRoom0];
// for (var i = 0; i < 10; i++) {
//   gameRooms.push(new GameRoom(i));
// }

class GameRoomSocket {

  constructor(io) {
    this.io = io;
  }

  playGame(socket) {
    socket.on('play game', (msg) => {
      if (gameRoom0.isFull()) {
        socket.emit('play game', false);
      } else {
        socket.emit('play game', true, gameRoom0.bodyPartsAvailable(), gameRoom0.getRoomId());
      }
    });
  }

  joinGame(socket) {
    socket.on('join game', (bodyPartChosen, roomId) => {
      var gameRoom = gameRooms[roomId];
      if (gameRoom.bodyPartAvailable(bodyPartChosen)) {
        socket.join(`gameRoom${roomId}`);
        gameRoom.addPlayer(socket.id, bodyPartChosen);
        socket.emit('join game', true, bodyPartChosen, 3 - gameRoom.playersInRoom());
        this.io.to(`gameRoom${roomId}`).emit('player joined', 3 - gameRoom.playersInRoom());
      } else {
        socket.emit('join game', false);
      }
    });
  }

  leaveGame(socket) {
    socket.on('leave game', (roomId) => {
      var gameRoom = gameRooms[roomId];
      gameRoom.removePlayer(socket.id);
      this.io.to(`gameRoom${roomId}`).emit('player joined', 3 - gameRoom.playersInRoom());
    });
  }

  disconnect(socket) {
    socket.on('disconnecting', () => {
      Object.keys(socket.rooms).forEach((room, index) => {
        if (index > 0) {
          var roomIndex = /\d+/.exec(room);
          var gameRoom = gameRooms[parseInt(roomIndex[0])];
          gameRoom.removePlayer(socket.id);
          console.log('game left: ', roomIndex);
          this.io.to(`gameRoom${roomIndex}`).emit('player joined', 3 - gameRoom.playersInRoom());
        }
      });
    });
  }

  // playerJoined: (socket) => {

  // }
};

module.exports.init = (io) => {
  const gameRoomSocket = new GameRoomSocket(io);

  io.on('connection', (socket) => {
  console.log(socket.id, ' user connected!');

  // play game 
  gameRoomSocket.playGame(socket);

  // join game room lobby
  gameRoomSocket.joinGame(socket);

  // leave game room
  gameRoomSocket.leaveGame(socket);
  gameRoomSocket.disconnect(socket);

});
}


