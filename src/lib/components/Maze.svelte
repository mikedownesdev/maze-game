<script lang="ts">
	import Square from './Square.svelte';
    import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
    
    const dispatch = createEventDispatcher();

	// Props
	export let squares: SquareData[][]

	let currentlyOccupiedSquare = { row: 0, col: 0 };

	function updatePlayerPosition(
		{ row, col }: { row: number; col: number },
		usePortal: boolean = true
	) {
		const nextSquare = squares[row][col];

		if (nextSquare.isWall) return;

		console.log('a')

		// If the player lands on a Portal Square and `usePortal` is true, find the next Portal Square in the sequence
		if (usePortal && nextSquare.portalNumber) {
			let nextPortalNumber = nextSquare.portalNumber + 1;
			let nextPortalFound = false;
			debugger
			for (let r = 0; r < squares.length && !nextPortalFound; r++) {
				let row = squares[r];
				debugger
				for (let c = 0; c < row.length && !nextPortalFound; c++) {
					if (squares[r][c].portalNumber === nextPortalNumber) {
						updatePlayerPosition({ row: r, col: c }, false);
						nextPortalFound = true;
						debugger
					}
				}
			}

			return;
		}

		squares[currentlyOccupiedSquare.row][currentlyOccupiedSquare.col].isOccupied = false;
		squares[row][col].isOccupied = true;
		currentlyOccupiedSquare = { row, col };

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
				if (currentlyOccupiedSquare.row === 0) return;
				nextSquareIndicies = { row: currentlyOccupiedSquare.row - 1, col: currentlyOccupiedSquare.col };
				break;
			case 'ArrowDown':
				// if (currentlyOccupiedSquare.row === size - 1) return;
				nextSquareIndicies = { row: currentlyOccupiedSquare.row + 1, col: currentlyOccupiedSquare.col };
				break;
			case 'ArrowLeft':
				if (currentlyOccupiedSquare.col === 0) return;
				nextSquareIndicies = { row: currentlyOccupiedSquare.row, col: currentlyOccupiedSquare.col - 1 };
				break;
			case 'ArrowRight':
				// if (currentlyOccupiedSquare.col === size - 1) return;
				nextSquareIndicies = { row: currentlyOccupiedSquare.row, col: currentlyOccupiedSquare.col + 1 };
				break;
			default:
				return;
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
					isPortal={squareData.portalNumber !== undefined}
					number={squareData.portalNumber}
				/>
			{/each}
		</div>
	{/each}
</div>

<svelte:window on:keydown={handleKeyDown} />
