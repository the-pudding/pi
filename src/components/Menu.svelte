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
		<button aria-haspopup="dialog" onclick={() => (modes.boss = !modes.boss)}
			>BOSS BUTTON</button
		>
	</div>

	<div class="menu-item">
		<button
			aria-haspopup="dialog"
			onclick={() => (modes.friend = !modes.friend)}>FRIEND BUTTON</button
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

	/* small viewports and high zoom: let the menu scroll away instead of covering text */
	@media (max-width: 40rem), (max-height: 30rem) {
		.menu {
			position: absolute;
		}
	}

	.menu-item {
		margin-right: 0.5rem;
	}
</style>
