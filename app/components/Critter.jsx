import React from 'react';
import $ from 'jquery';


class Critter extends React.Component{
  constructor(props){
    super(props);
    this.update = this.update.bind(this);
  }

  update(){
    this.props.pass();
  }

  render(){
    let color = this.props.alive == 1 ? "blue" : "white";
    let  cssClasses = ` ${color} cell`;
    return (
      <div className = {cssClasses} onClick = {() => this.props.onClick()}>

      </div>
    );
  }
}
export default Critter;
