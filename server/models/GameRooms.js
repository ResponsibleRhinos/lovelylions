
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

  isFull() {
    return this.players.length === 3;
  }

  bodyPartsAvailable() {
    var bodyParts = ['head', 'torso', 'legs'];
    return bodyParts.filter((part, index) => {
      return this.players.findIndex(player => player.bodyPart === part) === -1;
    });
  }

}

module.exports = GameRoom;