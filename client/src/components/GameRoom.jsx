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
      if (isRoomAvailable) {
        this.setState({
          currentView: this.chooseBodyParts(bodyParts)
        });
      }
    })
  }

  chooseBodyParts(bodyParts) {
    return (
      <div className="overlay join-room">
          <b className="draw-off">Choose body part:</b>
          <select name="select-body-part">
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
        <DrawCanvas drawDisabled={this.state.drawDisabled}/>
        {this.state.currentView}
      </div>
    );
  }

}

export default GameRoom;