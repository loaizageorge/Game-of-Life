import React from 'react';
import Critter from 'Critter';
import {Button} from 'react-bootstrap';

class Environment extends React.Component{
  constructor(props){
    super(props);

    this.gridDimensions = {
      width: 20,
      height: 20
    }

    this.neighbors = [
      [-1,-1] , [0,-1] , [1,-1],
      [-1,0]  ,        , [1,0],
      [-1,1]  , [0,1]  , [1,1]
    ];

    this.countdown = "";

    this.makeInitialGrid.bind(this);

    this.renderSquares.bind(this);
    this.renderSquare.bind(this);
    this.createNextGen.bind(this)
    this.createNeighborCells.bind(this);
    this.checkBoundries.bind(this);
    this.checkAliveCells.bind(this);
    this.calculateNextState.bind(this);
    //this.updateState.bind(this);

    this.state = {
      grid: this.makeInitialGrid(this.gridDimensions.width,this.gridDimensions.height),
      generation: 0
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
    this.setState({
      grid:squares

    });
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

  renderSquare(xPos,yPos,alive){
    var coordinates = xPos.toString() + yPos.toString();
    return (<Critter key = {coordinates} coordinates = {coordinates} onClick = {() => this.handleClick(xPos,yPos)} x = {xPos} y ={yPos} alive = {alive} />);
  }

  createNextGen(){
    var grid = this.state.grid;
    var nextGrid = [];
    for (var i = 0; i < this.gridDimensions.width; i++){
      var column = [];
      for(var j = 0; j < this.gridDimensions.height; j++){
        var neighboringCells = this.createNeighborCells(i,j);
        var numOfAliveNeighbors = this.checkAliveCells(neighboringCells);
        var currentCellState = grid[i][j];
        var nextState = this.calculateNextState(currentCellState,numOfAliveNeighbors);
        column.push(nextState);
      }
      nextGrid.push(column);
    }
    var nextGen = this.state.generation;
    nextGen++;
    this.setState({
      grid: nextGrid,
      generation: nextGen
    });
  }

  createNeighborCells(xPos,yPos){
    var neighboringCellsPositions = [
      [-1,-1] , [0,-1] , [1,-1],
      [-1,0]  ,          [1,0],
      [-1,1]  , [0,1]  , [1,1]
    ];
    var neighboringCells = [];
    var currentCell = [xPos,yPos];

    for( var i = 0; i < neighboringCellsPositions.length; i++){
      var neighborXPos = currentCell[0] + neighboringCellsPositions[i][0];
      var neighborYPos = currentCell[1] + neighboringCellsPositions[i][1];
      var isValidCell = this.checkBoundries(neighborXPos,neighborYPos);
      if(isValidCell){
        neighboringCells.push([neighborXPos,neighborYPos]);
      }
    }
    return neighboringCells;
  }

  checkBoundries(xPos,yPos){
    var xBoundary = this.gridDimensions.width;
    var yBoundary = this.gridDimensions.height;

    if( xPos > -1 && xPos < xBoundary && yPos > -1 && yPos < yBoundary){
      return true;
    }
    return false;

  }

  checkAliveCells(neighborCells){
    var aliveCells = [];
    for( var i = 0; i < neighborCells.length; i++){
      var xPos = neighborCells[i][0];
      var yPos = neighborCells[i][1];
      if (this.state.grid[xPos][yPos] ==  1){
        aliveCells.push(neighborCells[i]);
      }
    }
    return aliveCells.length;
  }

  calculateNextState(currentCellState,numOfAliveNeighbors){
    var count = numOfAliveNeighbors;
    // unchanged
    if( (count == 2 || count == 3) && (currentCellState == 1) ){
      return currentCellState;
    }
    // life to dead cell
    else if( count == 3 && currentCellState == 0 ){
      return 1;
    }
    // death to alive cell
    else if( (count < 2 || count > 3) && currentCellState == 1  ){
      return 0;
    }
    return currentCellState;
  }

  resetBoard(){
    var initialGrid = this.makeInitialGrid(this.gridDimensions.width,this.gridDimensions.height);
    this.setState({
      grid: initialGrid,
      generation: 0
    });
  () => {this.resetBoard()}

  }

  start(){
    this.countdown = setInterval(this.createNextGen.bind(this),100);
  }

  stop(){
    clearInterval(this.countdown);

  }


  render(){

    return (
      <div>
        <h2 className = "center">Current Generation: {this.state.generation}</h2>
        <div className = "grid">
          {this.state.grid.map(this.renderSquares.bind(this))}
        </div>
        <div className = "buttons center">
          <button className = "start" onClick = { () => this.start() }>Start</button>
          <button className = "stop" onClick = { () => this.stop() }>Stop</button>
          <button className = "step" onClick = { () => this.createNextGen()}>Step</button>
          <button className = "reset" onClick = { () => this.resetBoard()}>Clear Board</button>
        </div>
      </div>
    );
  }
}

export default Environment;
