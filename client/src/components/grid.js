import React from "react";

import Cell from "./cell";

const DEFAULT_GRID_SIZE = 3
const DEFAULT_TURN = 'HUMAN' 

const initGrid = (size) => {
  const grid = [];
  const gridSize = size || DEFAULT_GRID_SIZE;

  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push("");
    }
    grid.push(row);
  }
  return grid;
};

export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isGameOver: false,
      startTurn: DEFAULT_TURN,
      turn: DEFAULT_TURN,
      gridSize: DEFAULT_GRID_SIZE,
      lastMove: null,
      turnCount: 1,
      message: "",
      grid: initGrid(),
    };
  }

  componentDidMount() {
    const { turn } = this.state;

    if (turn === "COMPUTER") {
      this.calculateComputerMove();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { turn, isGameOver } = this.state;

    if (!isGameOver && turn === "COMPUTER") {
      this.calculateComputerMove();
    }
  }

  calculateComputerMove = async () => {
    const { grid, turnCount } = this.state;
    await new Promise((resolve, reject) => {
      findNextComputerMove(grid, turnCount);
      // let the other threads finish
      setTimeout(resolve, 0);
    });

    this.fillCell(nextMove, "COMPUTER");
  };

  fillCell = async (cell, player) => {
    const { grid, turnCount } = this.state;
    const [row, column] = cell;

    const gridCopy = [...grid]; // we do this so we don't mutate state itself!

    gridCopy[row][column] = player;

    const turn = player === "HUMAN" ? "COMPUTER" : "HUMAN";

    await new Promise((resolve, reject) => {
      checkGameState(grid, cell, turnCount, player);
      // let the other threads finish
      setTimeout(resolve, 0);
    });

    switch (gameState) {
      case 1:
        this.endGame('Computer has won. Press reset to play again!', gridCopy)
        return
      case 2:
        this.endGame(
          "Congrats Hackerman. Press reset to play again!",
          gridCopy
        );
        return;
      case 3:
        this.endGame("Nobody won. Press reset to play again!", gridCopy);
        return;
    }

    this.setState({
      turn,
      grid: gridCopy,
      turnCount: turnCount + 1,
      lastMove: cell,
    });
  };

  endGame = (message, grid) => {
    this.setState({
      grid,
      message,
      isGameOver: true,
    });
  };

  resetGame = (turn) => {
    this.setState(
      (prevState, _) => ({
        message: "Restarting Game..",
        isGameOver: false,
        startTurn: turn || prevState.startTurn,
        turn: turn || prevState.startTurn || DEFAULT_TURN,
        gridSize: DEFAULT_GRID_SIZE,
        lastMove: null,
        turnCount: 1,
        grid: initGrid(),
      }),
      () => this.setState({ message: "" })
    );
  };

  render() {
    const { grid, gridSize, turn, isGameOver, message } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <h1 style={{textAlign: 'center', marginBottom: '5px'}}>Chris's Tic Tac Toe</h1>
        <h2 style={{textAlign: 'center', marginTop: '5px'}}>{message ? message : (!isGameOver && turn === 'COMPUTER') ? 'Computer is thinking 🤔' : ' '}</h2>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <select onChange={(e) => this.resetGame(e.target.value)} style={{ flex: 1, marginRight: '3px'}}>
            <option value='HUMAN'>Human</option>
            <option value='COMPUTER'>Computer</option>
          </select>
          <button style={{ flex: 1 }} onClick={(e) => this.resetGame()}>
            Reset
          </button>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          {grid.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: `${gridSize * 100 + gridSize - 1}px`,
                borderBottom:
                  rowIndex < gridSize - 1 ? "1px solid red" : "none",
              }}
            >
              {row.map((fill, columnIndex) => (
                <Cell
                  key={`col-${columnIndex}`}
                  isGameOver={isGameOver}
                  turn={turn}
                  fill={fill} // This determines if this cell is empty or not!
                  cell={[rowIndex, columnIndex]}
                  gridSize={gridSize}
                  fillCell={this.fillCell}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
