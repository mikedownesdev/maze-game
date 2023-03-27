<script lang="ts">
	import { onMount } from 'svelte';
	import Maze from './Maze.svelte';
	import Timer from './Timer.svelte';
	import StepCounter from './StepCounter.svelte';
	import Score from './Score.svelte';
	import { generateTestMaze } from '../lib';

	let size = 10;
	let time = 0;
	let steps = 0;
	$: score = 1000 - steps - time;
	let gameCompleted = false;

	const nextMaze = () => {
		// You can define the logic to generate a new maze here
	};

	const testMaze = generateTestMaze(size);

	onMount(() => {
		const timerInterval = setInterval(() => {
			if (!gameCompleted) {
				time++;
			} else {
				clearInterval(timerInterval);
			}
		}, 1000);
	});

	const handleSquareReached = (event: CustomEvent) => {
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
		flex justify-evenly w-full mb-8
	">
		<Timer {time} />
		<StepCounter {steps} />
		<Score {score} />
	</div>
	<div>
		<Maze {...testMaze} on:squareReached={handleSquareReached} />
	</div>
	{#if gameCompleted}
	<div class="complete-popup shadow-xl fixed rounded-3xl">
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
