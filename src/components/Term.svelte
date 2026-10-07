<script>
	import { getContext, tick } from "svelte";

	const pi = getContext("pi");

	let { term, spot, offset, count, label } = $props();

	let s = $derived(+spot);
	let o = $derived(+offset);
	let c = $derived(+count);
	let raw = $derived(pi[term].split(""));
	let start = $derived(s - o);
	let digits = $derived(raw.slice(start, start + o * 2 + c * 2));

	// remove the zero at the 5th spot from digits
	let digitsWrong = $derived([
		...digits.slice(0, o - 1),
		...digits.slice(o + c - 1, o + c - 1 + o + 2)
	]);

	let digitsCorrect = $derived(digits.slice(0, o * 2 + 1));
</script>

<div class="c">
	<code role="img" aria-label={label}>
		<span>Correct:</span>
		...{#each digitsCorrect as digit, i}
			{@const correct = i < o - 1}
			{@const cross = i > o - 2 && i < o + c - 1}
			<span class:correct class:cross>{digit}</span>
		{/each}...
	</code>
	<code role="img" aria-label={label}>
		<span>Shanks:&nbsp;</span>
		...{#each digitsWrong as digit, i}
			{@const correct = i < o - 1}
			{@const wrong = i >= o - 1}
			<span class:correct class:wrong>{digit}</span>
		{/each}...
	</code>
</div>

<style>
	.c {
		margin: 4rem auto;
		position: relative;
		overflow: hidden;
	}

	code {
		display: block;
		position: relative;
		font-size: var(--20px);
		line-height: 1;
		white-space: nowrap;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.correct {
		color: var(--color-blue);
	}
	.wrong {
		color: var(--color-red);
	}
	.cross {
		text-decoration: line-through;
	}
</style>
