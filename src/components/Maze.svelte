<script lang="ts">
	import Square from './Square.svelte';

    // Maze size
    export let size: number;

    const generateMaze = (size: number) => {
        const maze = Array.from(Array(size), () =>
            Array.from(Array(size), () => ({
                isSpace: true,
                isWall: false,
                isOccupied: false,
                isStart: false,
                isFinish: false,
                portalNumber: null,
            }))
        );

        maze[0][0].isStart = true;
        maze[0][0].isOccupied = true;
        maze[size - 1][size - 1].isFinish = true;

        const addRandomWalls = (numberOfWalls: number) => {
            for (let i = 0; i < numberOfWalls; i++) {
                const randomRow = Math.floor(Math.random() * size);
                const randomCol = Math.floor(Math.random() * size);

                maze[randomRow][randomCol].isWall = true;
            }
        }

        addRandomWalls(30)

        return maze;
    }

    const maze = generateMaze(size);
    let currentOccupiedSquare = { row: 0, col: 0 };

    function updatePlayerPosition({row, col}: { row: number, col: number }) {
        maze[currentOccupiedSquare.row][currentOccupiedSquare.col].isOccupied = false;
        maze[row][col].isOccupied = true;
        currentOccupiedSquare = { row, col };
    }

	// Handle keyboard input to move the player
	function handleKeyDown(event: KeyboardEvent) {
        var nextSquareIndicies: {
            row: number
            col: number
        } = { row: 0, col: 0}

		switch (event.key) {
			case 'ArrowUp':
                if (currentOccupiedSquare.row === 0) return;
                nextSquareIndicies = { row: currentOccupiedSquare.row - 1, col: currentOccupiedSquare.col }
				break;
			case 'ArrowDown':
                if (currentOccupiedSquare.row === size - 1) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row + 1, col: currentOccupiedSquare.col}
				break;
			case 'ArrowLeft':
                if (currentOccupiedSquare.col === 0) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row, col: currentOccupiedSquare.col - 1}
				break;
			case 'ArrowRight':
                if (currentOccupiedSquare.col === size - 1) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row, col: currentOccupiedSquare.col + 1}
				break;
		}

        if (maze[nextSquareIndicies.row][nextSquareIndicies.col].isWall) return;

        updatePlayerPosition(nextSquareIndicies)
	}
</script>

<div class="flex flex-col items-center space-y-1">
	{#each maze as rowValues}
		<div class="flex space-x-1">
			{#each rowValues as squareData}
				<Square
					isOccupied={squareData.isOccupied}
                    isWall={squareData.isWall}
					number={squareData.portalNumber}
				/>
			{/each}
		</div>
	{/each}
</div>

<svelte:window on:keydown={handleKeyDown} />
