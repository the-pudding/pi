<script>
	import copy from "$data/copy.json";
	import computePi from "$utils/computePi.js";

	const real707 = computePi(707);
	const shanks707 = copy.pi.shanks707updated;

	const a = shanks707;
	const b = real707;
	// at what digit to they start to not equal eachother?
	const firstMismatchIndex = b
		.split("")
		.findIndex((d, i) => d !== a.split("")[i]);

	console.log(firstMismatchIndex);
</script>

<div>
	<code>
		{#each a.split("") as d}
			<span class="pi-digit d{d}">{d}</span>
		{/each}
	</code>

	<!-- p -->
	<!-- <p>real</p> -->
	<code>
		{#each b.split("") as d}
			<span class="pi-digit d{d}">{d}</span>
		{/each}
	</code>
</div>

<style>
	div {
		color: white;
		background: black;
		padding: 1rem;
		min-height: 100svh;
	}
	/* every fifth digit, space to right */
	code {
		width: 90%;
		line-height: 1.5;
		position: absolute;
	}
	.pi-digit:nth-child(5n) {
		margin-right: 1ch;
	}

	/* color by d (0-9) */
	.d0 {
		color: #e6194b;
	}
	.d1 {
		color: #3cb44b;
	}
	.d2 {
		color: #ffe119;
	}
	.d3 {
		color: #0082c8;
	}
	.d4 {
		color: #f58231;
	}
	.d5 {
		color: white;
	}
	.d6 {
		color: #46f0f0;
	}
	.d7 {
		color: #f032e6;
	}
	.d8 {
		color: #d2f53c;
	}
	.d9 {
		color: #fabebe;
	}
</style>
