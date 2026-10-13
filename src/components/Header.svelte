<script>
	// shadow, plain, line, bubble
	import wordmark from "$svg/wordmark-script-stacked-sticker.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>
</header>

<style>
	.wordmark {
		max-width: 10em;
		margin: 2rem auto 0 auto;
		padding: 2rem 0;
		/* transform: rotate(-4deg); */
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}
</style>
