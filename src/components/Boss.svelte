<script>
	import { tick } from "svelte";
	import { modes } from "../runes/misc.svelte.js";
	import focusTrap from "$actions/focusTrap.js";
	let { chat, interactive } = $props();

	const history = {
		Today: [
			"Q3 revenue projections",
			"Resignation letter draft",
			"Understanding vibe coding"
		],
		"Previous 7 days": [
			"Competitor teardown",
			"Follow-up on rash spreading",
			"Pricing strategy options",
			"Handling coworker bad breath"
		],
		"Previous 30 days": ["What is this strange rash?", "Report summary filler"]
	};

	const AI_DELAY = 1000;

	let added = $state([]);
	let waiting = $state(false);
	let chatEl;

	let messages = $derived([...chat, ...added]);
	let done = $derived(added.length >= (interactive?.length ?? 0));

	const scrollToBottom = async () => {
		await tick();
		chatEl?.scrollTo({ top: chatEl.scrollHeight, behavior: "smooth" });
	};

	const onSubmit = (e) => {
		e.preventDefault();
		e.currentTarget.reset();
		if (waiting || done) return;

		const user = interactive[added.length];
		added.push(user);
		scrollToBottom();

		const ai = interactive[added.length];
		if (ai?.name !== "ai") return;

		waiting = true;
		setTimeout(() => {
			added.push(ai);
			waiting = false;
			scrollToBottom();
		}, AI_DELAY);
	};
</script>

<div
	id="boss"
	role="dialog"
	aria-modal="true"
	aria-label="PiGPT chat"
	use:focusTrap={{
		disable: !modes.boss,
		onEscape: () => (modes.boss = false)
	}}
	class:visible={modes.boss}
>
	<div class="panel">
		<div class="panel-top">
			<button tabindex="-1">New chat</button>
			<button tabindex="-1">Search chats</button>
			<button tabindex="-1">Library</button>
		</div>

		<div class="panel-history">
			{#each Object.entries(history) as [label, items]}
				<h3>{label}</h3>
				{#each items as item}
					<button tabindex="-1">{item}</button>
				{/each}
			{/each}
		</div>

		<div class="panel-account">
			<button tabindex="-1"><span class="avatar">U</span>User</button>
		</div>
	</div>

	<div class="main">
		<header>
			PiGPT <span>3.14 &#9662;</span>
			<button
				class="close"
				onclick={() => (modes.boss = false)}
				aria-label="Close">&times;</button
			>
		</header>

		<div class="chat" bind:this={chatEl}>
			{#each messages as { name, text }}
				<div class={name}>
					<div class="chat-text">
						{#each text as { value }}
							<p>{@html value}</p>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<footer>
			<form class="composer" onsubmit={onSubmit}>
				<input placeholder="Ask anything" tabindex="-1" />
				<button type="button" class="round" tabindex="-1">+</button>
				<button
					type="submit"
					class="round send"
					aria-label="Send"
					disabled={waiting || done}>&#8593;</button
				>
			</form>
			<p class="disclaimer">
				PiGPT has never made a mistake. Trust it implicitly.
			</p>
		</footer>
	</div>
</div>

<style>
	#boss {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: var(--z-overlay);
		font-family: var(--font-sans);
		color: var(--color-black);
		background: var(--color-white);
		display: none;
		overflow: hidden;
	}

	#boss.visible {
		display: flex;
	}

	.panel {
		width: 15rem;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		background: var(--color-gray-100);
		border-right: 1px solid var(--color-gray-300);
	}

	.panel button {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		border-radius: 0.5rem;
		padding: 0.5rem;
		font: inherit;
		font-size: var(--14px);
		color: var(--color-fg-a4);
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-transform: capitalize;
	}

	.panel button:hover {
		background: var(--color-gray-200);
	}

	.panel h3 {
		margin: 1rem 0 0.25rem 0.5rem;
		font-size: var(--12px);
		font-weight: normal;
		color: var(--color-fg-a3);
	}

	.panel-history {
		flex: 1;
		overflow-y: auto;
	}

	.panel-account {
		border-top: 1px solid var(--color-gray-300);
		padding-top: 0.5rem;
	}

	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		line-height: 1;
		margin-right: 0.5rem;
		border-radius: 50%;
		background: var(--color-blue);
		color: var(--color-white);
		font-size: var(--12px);
		vertical-align: middle;
	}

	/* main */

	.main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	header {
		position: relative;
		padding: 1rem;
		border-bottom: 1px solid var(--color-gray-300);
		font-weight: bold;
	}

	header span {
		color: var(--color-fg-a3);
		font-weight: normal;
	}

	.close {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: 50%;
		background: none;
		color: var(--color-gray-fg-a3);
		font-family: inherit;
		font-size: var(--24px);
		line-height: 1;
		cursor: pointer;
	}

	.close:hover {
		background: var(--color-gray-300);
		color: var(--color-black);
	}

	/* chat */

	.chat {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem 0;
	}

	.chat-text {
		max-width: 45rem;
		margin: 0 auto 1.5rem auto;
		padding: 0 1rem;
	}

	.chat p {
		margin: 0 0 1rem 0;
		font-size: var(--16px);
		line-height: 1.5;
	}

	.user .chat-text {
		text-align: right;
	}

	.user p {
		display: inline-block;
		max-width: 80%;
		margin-bottom: 0;
		padding: 0.5rem 1rem;
		text-align: left;
		background: var(--color-gray-200);
		border-radius: 1rem;
	}

	/* composer */

	footer {
		padding: 0 1rem 1rem 1rem;
	}

	.composer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		max-width: 45rem;
		margin: 0 auto;
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		background: var(--color-white);
		border: 1px solid var(--color-gray-300);
		border-radius: 1.5rem;
	}

	.composer input {
		flex: 1;
		border: none;
		outline: none;
		font: var(--font-sans);
		padding: 0.5rem 0;
	}

	.round {
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
		border: none;
		border-radius: 50%;
		background: var(--color-gray-300);
		color: var(--color-black);
		font-size: var(--16px);
		cursor: pointer;
	}

	.round.send {
		background: var(--color-black);
		color: var(--color-white);
	}

	.round.send:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.disclaimer {
		margin: 0.5rem 0 0 0;
		font-size: var(--12px);
		color: var(--color-fg-a3);
		text-align: center;
	}

	@media (max-width: 60rem) {
		.panel {
			display: none;
		}
	}
</style>
