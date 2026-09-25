<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Hero from "$components/Hero.svelte";
	import Menu from "$components/Menu.svelte";
	import Warning from "$components/Warning.svelte";
	import Figure from "$components/helpers/Figure.svelte";
	import Boss from "$components/Boss.svelte";
	import Friend from "$components/Friend.svelte";

	const copy = getContext("copy");
	const { body } = copy;
	const components = { Figure, Hero, Warning };
</script>

<Menu />

<article>
	<CMS {body} {components}></CMS>
</article>
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
		font-size: clamp(var(--20px), 3vw, var(--36px));
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
		font-size: clamp(var(--32px), 8vw, var(--160px));
		margin: 8rem auto 0 auto;
	}
</style>
