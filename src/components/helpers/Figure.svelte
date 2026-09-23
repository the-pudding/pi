<script>
	let { src, alt, figcaption } = $props();
</script>

<figure class="figure-media">
	<img {src} {alt} />

	{#if figcaption}
		<figcaption>
			{@html figcaption}
		</figcaption>
	{/if}
</figure>

<style>
	figure {
		/* position: sticky;
		top: 0;
		z-index: -1; */
		background: var(--color-bg);
	}

	figcaption {
		font-size: var(--14px);
		padding: 8px 0;
		/* text-align: center; */
	}

	img {
		display: block;
		margin: 0;
		width: 100%;
	}
</style>
