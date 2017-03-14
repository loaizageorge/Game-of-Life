import React from 'react';
import Critter from 'Critter';
import {Button} from 'react-bootstrap';

class Environment extends React.Component{
  constructor(props){
    super(props);

    this.gridDimensions = {
      width: 5,
      height: 7
    }

    this.makeInitialGrid.bind(this);

    this.renderSquares.bind(this);
    this.renderSquare.bind(this);
    //this.checkAliveCells.bind(this);
    //this.updateState.bind(this);

    this.state = {
      grid: this.makeInitialGrid(this.gridDimensions.width,this.gridDimensions.height),//this.makeGrid()
    }

  }

  // Make a multidimensional array, where each row of Cells
  // is an array filled with dead cells
  makeInitialGrid(width,height){
    var grid = [];
    for (var x = 0; x < width; x++){
      grid.push(Array(height).fill(0));
    }
    return grid;

  }

  handleClick(row,column){
    let squares = this.state.grid.slice();
    squares[row][column] = squares[row][column] == 1 ? 0 : 1;
    this.setState({grid:squares});
    //console.log(` Column: ${column} Row: ${row} `);
  }

  renderSquares(row,xPos){
    // Iterate throught the grid state, which simply keeps track of if a cell is alive ("1") or dead ("0")
    // and return a div grid passing the active prop to the cell child component
    var grid = [];
    var initialGrid = this.state.grid;
    for( let yPos = 0; yPos < row.length; yPos++){
      if( initialGrid[xPos][yPos] == 0){
        var square = this.renderSquare(xPos,yPos,0);
      }
      else if( initialGrid[xPos][yPos] == 1){
        var square = this.renderSquare(xPos,yPos,1);
      }
      grid.push(square);
    }
    return grid;
  }

  //createNeighborsArr(xPos,yPos){

  //}
  renderSquare(xPos,yPos,alive){
    var coordinates = xPos.toString() + yPos.toString();
    return (<Critter key = {coordinates} coordinates = {coordinates} onClick = {() => this.handleClick(xPos,yPos)} x = {xPos} y ={yPos} alive = {alive} />);
  }

  checkAliveCells(cellArray){
    let aliveCellPositions = []
    cellArray.map(function(column,xPos){
      for(let yPos = 0; yPos < column.length; yPos++){
        if( cellArray[xPos][yPos] == 1){
          aliveCellPositions.push(xPos.toString() + yPos.toString());
        }
      }
    })
    console.log(aliveCellPositions);
  }

  render(){
    return (
      <div>
        <h2>Board</h2>
        <div className = "buttons">
          <Button className = "btn" onClick = { () => this.checkAliveCells(this.state.grid) }>Check alive cells</Button>
        </div>
        <div className = "grid">
          {this.state.grid.map(this.renderSquares.bind(this))}
        </div>
      </div>
    );
  }
}

export default Environment;
