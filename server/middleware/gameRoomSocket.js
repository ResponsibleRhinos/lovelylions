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
        this.playerJoined(socket, gameRoom, roomId);
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

  playerJoined(socket, gameRoom, roomId) {
    if (gameRoom.playersInRoom() < 3) {
      this.io.to(`gameRoom${roomId}`).emit('player joined', 3 - gameRoom.playersInRoom());
    } else {
      this.io.to(`gameRoom${roomId}`).emit('starting game', true);
    }
  }

  gameEnd(socket) {
    socket.on('game end', (userImage) => {
      console.log('image received!', userImage);
      console.log('name: ', this.getSocketGameRoomName(socket));
      console.log('id: ', this.getSocketGameRoomId(socket));
      var gameRoom = this.getSocketGameRoom(socket);
      gameRoom.addPartToImage(userImage);
      if (gameRoom.isImageComplete()) {
        var roomName = this.getSocketGameRoomName(socket);
        this.io.to(roomName).emit('image complete', gameRoom.image);
      }
    });
  }

  getSocketGameRoomName(socket) {
    return Object.keys(socket.rooms)[1];
  }

  getSocketGameRoomId(socket) {
    return parseInt(/\d+/.exec(this.getSocketGameRoomName(socket)));
  }

  getSocketGameRoom(socket) {
    return gameRooms[this.getSocketGameRoomId(socket)];
  }

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

