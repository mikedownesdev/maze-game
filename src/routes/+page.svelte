<script>
	import Square from "../components/Square.svelte";
	import Maze from "../components/Maze.svelte";
</script>


<main>
	<Maze size={10} />
</main>


<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
