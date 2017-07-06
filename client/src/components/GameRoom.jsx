import React from 'react';
import DrawCanvas from './DrawCanvas.jsx';
import JoinGameRoom from './JoinGameRoom.jsx';


class GameRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView:  <JoinGameRoom />,
      drawDisabled: true
    };
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