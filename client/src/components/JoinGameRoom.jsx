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
            <b id="dance-off">cadavre dance off!</b>
            <button onClick={this.props.playGame}>Play Game!</button>
        </div>
      </div>
    );
  }

}

export default JoinGameRoom;