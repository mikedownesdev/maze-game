<script lang="ts">
	export let isWall: boolean;
	export let isOccupied: boolean;
	export let isFinish: boolean;
	export let number: number | null;
</script>

<div
	class="
        square
        w-4 h-4 border border-gray-500
        {isWall ? 'bg-black' : ''}
        {isOccupied ? 'bg-blue-500' : ''}
		{isFinish? 'bg-red-500' : ''}
    "
>
	{#if number !== null}
		<span class="portal text-xs">{number}</span>
	{/if}
</div>

<style>
	.square {
		width: 32px;
		height: 32px;
		border: 1px solid gray;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.portal {
		font-size: 12px;
		font-weight: bold;
		color: blue;
	}
</style>
