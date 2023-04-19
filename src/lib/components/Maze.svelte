<script lang="ts">
	import Square from './Square.svelte';
	import { createEventDispatcher } from 'svelte';
	import StepCounter from './StepCounter.svelte';

	const dispatch = createEventDispatcher();

	// Props
	export let squares: SquareData[][];
	export let mode: 'play' | 'edit';

	let currentlyOccupiedSquare = { row: 0, col: 0 };

	const stupidLittleFunction = (squares: SquareData[][]) => {
		const newSet = new Set<number>();
		squares.forEach((row) => {
			row.forEach((square) => {
				if (square.isPortal && square.portalNumber) {
					newSet.add(square.portalNumber);
				}
			});
		});
		return newSet;
	}

	$: activePortalNumbers = stupidLittleFunction(squares);


	// let activePortalNumbers = new Set<number>();
	// squares.forEach((row) => {
	// 	row.forEach((square) => {
	// 		if (square.isPortal && square.portalNumber) {
	// 			activePortalNumbers.add(square.portalNumber);
	// 		}
	// 	});
	// });

	$: portalNumbersSorted = Array.from(activePortalNumbers).sort((a, b) => a - b);
	$: nextPortalNumber = getNextPortalNumber(activePortalNumbers);

	const getNextPortalNumber: (portalNumbers: Set<number>) => number | null = (portalNumbers: Set<number>) => {
		console.log(portalNumbers)
		for (let i = 1; i <= 9; i++) {
			if (!portalNumbers.has(i)) {
				return i;
			}
		}
		return null;
	};

	// let nextPortalNumber = getNextPortalNumber();

	function updateSquare(event: CustomEvent) {
		const { row, col, isWall, isPortal, isStart, isFinish, portalNumber } = event.detail.current;
		const previous = event.detail.previous;
		const square = squares[row][col];

		console.log('isPortal:', isPortal);
		console.log('portalNumber:', portalNumber);

		if (isPortal && portalNumber) {
			console.log('adding', portalNumber);
			activePortalNumbers.add(portalNumber);
			activePortalNumbers = new Set(activePortalNumbers);
		} else if (!isPortal && previous.portalNumber) {
			console.log('removing', square.portalNumber);
			activePortalNumbers.delete(previous.portalNumber);
			activePortalNumbers = new Set(activePortalNumbers);
		}

		// nextPortalNumber = getNextPortalNumber();

		// Clone the `squares` array to trigger a reactivity update
		const updatedSquares = squares.map((rowValues, r) =>
			rowValues.map((square, c) => {
				if (r === row && c === col) {
					return {
						...square,
						isWall,
						isPortal,
						isStart,
						isFinish,
						portalNumber
					};
				}
				return square;
			})
		);

		squares = updatedSquares;
	}

	function updatePlayerPosition({ row, col }: SquareIndices, usePortal: boolean = true) {
		const nextSquare = squares[row][col];

		if (nextSquare.isWall) return;

		// If the player lands on a Portal Square and `usePortal` is true, find the next Portal Square in the sequence
		if (usePortal && nextSquare.portalNumber) {
			let nextPortalNumber = nextSquare.portalNumber + 1;
			let nextPortalFound = false;
			for (let r = 0; r < squares.length && !nextPortalFound; r++) {
				let row = squares[r];
				for (let c = 0; c < row.length && !nextPortalFound; c++) {
					if (squares[r][c].portalNumber === nextPortalNumber) {
						updatePlayerPosition({ row: r, col: c }, false);
						nextPortalFound = true;
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
		if (event.key.includes('Arrow')) {
			event.preventDefault();
		}
		if (mode !== 'play') {
			return;
		}

		var nextSquareIndicies: SquareIndices = { row: 0, col: 0 };

		switch (event.key) {
			case 'ArrowUp':
				if (currentlyOccupiedSquare.row === 0) return;
				nextSquareIndicies = {
					row: currentlyOccupiedSquare.row - 1,
					col: currentlyOccupiedSquare.col
				};
				break;
			case 'ArrowDown':
				// if (currentlyOccupiedSquare.row === size - 1) return;
				nextSquareIndicies = {
					row: currentlyOccupiedSquare.row + 1,
					col: currentlyOccupiedSquare.col
				};
				break;
			case 'ArrowLeft':
				if (currentlyOccupiedSquare.col === 0) return;
				nextSquareIndicies = {
					row: currentlyOccupiedSquare.row,
					col: currentlyOccupiedSquare.col - 1
				};
				break;
			case 'ArrowRight':
				// if (currentlyOccupiedSquare.col === size - 1) return;
				nextSquareIndicies = {
					row: currentlyOccupiedSquare.row,
					col: currentlyOccupiedSquare.col + 1
				};
				break;
			default:
				return;
		}

		if (squares[nextSquareIndicies.row][nextSquareIndicies.col].isWall) return;

		updatePlayerPosition(nextSquareIndicies);
	}
</script>

<div class="portal-info-pane flex justify-center mb-4 gap-2">
	{#each portalNumbersSorted as portalNumber}
		<p class='p-2 rounded-lg bg-purple-500 text-white'>{portalNumber}</p>
	{/each}
</div>
<div class="flex flex-col items-center space-y-0.5">
	{#each squares as rowValues, rowIndex}
		<div class="flex space-x-0.5">
			{#each rowValues as square, colIndex}
				<Square
					{...square}
					row={rowIndex}
					col={colIndex}
					isEditMode={mode === 'edit'}
					isPortal={square.isPortal}
					nextPortalNumber={nextPortalNumber}
					on:updateSquare={updateSquare}
				/>
			{/each}
		</div>
	{/each}
</div>

<!-- Add this below the maze rendering code in Maze.svelte -->
{#if mode === 'edit'}
	{#each Array.from({ length: 9 }, (_, i) => i + 1) as num}
		{#if !activePortalNumbers.has(num)}
			<p class="text-red-600 mt-2">
				Warning: Portal {num} is missing. The maze is currently invalid.
			</p>
		{/if}
	{/each}
{/if}

<svelte:window on:keydown={handleKeyDown} />

<style>
	.context-menu {
		min-width: 10rem;
	}
</style>
