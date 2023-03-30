<script lang="ts">
	import { onMount } from 'svelte';
	import Maze from './Maze.svelte';
	import Timer from './Timer.svelte';
	import StepCounter from './StepCounter.svelte';
	import Score from './Score.svelte';
	import { Square } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import { getMaze } from '../../firebase';

	let size = 10;
	let time = 0;
	let steps = 0;
	$: score = 1000 - steps - time;
	let maze: MazeData | null = null;
	let mazeLoaded = false;
	let gameCompleted = false;

	const nextMaze = () => {
		// You can define the logic to generate a new maze here
	};

	//Write a function that will find the start square and return it
	const findStartSquare = (maze: MazeData) => {
		for (let r = 0; r < maze.squares.length; r++) {
			let row = maze.squares[r];
			for (let c = 0; c < row.length; c++) {
				if (maze.squares[r][c].isStart) {
					return { row: r, col: c };
				}
			}
		}
	};

	const findFinishSquare = (maze: MazeData) => {
		for (let r = 0; r < maze.squares.length; r++) {
			let row = maze.squares[r];
			for (let c = 0; c < row.length; c++) {
				if (maze.squares[r][c].isFinish) {
					return { row: r, col: c };
				}
			}
		}
	};

	const initializeMaze = (maze: MazeData) => {
		const startSquare = findStartSquare(maze);
		const finishSquare = findFinishSquare(maze);
		if (startSquare && finishSquare) {
			maze.squares[startSquare.row][startSquare.col].isOccupied = true;
			maze.squares[finishSquare.row][finishSquare.col].isFinish = true;
		}
		else {
			console.log("No start or finish square found")
		}
		
	};

	onMount(() => {
		const mazePromise = getMaze("1");
		mazePromise.then((mazeDocument) => {
			if(mazeDocument) {
				maze = {...mazeDocument, squares: Object.values(mazeDocument.squares)}
				mazeLoaded = true;
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
			<Maze {...maze} on:stepTaken={handleStepTaken} />
		{:else}
			<Square size="60" color="#FFFFFF" unit="px" duration="2s" />
		{/if}
	</div>
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
