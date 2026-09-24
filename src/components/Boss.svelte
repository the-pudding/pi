<script>
	import { modes } from "../runes/misc.svelte.js";
	let { chat } = $props();

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
</script>

<section id="boss" class:visible={modes.boss}>
	<div class="panel">
		<div class="panel-top">
			<button>New chat</button>
			<button>Search chats</button>
			<button>Library</button>
		</div>

		<div class="panel-history">
			{#each Object.entries(history) as [label, items]}
				<h3>{label}</h3>
				{#each items as item}
					<button>{item}</button>
				{/each}
			{/each}
		</div>

		<div class="panel-account">
			<button><span class="avatar">U</span>User</button>
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

		<div class="chat">
			{#each chat as { name, text }}
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
			<div class="composer">
				<input placeholder="Ask anything" />
				<button class="round">+</button>
				<button class="round send">&#8593;</button>
			</div>
			<p class="disclaimer">
				PiGPT has never made a mistake. Trust it implicitly.
			</p>
		</footer>
	</div>
</section>

<style>
	#boss {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: var(--z-overlay);
		font-family: var(--font-sans);
		font-size: 16px;
		color: black;
		background: white;
		display: none;
	}

	#boss.visible {
		display: flex;
	}

	/* panel */

	.panel {
		width: 260px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		padding: 8px;
		background: whitesmoke;
		border-right: 1px solid gainsboro;
	}

	.panel button {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		border-radius: 8px;
		padding: 8px 10px;
		font: inherit;
		color: black;
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.panel button:hover {
		background: gainsboro;
	}

	.panel h3 {
		margin: 18px 0 4px 10px;
		font-size: 12px;
		font-weight: normal;
		color: gray;
	}

	.panel-history {
		flex: 1;
		overflow-y: auto;
	}

	.panel-account {
		border-top: 1px solid gainsboro;
		padding-top: 8px;
	}

	.avatar {
		display: inline-block;
		width: 24px;
		height: 24px;
		line-height: 24px;
		margin-right: 8px;
		border-radius: 50%;
		background: darkslateblue;
		color: white;
		font-size: 12px;
		text-align: center;
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
		padding: 12px 16px;
		border-bottom: 1px solid gainsboro;
		font-weight: bold;
	}

	header span {
		color: gray;
		font-weight: normal;
	}

	.close {
		position: absolute;
		top: 50%;
		right: 12px;
		transform: translateY(-50%);
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 50%;
		background: none;
		color: gray;
		font-family: inherit;
		font-size: 24px;
		line-height: 1;
		cursor: pointer;
	}

	.close:hover {
		background: gainsboro;
		color: black;
	}

	/* chat */

	.chat {
		flex: 1;
		overflow-y: auto;
		padding: 24px 0;
	}

	.chat-text {
		max-width: 720px;
		margin: 0 auto 24px auto;
		padding: 0 16px;
	}

	.chat p {
		margin: 0 0 16px 0;
		font-size: 15px;
		line-height: 1.6;
	}

	.user .chat-text {
		text-align: right;
	}

	.user p {
		display: inline-block;
		max-width: 80%;
		margin-bottom: 0;
		padding: 10px 16px;
		text-align: left;
		background: gainsboro;
		border-radius: 18px;
	}

	/* composer */

	footer {
		padding: 0 16px 12px 16px;
	}

	.composer {
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: 720px;
		margin: 0 auto;
		padding: 8px 8px 8px 16px;
		background: white;
		border: 1px solid darkgray;
		border-radius: 24px;
	}

	.composer input {
		flex: 1;
		border: none;
		outline: none;
		font: inherit;
		padding: 6px 0;
	}

	.round {
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		border: none;
		border-radius: 50%;
		background: gainsboro;
		color: black;
		font-size: 16px;
		cursor: pointer;
	}

	.round.send {
		background: black;
		color: white;
	}

	.disclaimer {
		margin: 8px 0 0 0;
		font-size: 12px;
		color: gray;
		text-align: center;
	}
</style>
