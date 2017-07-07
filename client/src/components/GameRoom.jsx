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
    this.socket = io();
  }

  playGame() {
    this.socket.emit('play game', true);
    this.socket.on('play game', (isRoomAvailable, bodyParts) => {
      console.log('lets play: ', isRoomAvailable, bodyParts);
    })
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