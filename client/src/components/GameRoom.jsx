import React from 'react';
import DrawCanvas from './DrawCanvas.jsx';
import JoinGameRoom from './JoinGameRoom.jsx';
import io from 'socket.io-client';


class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView:  <JoinGameRoom 
                      playGame={this.playGame.bind(this)}/>,
      drawDisabled: true
    };
  }

  playGame() {
    this.socket = io();
  }

  render() {
    return (
      <div>
        <DrawCanvas drawDisabled={this.state.drawDisabled}/>
        {this.state.currentView}
      </div>
    );
  }

}

export default GameRoom;