<script>
	import { getContext } from "svelte";
	const pi = getContext("pi");
	let { version } = $props();
	let digits = $derived(`3.${pi[version]}`);
</script>

<div class="c">
	<code>
		{digits}
	</code>
</div>

<style>
	div {
		margin: 4rem auto;
	}

	code {
		display: block;
		font-size: var(--20px);
		line-height: 1;
	}
</style>
