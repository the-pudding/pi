<script>
	let { src, alt, figcaption, className } = $props();
</script>

<figure class="figure-media {className}">
	<img {src} {alt} />

	{#if figcaption}
		<figcaption>
			{@html figcaption}
		</figcaption>
	{/if}
</figure>

<style>
	figure {
		margin: 8rem auto;
	}

	figure.small {
		max-width: 25em;
		margin: 2rem auto;
	}

	figcaption {
		font-size: var(--14px);
		padding: 8px 0;
	}

	img {
		display: block;
		margin: 0;
		width: 100%;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}
</style>
