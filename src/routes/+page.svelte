<script>
	import Square from "../components/Square.svelte";
	import Maze from "../components/Maze.svelte";
	import Game from "../components/Game.svelte";
</script>


<main>
	<Game />
</main>


<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
