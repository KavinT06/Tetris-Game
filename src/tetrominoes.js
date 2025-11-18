export const TETROMINOES = {
    I: {
        shape: [
            [[1, 1, 1, 1]],
            [[1], [1], [1], [1]]
        ],
        color: '#00e5ff'
    },
    O: {
        shape: [
            [[1, 1], [1, 1]]
        ],
        color: '#ffe600'
    },
    T: {
        shape: [
            [[1, 1, 1], [0, 1, 0]],
            [[0, 1], [1, 1], [0, 1]],
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0], [1, 1], [1, 0]]
        ],
        color: '#a15dff'
    },
    L: {
        shape: [
            [[1, 1, 1], [1, 0, 0]],
            [[1, 1], [0, 1], [0, 1]],
            [[0, 0, 1], [1, 1, 1]],
            [[1, 0], [1, 0], [1, 1]]
        ],
        color: '#ff9500'
    },
    J: {
        shape: [
            [[1, 1, 1], [0, 0, 1]],
            [[0, 1], [0, 1], [1, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[1, 1], [1, 0], [1, 0]]
        ],
        color: '#0051ff'
    },
    S: {
        shape: [
            [[0, 1, 1], [1, 1, 0]],
            [[1, 0], [1, 1], [0, 1]]
        ],
        color: '#06d6a0'
    },
    Z: {
        shape: [
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1], [1, 1], [1, 0]]
        ],
        color: '#ff4e4e'
    }
};

export const randomTetromino = () => {
    const keys = Object.keys(TETROMINOES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { type: key, ...TETROMINOES[key], rotation: 0 };
};
