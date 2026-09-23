<script>
	let { text, note } = $props();
</script>

<div class="warning">
	<span><strong>Warning:</strong> {@html text}</span>
	<span class="note"><small>*<em>{@html note}</em></small></span>
</div>

<style>
	.warning {
		/* background-color: var(--color-fg);
		color: var(--color-bg);
		padding: 1rem;
		margin: 1rem 0; */
	}

	span {
		display: block;
		/* font-size: var(--20px); */
	}
</style>
