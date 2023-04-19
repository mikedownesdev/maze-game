type SquareIndices = {
    row: number;
    col: number;
}

type SquareData = {
    isWall: boolean;
    isOccupied: boolean;
    isStart: boolean;
    isFinish: boolean;
    isPortal: boolean;
    portalNumber: number | null;
    row: number;
    col: number;
}

type MazeData = {
    id: string | undefined;
    squares: SquareData[][];
    size: number;
}

type MazeDocument = {
    id: string;
    squares: Object;
    size: number;
}