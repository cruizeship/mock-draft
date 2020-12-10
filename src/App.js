import React from 'react';
import './App.css';
import Tabletop from 'tabletop';
import Board from './Board';
import Sidebar from './Sidebar';
import CollapsedSidebar from './CollapsedSidebar';
import Summary from './Summary';

/*import {playerLst} from "./playerLst.json"*/

const optionDict = [["Regular PPR", "Regular Tight End Premium", "Regular Superflex", "Tight End Premium with Superflex"], ["10", "11", "12", "13", "14", "15", "16"], ["Random", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]];

function RestartAlert(props) {
  return (
    <div>
      <div className="restart-alert">
        <i className="fa fa-exclamation-circle restart-alert-icon" aria-hidden="true"></i>
        <h5 className="restart-text">Are you sure you want to restart? All progress will be lost.</h5>
        <button className="undo-button" onClick={() => props.confirmRestart()}>Restart</button>
        <button className="confirm-button" onClick={() => props.undoRestart()}>Back</button>
      </div>
    </div>
  );
}

function computer(draftIndex, turnToPick, draftPosition) {
  if (Math.floor((draftIndex - 1)/12) % 2 === 0 && (draftIndex + 1) % 12 !== draftPosition) {
    turnToPick(draftIndex);
  } else if ((Math.floor((draftIndex - 1)/12) % 2 !== 0 || Math.floor((draftIndex)/12) % 2 === 1) && (draftIndex) % 12 !== 12 - draftPosition && draftPosition !== draftIndex + 1) {
    turnToPick(draftIndex);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var rosterDictCopy = {};
    for (var i = 1; i < 13; i++) {
      rosterDictCopy["Team " + i] = [];
    }
    this.state = {playerLst: [], start: false, positionLst: ["All", "QB", "RB", "WR", "TE", "K", "DST"], indexShown: 0, squareArray: [], draftIndex: 0, dropdownArray: [optionDict[0][0], optionDict[1][0], optionDict[2][0]], numRounds: [], draftPosition: 0, computerPlayerLst: [], computerIndex: 0, collapse: false, showAlert: false, draftTypeIndex: "", computerOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rosterDict: rosterDictCopy, showList: true, end: false, showSummary: false};
    this.computerPicking = false;
    this.waiting = false;
    this.showInfo = this.showInfo.bind(this);
    this.tabletop();
  }

  tabletop() {
  Tabletop.init({key: 'https://docs.google.com/spreadsheets/d/1c4iMokhuCrsZVquBxXQiD9bnJggo6CuOz0hiiORMmNY/edit?usp=sharing', callback: this.showInfo, simpleSheet: true})
  }

  showInfo(data, tabletop) {
    data.sort((a, b) => (parseInt(a.centralRanking, 10) > parseInt(b.centralRanking, 10)) ? 1 : -1);
    this.setState({playerLst: data})
    let array = [];
    for (var i = 1; i < 12; i++) {
      var index = "regular" + i;
      let newArray = data.slice().sort((a, b) => (parseInt(a[index], 10) < parseInt(b[index], 10)) ? 1 : -1);
      array.push(newArray);
    }
    this.setState({computerPlayerLst: array})

    let arr = this.state.computerOrder.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    } 
    this.setState({computerOrder: arr});
  }

  menuClick(index) {
    this.setState({indexShown: index})
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  rosterAdd(player, index) {
    if (player.pos==="QB") {
    }
    var rosterCopy = Object.assign({}, this.state.rosterDict);
    if (Math.floor((this.state.draftIndex)/12) % 2 === 0) {
      rosterCopy["Team " + (index)].push(player);
    } else {
      rosterCopy["Team " + (13 - index)].push(player);
    }
    this.setState({rosterDict: rosterCopy});
  }

  computerDevalue(player, position) {
    const rankingIndex = this.state.draftTypeIndex + (this.state.computerOrder[this.state.computerIndex] + 1).toString();
    if (player.pos === position) {
      if (player.pos === "QB" && (this.state.draftTypeIndex != "Regular Superflex" || this.state.draftTypeIndex != "Tight End Premium with Superflex")) {
        player[rankingIndex] -= 10;
      } else if (player.pos == "QB") {
        player[rankingIndex] -= 0;
      }/*else if (player.pos === "RB") {
        player[rankingIndex] -= 5;
      } else if (player.pos === "WR") {
        player[rankingIndex] -= 5;
      }*/ else if (player.pos === "TE" && (this.state.draftTypeIndex != "Regular Tight End Premium" || this.state.draftTypeIndex != "Tight End Premium with Superflex")) {
        player[rankingIndex] -= 15;
      } else if (player.pos === "TE") {
        player[rankingIndex] -= 5;
      } else if (player.pos === "K") {
        player[rankingIndex] -= 20;
      } else if (player.pos === "DST") {
        player[rankingIndex] -= 25;
      }
      player[rankingIndex] = player[rankingIndex].toString();
    }
  }

  computerPick() {
    if (this.state.computerPlayerLst.length > 0) {
      const rankingIndex = this.state.draftTypeIndex + (this.state.computerOrder[this.state.computerIndex] + 1).toString();
      var computerPlayerLstCopy2 = this.state.computerPlayerLst.slice()
      computerPlayerLstCopy2[this.state.computerOrder[this.state.computerIndex]].sort((a, b) => (parseInt(a[rankingIndex], 10) < parseInt(b[rankingIndex], 10)) ? 1 : -1);
      this.setState({computerPlayerLst: computerPlayerLstCopy2});

      if (this.state.squareArray.includes(null) && this.state.playerLst.length > 0) {
        var indexDrafted = 0;
        while (true) {
          if (this.state.playerLst.includes(this.state.computerPlayerLst[this.state.computerOrder[this.state.computerIndex]][indexDrafted])) {
            break;
          } 
          indexDrafted += 1;
        }
        var playerDrafted = this.state.computerPlayerLst[this.state.computerOrder[this.state.computerIndex]][indexDrafted];
        this.state.squareArray[this.state.draftIndex] = playerDrafted;
        var playerLstCopy = this.state.playerLst.slice();
        var newArray = playerLstCopy.filter(player => player.centralRanking !== (playerDrafted.centralRanking));
        this.state.playerLst = newArray;
        this.setState({playerLst: this.state.playerLst});

        this.rosterAdd(playerDrafted, (this.state.draftIndex % 12) + 1);
        this.state.draftIndex += 1;

        var computerPlayerLstCopy = this.state.computerPlayerLst.slice()
        computerPlayerLstCopy[this.state.computerOrder[this.state.computerIndex]].map(player => this.computerDevalue(player, playerDrafted.pos));
        this.setState({computerPlayerLst: computerPlayerLstCopy});
        if (this.state.draftIndex % 12 === 0 || (this.state.draftPosition === 0 && this.state.computerIndex === 10 && Math.floor((this.state.draftIndex - 1)/12) % 2 === 0) || (this.state.draftPosition === 1 && Math.floor((this.state.draftIndex - 1)/12) % 2 !== 0 && this.state.computerIndex === 0)) {
        } else if (Math.floor((this.state.draftIndex - 1)/12) % 2 === 0 && this.state.computerIndex < 10) {
          this.state.computerIndex += 1;
        } else {
          this.state.computerIndex -= 1;
        }

        const wait = async () => {
          this.computerPicking = true;
          await this.sleep(100)
          this.computerPicking = false;
          computer(this.state.draftIndex, () => this.computerPick(), this.state.draftPosition)
        }
        wait();
      } else {
        const wait = async () => {
          this.computerPicking = true;
          await this.sleep(500)
          this.setState({end: true});
          this.setState({showSummary: true});
        }
        wait();
      }
    } else {
      window.setTimeout(() => this.computerPick(), 10);
    }
  }

  handleClick(number) {
    const wait = async () => {
      await this.sleep(500)
      this.computerPick();
    }
    if (this.computerPicking === false && this.state.squareArray.includes(null) && (this.state.draftIndex + 1) % 12 === this.state.draftPosition && Math.floor((this.state.draftIndex)/12) % 2 === 0) {
      this.state.squareArray[this.state.draftIndex] = (this.state.playerLst[number]);
      const playerLstCopy = this.state.playerLst.slice();
      const toBeRemoved = playerLstCopy.splice(number, 1);
      this.state.playerLst = playerLstCopy;
      this.setState({playerLst: this.state.playerLst});

      this.rosterAdd(toBeRemoved[0], (this.state.draftIndex % 12) + 1);

      this.state.draftIndex += 1;
      if (this.state.draftIndex % 12 !== 0) {
        wait();
      }
    } else if (this.computerPicking === false && this.state.squareArray.includes(null) && (Math.floor((this.state.draftIndex)/12) % 2 !== 0) && (((this.state.draftIndex) % 12 === 12 - this.state.draftPosition || (this.state.draftIndex) % 12 === 0))) {
      this.state.squareArray[this.state.draftIndex] = (this.state.playerLst[number]);
      const playerLstCopy = this.state.playerLst.slice();
      const toBeRemoved = playerLstCopy.splice(number, 1);
      this.state.playerLst = playerLstCopy;
      this.setState({playerLst: this.state.playerLst});

      this.rosterAdd(toBeRemoved[0], (this.state.draftIndex % 12) + 1);

      this.state.draftIndex += 1;
      if (this.state.draftIndex % 24 !== 0) {
        wait();
      }
    }
  }

  startClick() {
    this.setState({start: true});
    if (this.state.dropdownArray[0] == "Regular PPR") {
      this.setState({draftTypeIndex: "regular"});
    } else if (this.state.dropdownArray[0] == "Regular Tight End Premium") {
      this.setState({draftTypeIndex: "TE"});
    } else if (this.state.dropdownArray[0] == "Regular Superflex") {
      this.setState({draftTypeIndex: "SF"});
    } else if (this.state.dropdownArray[0] == "Tight End Premium with Superflex") {
      this.setState({draftTypeIndex: "SFTE"});
    }

    var array = [];
    for (var i = 0; i < this.state.dropdownArray[1]; i++) {
      array.push(i + 1);
    }
    this.setState({numRounds: array})
    if (this.state.dropdownArray[2] === "Random") {
      var num = Math.floor(Math.random() * (12 - 0));
      this.setState({draftPosition: num});
    } else {
      if (parseInt(this.state.dropdownArray[2], 10) !== 12) {
        this.setState({draftPosition: parseInt(this.state.dropdownArray[2], 10)});
      }
    }
    const wait = async () => {
      this.waiting = true;
      await this.sleep(500);
      this.waiting = false;
      computer(this.state.draftIndex, () => this.computerPick(), this.state.draftPosition)
    }
    wait();
    var newSquareArray = Array(array[array.length-1]*12).fill(null)
    this.setState({squareArray: newSquareArray});
  }

  collapseClick() {
    this.setState({collapse: !this.state.collapse})
  }

  restartClick() {
    this.setState({showAlert: true});
  }
  
  confirmRestart() {
    //window.location.reload();
    if (!this.waiting) {
      var rosterDictCopy = {};
      for (var i = 1; i < 13; i++) {
        rosterDictCopy["Team " + i] = [];
      }
      this.setState({playerLst: [], start: false, positionLst: ["All", "QB", "RB", "WR", "TE", "K", "DST"], indexShown: 0, squareArray: [], draftIndex: 0, dropdownArray: [optionDict[0][0], optionDict[1][0], optionDict[2][0]], numRounds: [], draftPosition: 0, computerPlayerLst: [], computerIndex: 0, collapse: false, showAlert: false, draftTypeIndex: "", computerOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rosterDict: rosterDictCopy, showList: true, end: false, showSummary: false});
      this.computerPicking = false;
      this.showInfo = this.showInfo.bind(this)
      this.tabletop()
    }
  }

  undoRestart() {
    this.setState({showAlert: false});
  }

  changeDropdown(dropdownNum, value) {
    var array = this.state.dropdownArray.slice()
    array[dropdownNum] = value;
    this.setState({dropdownArray: array});
  }

  showDraftPicks() {
    this.setState({showList: true})
    this.setState({collapse: false})
  }

  showRosters() {
    this.setState({showList: false})
    this.setState({collapse: false})
  }

  toggleSummary() {
    this.setState({showSummary: !this.state.showSummary});
  }

  render() {
    console.log(this.state.computerPlayerLst);
    if (this.state.showAlert) {
      var blur = "blur(2px)";
    } else {
      var blur = "blur(0px)";
    }
    return (
    <div className="all-div">
      <div className="all" style={{filter: blur}}>
        {this.state.collapse &&
        <CollapsedSidebar 
        show={this.state.start}
        restartClick={() => this.restartClick()}
        collapseClick={() => this.collapseClick()}
        showList={this.state.showList}
        showDraftPicks={() => this.showDraftPicks()}
        showRosters={() => this.showRosters()}/>}
        {!this.state.collapse &&
        <Sidebar 
        computerPlayerLstLen={this.state.computerPlayerLst.length}
        showList={this.state.showList}
        showDraftPicks={() => this.showDraftPicks()}
        showRosters={() => this.showRosters()}
        restartClick={() => this.restartClick()}
        collapseClick={() => this.collapseClick()}
        show={this.state.start}
        playerLst={this.state.playerLst}
        menuClick={i => this.menuClick(i)}
        positionLst={this.state.positionLst}
        indexShown={this.state.indexShown}
        handleClick={i => this.handleClick(i)}
        startClick={() => this.startClick()}
        changeDropdown={(dropdownNum, value) => this.changeDropdown(dropdownNum, value)}
        rosterDict={this.state.rosterDict}/>}
        {!this.state.showSummary && <Board 
        squareArray={this.state.squareArray}
        draftPosition={this.state.draftPosition}
        numRounds={this.state.numRounds}
        start={this.state.start}
        collapse={this.state.collapse}
        end={this.state.end}
        toggleSummary={() => this.toggleSummary()}/>}
        {this.state.showSummary &&
        <Summary 
        draftPosition={this.state.draftPosition}
        numRounds={this.state.numRounds}
        collapse={this.state.collapse}
        rosterDict={this.state.rosterDict}
        toggleSummary={() => this.toggleSummary()}/>}
      </div>
      {this.state.showAlert &&
      <RestartAlert
      confirmRestart={() => this.confirmRestart()}
      undoRestart={() => this.undoRestart()}
      />}
    </div>
    )
  }
}

export default Game;