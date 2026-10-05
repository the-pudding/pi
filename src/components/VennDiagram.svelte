<script>
	let { left, right, center } = $props();
</script>

<div class="c">
	<div class="diagram">
		<div class="circle"><span>{@html left}</span></div>
		<div class="center"><span>{@html center}</span></div>
		<div class="circle"><span>{@html right}</span></div>
	</div>
</div>

<style>
	.c {
		margin: 4rem auto;
	}

	.diagram {
		width: 100%;
		aspect-ratio: 1.6;
		position: relative;
		overflow: hidden;
	}

	.circle {
		width: 62.5%;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		border: 3px solid currentColor;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
	}

	.circle:first-of-type {
		left: 0;
	}

	.circle:last-of-type {
		right: 0;
	}

	.center {
		position: absolute;
		width: 20%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	span {
		font-family: var(--font-sans);
		font-size: var(--14px);
		display: block;
		text-align: center;
	}

	.circle span {
		max-width: 37.5%;
		z-index: 0;
	}

	.circle:first-of-type span {
		text-align: left;
		transform: translateX(-33.33%);
	}

	.center {
		z-index: 1;
	}

	.circle:last-of-type span {
		text-align: right;
		transform: translateX(33.33%);
	}

	/* .alt .circle {
		background: var(--color-black);
		opacity: 0.75;
	}

	.alt span {
		color: var(--color-white);
	} */
</style>
