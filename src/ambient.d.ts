type SquareData = {
    isWall: boolean;
    isOccupied: boolean;
    isStart: boolean;
    isFinish: boolean;
    portalNumber: number | null | undefined;
}

type MazeData = {
    id: string;
    squares: SquareData[][];
    size: number;
}

type MazeDocument = {
    id: string;
    squares: Object;
    size: number;
}