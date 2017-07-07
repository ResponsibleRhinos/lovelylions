import React from 'react';
import GameRoomCanvas from './GameRoomCanvas.jsx';
import JoinGameRoom from './JoinGameRoom.jsx';
import io from 'socket.io-client';


class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView:  <JoinGameRoom playGame={this.playGame.bind(this)}/>,
      drawDisabled: true,
      bodyPart: 'head'
    };
    this.socket = io();
  }

  playGame() {
    this.socket.emit('play game', true);
    this.socket.on('play game', (isRoomAvailable, bodyParts, roomId) => {
      console.log('lets play: ', isRoomAvailable, bodyParts);
      if (isRoomAvailable) {
        this.setState({
          currentView: this.chooseBodyParts(bodyParts),
          roomId: roomId
        });
      }
    });
  }

  selectBodyPart(event) {
    this.socket.emit('join game', event.target.value, this.state.roomId);

    this.socket.on('join game', (didJoin, bodyPart, playersMissing) => {
      if (didJoin) {
        this.setState({
          bodyPart: bodyPart,
          currentView: (playersMissing !== 0) ? this.waitForPlayers(playersMissing): this.startingGame()
        });
      }
    });

    this.socket.on('player joined', (playersMissing) => {
      this.setState({
        currentView: this.waitForPlayers(playersMissing)
      });
    });

    this.socket.on('starting game', (gameStart) => {
      this.setState({
        currentView: this.startingGame()
      });
      this.startGame();
    });
  }

  startGame() {

  }

  componentWillUnmount() {
    this.socket.emit('leave game', this.state.roomId);
  }

  waitForPlayers(players) {
    var playerString = (players === 1 ? 'player' : 'players');
    return (
      <div className="overlay join-room">
        <b className="draw-off">Waiting for {players} {playerString} to join game...</b>
      </div>
    )
  }

  startingGame() {
    return (
      <div className="overlay join-room">
        <b className="draw-off">Game about to start...</b>
      </div>
    )
  }

  chooseBodyParts(bodyParts) {
    return (
      <div className="overlay join-room">
          <b className="draw-off">Choose body part:</b>
          <select name="select-body-part" 
            onChange={this.selectBodyPart.bind(this)}>
            <option selected disabled>Choose here</option>
            {bodyParts.map((part, index) => (
              <option value={part} key={index}>{part}</option>
            ))}
          </select>
      </div>
    );
  }

  render() {
    return (
      <div>
        <GameRoomCanvas 
          drawDisabled={this.state.drawDisabled}
          bodyPart={this.state.bodyPart}/>
        {this.state.currentView}
      </div>
    );
  }

}

export default GameRoom;