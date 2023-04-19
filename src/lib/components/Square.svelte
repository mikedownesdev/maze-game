<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let isEditMode: boolean;
	export let isStart: boolean;
	export let isWall: boolean;
	export let isOccupied: boolean;
	export let isFinish: boolean;
	export let isPortal: boolean;
	export let portalNumber: number | null | undefined;
	export let row: number;
	export let col: number;
	export let nextPortalNumber: () => number | null;

	let squareEl: HTMLElement;

	function handleRightClick(event: MouseEvent) {
		if (!isEditMode || isPortal) return;
		console.log('right click')
		// event.preventDefault();
		// dispatch('showContextMenu', { square: { row, col}, coordindates: { x: event.clientX, y: event.clientY } });
	}

	function handleClick(event: MouseEvent) {
		if (!isEditMode) return;

		// copy old state of square
		const previous = { isWall, isPortal, isStart, isFinish, portalNumber };

		// Toggle's isWall status on single click
		if (event.detail === 1) {
			if (isOccupied || isFinish || isStart) return;

			// This removes a portal by changing into a wall
			if (isPortal) {
				isPortal = false;
				portalNumber = null;
			}
			isWall = !isWall;

		// Toggle's portalActions
		} else if (event.detail === 2) {
			isWall = false;
			isPortal = true
			portalNumber = nextPortalNumber();
		}
		
		dispatch('updateSquare',  {
			previous: previous,
			current: { row, col, isWall, isPortal, isStart, isFinish, portalNumber }
		});
	}

</script>

<div
	class="
        square 
		w-12 h-12 border-2 border-gray-200 rounded-sm
		{isPortal ? 'portal' : ''}
        {isWall ? 'bg-black' : ''}
		{isFinish ? 'bg-green-500' : ''}
		{isStart ? 'bg-purple-600' : ''}
    "
	tabindex="-1"
	bind:this={squareEl}
	on:click={handleClick}
	on:keydown={handleClick}
	on:contextmenu={handleRightClick}
>
	<div class="player-indicator absolute">
		<svg
			class="w-12 h-12"
			fill="none"
			opacity={isOccupied ? '1' : '0'}
			stroke="#ddd"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	</div>

	{#if isPortal && portalNumber}
		<div class="bg-purple-600 p-1 rounded-lg">
			<span
				class="
				portal text-xs"
			>
				{portalNumber}
			</span>
		</div>
	{/if}
</div>

<style>
	.square {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.portal {
		font-size: 12px;
		font-weight: bold;
		color: white;
	}

	.portal .player-indicator svg {
		transition-property: opacity;
		transition-duration: 0.7s;
		transition-timing-function: linear;
	}
</style>
