import React, { Component } from 'react';

function TeamName(props) {
  return (
    <button className="team-name" key={props.value}>
    {"Team " + props.value}
    </button>
  )
}

/*title={props.i + 1}*/

function Square(props) {
  return (
    <div>
      {(props.color === "white" || props.color === "rgb(235, 235, 235)") && <button className="square" key={props.value} style={{backgroundColor: props.color}}>
        <p className="draft-position">
        {Math.floor((props.i)/12 + 1) + "." + ((props.i) % 12 + 1)}
        </p>
      </button>}
      {props.color !==  "white" && props.color !== "rgb(235, 235, 235)" && <button className="square" key={props.value} style={{backgroundColor: props.color}} title={Math.floor((props.i)/12 + 1) + "." + ((props.i) % 12 + 1)}>
        <p>
        {props.value} <br />
        {props.pos}
        </p>
      </button>}
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i, value, color, pos) {
    return (
      <Square
        value={value}
        key={i}
        i={i}
        color={color}
        pos={pos}
      />
    );
  }

  createRow(number, columns) {
    var num = number.num;
    let array = [];
    if ((num - 1) % 2 === 0) { 
      for (let i = 0; i < columns; i++) {
        let color = "white"
        if ((this.props.squareArray[i + (num-1)*12]) !== null) {
          if ((this.props.squareArray[i + (num-1)*12]).pos === ("RB")) {
            color = "rgb(164, 237, 183)"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("WR")) {
            color = "lightyellow"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("QB")) {
            color = "pink"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("TE")) {
            color = "rgb(186, 161, 237)"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("K")) {
            color = "rgb(232, 193, 97)"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("DST")) {
            color = "rgb(185, 226, 240)"
          }
          array.push(this.renderSquare(i + (num-1)*12, this.props.squareArray[i + (num-1)*12].name, color, (this.props.squareArray[i + (num-1)*12]).pos));
        } else {
          if ((i + 1 + (num-1)*12) % 12 === this.props.draftPosition) {
            color = "rgb(235, 235, 235)"
          }
          array.push(this.renderSquare(i + (num-1)*12, this.props.squareArray[i + (num-1)*12], color, (this.props.squareArray[i + (num-1)*12])));
          }
      }
    } else {
      for (let i = columns - 1; i > -1; i--) {
        let color = "white"
        if ((this.props.squareArray[i + (num-1)*12]) !== null) {
          if ((this.props.squareArray[i + (num-1)*12]).pos === ("RB")) {
            color = "rgb(164, 237, 183)"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("WR")) {
            color = "lightyellow"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("QB")) {
            color = "pink"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("TE")) {
            color = "rgb(186, 161, 237)"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("K")) {
            color = "rgb(232, 193, 97)"
          } else if ((this.props.squareArray[i + (num-1)*12]).pos === ("DST")) {
            color = "rgb(185, 226, 240)"
          }
          array.push(this.renderSquare(i + (num-1)*12, this.props.squareArray[i + (num-1)*12].name, color, (this.props.squareArray[i + (num-1)*12]).pos));
        } else {
          if (i === 12 - (this.props.draftPosition)) {
            color = "rgb(235, 235, 235)"
          } else if (i === 0 && this.props.draftPosition === 0) {
            color = "rgb(235, 235, 235)"
          }
          array.push(this.renderSquare(i + (num-1)*12, this.props.squareArray[i + (num-1)*12], color, (this.props.squareArray[i + (num-1)*12])));
          }
      }
    }
    return array; 
  }

  renderTeamName(i) {
    return (
      <TeamName
        value={i}
        key={i}
      />
    );
  }

  createUpperRow(num) {
    let array = []
    for (let i = 1; i < num + 1; i++) {
      array.push(this.renderTeamName(i))
    }
    return array
  }

  render() {
    if (this.props.collapse) {
      var margin = "70px";
    } else {
      var margin = "320px";
    }
    return (
      <div className="draft-board-container" style={{marginLeft: margin}}>
      {this.props.end &&
      <button className="toggle-summary" onClick={() => this.props.toggleSummary()}>Toggle Summary</button>}
      <div className="all-rows">
        {!this.props.start &&
        <div className="welcome-container">
          <h1>Mock Draft Welcome Title</h1>
          <h4 className="welcome-text">Mock Draft Description. Blah blah blah blah blah blah blah blah blah...</h4>
          <ol className="instruction-list">
            <li className="instruction-item-1">Adjust the settings in the sidebar to fit your draft.</li>
            <li className="instruction-item">Press &nbsp; <span className="inline-startButton"><p>Start Draft</p></span> &nbsp;  to start your mock draft.</li>
            <li className="instruction-item">Hover over a player and press &nbsp; <span className="inline-draftButton"><p> Draft</p></span> &nbsp; to draft a player.</li>
            <li className="instruction-item">Press &nbsp; <span><i className="fa fa-group inline-roster-icon" aria-hidden="true"></i></span> &nbsp; to view and compare team rosters.</li>
            <li className="instruction-item">Press &nbsp; <span><i className="fa fa-refresh inline-restart-icon" aria-hidden="true"></i></span> &nbsp; to restart your mock draft.</li>
          </ol>
          {/*<h4 className="welcome-text">Use &nbsp; <span className="inline-menuIcon">&#9776;</span> &nbsp; in the sidebar to expand/collapse the sidebar. <br /> Use &nbsp; <span className="inline-restartIcon">&#x21ba;</span> &nbsp; in the the sidebar to restart the mock draft.</h4>*/}
          <h4 className="welcome-text">More Text. Blah blah blah blah blah blah blah blah blah...</h4>
          {/*<h1> New Icons: <i className="fa fa-chevron-circle-right" aria-hidden="true"></i> <i className="fa fa-chevron-circle-left" aria-hidden="true"></i> <i className="fa fa-list" aria-hidden="true"></i> <i className="fa fa-group" aria-hidden="true"></i> <i className="fa fa-refresh" aria-hidden="true"></i> </h1>*/}
        </div>}
        {this.props.start &&
        <div>
          <h1>Draft Board</h1>
          <div className="upper-row">
          {this.createUpperRow(12)}
          </div>
          {this.props.numRounds.map(num => 
            <div key={num} className="row">
              {this.createRow({num}, 12)}
            </div>)}
        </div>}
      </div>
      </div>
    );
  }
}

export default Board;