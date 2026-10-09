<script>
	import random from "random";

	import { tick, untrack, getContext } from "svelte";
	import { AnimationFrames, IsDocumentVisible } from "runed";
	import variables from "$data/variables.json";
	import computePi from "$utils/computePi.js";
	const DPR = 2;

	const DEGREE_OPTS = {
		polya: [0, 90, 180, 270],
		venn: [0, 45, 90, 135, 180, 225, 270, 315]
	};

	const FPS_OPTS = {
		slow: 2,
		medium: 12,
		fast: 60
	};

	// `speed="hyper"` swaps medium for a 300 fps option, listed last
	const HYPER_OPTS = {
		slow: 2,
		fast: 60,
		hyper: 300
	};
	const SPEED_LABELS = { hyper: "very fast" };
	const REFRESH_FPS = 60;
	const MAX_STEPS_PER_TICK = 10;

	const TICKER_HALF = 100;
	const CHUNK = 512;
	const MAX_DIGITS = 50000;
	const FIT = 0.9;

	const pi = getContext("pi");
	const roll = random.uniformInt(0, 9);
	const visible = new IsDocumentVisible();

	let {
		version = "polya",
		source = "random",
		target = null,
		description = "",
		label = "Walk",
		start = undefined,
		ghostSource = null,
		speed: initialSpeed = "slow"
	} = $props();

	const uid = $props.id();

	const LINE = variables.color["color-fg-a2"];
	const ACCENT = variables.color.red;
	const GHOST = variables.color["color-fg-a2"];

	let rawDigits = [];
	let walkIndices = [];

	let pen = { ux: 0, uy: 0 };
	let prevPen = { ux: 0, uy: 0 };
	let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
	let view = { scale: 0, ox: 0, oy: 0 };
	let baseUnit = 0;
	let drawnFrame = -1;
	let returns = 0;

	let canvasEl = $state(null);
	let ctx = $state(null);
	let ghostEl = $state(null);

	let frame = $state(-1);
	let walkLength = $state(0);
	let speed = $state(untrack(() => initialSpeed));
	let originReturnCount = $state(0);

	let piDigits = $derived(
		source.includes("real")
			? computePi(+source.split("real")[1]).split("").map(Number)
			: null
	);

	// $inspect(piDigits.length)

	let speedOpts = $derived(initialSpeed === "hyper" ? HYPER_OPTS : FPS_OPTS);
	let fps = $derived(speedOpts[speed] ?? speedOpts.slow);
	let degrees = $derived(DEGREE_OPTS[version]);
	let startDigit = $derived(
		start === undefined || start === null || start === "" || isNaN(+start)
			? undefined
			: Math.max(0, Math.floor(+start))
	);
	let isRandom = $derived(source === "random");
	let showOrigin = $derived(target === "origin");

	let deltas = $derived(
		degrees.map((a) => {
			const rad = (a * Math.PI) / 180;
			const len = a % 90 ? Math.SQRT2 : 1;
			return [
				Math.round(Math.sin(rad) * len),
				Math.round(-Math.cos(rad) * len)
			];
		})
	);

	let ghostPath = $derived.by(() => {
		if (!ghostSource || !pi[ghostSource]) return [];
		const ghostDegrees = DEGREE_OPTS[version];
		const ghostDeltas = ghostDegrees.map((a) => {
			const rad = (a * Math.PI) / 180;
			const len = a % 90 ? Math.SQRT2 : 1;
			return [
				Math.round(Math.sin(rad) * len),
				Math.round(-Math.cos(rad) * len)
			];
		});
		const path = [[0, 0]];
		let ux = 0;
		let uy = 0;
		for (const ch of pi[ghostSource]) {
			const d = +ch;
			if (d >= ghostDegrees.length) continue;
			ux += ghostDeltas[d][0];
			uy += ghostDeltas[d][1];
			path.push([ux, uy]);
		}
		return path;
	});

	let maxFrame = $derived(walkLength - 1);
	let activeIndex = $derived.by(() => {
		walkLength;
		return frame < 0 ? undefined : walkIndices[frame];
	});
	let anchor = $derived(activeIndex ?? 0);

	let windowStart = $derived(Math.max(0, anchor - TICKER_HALF));
	let ticker = $derived.by(() => {
		walkLength;
		return rawDigits.slice(windowStart, anchor + TICKER_HALF + 1);
	});
	let tickerOffset = $derived(`calc(-${anchor - windowStart + 0.5} * 1ch)`);

	function ensure(count) {
		if (!isRandom) return;
		const before = walkIndices.length;
		const deg = degrees.length;

		while (rawDigits.length < MAX_DIGITS) {
			const enoughSteps = walkIndices.length >= count;
			const head = enoughSteps ? walkIndices[count - 1] : rawDigits.length;
			if (enoughSteps && rawDigits.length >= head + TICKER_HALF + 1) break;

			for (let i = 0; i < CHUNK; i++) {
				const d = roll();
				if (d < deg) walkIndices.push(rawDigits.length);
				rawDigits.push(d);
			}
		}

		if (walkIndices.length !== before) walkLength = walkIndices.length;
	}

	// step whose raw digit index is the last one <= rawIndex (-1 if none yet)
	function lastStepAtOrBefore(rawIndex) {
		let lo = 0;
		let hi = walkIndices.length;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (walkIndices[mid] <= rawIndex) lo = mid + 1;
			else hi = mid;
		}
		return lo - 1;
	}

	// first step drawn in red; with a ghost, everything after `start` is red
	function redFrom() {
		if (!ghostPath.length) return Infinity;
		return startDigit === undefined ? 0 : lastStepAtOrBefore(startDigit) + 1;
	}

	function seedBounds() {
		const b = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
		for (const [x, y] of ghostPath) {
			if (x < b.minX) b.minX = x;
			else if (x > b.maxX) b.maxX = x;
			if (y < b.minY) b.minY = y;
			else if (y > b.maxY) b.maxY = y;
		}
		return b;
	}

	function size() {
		return { w: canvasEl.width / DPR, h: canvasEl.height / DPR };
	}

	function screenX(ux) {
		return view.ox + ux * view.scale;
	}

	function screenY(uy) {
		return view.oy + uy * view.scale;
	}

	function fitView() {
		if (!canvasEl) return;
		const { w, h } = size();
		const bw = bounds.maxX - bounds.minX || 1;
		const bh = bounds.maxY - bounds.minY || 1;
		const scale = Math.min(baseUnit, (w * FIT) / bw, (h * FIT) / bh);

		view = {
			scale,
			ox: w / 2 - ((bounds.minX + bounds.maxX) / 2) * scale,
			oy: h / 2 - ((bounds.minY + bounds.maxY) / 2) * scale
		};
		drawGhost();
	}

	function drawGhost() {
		if (!ghostEl) return;
		const g = ghostEl.getContext("2d");
		const { w, h } = size();
		g.setTransform(DPR, 0, 0, DPR, 0, 0);
		g.clearRect(0, 0, w, h);
		if (ghostPath.length < 2) return;
		g.lineWidth = 1.5;
		g.lineJoin = "round";
		g.strokeStyle = GHOST;
		g.beginPath();
		g.moveTo(screenX(0), screenY(0));
		for (let i = 1; i < ghostPath.length; i++)
			g.lineTo(screenX(ghostPath[i][0]), screenY(ghostPath[i][1]));
		g.stroke();
	}

	function outside(sx, sy) {
		const { w, h } = size();
		return sx < 2 || sy < 2 || sx > w - 2 || sy > h - 2;
	}

	function grow(ux, uy) {
		if (ux < bounds.minX) bounds.minX = ux;
		else if (ux > bounds.maxX) bounds.maxX = ux;
		if (uy < bounds.minY) bounds.minY = uy;
		else if (uy > bounds.maxY) bounds.maxY = uy;
	}

	function measure(toFrame) {
		let ux = 0;
		let uy = 0;
		bounds = seedBounds();

		for (let i = 0; i <= toFrame; i++) {
			const [dx, dy] = deltas[rawDigits[walkIndices[i]]];
			ux += dx;
			uy += dy;
			grow(ux, uy);
		}
	}

	function drawOrigin() {
		if (!showOrigin || !ctx) return;
		ctx.fillStyle = ACCENT;
		ctx.beginPath();
		ctx.arc(screenX(0), screenY(0), 5, 0, Math.PI * 2);
		ctx.fill();
	}

	function render(toFrame) {
		measure(toFrame);
		fitView();

		const { w, h } = size();
		ctx.clearRect(0, 0, w, h);
		ctx.lineWidth = 1.5;

		let ux = 0;
		let uy = 0;
		let fromX = 0;
		let fromY = 0;
		let count = 0;

		const red = redFrom();

		ctx.strokeStyle = LINE;
		ctx.beginPath();
		ctx.moveTo(screenX(0), screenY(0));

		for (let i = 0; i <= toFrame; i++) {
			const [dx, dy] = deltas[rawDigits[walkIndices[i]]];
			fromX = ux;
			fromY = uy;
			ux += dx;
			uy += dy;
			if (ux === 0 && uy === 0) count++;
			if (i < toFrame) {
				if (i === red) {
					ctx.stroke();
					ctx.strokeStyle = ACCENT;
					ctx.beginPath();
					ctx.moveTo(screenX(fromX), screenY(fromY));
				}
				ctx.lineTo(screenX(ux), screenY(uy));
			}
		}
		ctx.stroke();

		ctx.lineWidth = 3;
		ctx.strokeStyle = ACCENT;
		ctx.beginPath();
		ctx.moveTo(screenX(fromX), screenY(fromY));
		ctx.lineTo(screenX(ux), screenY(uy));
		ctx.stroke();

		returns = count;
		originReturnCount = count;
		drawOrigin();

		prevPen = { ux: fromX, uy: fromY };
		pen = { ux, uy };
		drawnFrame = toFrame;
	}

	function advance(toFrame) {
		const [dx, dy] = deltas[rawDigits[walkIndices[toFrame]]];
		const ux = pen.ux + dx;
		const uy = pen.uy + dy;
		const toX = screenX(ux);
		const toY = screenY(uy);

		if (outside(toX, toY)) {
			render(toFrame);
			return;
		}

		ctx.lineWidth = 1.5;

		ctx.strokeStyle = toFrame - 1 >= redFrom() ? ACCENT : LINE;
		ctx.beginPath();
		ctx.moveTo(screenX(prevPen.ux), screenY(prevPen.uy));
		ctx.lineTo(screenX(pen.ux), screenY(pen.uy));
		ctx.stroke();

		ctx.lineWidth = 3;
		ctx.strokeStyle = ACCENT;
		ctx.beginPath();
		ctx.moveTo(screenX(pen.ux), screenY(pen.uy));
		ctx.lineTo(toX, toY);
		ctx.stroke();

		prevPen = pen;
		pen = { ux, uy };
		grow(ux, uy);
		if (ux === 0 && uy === 0) originReturnCount = ++returns;
		drawOrigin();
		drawnFrame = toFrame;
	}

	function draw(toFrame) {
		if (!ctx || !canvasEl || toFrame < 0 || toFrame > maxFrame) return;
		if (toFrame === drawnFrame) return;
		const gap = toFrame - drawnFrame;
		if (drawnFrame >= 0 && gap > 0 && gap <= MAX_STEPS_PER_TICK) {
			for (let f = drawnFrame + 1; f <= toFrame; f++) advance(f);
		} else render(toFrame);
	}

	function resize() {
		if (!canvasEl) return;
		const { width, height } = canvasEl.getBoundingClientRect();
		canvasEl.width = width * DPR;
		canvasEl.height = height * DPR;
		if (ghostEl) {
			ghostEl.width = width * DPR;
			ghostEl.height = height * DPR;
		}
		if (!ctx) ctx = canvasEl.getContext("2d");
		ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
		baseUnit = width * 0.05;

		drawnFrame = -1;
		if (frame >= 0) render(frame);
		else {
			fitView();
			drawOrigin();
		}
	}

	function reset() {
		frame = -1;
		drawnFrame = -1;
		returns = 0;
		originReturnCount = 0;
		pen = { ux: 0, uy: 0 };
		prevPen = { ux: 0, uy: 0 };
		bounds = seedBounds();

		if (isRandom) {
			rawDigits = [];
			walkIndices = [];
			walkLength = 0;
		}

		ensure(1);
		if (startDigit !== undefined) {
			while (rawDigits.length <= startDigit && rawDigits.length < MAX_DIGITS)
				ensure(walkIndices.length + 1);
			frame = lastStepAtOrBefore(startDigit);
		}
		fitView();

		if (ctx && canvasEl) {
			const { w, h } = size();
			ctx.clearRect(0, 0, w, h);
			drawOrigin();
		}
	}

	const animation = new AnimationFrames(
		({ delta }) => {
			// above the display refresh rate, take several steps per animation frame
			const n =
				fps > REFRESH_FPS
					? Math.max(
							1,
							Math.min(Math.round((delta * fps) / 1000), MAX_STEPS_PER_TICK)
						)
					: 1;
			for (let i = 0; i < n; i++) {
				ensure(frame + 2);
				if (frame + 1 > walkLength - 1) {
					pause();
					return;
				}
				frame++;
			}
		},
		{ fpsLimit: () => +fps, immediate: false }
	);

	let running = $derived(animation.running);

	let status = $derived.by(() => {
		walkLength;
		if (running || frame < 0) return "";
		let x = 0;
		let y = 0;
		let back = 0;
		for (let i = 0; i <= frame; i++) {
			const [dx, dy] = deltas[rawDigits[walkIndices[i]]];
			x += dx;
			y += dy;
			if (x === 0 && y === 0) back++;
		}
		const parts = [];
		if (y) parts.push(`${Math.abs(y)} ${y < 0 ? "north" : "south"}`);
		if (x) parts.push(`${Math.abs(x)} ${x > 0 ? "east" : "west"}`);
		const where = parts.length
			? `${parts.join(" and ")} of the start`
			: "back at the start";
		const returns = showOrigin
			? ` It has returned to the start ${back} ${back === 1 ? "time" : "times"}.`
			: "";
		return `Step ${frame + 1} of ${walkLength}. The walk is ${where}.${returns}`;
	});

	function play() {
		if (frame === -1) reset();
		animation.start();
	}

	function pause() {
		animation.stop();
	}

	async function restart() {
		pause();
		await tick();
		reset();
		play();
	}

	function step(e) {
		pause();
		if (frame === -1) reset();
		frame = Math.min(+e.currentTarget.value, walkLength - 1);
	}

	$effect(() => {
		if (!canvasEl || !ghostEl) return;
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvasEl);
		return () => ro.disconnect();
	});

	function rebuild() {
		const deg = DEGREE_OPTS[version].length;
		if (source !== "random")
			rawDigits = piDigits || pi[source].split("").map(Number);

		walkIndices = [];
		for (let i = 0; i < rawDigits.length; i++)
			if (rawDigits[i] < deg) walkIndices.push(i);

		walkLength = walkIndices.length;
		drawnFrame = -1;
	}

	rebuild();

	$effect(() => {
		source;
		version;
		rebuild();
	});

	let jumped = false;
	$effect(() => {
		if (!ctx || jumped || startDigit === undefined) return;
		jumped = true;
		untrack(() => reset());
	});

	$effect(() => {
		ghostPath;
		untrack(() => {
			if (!canvasEl) return;
			if (frame < 0) bounds = seedBounds();
			resize();
		});
	});

	$effect(() => {
		if (!visible.current && animation.running) pause();
	});

	$effect(() => {
		if (!ctx) return;
		if (frame > maxFrame) {
			frame = maxFrame;
			return;
		}
		draw(frame);
	});
</script>

<div class="c">
	<div class="ui">
		<div class="toggles" role="group" aria-label="{label} playback">
			<button onclick={() => (running ? pause() : play())}
				>{running ? "Pause" : "Play"}</button
			>
			<button onclick={() => restart()}>Restart</button>
		</div>
		<div class="speed" role="radiogroup" aria-labelledby="speed-label-{uid}">
			<span class="label" id="speed-label-{uid}">Speed:</span>
			{#each Object.keys(speedOpts) as opt}
				<label>
					<input
						type="radio"
						name="speed-{uid}"
						value={opt}
						bind:group={speed}
					/>
					{SPEED_LABELS[opt] ?? opt}
				</label>
			{/each}
		</div>

		{#if source !== "random"}
			<div class="frame">
				<label>
					<span>Step:</span>
					<input
						type="range"
						min="0"
						max={Math.max(0, maxFrame)}
						value={Math.max(0, frame)}
						oninput={step}
					/>
				</label>
			</div>
		{/if}
		{#if showOrigin}
			<div class="returns">
				<span class="label">Returns to origin: {originReturnCount}</span>
			</div>
		{/if}
	</div>
	<div class="pi" aria-hidden="true">
		<span class="inner" style:transform="translateX({tickerOffset})">
			{#each ticker as digit, i (windowStart + i)}
				{@const index = windowStart + i}
				<span
					class="decimal"
					class:unused={digit >= degrees.length}
					class:active={index === activeIndex}>{digit}</span
				>
			{/each}
		</span>
	</div>

	<div
		class="canvas"
		role="img"
		aria-label={description ||
			`A line drawn by a walk on a lattice, one step per ${source === "random" ? "random number" : "digit of pi"}.`}
	>
		<canvas bind:this={ghostEl} class="ghost"></canvas>
		<canvas bind:this={canvasEl}></canvas>
	</div>

	<div class="sr-only" aria-live="polite">{status}</div>

	<details class="text-alt">
		<summary>Text description</summary>
		<p>
			Key: the red segment is the latest step and the gray line is the path so
			far.{#if showOrigin}
				The red dot is the starting point.{/if}
			Each digit of pi sets a direction ({degrees.length} directions: digits 0 to
			{degrees.length - 1}). Faded digits in the strip above the drawing are
			skipped and don't move the line.
		</p>
		{#if description}<p>{description}</p>{/if}
		<p>{status || "Press play or move the step slider to start the walk."}</p>
	</details>
</div>

<style>
	.c {
		position: relative;
		width: 100%;
		height: 100%;
		margin: 4rem auto;
	}

	.canvas {
		position: relative;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}

	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		position: relative;
		z-index: 1;
	}

	canvas.ghost {
		position: absolute;
		inset: 0;
		z-index: 0;
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
	.frame,
	.returns,
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

	label,
	.label {
		min-height: 24px;
		font-family: var(--font-sans);
		font-size: var(--14px);
		text-transform: uppercase;
		vertical-align: middle;
		display: flex;
		align-items: center;
		line-height: 1;
		gap: 0.25em;
	}

	button {
		min-height: 24px;
		min-width: 24px;
	}

	input[type="range"] {
		height: 24px;
		vertical-align: middle;
	}

	.text-alt {
		margin-top: 0.75rem;
		font-family: var(--font-sans);
		font-size: var(--14px);
	}

	.text-alt p {
		margin: 0.5rem 0 0 0;
	}

	.pi {
		font-family: var(--font-mono);
		font-size: var(--14px);
		width: 100%;
		margin: 1rem auto;
		overflow: hidden;
	}

	.pi .inner {
		text-wrap: nowrap;
		position: relative;
		display: block;
		line-height: 1;
		padding-left: 50%;
	}

	.pi .decimal {
		display: inline-block;
		width: 1ch;
		text-align: center;
	}

	.pi .decimal.unused {
		opacity: 0.25;
	}

	.pi .decimal.active {
		font-weight: bold;
		color: var(--color-primary);
	}
</style>
