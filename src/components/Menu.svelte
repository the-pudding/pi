<script>
	import { modes } from "../runes/misc.svelte.js";
</script>

<div class="menu">
	<div class="menu-item">
		<button onclick={() => (modes.boss = !modes.boss)}>BOSS BUTTON</button>
	</div>

	<div class="menu-item">
		<button onclick={() => (modes.friend = !modes.friend)}>FRIEND BUTTON</button>
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

	button {
		border: 1px solid gray;
		padding: 0.25rem 0.5rem;
		font-family: sans-serif;
		font-size: 14px;
		border-radius: 4px;
	}

	.menu-item {
		margin-right: 0.5rem;
	}
</style>
