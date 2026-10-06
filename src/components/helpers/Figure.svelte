<script>
	import inView from "$actions/inView.js";
	// description: optional longer text alternative (e.g. for video)
	let { src, alt, figcaption, className = "", description = "" } = $props();

	let isVideo = $derived(src.endsWith(".mp4"));
	let videoElement = $state(null);
	let playing = $state(false);

	const onRestart = () => {
		videoElement.currentTime = 0;
		videoElement.play();
	};
</script>

<figure class="figure-media {className}">
	{#if isVideo}
		<div class="controls">
			<button
				aria-pressed={playing}
				onclick={() => (playing ? videoElement.pause() : videoElement.play())}
				>{playing ? "Pause" : "Play"}</button
			>
			<button onclick={onRestart}>Restart</button>
		</div>
		<video
			bind:this={videoElement}
			{src}
			aria-label={alt}
			onplay={() => (playing = true)}
			onpause={() => (playing = false)}
			loop
			muted
			poster={src.replace(".mp4", ".jpg")}
		></video>
	{:else}
		<img {src} {alt} />
	{/if}

	{#if isVideo && description}
		<details class="description">
			<summary>Text description</summary>
			<p>{description}</p>
		</details>
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

	.description {
		font-size: var(--14px);
		padding-top: 8px;
	}

	.controls {
		text-align: center;
		margin-bottom: 8px;
	}
</style>
