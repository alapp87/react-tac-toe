import React from "react";
import Board from "./Board";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            isXNext: true,
        }
    }

    render() {
        let status;
        let showRestartGame = false;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        if (winner) {
            status = 'Winner is ' + winner;
            showRestartGame = true;
        } else if (this.boardFull(current.squares)) {
            status = 'No winner this round :(';
            showRestartGame = true;
        } else {
            status = "Next player: " + (this.state.isXNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div style={{
                        display: showRestartGame ? 'block' : 'none',
                    }}>
                        <button onClick={() => this.restartGame()}>Restart Game</button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    calculateWinner(squares) {
        if (this.horizontalLineMatch(squares, 'X')
            || this.verticalLineMatch(squares, 'X')
            || this.diagnolMatch(squares, 'X')) {
            return 'X';
        }
        if (this.horizontalLineMatch(squares, 'O')
            || this.verticalLineMatch(squares, 'O')
            || this.diagnolMatch(squares, 'O')) {
            return 'O';
        }

        return false;
    }

    horizontalLineMatch(squares, player) {
        // 0 1 2 || . . . || . . .
        // . . . || 3 4 5 || . . .
        // . . . || . . . || 6 7 8
        for (var i = 0; i < squares.length; i += 3) {
            if (squares[i] === player && squares[i + 1] === player && squares[i + 2] === player) {
                return true;
            }
        }

        return false;
    }

    verticalLineMatch(squares, player) {
        // 0 . . || . 1 . || . . 3
        // 3 . . || . 4 . || . . 5
        // 6 . . || . 7 . || . . 8
        for (var i = 0; i < 3; i++) {
            if (squares[i] === player && squares[i + 3] === player && squares[i + 6] === player) {
                return true;
            }
        }

        return false;
    }

    diagnolMatch(squares, player) {
        // 0 . . || . . 3
        // . 4 . || . 4 .
        // . . 8 || 6 . .
        if (squares[0] === player && squares[4] === player && squares[8] === player) {
            return true;
        } else if (squares[2] === player && squares[4] === player && squares[6] === player) {
            return true;
        }
        return false;
    }

    boardFull(squares) {
        for (var i = 0; i < squares.length; i++) {
            if (!squares[i]) { // if square value is null, more moves can be made
                return false;
            }
        }

        return true;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            isXNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.isXNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares
            }]),
            stepNumber: history.length,
            isXNext: !this.state.isXNext,
        });
    }

    restartGame() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            isXNext: true,
        });
    }

}
