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

	article,
	:global(p),
	:global(figure) {
		/* max-width: 45rem; */
		margin: 1rem auto;
	}

	article :global(figure) {
		margin: 4 rem auto;
	}

	article :global(p) {
		font-size: clamp(var(--20px), 3vw, var(--40px));
		line-height: 1.5;
		max-width: 25em;
	}

	@media only screen and (min-width: 720px) {
		article :global(p) {
			line-height: 1.4;
			margin: 1.5rem auto;
		}
	}

	@media only screen and (min-width: 1280px) {
		article :global(p) {
			line-height: 1.325;
			margin: 2rem auto;
		}
	}
</style>
