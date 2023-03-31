export const generateTestMaze = (size: number): MazeData => {
    
    const createMazeRow = (rowLength: number): SquareData[] => {
		return Array.from(Array(rowLength), () => {
			return {
				isWall: false,
				isOccupied: false,
				isStart: false,
				isFinish: false,
				portalNumber: null
			};
		});
	};


    const squares = Array.from(Array(size), () => createMazeRow(size));

    // Portal Squares
    squares[2][2].portalNumber = 1;
    squares[2][6].portalNumber = 2;
    squares[5][5].portalNumber = 3;
    squares[6][2].portalNumber = 4;
    squares[8][6].portalNumber = 5;

    // Starting and Finishing Squares
    squares[0][0].isStart = true;
    squares[0][0].isOccupied = true;
    squares[size - 1][size - 1].isFinish = true;

    // Walls
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (
                squares[row][col].portalNumber ||
                (row === 0 && col === 0) ||
                (row === size - 1 && col === size - 1)
            )
                continue;

            // Vertical walls
            if (
                (col === 1 && row !== 1 && row !== 9) ||
                (col === 4 && row !== 1 && row !== 9) ||
                (col === 7 && row !== 0 && row !== 8)
            ) {
                squares[row][col].isWall = true;
            }

            // Horizontal walls
            if (
                (row === 3 && col !== 0 && col !== 4 && col !== 7) ||
                (row === 7 && col !== 0 && col !== 4 && col !== 7)
            ) {
                squares[row][col].isWall = true;
            }
        }
    }

    // Additional wall to prevent skipping Portal Square 1
    squares[1][4].isWall = true;

    return {
        id: "0",
        squares: squares,
        size: size
    }
};

export const generateNewMaze = (): MazeData => {
    const size = 10;

    const createMazeRow = (rowLength: number): SquareData[] => {
		return Array.from(Array(rowLength), () => {
			return {
				isWall: false,
				isOccupied: false,
				isStart: false,
				isFinish: false,
				portalNumber: null
			};
		});
	};

    const squares = Array.from(Array(size), () => createMazeRow(size));
    squares[0][0].isStart = true;
    squares[9][9].isFinish = true;

    return {
        id: "0",
        squares: squares,
        size: size
    }
}

export const findSquareByCondition = (squares: SquareData[][], condition: (square: SquareData) => boolean) => {
    for (const [rowIndex, row] of squares.entries()) {
        const colIndex = row.findIndex(condition);
        if (colIndex !== -1) {
            return { 
                row: rowIndex, 
                col: colIndex ,
                square: squares[rowIndex][colIndex]
            };
        }
    }
};