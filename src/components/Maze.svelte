<script lang="ts">
	import Square from './Square.svelte';
    import { createEventDispatcher } from 'svelte';
	import { generateTestMaze } from '../lib';
    
    const dispatch = createEventDispatcher();

	// Props
	export let squares: SquareData[][]
	export let size: number;

	let currentOccupiedSquare = { row: 0, col: 0 };

	function updatePlayerPosition(
		{ row, col }: { row: number; col: number },
		usePortal: boolean = true
	) {
		const nextSquare = squares[row][col];

		if (nextSquare.isWall) return;

		// If the player lands on a Portal Square and `usePortal` is true, find the next Portal Square in the sequence
		if (usePortal && nextSquare.portalNumber !== null) {
			let nextPortalNumber = nextSquare.portalNumber + 1;
			let nextPortalFound = false;

			for (let r = 0; r < size && !nextPortalFound; r++) {
				for (let c = 0; c < size && !nextPortalFound; c++) {
					if (squares[r][c].portalNumber === nextPortalNumber) {
						updatePlayerPosition({ row: r, col: c }, false);
						nextPortalFound = true;
					}
				}
			}

			return;
		}

		squares[currentOccupiedSquare.row][currentOccupiedSquare.col].isOccupied = false;
		squares[row][col].isOccupied = true;
		currentOccupiedSquare = { row, col };
        
        dispatch('stepTaken', squares[row][col]);
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

		if (squares[nextSquareIndicies.row][nextSquareIndicies.col].isWall) return;

		updatePlayerPosition(nextSquareIndicies);
	}
</script>

<div class="flex flex-col items-center space-y-0.5">
	{#each squares as rowValues}
		<div class="flex space-x-0.5">
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
