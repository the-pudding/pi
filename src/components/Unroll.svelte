<script>
	let { duration = 12 } = $props();

	const UNITS = 4;
	const SPAN = UNITS + 1.5; // container width in diameters

	let width = $state(0);
	let paused = $state(false);

	let d = $derived(width / SPAN);

	let marks = $derived(
		Array.from({ length: UNITS + 1 }, (_, i) => (0.5 + i) * d)
	);
</script>

{#snippet disc()}
	<svg viewBox="0 0 100 100" aria-hidden="true">
		<!-- <circle class="base" cx="50" cy="50" r="48.5" /> -->
		<path
			class="rim"
			pathLength="100"
			d="M 50 98.5 A 48.5 48.5 0 1 0 50 1.5 A 48.5 48.5 0 1 0 50 98.5"
		/>
	</svg>
{/snippet}

<div class="wrap" class:paused>
	<div
		class="unroll"
		role="img"
		aria-label="A circle repeated four times to mark off four of its own widths along a line. The circle then rolls one full turn, unwrapping its red edge onto the line. The unwrapped edge reaches just past the third mark: pi, about 3.14 widths."
		bind:clientWidth={width}
		style:--d="{d}px"
		style:--dur="{duration}s"
	>
		{#if d > 0}
			<div class="ground"></div>
			{#each marks as x, i}
				<div class="mark mark-{i}" style:left="{x}px">
					<span class="line"></span>
					<span class="label">{i}</span>
				</div>
			{/each}

			<div class="mark mark-pi" style:left="{(0.5 + Math.PI) * d}px">
				<!-- <span class="line"></span> -->
				<span class="label">&pi; = ~3.14</span>
			</div>

			{#each [1, 2, 3] as i}
				<div class="clone clone-{i}" style:left="{(0.5 + i) * d}px">
					{@render disc()}
				</div>
			{/each}

			<div class="wheel">{@render disc()}</div>
			<div class="trace"></div>
		{/if}
	</div>
	<button class="toggle" onclick={() => (paused = !paused)}
		>{paused ? "Play" : "Pause"} animation</button
	>
</div>

<style>
	.wrap.paused :global(*) {
		animation-play-state: paused !important;
	}

	.toggle {
		display: block;
		margin: 0 auto;
		min-height: 24px;
	}

	.unroll {
		--ground: calc(0.25 * var(--d));
		--line: max(1.5px, calc(0.025 * var(--d)));
		--strokeWidth: 3;
		position: relative;
		width: 100%;
		aspect-ratio: 5.5 / 1.5;
		margin: 2rem auto;
		overflow: hidden;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/* .base {
		fill: none;
		stroke: var(--color-fg-a2);
		stroke-width: 3;
	} */

	.rim {
		fill: none;
		stroke: var(--color-primary);
		stroke-width: var(--strokeWidth);
		stroke-dasharray: 101;
		stroke-dashoffset: 0;
		transform-box: view-box;
		transform-origin: 50% 50%;
	}

	.ground {
		position: absolute;
		left: 0;
		right: 0;
		bottom: var(--ground);
		height: var(--line);
		background: var(--color-fg-a2);
	}

	.trace {
		position: absolute;
		left: calc(0.5 * var(--d));
		bottom: calc(var(--ground) + var(--strokeWidth) * 1px);
		width: calc(3.14159 * var(--d));
		height: var(--line);
		background: var(--color-primary);
		transform-origin: left center;
		transform: scaleX(1);
		animation: trace var(--dur) infinite both;
	}

	.mark {
		position: absolute;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: var(--font-mono, monospace);
		font-size: max(12px, calc(0.14 * var(--d)));
		line-height: 1;
		opacity: 1;
		transform: translateX(-50%);
		animation-duration: var(--dur);
		animation-iteration-count: infinite;
		animation-fill-mode: both;
	}

	.mark .line {
		width: var(--line);
		height: calc(0.15 * var(--d));
		background: var(--color-fg-a2);
	}

	.mark .label {
		margin-top: calc(0.045 * var(--d));
	}

	.mark-pi {
		color: var(--color-primary);
		animation-name: tick-pi;
		transform: translate(0, calc(var(--ground) * -1));
	}

	/* .mark-pi .line {
		height: calc(0.24 * var(--d));
	} */

	.mark-0,
	.mark-1 {
		animation-name: tick-a;
	}
	.mark-2 {
		animation-name: tick-b;
	}
	.mark-3 {
		animation-name: tick-c;
	}
	.mark-4 {
		animation-name: tick-d;
	}

	.clone {
		position: absolute;
		bottom: calc(var(--ground) + var(--strokeWidth) * 1px);
		width: var(--d);
		height: var(--d);
		opacity: 0;
		transform-origin: center bottom;
		animation-duration: var(--dur);
		animation-iteration-count: infinite;
		animation-fill-mode: both;
	}

	.clone-1 {
		animation-name: clone-a;
	}
	.clone-2 {
		animation-name: clone-b;
	}
	.clone-3 {
		animation-name: clone-c;
	}

	.wheel {
		position: absolute;
		left: calc(0.5 * var(--d));
		bottom: calc(var(--ground) + var(--strokeWidth) * 1px);
		width: var(--d);
		height: var(--d);
		transform: translateX(264.159%) rotate(0deg);
		animation: wheel var(--dur) infinite both;
	}

	.wheel .rim {
		stroke-dashoffset: -101;
		animation: unwrap var(--dur) infinite both;
	}

	/* 2.5-6.7% marks 0 and 1 */
	@keyframes tick-a {
		0%,
		2.5% {
			opacity: 0;
			transform: translateX(-50%);
		}
		6.667%,
		86.667% {
			opacity: 1;
			transform: translateX(-50%);
		}
		90%,
		100% {
			opacity: 0;
			transform: translateX(-50%);
		}
	}

	/* 6.7-10.8% mark 2 */
	@keyframes tick-b {
		0%,
		6.667% {
			opacity: 0;
			transform: translateX(-50%);
		}
		10.833%,
		86.667% {
			opacity: 1;
			transform: translateX(-50%);
		}
		90%,
		100% {
			opacity: 0;
			transform: translateX(-50%);
		}
	}

	/* 10.8-15% mark 3 */
	@keyframes tick-c {
		0%,
		10.833% {
			opacity: 0;
			transform: translateX(-50%);
		}
		15%,
		86.667% {
			opacity: 1;
			transform: translateX(-50%);
		}
		90%,
		100% {
			opacity: 0;
			transform: translateX(-50%);
		}
	}

	/* 15-19.2% mark 4 */
	@keyframes tick-d {
		0%,
		15% {
			opacity: 0;
			transform: translateX(-50%);
		}
		19.167%,
		86.667% {
			opacity: 1;
			transform: translateX(-50%);
		}
		90%,
		100% {
			opacity: 0;
			transform: translateX(-50%);
		}
	}

	/* pi lands at 53.3% */
	@keyframes tick-pi {
		0%,
		53.333% {
			opacity: 0;
			transform: translate(0, calc(var(--ground) * -1 - (0.15 * var(--d))));
		}
		58.333%,
		86.667% {
			opacity: 1;
			transform: translate(0, calc(var(--ground) * -1 - (0.15 * var(--d))));
		}
		90%,
		100% {
			opacity: 0;
			transform: translate(0, calc(var(--ground) * -1));
		}
	}

	@keyframes clone-a {
		0%,
		6.667% {
			opacity: 0;
			transform: scale(1);
		}
		10.833%,
		22.5% {
			opacity: 1;
			transform: scale(1);
		}
		26.667%,
		100% {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes clone-b {
		0%,
		10.833% {
			opacity: 0;
			transform: scale(1);
		}
		15%,
		22.5% {
			opacity: 1;
			transform: scale(1);
		}
		26.667%,
		100% {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes clone-c {
		0%,
		15% {
			opacity: 0;
			transform: scale(1);
		}
		19.167%,
		22.5% {
			opacity: 1;
			transform: scale(1);
		}
		26.667%,
		100% {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes wheel {
		0% {
			transform: translateX(0) rotate(0deg);
		}
		26.667% {
			transform: translateX(0) rotate(0deg);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		31.667% {
			transform: translateX(-50%) rotate(0deg);
		}
		36.667% {
			transform: translateX(-50%) rotate(0deg);
			animation-timing-function: linear;
		}
		/* 5.5 diameters of travel is 5.5 / pi = 1.7507  */
		65.833%,
		100% {
			transform: translateX(500%) rotate(630.254deg);
		}
	}

	@keyframes unwrap {
		0%,
		36.667% {
			stroke-dashoffset: 0;
			animation-timing-function: linear;
		}
		53.333%,
		100% {
			stroke-dashoffset: -100.1;
		}
	}

	@keyframes trace {
		0%,
		36.667% {
			transform: scaleX(0);
			opacity: 1;
			animation-timing-function: linear;
		}
		53.333%,
		86.667% {
			transform: scaleX(1);
			opacity: 1;
		}
		90%,
		100% {
			transform: scaleX(1);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toggle {
			display: none;
		}

		.trace,
		.mark,
		.clone,
		.wheel,
		.rim {
			animation: none !important;
		}
	}
</style>
