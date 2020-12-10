import React, { Component } from 'react';

const optionDict = [["Regular PPR", "Regular Tight End Premium", "Regular Superflex", "Tight End Premium with Superflex"], ["10", "11", "12", "13", "14", "15", "16"], ["Random", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]];
const dropdownIndex = [[0], [1, 2]];
const dropdownTitles = ["Format", "Number of Rounds", "Draft Position"];
const rosterOptions = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12"];
var rosterIndex = "Team 1";
const positionRanking = {"QB": 1, "RB": 2, "WR": 3, "TE": 4, "K": 5, "DST": 6}

class SettingsMenu extends React.Component {
  render() {
    return (
      <div className="sidebar-menu">
        <i className="fa fa-chevron-circle-left collapse-button" aria-hidden="true" onClick={() => this.props.collapseClick()}></i>
        <div className="horizontal-center-menu">
          <i className="fa fa-cog settings-button" aria-hidden="true" style={{color: "rgb(150, 150, 150)", borderBottom: "2px solid rgb(150, 150, 150)", left: "9px"}}></i>
        </div>
        <i className="fa fa-refresh restart-button" aria-hidden="true" onClick={() => this.props.restartClick()}></i>
      </div>
    );
  }
}

class SidebarMenu extends React.Component {
  render() {
    if (this.props.showList === true) {
      return (
        <div className="sidebar-menu">
          <i className="fa fa-chevron-circle-left collapse-button" aria-hidden="true" onClick={() => this.props.collapseClick()}></i>
          <div className="horizontal-center-menu">
            <i className="fa fa-list draftPicks-button" onClick={() => this.props.showDraftPicks()} aria-hidden="true" style={{color: "rgb(150, 150, 150)", borderBottom: "2px solid rgb(150, 150, 150)", left: "9px"}}></i>
            <i className="fa fa-group rosters-button" aria-hidden="true" onClick={() => this.props.showRosters()}></i>
          </div>
          <i className="fa fa-refresh restart-button" aria-hidden="true" onClick={() => this.props.restartClick()}></i>
        </div>
      );
    } else {
      return (
        <div className="sidebar-menu">
          <i className="fa fa-chevron-circle-left collapse-button" aria-hidden="true" onClick={() => this.props.collapseClick()}></i>
          <div className="horizontal-center-menu">
            <i className="fa fa-list draftPicks-button" onClick={() => this.props.showDraftPicks()} aria-hidden="true"></i>
            <i className="fa fa-group rosters-button" aria-hidden="true" onClick={() => this.props.showRosters()} style={{color: "rgb(150, 150, 150)", borderBottom: "2px solid rgb(150, 150, 150)", left: "9px"}}></i>
          </div>
          <i className="fa fa-refresh restart-button" aria-hidden="true" onClick={() => this.props.restartClick()}></i>
        </div>
      );
    }
  }
}

function RosterItem(props) {
  return (
    <div className="lst-item">
      <div className="player-info-container">
        <p className="player-info-1">{props.player.name}</p>
        <p className="player-info-2">{props.player.pos}</p>
      </div>
    </div>
  );
}

class Rosters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {update: true}
  }
  renderRoster(team, roster) {
    roster.sort((a, b) => {
      return positionRanking[a.pos] - positionRanking[b.pos];
    });
    return (
      <div className="roster-lst" key={team}>
        {roster.map((player) => <RosterItem key={player.name} player={player} />)}
      </div>
    );
  }

  renderRosters() {
    return this.renderRoster(rosterIndex, this.props.rosterDict[rosterIndex]);
  }

  renderDropdownOption(value) {
    return <DropdownOption
    value={value} 
    key={value} />
  }

  createDropdown(lst) {
    let array = [];
    for (let i = 0; i < lst.length; i++) {
      array.push(this.renderDropdownOption(lst[i]));
    }
    return array; 
  }

  changeDropdown(index) {
    rosterIndex = index;
    this.setState({update: true});
  }

  render() {
    return (
      <div>
        <select id="dropdown" defaultValue={rosterIndex} onChange={(e) => this.changeDropdown(e.target.value)}>{this.createDropdown(rosterOptions)}</select>
        {this.renderRosters()}
      </div>
    );
  }
}

function MenuItem(props) {
  return (
    <li className="menu-lst-item">
      <button className="menu-item" key={props.index} onClick={props.onClick} style={{backgroundColor: props.backgroundColor, color: props.color}}>
        {props.pos}
      </button>
    </li>
  )
}

class Menu extends React.Component {
  renderMenuItem(index, pos, color, backgroundColor) {
    return (
      <MenuItem
        index={index}
        pos={pos}
        onClick={() => this.props.onClick(index)}
        color={color}
        backgroundColor={backgroundColor}
        key={index}
      />
    )
  }

  createMenu() {
    let array = [];
    for (let i = 0; i < this.props.positionLst.length; i++) {
      let backgroundColor = "";
      let color = "";
      if (i === this.props.indexShown) {
        backgroundColor = "blue";
        color = "white"
      }
      array.push(this.renderMenuItem(i, this.props.positionLst[i], color, backgroundColor));
    }
    return array; 
  }

  render() {
    return (
      <div className="menu-container">
        <ul className="menu">
          {this.createMenu()}
        </ul>
      </div>
    );
  }
}
/*onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}*/
/*
{props.hoverIndex === props.index &&
<button className="draft-button" onClick={props.onClick}>
  {"Draft"}
</button>}
*/
function LstItem(props) {
  return (
    <li className="lst-item-li">
      <div className="lst-item" key={props.name}>
        <div className="player-info-container">
          <p className="player-info-1">{props.name}</p>
          <p className="player-info-2">{props.pos}</p>
        </div>
        <button className="draft-button" onClick={props.onClick}>
          {"Draft"}
        </button>
      </div>
    </li>
  );
}

class PlayerLst extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hoverIndex: -1}
  }
  /*
  mouseEnter(index) {
    this.setState({hoverIndex: index})
  }

  mouseLeave(index) {
    this.setState({hoverIndex: -1})
  }
  */

  /*onMouseEnter={() => this.mouseEnter(index)}
  onMouseLeave={() => this.mouseLeave(index)}*/
  renderLstItem(name, centralRanking, index, pos) {
    return (
      <LstItem
      name={name}
      centralRanking={centralRanking}
      key={name}
      index={index}
      onClick={() => this.props.onClick(index)}
      hoverIndex={this.state.hoverIndex}
      pos={pos}
      />
    )
  }

  renderLst() {
    let array = [];
    for (let i = 0; i < this.props.playerLst.length; i++) {
      if (this.props.playerLst[i].pos === this.props.positionLst[this.props.indexShown]) {
        array.push(this.renderLstItem(this.props.playerLst[i].name, this.props.playerLst[i].centralRanking, i, this.props.playerLst[i].pos));
      } else if (this.props.positionLst[this.props.indexShown] === "All") {
        array.push(this.renderLstItem(this.props.playerLst[i].name, this.props.playerLst[i].centralRanking, i, this.props.playerLst[i].pos));
      }
    }
    return array; 
  }

  render() {
    return (
      <div className="player-lst">
        {this.renderLst()}
      </div>
    )
  }
}

function StartButton(props) {
  return (
    <button className="start-button" onClick={props.onClick}>
      {"Start Draft"}
    </button>
  )
}

function DropdownOption(props) {
  return (
    <option value={props.value}>{props.value}</option>
  )
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderDropdownOption(value) {
    return <DropdownOption
    value={value} 
    key={value} />
  }

  createDropdown(lst) {
    let array = [];
    for (let i = 0; i < lst.length; i++) {
      array.push(this.renderDropdownOption(lst[i]));
    }
    return array; 
  }
  
  render() {
    return (
      <div className="settings-container">
        <h4 className="settings-title"><span className="settings-title-span">{"League"}</span></h4>
        {dropdownIndex[0].map(num => <section key={num}><h5 className="dropdown-title" key={num + 5}>{dropdownTitles[num]}
        </h5>
        <select onChange={(e) => this.props.changeDropdown(num, e.target.value)} name="dropdown" key={num} id="dropdown">
          {this.createDropdown(optionDict[num])}
        </select></section>)}

        <h4 className="settings-title"><span className="settings-title-span">{"Draft"}</span></h4>
        {dropdownIndex[1].map(num => <section key={num}><h5 className="dropdown-title" key={num + 5}>{dropdownTitles[num]}
        </h5>
        <select onChange={(e) => this.props.changeDropdown(num, e.target.value)} name="dropdown" key={num} id="dropdown">
          {this.createDropdown(optionDict[num])}
        </select></section>)}
        <h4 className="settings-title"><span className="settings-title-span">{"Built-in Settings"}</span></h4>
        <ul>
          <li className="built-in-list"> &nbsp; Dynasty League</li>
          <li className="built-in-list"> &nbsp; Standard PPR</li>
          <li className="built-in-list"> &nbsp; 12 Player Draft</li>
          <li className="built-in-list"> &nbsp; Snake Draft</li>
        </ul>
        <p className="info-text">Visit <a href="https://google.com" target="blank">link</a> for more information</p>
        <StartButton
        onClick={this.props.onClick}/>
      </div>
    )
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="sidebar-container">
        {this.props.show && <SidebarMenu 
        showList={this.props.showList}
        showDraftPicks={() => this.props.showDraftPicks()}
        showRosters={() => this.props.showRosters()}
        restartClick={() => this.props.restartClick()}
        collapseClick={() => this.props.collapseClick()}/>}
        {this.props.show && !this.props.showList && <h3 className="sidebar-title">{"Team Rosters"}</h3>}
        {this.props.show && !this.props.showList && <Rosters 
        rosterDict={this.props.rosterDict}/>}
        {this.props.show && this.props.showList && <h3 className="sidebar-title">{"Draft Picks"}</h3>}
        {this.props.show && this.props.showList && <Menu 
        onClick={i => this.props.menuClick(i)}
        positionLst={this.props.positionLst}
        indexShown={this.props.indexShown}/>}
        {this.props.show && this.props.showList && this.props.computerPlayerLstLen === 0 &&
        <p>Hi</p>}
        {this.props.computerPlayerLstLen > 0 && this.props.show && this.props.showList && <PlayerLst 
        playerLst={this.props.playerLst}
        positionLst={this.props.positionLst}
        indexShown={this.props.indexShown}
        onClick={i => this.props.handleClick(i)}/>}
        {!this.props.show && <SettingsMenu 
        restartClick={() => this.props.restartClick()}
        collapseClick={() => this.props.collapseClick()}/>}
        {!this.props.show && <h3 className="sidebar-title">{"Draft Settings"}</h3>}
        {!this.props.show && <Settings
        onClick={this.props.startClick}
        changeDropdown={(dropdownNum, value) => this.props.changeDropdown(dropdownNum, value)}/>}
      </div>
    ); 
  }
}

export default Sidebar;