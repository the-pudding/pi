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
		margin-bottom: 8rem;
	}

	mark {
		display: block;
		padding: 1rem;
		margin: 0 auto;
		font-size: 0.75em;
		max-width: 20em;
	}

	span {
		display: block;
	}
</style>
