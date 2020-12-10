import React, { Component } from 'react';

const positionRanking = {"QB": 1, "RB": 2, "WR": 3, "TE": 4, "K": 5, "DST": 6}

class Summary extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.collapse) {
      var margin = "70px";
    } else {
      var margin = "320px";
    }
    this.props.rosterDict["Team " + ((this.props.draftPosition + 11) % 12 + 1)].sort((a, b) => {
      return positionRanking[a.pos] - positionRanking[b.pos];
    });
    return (
      <div className="draft-board-container" style={{marginLeft: margin}}>
        <button className="toggle-summary" onClick={() => this.props.toggleSummary()}>Toggle Summary</button>
        <div className="all-rows">
          <div className="summary-container">
            <h1>Mock Draft Summary</h1>
            <ul>
              {this.props.rosterDict["Team " + ((this.props.draftPosition + 11) % 12 + 1)].map((player) => <li>{player.name}</li>)}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Summary;