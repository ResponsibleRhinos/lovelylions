
class GameRoom {
  constructor(id){
    this.players = [];
    this.roomId = id;
  }

  addPlayer(playerId, bodyPart) {
    this.players.push({
      playerId: playerId,
      bodyPart: bodyPart
    });
  }

  removePlayer(playerId) {
    var index = this.players.findIndex(player => player.playerId === playerId);
    if (index >= 0) {
      this.players.splice(index, 1);
    }
  }

  playersInRoom() {
    return this.players.length;
  }

}

module.exports = GameRoom;