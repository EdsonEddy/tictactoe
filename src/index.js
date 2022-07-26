import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  let classStyle;
  switch (props.selected) {
    case 0:
      classStyle = "square";
      break;
    case 1:
      classStyle = "square selected";
      break;
    case 2:
      classStyle = "square selected win";
      break;
  }
  return (
    <button className={classStyle} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let selected = 0;
    if (i === this.props.lastMove) {
      selected = 1;
    }
    if (this.props.cells.includes(i)) {
      selected = 2;
    }
    return (
      <Square
        key={i}
        selected={selected}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardValues = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    const board = boardValues.map((a, i) => {
      return (
        <div className="board-row" key={i}>
          {a.map((b) => {
            return this.renderSquare(b);
          })}
        </div>
      );
    });
    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), lastMove: null }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  getColRow(i, j) {
    if (i != null) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      return `player=${j}, col=${col + 1}, row=${row + 1}`;
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastMove: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  checkGame() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    for (let i = 0; i < squares.length; ++i) {
      if (squares[i] === null) {
        return false;
      }
    }
    return true;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const historyMap = history.filter((step) => {
      return step.lastMove != null;
    });

    const historyMoves = historyMap.map((step, move) => {
      return (
        <li key={move}>
          {this.getColRow(step.lastMove, step.squares[step.lastMove])}
        </li>
      );
    });

    let cells = new Array(3);
    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
      cells = winner.cells;
    } else {
      if (this.checkGame()) {
        status = "Draw!";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            cells={cells}
            lastMove={current.lastMove}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="game-info">
          <div>History</div>
          <ul>{historyMoves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], cells: lines[i] };
    }
  }
  return null;
}
