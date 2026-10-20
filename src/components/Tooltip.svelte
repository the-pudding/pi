<script>
	import { getContext } from "svelte";

	const copy = getContext("copy");

	const data = copy.tooltipData;
	const people = data.map((d, i) => ({
		...d,
		id: `tip-${i}`,
		matchOn: [d.name, d.name.split(" ").slice(1).join(" ")]
			.concat(d.name === "D. F. Ferguson" ? ["Ferguson"] : [])
			.filter(Boolean)
	}));

	const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	// a shared surname goes to whoever is listed first (e.g., "Shanks" -> William)
	const lookup = new Map();
	people.forEach((p) =>
		p.matchOn.forEach((m) => {
			if (!lookup.has(m)) lookup.set(m, p);
		})
	);

	// one regex for every name, longest first so "Gail Borden" wins over "Borden".
	// a possessive (curly apostrophe only, e.g., "Venn’s") is included in the match
	const pattern = new RegExp(
		`\\b(${[...lookup.keys()]
			.sort((a, b) => b.length - a.length)
			.map(escape)
			.join("|")})\\b(?:’s\\b)?`,
		"g"
	);

	function wrap(node, person, anchor) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "person";
		button.textContent = node.textContent;
		button.style.setProperty("anchor-name", anchor);
		button.setAttribute("popovertarget", person.id);
		node.replaceWith(button);
		return button;
	}

	$effect(() => {
		// look for the a person's full or last name (matchOn)
		// if you find it, wrap it in a button.person (every mention)
		const buttons = [];

		document.querySelectorAll(".chunk p, .chunk--chat .name").forEach((el) => {
			const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
				acceptNode: (n) =>
					n.parentElement.closest("a, button")
						? NodeFilter.FILTER_REJECT
						: NodeFilter.FILTER_ACCEPT
			});
			const nodes = [];
			while (walker.nextNode()) nodes.push(walker.currentNode);

			nodes.forEach((node) => {
				// splitText truncates nodes in place, so match against a snapshot
				// and track where the remaining node starts in the original text
				let current = node;
				let start = 0;
				for (const match of [...node.textContent.matchAll(pattern)]) {
					const person = lookup.get(match[1]);
					const anchor = `--person-${buttons.length}`;

					const rest = current.splitText(match.index - start);
					current = rest.splitText(match[0].length);
					start = match.index + match[0].length;
					buttons.push({ button: wrap(rest, person, anchor), person, anchor });
				}
			});
		});

		// one popover per person, so tether it to whichever mention was clicked.
		// click fires before popovertarget toggles, so the anchor is set in time
		const cleanups = buttons.map(({ button, person, anchor }) => {
			const tip = document.getElementById(person.id);
			const onClick = (e) => {
				const open = tip.matches(":popover-open");
				const elsewhere =
					tip.style.getPropertyValue("position-anchor") !== anchor;
				tip.style.setProperty("position-anchor", anchor);
				// already open under another mention: move it instead of closing it
				if (open && elsewhere) e.preventDefault();
			};
			button.addEventListener("click", onClick);
			return () => button.removeEventListener("click", onClick);
		});

		return () => cleanups.forEach((fn) => fn());
	});
</script>

{#each people as { id, name, short, description } (id)}
	<div {id} class="tip" popover>
		<button
			class="close"
			popovertarget={id}
			popovertargetaction="hide"
			aria-label="Close">×</button
		>
		<p><mark>{name}</mark></p>
		<strong>{short}</strong>
		<p>{description}</p>
	</div>
{/each}

<style>
	:global(button.person) {
		font: inherit;
		color: inherit;
		background: none;
		border: none;
		padding: 0;
		cursor: help;
		text-decoration: underline dotted;
		text-decoration-thickness: 2px;
		text-underline-offset: 0.15em;
	}

	:global(button.person:focus-visible) {
		outline: 3px solid currentColor;
		outline-offset: 2px;
	}

	.tip {
		/* undo the UA popover centering so anchor positioning takes over */
		inset: auto;
		margin: 0.5rem 1rem;
		position-area: bottom;
		position-try-fallbacks: flip-block, flip-inline;

		width: max-content;
		max-width: min(20rem, calc(100vw - 2rem));
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-fg);
		background: var(--color-bg);
		color: var(--color-fg);
		font-family: var(--font-sans);
		font-size: var(--16px);
		line-height: 1.4;
	}

	.tip p {
		margin: 0.25rem 0 0 0;
	}

	.tip strong {
		display: block;
		padding-right: 1.5rem;
	}

	.close {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		font-size: var(--20px);
		line-height: 1;
		cursor: pointer;
	}

	.close:focus-visible {
		outline: 3px solid currentColor;
		outline-offset: 2px;
	}

	/* older browsers: pin to the bottom of the viewport instead */
	@supports not (anchor-name: --a) {
		.tip {
			inset: auto 1rem 1rem 1rem;
			margin: 0 auto;
		}
	}
</style>
