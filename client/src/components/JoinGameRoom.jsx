import React from 'react';
import DrawCanvas from './DrawCanvas.jsx';


class JoinGameRoom extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="overlay join-room">
<<<<<<< HEAD
            <b className="draw-off">cadavre draw off!</b>
            <button onClick={this.props.playGame}>Play Game!</button>
=======
            
>>>>>>> add multiplayer room rendering and disallow drawing while on lobby
        </div>
      </div>
    );
  }

}

export default JoinGameRoom;