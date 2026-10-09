<script>
	import { AxisX, AxisY, Plot, Line, Dot, Text } from "svelteplot";
	import { format } from "d3";
	import records from "$data/records.csv";

	let { caption } = $props();

	const uid = $props.id();
	const start = new Date(1700, 0, 1);
	const end = new Date();
	const minYear = start.getFullYear();
	const comma = format(",.0f");

	const data = records
		.map((d) => {
			const [year, month] = d.date.split("/").map(Number);
			return {
				who: d.who,
				year,
				digits: +d.digits,
				date: new Date(year, (month || 1) - 1, 1)
			};
		})
		.filter((d) => d.year >= minYear)
		.sort((a, b) => a.date - b.date)
		.map((d, i) => ({ ...d, i }));

	const first = data[0];
	const last = data[data.length - 1];

	let active = $state(0);
	let announce = $state("");

	let current = $derived(data[active]);

	function describe(d) {
		return `${d.who}, ${d.year}: ${comma(d.digits)} digits`;
	}

	function onSlide(e) {
		active = +e.currentTarget.value;
		announce = describe(data[active]);
	}
</script>

<figure class="wrap">
	<figcaption>
		{caption ??
			`Record number of digits of pi calculated, ${first.year} to ${last.year}.`}
	</figcaption>

	<p class="cue" id="records-cue-{uid}">
		Use the slider below the chart to step through who set each record.
	</p>

	<div class="chart" aria-hidden="true">
		<Plot
			x={{ type: "time", domain: [start, end], label: "Year" }}
			y={{ type: "log", label: "Digits of pi (log scale)", grid: true }}
			marginRight={20}
			axes={false}
		>
			<AxisX tickFontSize={14} titleFontSize={14} />
			<AxisY tickFontSize={14} titleFontSize={14} />

			<Line {data} x="date" y="digits" stroke="currentColor" />
			<Dot {data} x="date" y="digits" r={3} fill="currentColor" />

			<Dot
				data={[current]}
				x="date"
				y="digits"
				r={7}
				fill="var(--color-primary)"
				stroke="currentColor"
				strokeWidth={2}
			/>
		</Plot>
	</div>

	<div class="control">
		<label>
			<span>Year:</span>
			<input
				type="range"
				min="0"
				max={data.length - 1}
				value={active}
				oninput={onSlide}
				aria-describedby="records-cue-{uid}"
				aria-valuetext={describe(current)}
			/>
		</label>
		<output
			>{comma(current.digits)} digits - {current.who} ({current.year})</output
		>
	</div>

	<div class="sr-only" aria-live="polite">{announce}</div>

	<details class="text-alt">
		<summary>Text description and data table</summary>
		<p>
			Each dot is a new world record for how many digits of pi had been
			calculated. The line goes up and to the right: from {comma(first.digits)}
			digits in {first.year} to {comma(last.digits)} digits in {last.year}. The
			vertical scale is logarithmic, so each gridline is ten times the one below
			it. Progress is slow before 1940 and then climbs steeply once computers
			take over.
		</p>
		<table>
			<caption>Pi calculation records since {minYear}</caption>
			<thead>
				<tr>
					<th scope="col">Year</th>
					<th scope="col">Who</th>
					<th scope="col">Digits</th>
				</tr>
			</thead>
			<tbody>
				{#each data as d (d.i)}
					<tr>
						<th scope="row">{d.year}</th>
						<td>{d.who}</td>
						<td>{comma(d.digits)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</details>
</figure>

<style>
	.wrap {
		margin: 4rem auto;
	}

	.wrap :global(svg text) {
		font-family: var(--font-mono);
	}

	.cue,
	figcaption,
	.control,
	.text-alt {
		font-size: var(--14px);
	}

	.cue {
		margin: 0 0 0.5rem 0;
	}

	figcaption {
		padding: 0 0 0.5rem 0;
		font-weight: bold;
		font-size: var(--24px);
	}

	.control {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}

	.control label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-transform: uppercase;
	}

	.control input[type="range"] {
		flex: 1;
		height: 24px;
	}

	.control input[type="range"]:focus-visible {
		outline: 3px solid currentColor;
		outline-offset: 2px;
	}

	.control output {
		font-size: var(--14px);
	}

	.text-alt p {
		margin: 0.5rem 0;
	}

	.text-alt summary {
		min-height: 24px;
		cursor: pointer;
	}

	.text-alt summary:focus-visible {
		outline: 3px solid currentColor;
		outline-offset: 2px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--12px);
		font-family: var(--font-mono);
	}

	caption {
		text-align: left;
		font-weight: bold;
		padding: 0.5rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.325rem;
		border-bottom: 1px solid currentColor;
		vertical-align: top;
	}

	thead th:first-of-type,
	tbody th:first-of-type {
		width: 4rem;
		text-align: right;
	}

	thead th:last-of-type,
	tbody td:last-of-type {
		text-align: right;
	}

	/* thead th:last-of-type,
	tbody td:last-of-type {
		text-align: right;
	} */
</style>
