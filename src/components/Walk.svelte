<!-- a component that visualizes a random walk based on digits of pi or randomly -->
<script>
	import { tick, getContext } from "svelte";
	import { AnimationFrames } from "runed";
	import variables from "$data/variables.json";
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

	const pi = getContext("pi");

	let x = 0;
	let y = 0;
	let baseX = 0;
	let baseY = 0;
	let unit = 0.02;

	let { version = "polya", source = "random" } = $props();
	let canvasEl = $state(null);
	let ctx = $state(null);

	let frame = $state(-1);
	// let delta = $state(0);
	let speed = $state("slow");
	let fps = $derived(FPS_OPTS[speed]);

	let degrees = $derived(DEGREE_OPTS[version]);
	let specimen = $derived(
		source === "random"
			? null
			: pi[source]
					.split("")
					.map((d) => +d)
					.map((d, i) => ({ digit: d, index: i }))
	);

	let specimenWalk = $derived(
		specimen.filter(({ digit }) => digit < degrees.length)
	);

	let lastDigit = $state(null);

	let maxFrame = $derived(specimenWalk ? specimenWalk.length - 1 : -1);

	let activeIndex = $derived(specimenWalk[frame]?.index);
	let tickerOffset = $derived(`calc(-${(activeIndex ?? 0) + 0.5} * 1ch)`);

	const animation = new AnimationFrames(
		(args) => {
			frame++;
			// delta = args.delta;
		},
		{ fpsLimit: () => +fps, immediate: false }
	);

	function resize() {
		if (!canvasEl) return;
		const { width, height } = canvasEl.getBoundingClientRect();
		canvasEl.width = width * DPR;
		canvasEl.height = height * DPR;
		unit = width * 0.02;
		if (!ctx) ctx = canvasEl.getContext("2d");
		ctx.scale(DPR, DPR);
	}

	function reset() {
		frame = -1;
		// delta = 0;
		if (ctx && canvasEl)
			ctx.clearRect(0, 0, canvasEl.width / DPR, canvasEl.height / DPR);

		if (version === "venn") {
			baseX = canvasEl.width / 20 / DPR;
			baseY = canvasEl.height / 20 / DPR;
		} else {
			baseX = canvasEl.width / 2 / DPR;
			baseY = canvasEl.height / 2 / DPR;
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

	function step(e) {
		pause();
		if (frame === -1) reset();
		frame = +e.currentTarget.value;
	}

	function draw(toFrame, clear = false) {
		if (!ctx || !canvasEl || !specimenWalk) return;

		if (clear) {
			ctx.clearRect(0, 0, canvasEl.width / DPR, canvasEl.height / DPR);
			x = baseX;
			y = baseY;
		}

		ctx.strokeStyle = variables.color.red;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(x, y);

		const startIndex = clear ? 0 : toFrame;

		for (let i = startIndex; i <= toFrame; i++) {
			const digit = specimenWalk[i].digit;

			if (digit === undefined) break;

			const angle = degrees[digit];
			const rad = (angle * Math.PI) / 180;
			const isDiagonal = ((angle % 90) + 90) % 90 !== 0;
			const strokeLength = isDiagonal ? unit * Math.SQRT2 : unit;

			x += Math.sin(rad) * strokeLength;
			y -= Math.cos(rad) * strokeLength;
			ctx.lineTo(x, y);
		}

		lastDigit = specimenWalk[toFrame]?.digit;

		ctx.stroke();
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
		if (frame > maxFrame) {
			frame = maxFrame;
			pause();
			return;
		}
		draw(frame, true);
	});
</script>

<!-- <div>debug: {frame}: {lastDigit} and {specimenWalk[frame]?.index}</div> -->
<div class="c">
	<div class="controls">
		<button onclick={() => play()}>Play</button>
		<button onclick={() => pause()}>Pause</button>
		<button onclick={() => restart()}>Restart</button>
		<div class="fps">
			<span class="label">Speed:</span>
			{#each Object.keys(FPS_OPTS) as opt}
				<label>
					<input type="radio" name="speed" value={opt} bind:group={speed} />
					{opt}
				</label>
			{/each}

			{#if maxFrame >= 0}
				<div class="fps">
					<label>
						Step
						<input
							type="range"
							min="0"
							max={maxFrame}
							value={Math.max(0, frame)}
							oninput={step}
						/>
					</label>
				</div>
			{/if}
		</div>
		<div class="pi">
			<span class="inner" style:transform="translateX({tickerOffset})">
				{#each specimen as { digit, index }}
					{@const unused = digit > degrees.length - 1}
					{@const active = activeIndex === index}
					<span class="decimal" class:unused class:active>{digit}</span>
				{/each}
			</span>
		</div>
	</div>
	<div class="canvas">
		<!-- <img class="venn" src="assets/images/vennpen.jpg" alt="Venn's path drawing" /> -->
		<canvas bind:this={canvasEl}></canvas>
	</div>
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
	}

	/* img.venn {
		position: absolute;
		top: 5.1%;
		left: 3.3%;
		width: 50%;
		height: 48%;
		transform: rotate(0.5deg);
		opacity: 0.25;
	} */

	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
		position: relative;
		z-index: 1;
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

	label,
	.label {
		font-family: var(--font-sans);
		font-size: var(--14px);
		vertical-align: middle;
	}

	input[type="range"] {
		vertical-align: middle;
	}

	.pi {
		font-family: var(--font-mono);
		font-size: var(--14px);
		width: 100%;
		margin: 1rem auto;
		/* margin-left: 50%; */
		overflow: hidden;
	}

	.pi .inner {
		text-wrap: nowrap;
		position: relative;
		display: block;
		line-height: 1;
		padding-left: 50%;
		/* padding-left: 1ch; */
		/* transition: transform 0.2s linear; */
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
