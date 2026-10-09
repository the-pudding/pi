<script>
	let { values } = $props();
</script>

<div class="c">
	{#each values as { name, text }}
		<div class="message">
			<strong>{name}</strong>: {text}
		</div>
	{/each}
</div>

<style>
	.c {
		font-family: var(--font-mono);
		background: var(--color-gray-100);
		padding: 1rem;
		margin: 4rem auto;
	}

	.message {
		font-size: 0.75em;
		margin-bottom: 1rem;
		line-height: 1.5;
	}
</style>
