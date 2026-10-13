<script>
	import deburr from "lodash.deburr";
	let { values } = $props();
</script>

<div class="c">
	{#each values as { name, text }}
		{@const src = `assets/images/${deburr(name).toLowerCase().replace(/\s+/g, "")}.jpg`}
		<div class="message">
			<span class="avatar">
				<img {src} alt="{name} headshot" aria-hidden="true" />
			</span>
			<span class="text">
				<strong class="name">{name}</strong>
				{text}
			</span>
		</div>
	{/each}
</div>

<style>
	.c {
		font-family: var(--font-mono);
		background: var(--color-gray-100);
		padding: 1rem;
		margin: 4rem auto;
	}

	.message {
		display: flex;
		align-items: flex-start;
		font-size: 0.75em;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.avatar {
		display: block;
		flex: 1;
		min-width: 4rem;
		width: 4rem;
		max-width: 4rem;
		padding-right: 1rem;
	}

	img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		object-position: top;
		border-radius: 50%;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}

	.text {
		display: flex;
		flex-direction: column;
		line-height: 1.325;
	}

	.name {
		line-height: 1;
		margin-bottom: 0.5rem;
	}
</style>
