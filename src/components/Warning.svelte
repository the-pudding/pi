<script>
	let { text, note } = $props();
</script>

<div class="warning">
	<mark>
		<span><strong>Warning:</strong> {@html text}</span>
		<span class="note"><small>*<em>{@html note}</em></small></span>
	</mark>
</div>

<style>
	.warning {
		/* font-size: var(--20px); */
		/* max-width: 35em; */
		margin-bottom: 8rem;
	}

	mark {
		display: block;
		padding: 1rem;
	}

	span {
		display: block;
		/* font-size: var(--20px); */
	}
</style>
