<script>
	import '../app.css';
</script>

<div
	class="
	bg-gradient-to-r from-cyan-500 to-blue-500 h-screen"
>
	<nav class="container">
		<h1
			class="
		text-3xl font-bold underline p-2
		text-white
	"
		>
			Mazer
		</h1>
	</nav>

	<slot />

	<footer class="bg-black fixed bottom-0 mt-8 bg-opacity-25 w-full">
		<div class="container mx-auto p-8">
			<div>
				<p>Mazer is a simple game where you navigate a series of squares and portals to reach the end a maze</p>
				<p>Inspired by crosswords and Tomorrow, Tomorrow, and Tomorrow, and planes</p>
			</div>
			<p class="text-sm text-white">
				<a href="https://mikedownes.dev" class="underline">About</a>
			</p>
		</div>
	</footer>
</div>
