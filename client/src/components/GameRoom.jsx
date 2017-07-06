import React from 'react';
import DrawCanvas from './DrawCanvas.jsx';
import JoinGameRoom from './JoinGameRoom.jsx';


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
    console.log('Lets do this mofo!!')
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