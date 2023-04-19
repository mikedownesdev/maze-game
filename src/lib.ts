export const createNewMaze = (): MazeData => {
    const size = 10;

    const createMazeRow = (rowIndex: number, rowLength: number): SquareData[] => {
        let row = [];
        for (var i = 0; i < rowLength; i++) {
            row.push({
				isWall: false,
				isOccupied: false,
				isStart: false,
				isFinish: false,
				portalNumber: null,
                isPortal: false,
                row: rowIndex,
                col: i
			});
        }
        return row
	};

    const squares = Array.from(Array(size), (element, index) => createMazeRow(index, size));
    squares[0][0].isStart = true;
    squares[size-1][size-1].isFinish = true;

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