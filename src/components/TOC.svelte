<script>
	import { getContext } from "svelte";
	import { onClickOutside } from "runed";

	const copy = getContext("copy");

	const sections = [
		{ id: "introduction", title: "Introduction" },
		{ id: "title", title: "Title" }
	].concat(
		copy.body
			.map(({ section, content }) => ({
				id: section.toLowerCase().replace(/[^a-z0-9]/g, ""),
				section,
				title: Array.isArray(content)
					? content.find(({ type }) => type === "h2")?.value
					: null
			}))
			.filter(({ title }) => title)
	);

	let open = $state(false);
	let navEl = $state(null);
	let buttonEl = $state(null);

	function go(id) {
		open = false;
		const target = document.getElementById(id);
		if (!target) return;
		target.setAttribute("tabindex", "-1");
		target.focus({ preventScroll: true });
	}

	function onkeydown(e) {
		if (!open || e.key !== "Escape") return;
		open = false;
		// don't strand focus inside the now-hidden list
		if (navEl.contains(document.activeElement)) buttonEl.focus();
	}
</script>

<svelte:window {onkeydown} />

<nav
	aria-label="Table of contents"
	bind:this={navEl}
	use:onClickOutside={() => (open = false)}
>
	<button
		bind:this={buttonEl}
		aria-expanded={open}
		aria-controls="toc-list"
		onclick={() => (open = !open)}>Contents</button
	>
	<ol id="toc-list" hidden={!open}>
		{#each sections as { id, title }}
			<li><a href="#{id}" onclick={() => go(id)}>{title}</a></li>
		{/each}
	</ol>
</nav>

<style>
	nav {
		position: fixed;
		top: 0.5rem;
		left: 0.5rem;
		z-index: var(--z-overlay);
		font-family: var(--font-sans);
		font-size: var(--14px);
	}

	@media (max-width: 40rem), (max-height: 30rem) {
		nav {
			position: absolute;
		}
	}

	ol {
		margin: 0.25rem 0 0 0;
		padding: 0.75rem 1rem 0.75rem 2.5rem;
		max-height: calc(100vh - var(--spacing));
		overflow-y: auto;
		background: var(--color-bg);
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
	}

	li + li {
		margin-top: 0.5rem;
	}
</style>
