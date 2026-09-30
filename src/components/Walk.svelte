<script>
	import { tick, getContext } from "svelte";
	import { AnimationFrames } from "runed";
	const DPR = 2;

	const DEGREE_OPTS = {
		polya: [0, 90, 180, 270],
		venn: [0, 45, 90, 135, 180, 225, 270, 315]
	};

	const pi = getContext("pi");

	let { version = "polya", fps = 24, source = "random" } = $props();
	let canvasEl = $state(null);
	let ctx = $state(null);

	let frame = $state(-1);
	let delta = $state(0);

	let degrees = $derived(DEGREE_OPTS[version]);
	let specimen = $derived(
		source === "random"
			? null
			: pi[source]
					.split("")
					.map((d) => +d)
					.filter((d) => d < degrees.length)
	);

	let unit = 0.02;

	let x = 0;
	let y = 0;

	const animation = new AnimationFrames(
		(args) => {
			frame++;
			delta = args.delta;
		},
		{ fpsLimit: () => +fps, immediate: false }
	);

	function resize() {
		if (!canvasEl) return;
		const { width, height } = canvasEl.getBoundingClientRect();
		canvasEl.width = width * DPR;
		canvasEl.height = height * DPR;
		unit = width * 0.01875;
		if (!ctx) ctx = canvasEl.getContext("2d");
		ctx.scale(DPR, DPR);
	}

	function reset() {
		frame = -1;
		delta = 0;
		if (version === "venn") {
			x = canvasEl.width / 10 / DPR;
			y = canvasEl.height / 10 / DPR;
		} else {
			x = canvasEl.width / 2 / DPR;
			y = canvasEl.height / 2 / DPR;
		}
	}

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

	$effect(() => {
		if (!canvasEl) return;
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvasEl);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (!ctx || frame < 0) return;
		const digit = specimen[frame];
		if (digit === undefined) pause();

		const angle = degrees[digit];

		const rad = (angle * Math.PI) / 180;
		const isDiagonal = ((angle % 90) + 90) % 90 !== 0;
		const strokeLength = isDiagonal ? unit * Math.SQRT2 : unit;

		const nx = x + Math.sin(rad) * strokeLength;
		const ny = y - Math.cos(rad) * strokeLength;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(nx, ny);
		ctx.stroke();

		x = nx;
		y = ny;
	});
</script>

<div>{@html frame}</div>
<div class="c">
	<div class="controls">
		<button onclick={() => play()}>Play</button>
		<button onclick={() => pause()}>Pause</button>
		<button onclick={() => restart()}>Restart</button>
		<div class="fps">
			<label>
				FPS: {fps}
				<input type="range" min="1" max="60" bind:value={fps} />
			</label>
		</div>
	</div>
	<canvas bind:this={canvasEl}></canvas>
</div>

<style>
	.c {
		position: relative;
		width: 100%;
		height: 100%;
		margin: 4rem auto;
	}

	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}

	.controls {
		text-align: center;
		margin-bottom: 8px;
	}

	.fps {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	label {
		font-family: var(--font-sans);
		font-size: var(--14px);
		vertical-align: middle;
	}

	input[type="range"] {
		vertical-align: middle;
	}
</style>
