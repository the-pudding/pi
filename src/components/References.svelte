<script>
	import { ascending } from "d3";
	let { references = [] } = $props();

	let sorted = $derived(references.sort((a, b) => ascending(a.title, b.title)));
</script>

<section>
	<div class="chunk">
		<h3>References</h3>
		<ul>
			{#each sorted as { title, link }}
				<li>
					<a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	li {
		font-size: var(--16px);
	}

	@media (min-width: 40rem) {
		li {
			font-size: var(--18px);
		}
	}
</style>
