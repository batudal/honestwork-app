<script lang="ts">
	import type { User } from '$lib/stores/Types';
	import { placeholder_image } from '$lib/stores/Constants';
	import { userAddress, xmtpConnected } from '$lib/stores/Network';
	import { onMount } from 'svelte';
	import { assets, base } from '$app/paths';
	import { browser } from '$app/environment';
	import { toast } from '@zerodevx/svelte-toast';
	import { new_conversation_metadata } from '$lib/stores/State';
	import { goto } from '$app/navigation';
	import { Svrollbar } from 'svrollbar';
	import Tiptap from '../common/Tiptap.svelte';

	export let user: User;
	export let addr: string;
	let viewport: Element;
	let contents: Element;

	let nft_image: string;
	let feedHeight = 0;
	$: if (browser) feedHeight = window.innerHeight - 113;
	$: username_trimmed =
		user?.username.length > 16 ? user?.username.slice(0, 16) + '...' : user?.username;
	onMount(() => {
		if (user.shownft) getNft();
	});

	const getNft = async () => {
		if (user.nftaddress && user.nftid) {
			try {
				const response = await fetch(`${base}/api/alchemy/${user.nftaddress}/${user.nftid}`);
				if (response.ok) {
					const data = await response.json();
					nft_image = data.image;
				}
			} catch (err) {
				console.log(err);
			}
		}
	};
	const handleNewConversation = async () => {
		if (!$xmtpConnected) {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>XMTP not connected</p>`
			);
		} else {
			try {
				const url = `${base}/api/conversation_add/${addr}`;
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						title: $userAddress
					})
				});
				const data = await response.json();
				if (data == 'success') {
					new_conversation_metadata.set({
						address: addr,
						title: $userAddress
					});
					toast.push(
						`<p class="light-60"><span style='color:var(--color-success)'>success: </span>Created new conversation</p>`
					);
					goto('/messages');
				} else {
					toast.push(
						`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${data}</p>`
					);
				}
			} catch (err: any) {
				toast.push(
					`<p class="light-60"><span style='color:var(--color-success)'>success: </span>${err.Error()}</p>`
				);
			}
		}
	};
	const getRating = async () => {
		if (browser) {
			try {
				const url = `${base}/api/rating/${addr}`;
				const response = await fetch(url);
				const data = await response.json();
				return data;
			} catch (e) {
				console.log(e);
			}
		}
	};
</script>

<div class="wrapper">
	<div
		bind:this={viewport}
		class="viewport"
		style={`width:520px; height:${feedHeight.toString() + 'px'}`}
	>
		<div bind:this={contents} class="contents">
			<main>
				{#if user && user != null}
					<div class="profile-bar">
						<div class="left-section">
							<section>
								<img
									class="pfp"
									src={user.shownft && nft_image != null
										? nft_image
										: user.imageurl
										? user.imageurl + '?tr=h-120,w-120'
										: placeholder_image}
									alt="Profile"
									placeholder={placeholder_image}
								/>
							</section>
							<div style="width:8px;" />
							<div class="info">
								{#if user.showens}
									<p>{user.ensname}</p>
								{:else}
									<p>{username_trimmed}</p>
								{/if}
								<div style="height:4px;" />
								<p class="yellow">{user.title}</p>
								<div style="height:4px;" />
								{#await getRating()}
									<img
										src={`${assets}/icons/loader.svg`}
										alt="loading"
										class="rotating"
										style="height:16px;width:16px;"
									/>
								{:then rating}
									<p><span class="light-60">rating:</span>{rating}/10</p>
								{/await}
							</div>
						</div>
						<div class="right-section">
							<div class="button" on:click={handleNewConversation} on:keydown>
								<p class="yellow">send message</p>
							</div>
						</div>
					</div>
					<div class="bio">
						<Tiptap
							content={user.bio ? JSON.parse(user.bio) : 'No bio available'}
							editable={false}
						/>
					</div>
					{#each user.links as link, i}
						{#if link != ''}
							<a class="item" href={link} target="_blank" rel="noreferrer">
								<p>link #{i + 1} <span class="light-60">{link}</span></p>
								<img src={`${assets}/icons/external.svg`} alt="link" />
							</a>
						{/if}
					{/each}
				{/if}
			</main>
		</div>
	</div>
	<Svrollbar {viewport} {contents} />
</div>

<style>
	main {
		width: 520px;
		border-width: 1px 1px 0px 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
	}
	.profile-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
		cursor: pointer;
		padding: 12px;
		box-sizing: border-box;
	}
	.left-section {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}
	.pfp {
		width: 60px;
		height: 60px;
	}
	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		padding: 4px 8px;
		cursor: pointer;
	}
	.button:hover {
		background-color: var(--color-primary);
	}
	.button:hover p {
		color: var(--color-dark);
	}

	.bio {
		padding: 12px;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.item {
		padding: 8px;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		background-color: var(--color-dark);
	}
	.item:hover {
		background-color: var(--color-light-2);
	}
	.wrapper {
		position: relative;
		-ms-overflow-style: none; /* for Internet Explorer, Edge */
		scrollbar-width: none; /* for Firefox */
		overflow-y: scroll;
		--svrollbar-track-width: 1px;
		/* --svrollbar-track-background: #85b4b9; */
		--svrollbar-track-opacity: 1;

		--svrollbar-thumb-width: 1px;
		--svrollbar-thumb-background: #d9ab55;
		--svrollbar-thumb-opacity: 1;
	}
	.viewport {
		position: relative;
		overflow: scroll;
		box-sizing: border-box;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.viewport::-webkit-scrollbar {
		display: none;
	}
</style>
