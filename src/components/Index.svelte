<script>
	import { setContext, getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Hero from "$components/Hero.svelte";
	import Menu from "$components/Menu.svelte";
	import Warning from "$components/Warning.svelte";
	import Figure from "$components/helpers/Figure.svelte";
	import Boss from "$components/Boss.svelte";
	import Friend from "$components/Friend.svelte";
	import Specimen from "$components/Specimen.svelte";
	import Distribution from "$components/Distribution.svelte";
	import Walk from "$components/Walk.svelte";
	import WalkCouple from "$components/WalkCouple.svelte";
	import VennDiagram from "$components/VennDiagram.svelte";
	import Unroll from "$components/Unroll.svelte";
	import Term from "$components/Term.svelte";
	import { modes } from "$runes/misc.svelte.js";

	const copy = getContext("copy");
	const { body } = copy;
	setContext("pi", copy.pi);
	const components = {
		Figure,
		Hero,
		Warning,
		Specimen,
		Distribution,
		Walk,
		VennDiagram,
		Unroll,
		WalkCouple,
		Term
	};

	const overlay = $derived(modes.boss || modes.friend);

	$effect(() => {
		// make the page behind the overlay not scrollable
		document.documentElement.classList.toggle("no-scroll", overlay);
	});

	$effect(() => {
		document.querySelectorAll('a[href^="#"]').forEach((a) => {
			a.addEventListener("click", (e) => {
				const target = document.getElementById(a.hash.slice(1));
				if (!target) return;
				e.preventDefault();
				target.scrollIntoView({ behavior: "auto", block: "start" });
			});
		});
	});
</script>

<!-- inert while an overlay is open: keeps the background out of the tab order -->
<div class="page" inert={overlay}>
	<Menu />

	<article>
		<CMS {body} {components}></CMS>
	</article>
</div>

<Boss chat={copy.boss.chat}></Boss>
<Friend></Friend>

<svelte:boundary onerror={(e) => console.error(e)}>
	<!-- <Footer recirc={true} /> -->
</svelte:boundary>

<style>
	article {
		padding: 0 1rem;
	}

	article :global(section .chunk) {
		font-size: clamp(var(--20px), 3vw, var(--32px));
		max-width: 25em;
		margin: 2rem auto;
	}

	article :global(section .chunk--figure) {
		max-width: 1920px;
	}

	article :global(section .chunk--hero) {
		max-width: none;
	}

	article :global(h2) {
		font-size: clamp(var(--32px), 8vw, var(--128px));
		margin: 8rem auto 0 auto;
	}
</style>
