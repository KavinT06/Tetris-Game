import React, { useState, useEffect } from 'react';
import { randomTetromino } from '../tetrominoes';

const ROWS = 18;
const COLS = 10;

export default function Grid({ onScore }) {
    const [board, setBoard] = useState(
        Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    );
    const [currentPiece, setCurrentPiece] = useState(null);
    const [position, setPosition] = useState({ row: 0, col: 3 });

    const createEmptyBoard = () => {
        return Array.from({ length: ROWS }, () =>
            Array(COLS).fill(0)
        );
    };



    useEffect(() => {
        if (!currentPiece) return;
        const interval = setInterval(() => {
            const nextPos = { row: position.row + 1, col: position.col };
            if (checkCollision(currentPiece, nextPos, board)) {
                lockPiece();
                return;
            }
            setPosition(nextPos);
        }, 1000);
        return () => clearInterval(interval);
    }, [currentPiece, position, board]);


    useEffect(() => {
        function handleKeyDown(e) {
            if (!currentPiece) return;

            if (e.key === "ArrowLeft") {
                const nextPos = { row: position.row, col: position.col - 1 };
                if (!checkCollision(currentPiece, nextPos, board)) {
                    setPosition(nextPos);
                }
            }

            if (e.key === "ArrowRight") {
                const nextPos = { row: position.row, col: position.col + 1 };
                if (!checkCollision(currentPiece, nextPos, board)) {
                    setPosition(nextPos);
                }
            }

            if (e.key === "ArrowDown") {
                const nextPos = { row: position.row + 1, col: position.col };
                if (!checkCollision(currentPiece, nextPos, board)) {
                    setPosition(nextPos);
                }
            }

            if (e.key === "ArrowUp") {
                const rotated = rotatePiece(currentPiece);
                const nextPos = { row: position.row, col: position.col };

                if (!checkCollision(rotated, nextPos, board)) {
                    setCurrentPiece(rotated);
                }
            }

            if (e.key === " ") {   // space key
                e.preventDefault();
                hardDrop();
            }

        }

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentPiece, position, board]);




    useEffect(() => {
        const p = randomTetromino();
        const matrix = p.shape[p.rotation];
        const colStart = Math.floor((COLS - matrix[0].length) / 2);
        setCurrentPiece(p);
        setPosition({ row: 0, col: colStart });
    }, []);

    const [score, setScore] = useState(0);

    const checkCollision = (piece, pos, brd) => {
        const matrix = piece.shape[piece.rotation];
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const nr = pos.row + r;
                    const nc = pos.col + c;
                    if (nr >= ROWS || nc < 0 || nc >= COLS) return true;
                    if (brd[nr][nc] === 1) return true;
                }
            }
        }
        return false;
    };

    const lockPiece = () => {
        const newBoard = board.map(row => [...row]);
        const matrix = currentPiece.shape[currentPiece.rotation];

        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const nr = position.row + r;
                    const nc = position.col + c;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                        newBoard[nr][nc] = 1;
                    }
                }
            }
        }

        const { board: clearedBoard, rows } = clearRows(newBoard);

        setBoard(clearedBoard);

        if (rows === 1) onScore(s => s + 100);
        if (rows === 2) onScore(s => s + 300);
        if (rows === 3) onScore(s => s + 600);
        if (rows === 4) onScore(s => s + 1000);

        spawnNextPiece();
    };




    const clearRows = newBoard => {
        const fullRows = [];

        for (let r = 0; r < ROWS; r++) {
            if (newBoard[r].every(cell => cell === 1)) {
                fullRows.push(r);
            }
        }

        if (fullRows.length === 0) return { board: newBoard, rows: 0 };

        const updated = newBoard.filter((_, r) => !fullRows.includes(r));
        const emptyRows = Array.from({ length: fullRows.length }, () =>
            Array(COLS).fill(0)
        );

        return { board: [...emptyRows, ...updated], rows: fullRows.length };
    };



    const spawnNextPiece = () => {
        const p = randomTetromino();
        const matrix = p.shape[p.rotation];
        const colStart = Math.floor((COLS - matrix[0].length) / 2);
        const startPos = { row: 0, col: colStart };

        if (checkCollision(p, startPos, board)) return;
        setCurrentPiece(p);
        setPosition(startPos);
    };


    const getRenderedBoard = () => {
        const temp = board.map(row => [...row]);
        if (!currentPiece) return temp;
        const matrix = currentPiece.shape[currentPiece.rotation];
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const br = position.row + r;
                    const bc = position.col + c;
                    if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) {
                        temp[br][bc] = 2;
                    }
                }
            }
        }
        return temp;
    };

    const renderedBoard = getRenderedBoard();

    function rotateMatrix(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    }

    function rotatePiece(piece) {
        return {
            ...piece,
            rotation: (piece.rotation + 1) % piece.shape.length
        };
    }

    function hardDrop() {
        if (!currentPiece) return;

        let newRow = position.row;

        while (true) {
            const testPos = { row: newRow + 1, col: position.col };

            // test the REAL piece shape
            if (checkCollision(currentPiece, testPos, board)) break;

            newRow++;
        }

        setPosition({ row: newRow, col: position.col });
        lockPiece();
    }

    return (
        <div className="egrid">
            {renderedBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className="ebox"
                        style={{
                            backgroundColor: cell === 0 ? "#61616c" : cell === 1 ? "#ff77b0" : "#d76488"
                        }}
                    ></div>
                ))
            )}

        </div>

    );
}
