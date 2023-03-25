<script lang="ts">
	import Square from './Square.svelte';

	const SIZE = 8;

    const generateMaze = (size: number) => {
        const maze = Array.from(Array(size), () =>
            Array.from(Array(size), () => ({
                isSpace: false,
                isWall: true,
                isOccupied: false,
                isStart: false,
                isFinish: false,
                portalNumber: null,
            }))
        );

        maze[0][0].isStart = true;
        maze[0][0].isOccupied = true;
        maze[size - 1][size - 1].isFinish = true;

        return maze;
    }

    const maze = generateMaze(SIZE);
    let currentOccupiedSquare = { row: 0, col: 0 };

    function updatePlayerPosition(row: number, col: number) {
        maze[currentOccupiedSquare.row][currentOccupiedSquare.col].isOccupied = false;
        maze[row][col].isOccupied = true;
        currentOccupiedSquare = { row, col };
    }

	// Handle keyboard input to move the player
	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
                if (currentOccupiedSquare.row === 0) return;
				updatePlayerPosition(currentOccupiedSquare.row - 1, currentOccupiedSquare.col);
				break;
			case 'ArrowDown':
                if (currentOccupiedSquare.row === SIZE - 1) return;
				updatePlayerPosition(currentOccupiedSquare.row + 1, currentOccupiedSquare.col);
				break;
			case 'ArrowLeft':
                if (currentOccupiedSquare.col === 0) return;
				updatePlayerPosition(currentOccupiedSquare.row, currentOccupiedSquare.col - 1);
				break;
			case 'ArrowRight':
                if (currentOccupiedSquare.col === SIZE - 1) return;
				updatePlayerPosition(currentOccupiedSquare.row, currentOccupiedSquare.col + 1);
				break;
		}
	}
</script>

<div class="flex flex-col items-center space-y-1">
	{#each maze as rowValues, rowIndex}
		<div class="flex space-x-1">
			{#each rowValues as squareValue, colIndex}
				<Square
					isOccupied={squareValue.isOccupied}
                    isWall={squareValue.isWall}
					number={squareValue.portalNumber}
				/>
			{/each}
		</div>
	{/each}
</div>

<svelte:window on:keydown={handleKeyDown} />
