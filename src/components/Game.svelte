<script lang="ts">
	import { onMount } from 'svelte';
	import Maze from './Maze.svelte';
	import Timer from './Timer.svelte';
	import StepCounter from './StepCounter.svelte';
	import Score from './Score.svelte';

	let size = 10;
	let time = 0;
	let steps = 0;
	$: score = 1000 - steps - time;
	let gameCompleted = false;

	const nextMaze = () => {
		// You can define the logic to generate a new maze here
	};

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

<div class="game-container">
	<div class="game-info">
		<Timer {time} />
		<StepCounter {steps} />
		<Score {score} />
	</div>
	<Maze {size} on:squareReached={handleSquareReached} />
</div>

{#if gameCompleted}
	<div class="complete-popup">
		<h2>Complete!</h2>
		<p>Time: {time} seconds</p>
		<p>Steps: {steps}</p>
		<p>Score: {score}</p>
		<button on:click={nextMaze}>Next Maze</button>
	</div>
{/if}

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.game-info {
		display: flex;
		justify-content: space-around;
		width: 100%;
		margin-bottom: 16px;
	}

	.complete-popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		border: 1px solid black;
		padding: 16px;
		text-align: center;
	}
</style>
