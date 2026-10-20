<script>
	import { modes } from "../runes/misc.svelte.js";
</script>

<div class="menu">
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
		display: none;
		position: fixed;
		top: 0.5rem;
		right: 0;
		z-index: var(--z-overlay);
	}

	.menu-item {
		margin-right: 0.5rem;
	}

	@media (min-width: 40rem) {
		.menu {
			display: flex;
		}
	}
</style>
