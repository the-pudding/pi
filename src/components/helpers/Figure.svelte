<script>
	import inView from "$actions/inView.js";
	let { src, alt, figcaption, className } = $props();

	let isVideo = $derived(src.endsWith(".mp4"));
	let videoElement = $state(null);

	const onRestart = () => {
		videoElement.currentTime = 0;
		videoElement.play();
	};
</script>

<figure class="figure-media {className}">
	{#if isVideo}
		<div class="controls">
			<button onclick={() => videoElement.play()}>Play</button>
			<button onclick={() => videoElement.pause()}>Pause</button>
			<button onclick={onRestart}>Restart</button>
		</div>
		<video
			bind:this={videoElement}
			{src}
			{alt}
			loop
			muted
			poster={src.replace(".mp4", ".jpg").replace("videos", "images")}
		></video>
	{:else}
		<img {src} {alt} />
	{/if}

	{#if figcaption}
		<figcaption>
			{@html figcaption}
		</figcaption>
	{/if}
</figure>

<style>
	figure {
		margin: 4rem auto;
		/* max-width: calc(25em * 1.67); */
		max-width: 25em;
	}

	/* figure.small {
		max-width: 25em;
	} */

	figcaption {
		font-size: var(--14px);
		padding: 8px 0;
	}

	img,
	video {
		display: block;
		margin: 0;
		width: 100%;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}

	.controls {
		text-align: center;
		margin-bottom: 8px;
	}
</style>
