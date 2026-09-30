<script>
	import { getContext } from "svelte";
	import { groups, ascending, scaleLinear, max } from "d3";
	const pi = getContext("pi");
	let { version, caption } = $props();

	let byNumber = $derived(
		groups(
			pi[version].split("").map((d) => +d),
			(d) => d
		)
			.map(([number, c]) => ({ number, count: c.length }))
			.sort((a, b) => ascending(a.number, b.number))
	);

	let maxCount = $derived(max(byNumber, (d) => d.count));
	let total = $derived(pi[version].length);
	let scaleCount = $derived(
		scaleLinear().domain([0, maxCount]).range([0, 100])
	);

	const uid = Math.random().toString(36).slice(2);
</script>

<figure class="wrap">
	<div class="c" aria-hidden="true">
		{#each byNumber as { number, count }}
			{@const height = `${scaleCount(count)}%`}
			{@const highlight = number === 7}
			<div class="number" class:highlight>
				<div class="track">
					<span class="bar" style:height
						><span class="count">{count}</span></span
					>
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
					<th scope="row">{number}</th>
					<td>{count}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<figcaption id="dist-caption-{uid}">
		{caption}
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
	}

	.bar {
		width: 100%;
		background-color: currentColor;
		height: 0;
		display: inline-block;
		text-align: center;
		border: 4px solid currentColor;
	}

	.count {
		transform: translateY(calc(-100% - 16px));
		display: inline-block;
		line-height: 1;
		font-size: 0.75em;
	}

	.label {
		margin-top: 8px;
	}

	.highlight .bar {
		background: Mark;
	}
</style>
