import React from 'react';
import Critter from 'Critter';
import {Button} from 'react-bootstrap';

class Environment extends React.Component{
  constructor(props){
    super(props);
    // Grid is a square, so both width and height are the same.
    this.gridTypes = {
      small: 15,
      large: 20
    };

    this.neighbors = [
      [-1,-1] , [0,-1] , [1,-1],
      [-1,0]  ,        , [1,0],
      [-1,1]  , [0,1]  , [1,1]
    ];
    // Allows for setInterval to be cleared and started from anywhere
    this.countdown = "";

    // Binding
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
      dimensions: this.gridTypes.small,
      generation: 0,
      grid: this.makeInitialGrid(this.gridTypes.small),
      size : "small",
    }

  }

  // Make a multidimensional array, where each row of Cells
  // is an array filled with inactive cells
  makeInitialGrid(dimensions){
    var grid = [];
    for (var x = 0; x < dimensions; x++){
      grid.push(Array(dimensions).fill(0));
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
    // Iterate throught the grid, which simply keeps track of if a cell is
    // inactive/active (0/1). Create another grid filled with Critter components
    // which are styled accordingly.
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
    return (<Critter key = {coordinates} boardSize = {this.state.size} coordinates = {coordinates} onClick = {() => this.handleClick(xPos,yPos)} x = {xPos} y ={yPos} alive = {alive} />);
  }

  createNextGen(){
    var grid = this.state.grid;
    var nextGrid = [];
    // If this stays 0, stop the timer (no more generations)
    var nextGenAliveCells = 0;
    var dimensions = this.state.dimensions;
    // Calculate the next state of each cell by checking it's neighbor cells
    // and applying the game of life rules.
    for (var i = 0; i < dimensions; i++){
      var column = [];
      for(var j = 0; j < dimensions; j++){
        var neighboringCells = this.createNeighborCells(i,j);
        var numOfAliveNeighbors = this.checkAliveCells(neighboringCells);
        var currentCellState = grid[i][j];
        var nextState = this.calculateNextState(currentCellState,numOfAliveNeighbors);
        if( nextState != 0){
          nextGenAliveCells++;
        }
        column.push(nextState);
      }
      nextGrid.push(column);
    }

    if( nextGenAliveCells == 0 ){
      this.resetBoard();
    }
    else{
      var nextGen = this.state.generation;
      nextGen++;
      this.setState({
        grid: nextGrid,
        generation: nextGen
      });
    }
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

  // Doesn't support wrapping around the grid, so out of bounds neighbors are ignored.
  checkBoundries(xPos,yPos){
    var dimensions = this.state.dimensions;
    var xBoundary = dimensions;
    var yBoundary = dimensions;

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

  // Apply the game of life rules
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
    clearInterval(this.countdown);
    var dimensions = this.state.dimensions;
    var initialGrid = this.makeInitialGrid(dimensions);
    this.setState({
      grid: initialGrid,
      generation: 0
    });
  }

  start(){
    this.countdown = setInterval(this.createNextGen.bind(this),100);
  }

  stop(){
    clearInterval(this.countdown);

  }

  randomlyFillBoard(){
    var randomGrid = [];
    var dimensions = this.state.dimensions;

    for (var x = 0; x < dimensions; x++){
      var row = [];
      for ( var y = 0; y < dimensions; y++){
        row.push(Math.round(Math.random()));
      }
      randomGrid.push(row);
    }
    this.setState({
      grid: randomGrid
    });
  }
  render(){
    var boardClass = this.state.size == "small" ? "smaller-grid" : "large-grid";
    return (
      <div>
        <h2 className = "center">Current Generation: {this.state.generation}</h2>
        <div className = {boardClass} >
          {this.state.grid.map(this.renderSquares.bind(this))}
          <div className = "buttons center">

            <p>Controls</p>
            <div className = "btn-group">
              <button type = "button" className = "btn btn-success start" onClick = { () => this.start() }>Start</button>
              <button type = "button" className = "btn btn-primary stop" onClick = { () => this.stop() }>Stop</button>
              <button type = "button" className = "btn step" onClick = { () => this.createNextGen()}>Step</button>
              <button type = "button" className = "btn btn-danger reset" onClick = { () => this.resetBoard()}>Reset Board</button>
            </div>

            <p>Board Size</p>
            <div className = "btn-group">
              <button type = "button" className = "btn smallBtn" onClick = { () => {
                  this.setState({
                    dimensions: this.gridTypes.small,
                    grid: this.makeInitialGrid(this.gridTypes.small),
                    size: "small"
                  });
                }}>Small</button>
              <button type = "button" className = "btn largeBtn" onClick = { () => {
                this.setState({
                  dimensions: this.gridTypes.large,
                  grid: this.makeInitialGrid(this.gridTypes.large),
                  size: "large"
                });
                }}>Large</button>
            </div>

              <p>Patterns</p>
              <div className = "btn-group">
                <button type = "button" className = "btn random" onClick = { () => this.randomlyFillBoard()}>Random</button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Environment;
