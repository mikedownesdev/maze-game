<script>
	import '../app.css';
</script>

<div class="bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col justify-between h-screen">
	<nav class="flex justify-center p-4">
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

	<footer class="bg-black mt-8 bg-opacity-25">
		<div class="container mx-auto flex justify-center">
			<div class="p-4 w-1/3">
				<div>
					<p>
						Mazer is a simple game where you navigate a series of squares and portals to reach the end
						of a maze
					</p>
					<p>Inspired by crosswords and Tomorrow, Tomorrow, and Tomorrow, and planes</p>
				</div>
				<p class="text-sm text-white">
					
				</p>
			</div>
			<div class="p-4">
				<ul>
					<li><a href="https://mikedownes.dev" class="underline">About</a></li>
					<li><a href="https://mikedownes.dev" class="underline">Donate</a></li>
					<li><a href="https://mikedownes.dev" class="underline">Inquire</a></li>
				</ul>
			</div>
		</div>
	</footer>
</div>
