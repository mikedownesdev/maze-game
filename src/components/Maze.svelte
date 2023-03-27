<script lang="ts">
	import Square from './Square.svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

	// Maze size
	export let size: number;

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

	const generateTestMaze = (size: number): SquareData[][] => {
		const maze = Array.from(Array(size), () => createMazeRow(size));

		// Portal Squares
		maze[2][2].portalNumber = 1;
		maze[2][6].portalNumber = 2;
		maze[5][5].portalNumber = 3;
		maze[6][2].portalNumber = 4;
		maze[8][6].portalNumber = 5;

		// Starting and Finishing Squares
		maze[0][0].isStart = true;
		maze[0][0].isOccupied = true;
		maze[size - 1][size - 1].isFinish = true;

		// Walls
		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				if (
					maze[row][col].portalNumber ||
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
					maze[row][col].isWall = true;
				}

				// Horizontal walls
				if (
					(row === 3 && col !== 0 && col !== 4 && col !== 7) ||
					(row === 7 && col !== 0 && col !== 4 && col !== 7)
				) {
					maze[row][col].isWall = true;
				}
			}
		}

        // Additional wall to prevent skipping Portal Square 1
        maze[1][4].isWall = true;

		return maze;
	};

	const maze = generateTestMaze(size);
	let currentOccupiedSquare = { row: 0, col: 0 };

	function updatePlayerPosition(
		{ row, col }: { row: number; col: number },
		usePortal: boolean = true
	) {
		const nextSquare = maze[row][col];

		if (nextSquare.isWall) return;

		// If the player lands on a Portal Square and `usePortal` is true, find the next Portal Square in the sequence
		if (usePortal && nextSquare.portalNumber !== null) {
			let nextPortalNumber = nextSquare.portalNumber + 1;
			let nextPortalFound = false;

			for (let r = 0; r < size && !nextPortalFound; r++) {
				for (let c = 0; c < size && !nextPortalFound; c++) {
					if (maze[r][c].portalNumber === nextPortalNumber) {
						updatePlayerPosition({ row: r, col: c }, false);
						nextPortalFound = true;
					}
				}
			}

			return;
		}

		maze[currentOccupiedSquare.row][currentOccupiedSquare.col].isOccupied = false;
		maze[row][col].isOccupied = true;
		currentOccupiedSquare = { row, col };
        
        dispatch('squareReached', maze[row][col]);
	}

	// Handle keyboard input to move the player
	function handleKeyDown(event: KeyboardEvent) {
		var nextSquareIndicies: {
			row: number;
			col: number;
		} = { row: 0, col: 0 };

		switch (event.key) {
			case 'ArrowUp':
				if (currentOccupiedSquare.row === 0) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row - 1, col: currentOccupiedSquare.col };
				break;
			case 'ArrowDown':
				if (currentOccupiedSquare.row === size - 1) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row + 1, col: currentOccupiedSquare.col };
				break;
			case 'ArrowLeft':
				if (currentOccupiedSquare.col === 0) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row, col: currentOccupiedSquare.col - 1 };
				break;
			case 'ArrowRight':
				if (currentOccupiedSquare.col === size - 1) return;
				nextSquareIndicies = { row: currentOccupiedSquare.row, col: currentOccupiedSquare.col + 1 };
				break;
		}

		if (maze[nextSquareIndicies.row][nextSquareIndicies.col].isWall) return;

		updatePlayerPosition(nextSquareIndicies);
	}
</script>

<div class="flex flex-col items-center space-y-1">
	{#each maze as rowValues}
		<div class="flex space-x-1">
			{#each rowValues as squareData}
				<Square
					isOccupied={squareData.isOccupied}
					isWall={squareData.isWall}
                    isFinish={squareData.isFinish}
					number={squareData.portalNumber}
				/>
			{/each}
		</div>
	{/each}
</div>

<svelte:window on:keydown={handleKeyDown} />
