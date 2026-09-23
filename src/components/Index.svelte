<script>
	import { getContext } from "svelte";
	import Footer from "$components/Footer.svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Hero from "$components/Hero.svelte";
	import Warning from "$components/Warning.svelte";
	import Figure from "$components/helpers/Figure.svelte";

	const copy = getContext("copy");
	const { body } = copy;
	const components = { Figure, Hero, Warning };
</script>

<article>
	<CMS {body} {components}></CMS>
</article>

<svelte:boundary onerror={(e) => console.error(e)}>
	<!-- <Footer recirc={true} /> -->
</svelte:boundary>

<style>
	article {
		padding: 0 1rem;
		max-width: 1200px;
	}

	article,
	:global(p),
	:global(figure) {
		/* max-width: 45rem; */
		margin: 1rem auto;
	}

	article :global(figure) {
		margin: 4rem auto;
	}

	article :global(p) {
		font-size: var(--20px);
		line-height: 1.65;
	}

	@media only screen and (min-width: 720px) {
		article :global(p) {
			font-size: var(--28px);
			line-height: 1.4;
			margin: 1.5rem auto;
		}
	}
</style>
