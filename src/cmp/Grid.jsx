import React, { useState, useEffect } from 'react';
import { randomTetromino } from '../tetrominoes';

const ROWS = 18;
const COLS = 10;

export default function Grid({ onScore, onNextPiece }) {
    const [board, setBoard] = useState(
        Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    );
    const [currentPiece, setCurrentPiece] = useState(null);
    const [position, setPosition] = useState({ row: 0, col: 3 });
    const [isGameOver, setIsGameOver] = useState(false);

    const createEmptyBoard = () =>
        Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    // KEYBOARD CONTROLS
    useEffect(() => {
        function handleKeyDown(e) {
            if (isGameOver) return;
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

            if (e.key === " ") {
                e.preventDefault();
                hardDrop();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentPiece, position, board, isGameOver]);

    // INITIAL PIECE
    useEffect(() => {
        const p = randomTetromino();
        const matrix = p.shape[p.rotation];
        const colStart = Math.floor((COLS - matrix[0].length) / 2);
        setCurrentPiece(p);
        setPosition({ row: 0, col: colStart });
    }, []);

    const [score, setScore] = useState(0);

    // COLLISION CHECKER
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

    // CLEAR FILLED ROWS
    const clearRows = newBoard => {
        const fullRows = [];
        for (let r = 0; r < ROWS; r++) {
            if (newBoard[r].every(cell => cell === 1)) fullRows.push(r);
        }

        if (fullRows.length === 0) return { board: newBoard, rows: 0 };

        const updated = newBoard.filter((_, r) => !fullRows.includes(r));
        const empty = Array.from({ length: fullRows.length }, () =>
            Array(COLS).fill(0)
        );

        return { board: [...empty, ...updated], rows: fullRows.length };
    };

    const spawnNextPiece = () => {
        const nextPiece = randomTetromino();

        if (onNextPiece) {
            onNextPiece(nextPiece);
        }

        const matrix = nextPiece.shape[nextPiece.rotation];
        const colStart = Math.floor((COLS - matrix[0].length) / 2);
        const startPos = { row: 0, col: colStart };

        if (checkCollision(nextPiece, startPos, board)) {
            setIsGameOver(true);
            return;
        }

        setCurrentPiece(nextPiece);
        setPosition(startPos);
    };



    const lockPiece = (posOverride) => {
        const posToUse = posOverride || position;

        // Game Over if piece locks at top
        if (posToUse.row <= 0) {
            setIsGameOver(true);
            return;
        }

        // Copy board
        const newBoard = board.map(row => [...row]);
        const matrix = currentPiece.shape[currentPiece.rotation];

        // Lock current piece into board
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const nr = posToUse.row + r;
                    const nc = posToUse.col + c;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                        newBoard[nr][nc] = 1;
                    }
                }
            }
        }

        // Clear full rows
        const { board: clearedBoard, rows } = clearRows(newBoard);
        setBoard(clearedBoard);

        // Update score correctly
        if (rows > 0) {
            setScore(prev => {
                let points = 0;
                if (rows === 1) points = 100;
                if (rows === 2) points = 300;
                if (rows === 3) points = 600;
                if (rows === 4) points = 1000;

                const newScore = prev + points;
                onScore?.(newScore); // send actual score to App.jsx
                return newScore;
            });
        }

        // Spawn next piece
        spawnNextPiece();
    };


    // AUTO FALLING
    useEffect(() => {
        if (!currentPiece || isGameOver) return;

        const interval = setInterval(() => {
            const nextPos = { row: position.row + 1, col: position.col };

            if (checkCollision(currentPiece, nextPos, board)) {
                lockPiece();
                return;
            }

            setPosition(nextPos);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentPiece, position, board, isGameOver]);

    function hardDrop() {
        if (isGameOver) return;
        if (!currentPiece) return;

        let dropRow = position.row;

        while (true) {
            const nextPos = { row: dropRow + 1, col: position.col };
            if (checkCollision(currentPiece, nextPos, board)) break;
            dropRow++;
        }

        setPosition({ row: dropRow, col: position.col });
        lockPiece({ row: dropRow, col: position.col });
    }

    // GHOST PIECE
    const getGhostPosition = () => {
        let ghostRow = position.row;
        while (true) {
            const nextPos = { row: ghostRow + 1, col: position.col };
            if (checkCollision(currentPiece, nextPos, board)) break;
            ghostRow++;
        }
        return { row: ghostRow, col: position.col };
    };

    // RENDER BOARD
    const getRenderedBoard = () => {
        const temp = board.map(row => [...row]);
        if (!currentPiece) return temp;

        const matrix = currentPiece.shape[currentPiece.rotation];
        const ghostPos = getGhostPosition();

        // ghost cells
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const gr = ghostPos.row + r;
                    const gc = ghostPos.col + c;
                    if (temp[gr]?.[gc] === 0) temp[gr][gc] = 3;
                }
            }
        }

        // active piece
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    const br = position.row + r;
                    const bc = position.col + c;
                    temp[br][bc] = 2;
                }
            }
        }

        return temp;
    };

    const renderedBoard = getRenderedBoard();

    // ROTATION
    const rotatePiece = piece => ({
        ...piece,
        rotation: (piece.rotation + 1) % piece.shape.length
    });

    // RESET GAME
    function resetGame() {
        setBoard(createEmptyBoard());
        setScore(0);
        onScore?.(0);
        setIsGameOver(false);

        const p = randomTetromino();
        const matrix = p.shape[p.rotation];
        const colStart = Math.floor((COLS - matrix[0].length) / 2);

        setCurrentPiece(p);
        setPosition({ row: 0, col: colStart });
    }

    return (
        <div style={{ position: 'relative' }}>
            <div className="egrid" aria-hidden={isGameOver}>
                {renderedBoard.map((row, ri) =>
                    row.map((cell, ci) => (
                        <div
                            key={`${ri}-${ci}`}
                            className="ebox"
                            style={{
                                backgroundColor:
                                    cell === 0 ? "#61616c" :
                                        cell === 1 ? "#ff77b0" :
                                            cell === 2 ? "#d76488" :
                                                "rgba(255, 255, 255, 0.3)"
                            }}
                        ></div>
                    ))
                )}
            </div>

            {isGameOver && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: "rgba(0,0,0,0.65)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    gap: 16,
                }}>
                    <h2>Game Over</h2>

                    <button onClick={resetGame} style={{
                        padding: "10px 18px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer"
                    }}>
                        Restart
                    </button>

                    <p>Score: {score}</p>
                </div>
            )}
        </div>
    );
}
