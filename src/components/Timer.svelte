<script lang="ts">
	export let time: number;
</script>

<div class="timer">
	Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
</div>
