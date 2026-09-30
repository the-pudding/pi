<script>
	import { modes } from "../runes/misc.svelte.js";
</script>

<div class="menu">
	<!-- <div class="menu-item">
		<button onclick={() => (modes.motion = !modes.motion)}
			>MOTION ({modes.motion ? "ON" : "OFF"})</button
		>
	</div> -->

	<div class="menu-item">
		<button onclick={() => (modes.boss = !modes.boss)}>BOSS BUTTON</button>
	</div>

	<div class="menu-item">
		<button onclick={() => (modes.friend = !modes.friend)}>FRIEND BUTTON</button
		>
	</div>
</div>

<style>
	.menu {
		position: fixed;
		top: 0.5rem;
		right: 0;
		display: flex;
		z-index: var(--z-overlay);
	}

	.menu-item {
		margin-right: 0.5rem;
	}
</style>
