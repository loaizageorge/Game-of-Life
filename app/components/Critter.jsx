import React from 'react';
import $ from 'jquery';


class Critter extends React.Component{

  render(){

    let color = this.props.alive == 1 ? "blue" : "white";
    let boardSize = this.props.boardSize == "small" ? "smaller-cell" : "large-cell";
    let  cssClasses = ` ${color} ${boardSize} `;
    return (
      <div className = {cssClasses} onClick = {() => this.props.onClick()}>

      </div>
    );
  }
}

export default Critter;
