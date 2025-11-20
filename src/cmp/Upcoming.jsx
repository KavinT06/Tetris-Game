import React from "react";

export default function Upcoming({ nextPiece }) {
    if (!nextPiece) return null;

    const matrix = nextPiece.shape[nextPiece.rotation];
    const rows = matrix.length;
    const cols = matrix[0].length;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 40px)`,
                gridTemplateRows: `repeat(${rows}, 40px)`,
                gap: "6px",
                padding: "5px"
            }}
        >
            {matrix.map((row, r) =>
                row.map((cell, c) => (
                    <div
                        key={r + "-" + c}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            backgroundColor: cell ? "#d76488" : "transparent",
                            boxShadow: cell
                                ? "0px 4px 8px rgba(0,0,0,0.4)"
                                : "none",
                        }}
                    ></div>
                ))
            )}
        </div>
    );
}
