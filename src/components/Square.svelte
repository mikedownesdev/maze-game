<script lang="ts">
	export let isWall: boolean;
	export let isOccupied: boolean;
	export let isFinish: boolean;
	export let number: number | null;
</script>

<div
	class="
        square
        w-12 h-12 border-2 border-gray-200
		rounded-sm
        {isWall ? 'bg-black' : ''}
        {isOccupied ? 'bg-white' : ''}
		{isFinish? 'bg-green-500' : ''}
    "
>
	{#if number !== null}
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
</style>
