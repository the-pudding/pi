<script>
	import { getContext, tick } from "svelte";

	const pi = getContext("pi");

	const spot = 531;
	const offset = 10;
	const count = 30;
	const label = "";
	let raw = $derived(pi.term248.split(""));
	let digits = $derived(raw.slice(spot - offset, spot - offset + count));
	// remove the zero at the 5th spot from digits
	let digitsWrong = $derived([
		...digits.slice(0, offset - 1),
		...digits.slice(offset)
	]);
	let digitsCorrect = $derived(digits.slice(0, digits.length - 1));
</script>

<div class="c">
	<code role="img" aria-label={label}>
		<span>Correct:</span>
		...{#each digitsCorrect as digit, i}
			{@const correct = i < offset - 1}
			{@const cross = i === offset - 1}
			<span class:correct class:cross>{digit}</span>
		{/each}...
	</code>
	<code role="img" aria-label={label}>
		<span>Shanks:&nbsp;</span>
		...{#each digitsWrong as digit, i}
			{@const correct = i < offset - 1}
			{@const wrong = i >= offset - 1}
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
