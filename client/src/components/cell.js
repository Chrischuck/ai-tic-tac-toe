import React from "react";

export default class Cell extends React.Component {
  renderIcon() {
    const { fill } = this.props;
    if (!fill) {
      return null;
    }

    if (fill === 'HUMAN') {
      return (
        // Thanks w3schools! https://www.w3schools.com/graphics/svg_line.asp
        <svg height="50" width="50">
          <line
            x1="0"
            y1="0"
            x2="50"
            y2="50"
            style={{ stroke: "black", strokeWidth: 3 }}
          />
          <line
            x1="0"
            y1="50"
            x2="50"
            y2="0"
            style={{ stroke: "black", strokeWidth: 3 }}
          />
        </svg>
      );
    }

    if (fill === "COMPUTER") {
      return (
        // Thanks again w3schools! https://www.w3schools.com/graphics/svg_circle.asp
        <svg height="100" width="100">
          <circle
            cx="50"
            cy="50"
            r="40"
            style={{ stroke: "black", strokeWidth: 3, fill: "white" }}
          />
        </svg>
      );
    }
  }

  clickCell = () => {
    const { cell, fillCell, fill, turn, isGameOver } = this.props
    if (fill || turn !== 'HUMAN' || isGameOver) {
      return
    }
    fillCell(cell, 'HUMAN')
  }

  render() {
    const { cell, gridSize, fill, isGameOver } = this.props;
    const [row, column] = cell;

    return (
      <div
        onClick={this.clickCell}
        style={{
          width: "100px",
          height: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRight: column < gridSize - 1 ? "1px solid red" : "none",
          cursor: !fill && !isGameOver ? "pointer" : "default",
        }}
      >
        {this.renderIcon()}
      </div>
    );
  }
}
