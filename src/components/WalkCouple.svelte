<script>
	import { untrack } from "svelte";
	import random from "random";
	import { format } from "d3";
	import { AnimationFrames } from "runed";
	import variables from "$data/variables.json";

	const DPR = 2;
	const FPS_OPTS = {
		slow: 2,
		medium: 12,
		fast: 60
	};
	const GAP = 5;

	const MAX_STEPS = 1000;
	const FIT = 0.85;
	const IMG = 128;
	const IMG_MIN = IMG * 0.5;

	const IMG_UNITS = 3;

	const DELTAS = [
		[0, -1],
		[1, 0],
		[0, 1],
		[-1, 0]
	];

	const roll = random.uniformInt(0, 3);

	const WALKERS = [
		{ src: "assets/images/walk-polya.png", color: variables.color.blue },
		{ src: "assets/images/walk-couple.png", color: variables.color.red }
	];

	let images = [];

	function load() {
		images = WALKERS.map(({ src }) => {
			const img = new Image();
			img.onload = draw;
			img.src = src;
			return img;
		});
	}

	let canvasEl = $state(null);
	let ctx = $state(null);
	let outcome = $state(null);
	let steps = $state(0);
	let speed = $state("slow");
	let fps = $derived(FPS_OPTS[speed]);

	const uid = $props.id();

	let paths = [];

	function start() {
		paths = [[[0, 0]], [[GAP, GAP]]];
		steps = 0;
		outcome = null;
		draw();
	}

	function tick() {
		steps++;
		paths.forEach((path) => {
			const [x, y] = path.at(-1);
			const [dx, dy] = DELTAS[roll()];
			const next = [x + dx, y + dy];
			path.push(next);
		});

		const [a, b] = paths.map((path) => path.at(-1));
		const met = a[0] === b[0] && a[1] === b[1];
		if (met) outcome = "meet";
		else if (steps >= MAX_STEPS) outcome = "max";

		draw();
		if (outcome) animation.stop();
	}

	function view() {
		const w = canvasEl.width / DPR;
		const h = canvasEl.height / DPR;
		let minX = 0;
		let maxX = GAP;
		let minY = 0;
		let maxY = GAP;
		for (const path of paths)
			for (const [x, y] of path) {
				if (x < minX) minX = x;
				else if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				else if (y > maxY) maxY = y;
			}

		const scale = Math.min(
			(w * FIT) / (maxX - minX),
			((h - IMG) * FIT) / (maxY - minY)
		);
		return {
			w,
			h,
			size: Math.min(IMG, Math.max(IMG_MIN, scale * IMG_UNITS)),
			sx: (x) => w / 2 + (x - (minX + maxX) / 2) * scale,
			sy: (y) => (h + IMG) / 2 + (y - (minY + maxY) / 2) * scale
		};
	}

	function draw() {
		if (!ctx || !paths.length) return;
		const { w, h, size, sx, sy } = view();
		ctx.clearRect(0, 0, w, h);
		ctx.lineWidth = 1.5;
		ctx.lineJoin = "round";

		paths.forEach((path, i) => {
			ctx.strokeStyle = WALKERS[i].color;
			ctx.beginPath();
			path.forEach(([x, y], j) => {
				if (j) ctx.lineTo(sx(x), sy(y));
				else ctx.moveTo(sx(x), sy(y));
			});
			ctx.stroke();
		});

		paths.forEach((path, i) => {
			const img = images[i];
			if (!img?.complete || !img.naturalWidth) return;
			const [x, y] = path.at(-1);
			ctx.drawImage(img, sx(x) - size / 2, sy(y) - size, size, size);
		});
	}

	function resize() {
		const { width, height } = canvasEl.getBoundingClientRect();
		canvasEl.width = width * DPR;
		canvasEl.height = height * DPR;
		if (!ctx) ctx = canvasEl.getContext("2d");
		ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
		draw();
	}

	const animation = new AnimationFrames(tick, {
		fpsLimit: () => fps,
		immediate: false
	});

	let running = $derived(animation.running);

	function toggle() {
		if (running) animation.stop();
		else animation.start();
	}

	function restart() {
		animation.stop();
		start();
		animation.start();
	}

	$effect(() => {
		if (!canvasEl) return;
		const ro = new ResizeObserver(resize);
		ro.observe(canvasEl);
		untrack(() => {
			load();
			resize();
			start();
		});
		return () => {
			ro.disconnect();
			animation.stop();
		};
	});

	let restartEl = $state(null);

	$effect(() => {
		if (outcome) restartEl?.focus();
	});

	let message = $derived(
		outcome === "meet"
			? `They met after ${format(",")(steps)} steps each.`
			: `They never met in ${format(",")(steps)} steps each.`
	);
</script>

<div class="c">
	<div class="ui">
		<div class="toggles" role="group" aria-label="Walk playback">
			<button onclick={toggle} disabled={!!outcome}>
				{running ? "Pause" : "Play"}
			</button>
			<button onclick={restart}>Restart</button>
		</div>
		<div class="speed" role="radiogroup" aria-labelledby="speed-label-{uid}">
			<span class="label" id="speed-label-{uid}">Speed:</span>
			{#each Object.keys(FPS_OPTS) as opt}
				<label>
					<input
						type="radio"
						name="speed-{uid}"
						value={opt}
						bind:group={speed}
					/>
					{opt}
				</label>
			{/each}
		</div>
	</div>

	<div
		class="canvas"
		role="img"
		aria-label="Two walkers start in opposite corners and each take random steps on a grid until their paths cross."
	>
		<canvas bind:this={canvasEl}></canvas>

		{#if outcome}
			<div class="overlay">
				<div class="box">
					<p>{message}</p>
					<button bind:this={restartEl} onclick={restart}>Restart</button>
				</div>
			</div>
		{/if}
	</div>

	<div class="sr-only" aria-live="polite">{outcome ? message : ""}</div>

	<details class="text-alt">
		<summary>Text description</summary>
		<p>
			Two walkers start in opposite corners of a grid. Each step, both walkers
			move one square up, down, left or right at random. The red line and couple
			figure are one walker, and the blue line and single figure are the other.
			The walk ends when both are on the same square at the same time, or after {format(
				","
			)(MAX_STEPS)} steps each.
		</p>
	</details>
</div>

<style>
	.c {
		width: 100%;
		margin: 4rem auto;
	}

	.ui {
		text-align: center;
		margin-bottom: 0.5rem;
		gap: 0.5rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.ui > div {
		line-height: 1;
	}

	.speed,
	.toggles {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.toggles {
		flex: 1 auto;
		width: 100%;
		margin-bottom: 1rem;
	}

	.canvas {
		position: relative;
	}

	label,
	.label {
		min-height: 24px;
		font-family: var(--font-sans);
		font-size: var(--14px);
		text-transform: uppercase;
		display: flex;
		align-items: center;
		line-height: 1;
		gap: 0.25em;
	}

	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}

	.overlay {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.6);
	}

	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: white;
		border: 1px solid transparent;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
		font-family: var(--font-sans);
		font-size: var(--14px);
		text-align: center;
	}

	.box p {
		margin: 0;
	}

	button {
		min-height: 24px;
		min-width: 24px;
	}

	button:focus-visible,
	input:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.text-alt {
		margin-top: 0.75rem;
		font-family: var(--font-sans);
		font-size: var(--14px);
	}

	.text-alt p {
		margin: 0.5rem 0 0 0;
	}
</style>
