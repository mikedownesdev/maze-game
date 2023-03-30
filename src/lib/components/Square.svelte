<script lang="ts">
	export let isWall: boolean;
	export let isOccupied: boolean;
	export let isFinish: boolean;
	export let isPortal: boolean;
	export let number: number | null | undefined;
</script>

<div
	class="
        square {isPortal ? 'portal' : ''}
        w-12 h-12 border-2 border-gray-200
		rounded-sm
        {isWall ? 'bg-black' : ''}
		{isFinish? 'bg-green-500' : ''}
    "
>
	<div class="player-indicator absolute">
		<svg
			class="w-20 h-20"
			fill="none"
			opacity="{isOccupied? '1' : '0'}"
			stroke="#ddd"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			></path>
		</svg>
	</div>

	{#if number}
		<div class="bg-purple-600 p-1 rounded-lg">
			<span class="
				portal text-xs"
			>
				{number}
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
		transition-duration: .5s;
		transition-timing-function: linear;
	}
</style>
