<script>
	import { base } from "$app/paths";
	import { modes } from "../runes/misc.svelte.js";

	const videos = [
		{
			id: 0,
			user: "hannah.eats",
			caption: "he did NOT think i would actually do it #fyp #nope",
			sound: "original sound - hannah.eats",
			likes: "412.9K",
			comments: "8,204",
			saves: "31.7K"
		},
		{
			id: 1,
			user: "certified_dogguy",
			caption: "day 43 of teaching him to say i love you",
			sound: "Sunroof - Nicky Youre & dazy",
			likes: "1.2M",
			comments: "22.5K",
			saves: "190.4K"
		},
		{
			id: 2,
			user: "notyourchef",
			caption: "pov: you asked for the recipe and i sent you this",
			sound: "original sound - notyourchef",
			likes: "88.1K",
			comments: "1,932",
			saves: "12.0K"
		}
	];
</script>

<section id="friend" class:visible={modes.friend}>
	<div class="tabs">
		<span>Following</span>
		<span class="active">For You</span>
	</div>

	<button
		class="close"
		onclick={() => (modes.friend = false)}
		aria-label="Close">&times;</button
	>

	<div class="feed">
		{#each videos as { id, user, caption, sound, likes, comments, saves }}
			<div class="video">
				<img src="{base}/assets/friend/{id}.webp" alt="" />

				<div class="rail">
					<div class="avatar">{user.charAt(0).toUpperCase()}</div>
					<div class="action">
						<span class="icon">&#9829;</span>
						<span class="count">{likes}</span>
					</div>
					<div class="action">
						<span class="icon">&#128172;</span>
						<span class="count">{comments}</span>
					</div>
					<div class="action">
						<span class="icon">&#128278;</span>
						<span class="count">{saves}</span>
					</div>
					<div class="action">
						<span class="icon">&#10150;</span>
						<span class="count">Share</span>
					</div>
				</div>

				<div class="info">
					<p class="user">@{user}</p>
					<p class="caption">{caption}</p>
					<p class="sound">&#9834; {sound}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	#friend {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100dvh;
		z-index: var(--z-overlay);
		font-family: var(--font-sans);
		font-size: 14px;
		color: white;
		background: black;
		display: none;
		flex-direction: column;
	}

	#friend.visible {
		display: flex;
	}

	/* top tabs */

	.tabs {
		position: absolute;
		top: 12px;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 20px;
		z-index: 2;
		font-size: 16px;
	}

	.tabs span {
		color: lightgray;
	}

	.tabs .active {
		color: white;
		font-weight: bold;
		border-bottom: 2px solid white;
		padding-bottom: 2px;
	}

	.close {
		position: absolute;
		top: 8px;
		right: 12px;
		z-index: 2;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 50%;
		background: none;
		color: white;
		font-family: inherit;
		font-size: 26px;
		line-height: 1;
		cursor: pointer;
	}

	/* the feed: the only thing that actually works */

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
		background: black;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.video img {
		width: auto;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* right rail */

	.rail {
		position: absolute;
		right: 10px;
		bottom: 90px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		text-align: center;
	}

	.avatar {
		width: 44px;
		height: 44px;
		line-height: 44px;
		border-radius: 50%;
		border: 1px solid white;
		background: dimgray;
		font-size: 18px;
		font-weight: bold;
	}

	.icon {
		display: block;
		font-size: 28px;
	}

	.count {
		font-size: 12px;
		font-weight: bold;
	}

	/* bottom left caption */

	.info {
		position: absolute;
		left: 12px;
		bottom: 90px;
		width: 70%;
	}

	.info p {
		margin: 0 0 6px 0;
		line-height: 1.3;
	}

	.user {
		font-size: 16px;
		font-weight: bold;
	}

	.sound {
		font-size: 13px;
	}
</style>
