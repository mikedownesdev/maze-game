type SquareData = {
    isWall: boolean;
    isOccupied: boolean;
    isStart: boolean;
    isFinish: boolean;
    portalNumber: number | null;
}

type MazeData = {
    squares: SquareData[][];
    size: number;
}