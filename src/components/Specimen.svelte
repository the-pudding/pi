<script>
	import { getContext } from "svelte";
	const pi = getContext("pi");
	let { version } = $props();
	let digits = $derived(`3.${pi[version]}`);
</script>

<code>
	{digits}
</code>

<style>
	code {
		display: block;
		font-size: var(--20px);
		line-height: 1;
	}
</style>
