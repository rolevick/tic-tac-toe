import React, {useState} from "react";
import {Board} from "./Board";

// Крестики, они же Игрок1
const PLAYER1 = "X";

// Нолики, они же Игрок2
const PLAYER2 = "O";

// Наш специальный тип данных, может принимать три значения "X", "O" или null
export type SquareValue = (typeof PLAYER1 | typeof PLAYER2 | null);

/**
 * Тип состояния игры
 */
interface GameState {
    /**
     * Массив с игровым полем (0 - 2 первая строка, 3 - 5 вторая строка, 6 - 8 третья строка)
     */
    squares: SquareValue[];

    /**
     * true -- следующим ходит игрок с "крестиками", false -- с "ноликами"
     */
    xIsNext: boolean;
}

/**
 * Компонента "игра".
 * @constructor
 */
export function Game() {
    // получаем состояние игры и функцию для его изменения
    const [state, changeState] = useState<GameState>({
        squares: Array(9).fill(null) as Array<SquareValue>,
        xIsNext: true
    });

    /**
     * Вычислить победителя, если он есть.
     * @param squares Массив игрового поле
     * @return результат игры. PERSON1 -- победили крестики, PERSON2 -- победили нолики
     * или null -- пока нет победителя (или уже не будет, если это ничья).
     */
    function calculateWinner(squares: SquareValue[]): SquareValue {
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for(let i=0; i<lines.length; i++){
            const [a,b,c] = lines[i];
            if(squares[a] && squares[a]===squares[b] && squares[b]===squares[c]){
                return squares[a];
            }
        }
        return null;
    }

    /**
     * Вычисляет ничья в игре или нет.
     * @param squares Массив игрового поля.
     * @return true если ничья, false если не ничья.
     */
    function isTie(squares: SquareValue[]): boolean {
        const calculateWin = calculateWinner(squares);
        if (calculateWin === null && !squares.filter((square) => !square).length){
            return true;
        }
        return false;
    }

    /**
     * Обработчик нажатия на кнопку.
     * @param idx Индекс ячейки игрового поля, на которую нажали.
     */
    function handleClick(idx: number) {
        const squares = state.squares;

        if (calculateWinner(squares) || squares[idx] != null) {
            // если есть победитель или на эту ячейку уже нажимали не делаем ничего
            return;
        }

        // Заполняем массив. Если сейчас ходят крестики, то кладём крестик и наоборот.
        squares[idx] = state.xIsNext ? PLAYER1 : PLAYER2;

        // Меняем состояние игры.
        changeState({
            squares: squares,
            xIsNext: !state.xIsNext
        });
    }

    const squares = state.squares;

    // Посмотрим есть ли победитель.
    const winner = calculateWinner(squares);

    let status;

    if (winner != null) {
        // Победитель есть, "положим" его в статус игры
        status = "Winner: " + winner;
    } else {
        if (isTie(squares)) {
            // Ничья
            status = "It's a tie!";
        } else {
            // Выведем кто ходит следующим
            status = "Next player: " + (state.xIsNext ? PLAYER1 : PLAYER2);
        }
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={squares}
                    onClick={i => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
            </div>
        </div>
    );
}



