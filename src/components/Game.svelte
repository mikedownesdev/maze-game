<script lang="ts">
	import { onMount } from 'svelte';
	import Maze from './Maze.svelte';
	import Timer from './Timer.svelte';
	import StepCounter from './StepCounter.svelte';
	import Score from './Score.svelte';
	import { generateTestMaze } from '../lib';
	import { Square } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';

	let size = 10;
	let time = 0;
	let steps = 0;
	$: score = 1000 - steps - time;
	let mazeLoaded = false;
	let gameCompleted = false;

	const nextMaze = () => {
		// You can define the logic to generate a new maze here
	};

	

	const testMaze = generateTestMaze(size);

	const getMaze = async () => {
		return await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	onMount(() => {
		const res = getMaze();
		res.then(() => {
			mazeLoaded = true;
			const timerInterval = setInterval(() => {
			if (!gameCompleted) {
				time++;
			} else {
				clearInterval(timerInterval);
			}
		}, 1000);
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
	">
		<Timer {time} />
		<StepCounter {steps} />
		<Score {score} />
	</div>
	<div>
		{#if mazeLoaded}
		<Maze {...testMaze} on:stepTaken={handleStepTaken} />
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
