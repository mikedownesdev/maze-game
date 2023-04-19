<script lang="ts">
	import { onMount } from 'svelte';
	import Maze from './Maze.svelte';
	import Timer from './Timer.svelte';
	import StepCounter from './StepCounter.svelte';
	import Score from './Score.svelte';
	import MazeConfigPanel from './MazeConfigPanel.svelte';
	import { Square as LoadingSpinner } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import { getMaze, updateMaze } from '../../firebase';
	import { generateNewMaze, findSquareByCondition } from '../../lib';
	import { error } from '@sveltejs/kit';

	let mode: 'play' | 'edit' = 'play';
	let time = 0;
	let steps = 0;
	$: score = 1000 - steps - time;
	let maze: MazeData | null = null;
	let mazeLoaded = false;
	let gameCompleted = false;

	const nextMaze = () => {
		// You can define the logic to generate a new maze here
	};

	const saveMaze = (maze: MazeData) => {
		// Convert mazeData to MazeDocument

		var squaresObject: {
			[key: string]: SquareData[];
		} = {};
		for (let rowIndex = 0; rowIndex < maze.squares.length; rowIndex++) {
			squaresObject[rowIndex.toString()] = maze.squares[rowIndex]
		}
		
		const mazeDocument: MazeDocument = {
			...maze,
			squares: squaresObject
		};

		console.log(mazeDocument)

		// Save the maze to firebase
		updateMaze(mazeDocument)
			.then(() => console.log('save successful'))
			.catch(error => console.log('save failed', error));
	};

	

	const initializeMaze = (maze: MazeData) => {
		const startSquare = findSquareByCondition(maze.squares, (square) => square.isStart);
		const finishSquare = findSquareByCondition(maze.squares, (square) => square.isFinish);
		if (startSquare && finishSquare) {
			maze.squares[startSquare.row][startSquare.col].isOccupied = true;
			maze.squares[finishSquare.row][finishSquare.col].isFinish = true;
		} else {
			console.log('No start or finish square found');
		}
	};

	const loadNewMaze = () => {
		maze = generateNewMaze();
		mazeLoaded = true;
		mode = 'edit';
		initializeMaze(maze);
	};

	onMount(() => {
		const mazePromise = getMaze('GjgdlIxwA8lG0rF92Ya8');
		mazePromise.then((mazeDocument) => {
			if (mazeDocument) {
				console.log(mazeDocument)
				maze = { ...mazeDocument, squares: Object.values(mazeDocument.squares) };
				maze.squares.forEach(row => {
					row.forEach(square => {
						if (square.portalNumber) {
							square.isPortal = true;
						} else {
							square.isPortal = false;
						}
					})
				})
				mazeLoaded = true;
				mode = 'play';

				initializeMaze(maze);
				const timerInterval = setInterval(() => {
					if (!gameCompleted) {
						time++;
					} else {
						clearInterval(timerInterval);
					}
				}, 1000);
			}
		});
	});

	const handleStepTaken = (event: CustomEvent) => {
		steps = steps + 1;
		const squareData = event.detail;
		if (squareData.isFinish) {
			gameCompleted = true;
		}
	};
</script>

<button on:click={() => loadNewMaze()}>New maze</button>

<div id="game-container" class="mt-8">
	<div
		class="game-info
		flex justify-evenly w-full mb-8 items-
	"
	>
		<Timer {time} />
		<StepCounter {steps} />
		<Score {score} />
	</div>
	<div>
		{#if maze && mazeLoaded}
			<Maze bind:squares={maze.squares} {mode} on:stepTaken={handleStepTaken} />
		{:else}
			<LoadingSpinner size="60" color="#FFFFFF" unit="px" duration="2s" />
		{/if}
	</div>
	<div>
		<button on:click={() => (mode = mode == 'play' ? 'edit' : 'play')}>{mode}</button>
		{#if mode === 'edit' && maze}
			<MazeConfigPanel mazeData={maze} size={maze.size} />
		{/if}
	</div>
	<button class="bg-slate-500 text-white p-2 rounded-md" on:click={() => {
        if (maze) { saveMaze(maze) }
    }}>Save</button>
	{#if gameCompleted}
		<div transition:fade class="complete-popup shadow-xl fixed rounded-3xl">
			<h2>Complete!</h2>
			<p>Time: {time} seconds</p>
			<p>Steps: {steps}</p>
			<p>Score: {score}</p>
			<button on:click={nextMaze}>Next Maze</button>
		</div>
	{/if}
</div>

<style>
	.complete-popup {
		width: 400px;
		height: 400px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 16px;
		text-align: center;
	}
</style>
