<script>
	import { base } from "$app/paths";
	import { modes } from "../runes/misc.svelte.js";
	import focusTrap from "$actions/focusTrap.js";
	import Heart from "@lucide/svelte/icons/heart";
	import MessageCircle from "@lucide/svelte/icons/message-circle";
	import Bookmark from "@lucide/svelte/icons/bookmark";
	import Share2 from "@lucide/svelte/icons/share-2";
	import ChevronUp from "@lucide/svelte/icons/chevron-up";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import Plus from "@lucide/svelte/icons/plus";
	import Play from "@lucide/svelte/icons/play";
	import Pause from "@lucide/svelte/icons/pause";
	import X from "@lucide/svelte/icons/x";

	const videos = [
		{
			id: 0,
			user: "another_cat",
			caption: "omg just use the brita! #fyp #brita",
			likes: "40.1T",
			comments: "863.2K",
			saves: "31.5M",
			alt: "cat drinking water from sink"
		},
		{
			id: 1,
			user: "certified.millienial",
			caption: "day 43 of learning to dance #mercedes",
			likes: "1.2M",
			comments: "22.5K",
			saves: "190.4K",
			alt: "lady dancing in front of green car slowly moving"
		},
		{
			id: 2,
			user: "gainsville.fla",
			caption: "4am second workout of the day #riseandgrind #noexcuses",
			likes: "32",
			comments: "14,177",
			saves: "0",
			alt: "guy lifting weights"
		}
	];

	let feedEl;
	let videoEls = $state([]);
	const reduceMotion =
		typeof matchMedia !== "undefined" &&
		matchMedia("(prefers-reduced-motion: reduce)").matches;
	let paused = $state(reduceMotion);

	// "40.1T" -> "40.1 trillion" so screen readers don't read a bare letter
	const UNITS = { T: "trillion", M: "million", K: "thousand" };
	const spoken = (n) => n.replace(/([TMK])$/, (_, u) => ` ${UNITS[u]}`);
	let scrollTop = $state(0);
	let scrollMax = $state(0);

	const atTop = $derived(scrollTop < 8);
	const atBottom = $derived(scrollTop >= scrollMax - 8);

	function measure() {
		if (!feedEl) return;
		scrollTop = feedEl.scrollTop;
		scrollMax = feedEl.scrollHeight - feedEl.clientHeight;
	}

	function nav(dir) {
		if (dir < 0 ? atTop : atBottom) return;
		feedEl?.scrollBy({
			top: dir * feedEl.clientHeight,
			behavior: reduceMotion ? "auto" : "smooth"
		});
	}

	$effect(() => {
		if (modes.friend) measure();
	});

	$effect(() => {
		const play = modes.friend && !paused;
		videoEls.forEach((v) => {
			if (!v) return;
			if (play) v.play().catch(() => {});
			else v.pause();
		});
	});
</script>

<div
	id="friend"
	role="dialog"
	aria-modal="true"
	aria-label="Video feed"
	use:focusTrap={{
		disable: !modes.friend,
		onEscape: () => (modes.friend = false)
	}}
	class:visible={modes.friend}
>
	<div class="tabs">
		<span>Following</span>
		<span class="active">For You</span>
	</div>

	<button
		class="close"
		onclick={() => (modes.friend = false)}
		aria-label="Close"><X /></button
	>

	<div
		class="feed"
		role="region"
		aria-label="Videos"
		tabindex="0"
		bind:this={feedEl}
		onscroll={measure}
	>
		{#each videos as { id, user, caption, likes, comments, saves, alt }, i}
			<div class="video">
				<div class="frame">
					<video
						src="{base}/assets/videos/friend-{id}.mp4"
						poster="{base}/assets/videos/friend-{id}.jpg"
						aria-label={alt}
						bind:this={videoEls[i]}
						muted
						loop
					></video>

					<div class="info">
						<p class="user">@{user}</p>
						<p class="caption">{caption}</p>
					</div>
				</div>

				<div class="rail">
					<div class="avatar">
						<span class="letter">{user.charAt(0).toUpperCase()}</span>
						<span class="follow"><Plus /></span>
					</div>
					<div class="action">
						<span class="icon"><Heart /></span>
						<span class="count" aria-hidden="true">{likes}</span>
						<span class="sr-only">{spoken(likes)} likes</span>
					</div>
					<div class="action">
						<span class="icon"><MessageCircle /></span>
						<span class="count" aria-hidden="true">{comments}</span>
						<span class="sr-only">{spoken(comments)} comments</span>
					</div>
					<div class="action">
						<span class="icon"><Bookmark /></span>
						<span class="count" aria-hidden="true">{saves}</span>
						<span class="sr-only">{spoken(saves)} saves</span>
					</div>
					<div class="action">
						<span class="icon"><Share2 /></span>
						<span class="count">Share</span>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="nav">
		<button
			onclick={() => (paused = !paused)}
			aria-label={paused ? "Play videos" : "Pause videos"}
			>{#if paused}<Play />{:else}<Pause />{/if}</button
		>
		<button
			onclick={() => nav(-1)}
			aria-disabled={atTop}
			aria-label="Previous video"><ChevronUp /></button
		>
		<button
			onclick={() => nav(1)}
			aria-disabled={atBottom}
			aria-label="Next video"><ChevronDown /></button
		>
	</div>
</div>

<style>
	#friend {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: var(--z-overlay);
		font-family: var(--font-sans);
		font-size: var(--14px);
		color: var(--color-white);
		background: var(--color-black);
		display: none;
		flex-direction: column;
		overflow: hidden;
	}

	#friend.visible {
		display: flex;
	}
	#friend :focus-visible {
		outline: 3px solid var(--color-white);
		outline-offset: 2px;
	}

	#friend .feed:focus-visible {
		outline-offset: -4px;
	}

	.tabs {
		position: absolute;
		top: 1rem;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 1rem;
		z-index: var(--z-top);
		font-size: var(--16px);
	}

	.tabs span {
		color: var(--color-fg-a3);
	}

	.tabs .active {
		color: var(--color-white);
		font-weight: bold;
		border-bottom: 2px solid var(--color-white);
		padding-bottom: 0.125rem;
	}

	.close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: var(--z-top);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0.5rem;
		border: none;
		border-radius: 50%;
		background: none;
		background: var(--color-fg-a4);
		color: var(--color-white);
		cursor: pointer;
	}

	.close:hover {
		background: var(--color-fg-a2);
		color: var(--color-white);
	}

	.feed {
		height: 100%;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		scrollbar-width: none;
	}

	.feed::-webkit-scrollbar {
		display: none;
	}

	.video {
		position: relative;
		height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		background: var(--color-black);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.frame {
		position: relative;
		height: 100%;
		max-width: 100%;
		aspect-ratio: 9 / 16;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.frame video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.rail {
		align-self: flex-end;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.125rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.avatar {
		position: relative;
		width: 2.75rem;
		height: 2.75rem;
		margin-bottom: 0.5rem;
	}

	.letter {
		display: block;
		width: 100%;
		height: 100%;
		line-height: 2.75rem;
		border-radius: 50%;
		border: 1px solid var(--color-white);
		background: var(--color-fg-a3);
		color: var(--color-white);
		font-size: var(--18px);
		font-weight: bold;
	}

	.follow {
		position: absolute;
		bottom: -0.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.125rem;
		height: 1.125rem;
		border-radius: 50%;
		background: var(--color-red);
		color: var(--color-white);
	}

	.follow :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
	}

	.icon {
		display: block;
		text-align: center;
		display: flex;
		justify-content: center;
		margin: 0 auto 0.25rem auto;
	}

	.icon :global(svg) {
		width: 1.875rem;
		height: 1.875rem;
	}

	.count {
		font-size: var(--12px);
		font-weight: bold;
	}

	.nav {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		z-index: var(--z-top);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0.5rem;
		border: none;
		border-radius: 50%;
		background: var(--color-fg-a4);
		color: var(--color-white);
		cursor: pointer;
	}

	.nav button:hover {
		background: var(--color-fg-a2);
	}

	.nav button[aria-disabled="true"] {
		opacity: 0.33;
		cursor: default;
	}

	.info {
		position: absolute;
		left: 0.75rem;
		bottom: 1rem;
		width: 70%;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	}

	.info p {
		margin: 0 0 0.25rem 0;
		line-height: 1;
	}

	.user {
		font-size: var(--16px);
		font-weight: bold;
	}

	@media (max-width: 50rem) {
		.video {
			gap: 0;
			padding: 0.5rem;
		}

		.rail {
			position: absolute;
			bottom: 0;
			right: 1rem;
		}
	}
</style>
