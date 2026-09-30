<script>
	let { title } = $props();
</script>

<div class="c">
	<div class="image">
		<a
			href="https://pudding.cool"
			aria-label="The Pudding"
			target="_blank"
			rel="noreferrer">The</a
		>
		<img src="assets/images/hero.jpg" alt="Tk" />
	</div>
	<h1>
		<span>The</span> <span>Afterlife</span> <span class="of">of</span>
		<span>Pi</span>
	</h1>
	<span class="byline"
		>By <a
			href="https://pudding.cool/author/russell-samora"
			target="_blank"
			rel="noreferrer">Russell Samora</a
		></span
	>
</div>

<style>
	.c {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 4rem;
	}

	.image {
		position: relative;
	}

	.image a {
		position: absolute;
		bottom: 97%;
		right: 21%;
		font-size: var(--fs-small);
	}

	img {
		height: auto;
		max-height: max(320px, 60svh);
		width: auto;
		max-width: 100%;
	}

	h1 {
		text-align: center;
		line-height: 0.9;
		margin: 2rem auto;
		font-size: clamp(var(--32px), 10vw, var(--160px));
		margin: 1rem auto;
	}

	span.byline {
		margin: 1rem auto;
		font-size: var(--fs-small);
	}
</style>
