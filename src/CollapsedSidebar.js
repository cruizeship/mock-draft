import React, { Component } from 'react';

class CollapsedSidebar extends React.Component {
  render() {
    if (this.props.show === true) {
      if (this.props.showList === true) {
        return (
          <div className="collapsed-sidebar-container">
            <i className="fa fa-chevron-circle-right collapsed-collapse-button" aria-hidden="true" onClick={() => this.props.collapseClick()}></i>
            <div className="vertical-center-menu">
              <i className="fa fa-list collapsed-draftPicks-button" onClick={() => this.props.showDraftPicks()} aria-hidden="true" style={{color: "rgb(150, 150, 150)", borderRight: "2px solid rgb(150, 150, 150)", left: "9px"}}></i>
              <i className="fa fa-group collapsed-rosters-button" aria-hidden="true" onClick={() => this.props.showRosters()}></i>
            </div>
            <i className="fa fa-refresh collapsed-restart-button" aria-hidden="true" onClick={() => this.props.restartClick()}></i>
          </div>
        );
      } else {
        return (
          <div className="collapsed-sidebar-container">
            <i className="fa fa-chevron-circle-right collapsed-collapse-button" aria-hidden="true" onClick={() => this.props.collapseClick()}></i>
            <div className="vertical-center-menu">
              <i className="fa fa-list collapsed-draftPicks-button" onClick={() => this.props.showDraftPicks()} aria-hidden="true"></i>
              <i className="fa fa-group collapsed-rosters-button" aria-hidden="true" onClick={() => this.props.showRosters()} style={{color: "rgb(150, 150, 150)", borderRight: "2px solid rgb(150, 150, 150)", left: "9px"}}></i>
            </div>
            <i className="fa fa-refresh collapsed-restart-button" aria-hidden="true" onClick={() => this.props.restartClick()}></i>
          </div>
        );
      }
    } else {
      return (
        <div className="collapsed-sidebar-container">
          <i className="fa fa-chevron-circle-right collapsed-collapse-button" aria-hidden="true" onClick={() => this.props.collapseClick()}></i>
          <div className="vertical-center-menu">
            <i className="fa fa-cog collapsed-settings-button" aria-hidden="true"></i>
          </div>
          <i className="fa fa-refresh collapsed-restart-button" aria-hidden="true" onClick={() => this.props.restartClick()}></i>
        </div>
      );
    }
  }
}

export default CollapsedSidebar;