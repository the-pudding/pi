<script>
	import { getContext } from "svelte";
	import { groups, ascending, scaleLinear, max, format, sum } from "d3";
	import computePi from "$utils/computePi.js";

	const pi = getContext("pi");
	let { source, caption, highlight, ghost, values } = $props();

	let piDigits = $derived(source ? pi[source].split("").map(Number) : null);

	let byNumber = $derived(
		values
			? values.map((c, i) => ({ number: i, count: +c }))
			: groups(piDigits, (d) => d)
					.map(([number, c]) => ({ number, count: c.length }))
					.sort((a, b) => ascending(a.number, b.number))
	);

	let tally = $derived(sum(byNumber, (d) => d.count));

	let maxCount = $derived(max(byNumber, (d) => d.count));
	let total = $derived(tally);
	let scaleCount = $derived(
		scaleLinear().domain([0, maxCount]).range([0, 100])
	);

	let fontSize = $derived(0.75 - (`${maxCount}`.length - 2) * 0.1);

	let ghostCount = $derived(
		ghost === undefined || ghost === null || ghost === "" || isNaN(+ghost)
			? null
			: +ghost
	);
	let ghostHeight = $derived(
		ghostCount === null ? null : `${Math.min(100, scaleCount(ghostCount))}%`
	);

	const uid = $props.id();
</script>

<figure class="wrap">
	<div class="c" aria-hidden="true">
		{#each byNumber as { number, count }}
			{@const height = `${scaleCount(count)}%`}
			{@const high = `${number}` === highlight}
			<div class="number" class:high>
				<div class="track">
					<span class="bar" style:height>
						<span class="count" style:font-size="{fontSize}em"
							>{format(",")(count)}</span
						>
					</span>
					{#if number === 7 && ghostHeight}
						<span class="ghost" style:bottom={ghostHeight} aria-hidden="true">
							<span class="ghost-value">{format(",")(ghostCount)}</span>
						</span>
					{/if}
				</div>
				<span class="label">
					{number}
				</span>
			</div>
		{/each}
	</div>

	<table class="sr-only" aria-labelledby="dist-caption-{uid}">
		<caption>{total} total digits</caption>
		<thead>
			<tr>
				<th scope="col">Digit</th>
				<th scope="col">Count</th>
			</tr>
		</thead>
		<tbody>
			{#each byNumber as { number, count }}
				<tr>
					<th scope="row"
						>{number}{#if number === 7}
							<span class="sr-only">
								(highlighted in the chart)</span
							>{/if}{#if number === 7 && ghostCount !== null}
							<span class="sr-only">
								(the dotted line marks {format(",")(ghostCount)})</span
							>{/if}</th
					>
					<td>{count}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<figcaption id="dist-caption-{uid}">
		{@html caption}
		{#if ghostCount !== null}
			<span class="ghost-key"
				>Dotted line marks the comparison count of {format(",")(ghostCount)} for 7.</span
			>
		{/if}
	</figcaption>
</figure>

<style>
	.wrap {
		margin: 5rem auto 4rem auto;
	}

	figcaption {
		font-size: var(--14px);
		padding: 8px 0;
		text-align: center;
	}

	.c {
		display: flex;
		justify-content: space-between;
		gap: 0.5em;
	}

	.number {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 33svh;
		font-family: var(--font-mono);
		flex: 1;
		line-height: 1;
	}

	.track {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		flex: 1;
		min-height: 0;
		width: 100%;
		position: relative;
	}

	.bar {
		width: 100%;
		background-color: var(--color-white);
		height: 0;
		display: inline-block;
		text-align: center;
		border: 4px solid currentColor;
		position: relative;
	}

	.count {
		transform: translate(-50%, -100%);
		top: -0.5rem;
		left: 50%;
		position: absolute;
		display: inline-block;
		line-height: 1;
	}

	.label {
		margin-top: 8px;
	}

	.ghost {
		position: absolute;
		left: 0;
		right: 0;
		border-top: 3px dotted currentColor;
		z-index: 2;
		pointer-events: none;
	}

	.ghost-value {
		position: absolute;
		right: 0.5rem;
		top: 0.25rem;
		font-size: var(--12px);
		line-height: 1;
		background: var(--color-bg);
		color: var(--color-fg);
		padding: 0.25em;
	}

	.ghost-key {
		display: block;
	}

	.high .bar {
		background: var(--color-primary);
	}
</style>
