<script>
	import { getContext, tick } from "svelte";

	const pi = getContext("pi");
	let { version, mode } = $props();
	let digits = $derived(`3.${pi[version]}`.split(""));

	const INCORRECT_THRESHOLD = 527;
	const GRAVITY = 750;

	let targetNode = $state(null);
	let codeEl = $state(null);
	let spans = $state([]);
	let fallen = $state(false);
	let width = $state(0);
	let height = $state(0);

	const WRONG_FROM = INCORRECT_THRESHOLD - 1;

	let label = $derived(
		`Pi to ${digits.length - 2} decimal places, starting ${digits.slice(0, 7).join("")}.` +
			(version === "shanks707"
				? ` Every digit from decimal place ${WRONG_FROM} onward is incorrect.`
				: "")
	);

	const between = (min, max) => min + Math.random() * (max - min);
	const isIncorrect = (i) =>
		version === "shanks707" && i >= INCORRECT_THRESHOLD;

	let spin = $derived(
		digits.map((_, i) =>
			isIncorrect(i)
				? {
						turn: (Math.random() < 0.5 ? -1 : 1) * between(45, 180),
						delay: between(0, 0.5)
					}
				: null
		)
	);

	let dist = $derived.by(() => {
		width;
		height;
		if (!fallen || !codeEl) return [];
		const floor = height - codeEl.offsetTop;
		return digits.map((_, i) => {
			const el = spans[i];
			return isIncorrect(i) && el ? floor - el.offsetTop - el.offsetHeight : 0;
		});
	});

	async function play() {
		fallen = false;
		await tick();
		fallen = true;
	}
</script>

<div
	bind:this={targetNode}
	class="c"
	class:falling={mode === "falling"}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	{#if mode === "falling"}
		<button onclick={play}>Play</button>
		<button onclick={() => (fallen = false)}>Reset</button>
	{/if}
	<code class:fallen bind:this={codeEl} role="img" aria-label={label}>
		{#each digits as digit, i}
			{@const incorrect = isIncorrect(i)}
			<span
				class:incorrect
				bind:this={spans[i]}
				style:--dist={dist[i]}
				style:--time={dist[i] && Math.sqrt((2 * dist[i]) / GRAVITY)}
				style:--turn={spin[i]?.turn}
				style:--delay={spin[i]?.delay}>{digit}</span
			>
		{/each}
	</code>
	<div class="sr-only" aria-live="polite">
		{fallen ? "The incorrect digits turned red and fell to the bottom." : ""}
	</div>
</div>

<style>
	div {
		margin: 4rem auto;
	}

	.c {
		position: relative;
	}

	.c.falling {
		padding-bottom: 6rem;
	}

	button {
		min-height: 24px;
		min-width: 24px;
		margin-bottom: 1rem;
	}

	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	code {
		display: block;
		position: relative;
		font-size: var(--20px);
		line-height: 1;
	}

	code {
		--pause: 1s;
	}

	.incorrect {
		display: inline-block;
	}

	.fallen .incorrect {
		color: var(--color-red);
		text-decoration: line-through;
		translate: 0 calc(var(--dist) * 1px);
		rotate: calc(var(--turn) * 1deg);
		transition:
			color 0.3s,
			translate calc(var(--time) * 1s) cubic-bezier(0.55, 0, 1, 0.45)
				calc(var(--delay) * 1s + var(--pause)),
			rotate calc(var(--time) * 1s) linear
				calc(var(--delay) * 1s + var(--pause));
	}

	@media (prefers-reduced-motion: reduce) {
		.fallen .incorrect {
			transition: none;
		}
	}
</style>
