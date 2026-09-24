<script>
	let { title } = $props();
</script>

<div class="c">
	<img src="assets/images/hero.jpg" alt="Tk" />
	<h1>
		<span>The</span> <span>Afterlife</span> <span class="of">of</span>
		<span>Pi</span>
	</h1>
</div>

<style>
	.c {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	img {
		max-height: 60svh;
	}

	h1 {
		text-align: center;
		line-height: 1;
		margin: 2rem auto;
		font-size: clamp(var(--32px), 10vw, var(--160px));
	}
</style>
