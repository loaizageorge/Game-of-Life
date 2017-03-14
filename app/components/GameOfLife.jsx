import React from 'react';
import Environment from 'Environment';

class GameOfLife extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <h1>Game of Life</h1>
        <Environment/>
      </div>
    );
  }
}

export default GameOfLife;
