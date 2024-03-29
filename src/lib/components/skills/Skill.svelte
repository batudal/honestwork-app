<svelte:options immutable={true} />

<script lang="ts">
	import { new_conversation_metadata, user_signed_in } from '$lib/stores/State';
	import type { FavoriteType, SkillType, User } from '$lib/stores/Types';
	import { onMount } from 'svelte';
	import { assets, base } from '$app/paths';
	import { placeholder_image } from '$lib/stores/Constants';
	import { userConnected, userAddress } from '$lib/stores/Network';
	import { toast } from '@zerodevx/svelte-toast';
	import { parseContent } from '$lib/stores/Parser';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let chosen: boolean;
	export let skill: SkillType;

	let user: User;
	let hovering_heart: boolean = false;
	let favorited: boolean = false;

	let preload_images = [`${assets}/icons/halfheart.svg`, `${assets}/icons/heart.svg`];
	onMount(() => {
		fetchUser();
		getFavorites();
	});

	$: if ($userConnected) {
		getFavorites();
	}
	$: username_trimmed =
		user?.username.length > 16 ? user?.username.slice(0, 16) + '...' : user?.username;
	const search = (tag: string) => {
		dispatch('search', { text: tag });
	};
	const handleAddToFavorites = async () => {
		if ($userConnected) {
			try {
				const url = `${base}/api/favorites/add`;
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						address: skill.useraddress,
						slot: skill.slot
					})
				});
				const data = await response.json();
				if (data == 'success') {
					favorited = true;
					toast.push(
						`<p class="light-60"><span style='color:var(--color-success)'>success: </span>Added to favorites!</p>`
					);
				} else {
					toast.push(
						`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${data}</p>`
					);
				}
			} catch (e) {
				console.log(e);
			}
		}
	};

	const handleRemoveFromFavorites = async () => {
		if ($userConnected) {
			try {
				const url = `${base}/api/favorites/remove`;
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						address: skill.useraddress,
						slot: skill.slot
					})
				});
				const data = await response.json();
				if (data == 'success') {
					favorited = false;
					toast.push(
						`<p class="light-60"><span style='color:var(--color-success)'>success: </span>Removed from favorites.</p>`
					);
				} else {
					toast.push(
						`<p class="light-60"><span style='color:var(--color-error)'>error: </span>Failed to remove from favorites.</p>`
					);
				}
			} catch (error) {
				toast.push(
					`<p class="light-60"><span style='color:var(--color-error)'>error: </span>Failed to remove from favorites.</p>`
				);
			}
		}
	};
	const fetchUser = async () => {
		const res = await fetch(`/api/user/${skill.useraddress}`);
		user = await res.json();
	};

	const getFavorites = async () => {
		if (!$user_signed_in || !$userConnected) {
			return;
		}
		try {
			const url = `${base}/api/favorites/get/${$userAddress}`;
			const response = await fetch(url);
			const data = await response.json();
			if (data && data.length != 0) {
				data.forEach((f: FavoriteType) => {
					if (f.input.address == skill.useraddress && f.input.slot == skill.slot) {
						favorited = true;
					}
				});
			}
		} catch (e) {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${e}</p>`
			);
		}
	};
	const handleNewConversation = async () => {
		try {
			const url = `${base}/api/conversation_add/${skill.useraddress}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: skill.title
				})
			});
			const data = await response.json();
			if (data == 'success') {
				new_conversation_metadata.set({
					address: skill.useraddress,
					title: skill.title
				});
				toast.push(
					`<p class="light-60"><span style='color:var(--color-success)'>success: </span>Created new conversation</p>`
				);
				goto('/messages');
			} else {
				toast.push(
					`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${data.message}</p>`
				);
			}
		} catch (err: any) {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${err}</p>`
			);
		}
	};
	const getRating = async () => {
		if (browser) {
			try {
				const url = `${base}/api/rating/${skill.useraddress}`;
				const response = await fetch(url);
				const data = await response.json();
				return data;
			} catch (e) {
				console.log(e);
			}
		}
	};
</script>

<svelte:head>
	{#each preload_images as image}
		<link rel="preload" as="image" href={image} />
	{/each}
</svelte:head>

<section class={chosen ? 'chosen' : ''}>
	<div class="contents">
		<div class="thumbnail">
			<img
				src={skill.imageurls[0] ? skill.imageurls[0] + '?tr=h-360,w-480' : placeholder_image}
				alt="gallery"
				class="preview-image"
			/>
		</div>
		<div class="content">
			<div>
				<p>{skill.title}</p>
				<div style="height:12px" />
				<div class="body-text light-60">
					{parseContent(skill.description).slice(0, 140) + '...'}
				</div>
			</div>
			<div style="height: 12px" />
			<div class="sub">
				<p class="yellow">{username_trimmed}</p>
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
	</div>
	<div class="tag-bar">
		<div class="tags">
			{#each skill.tags as tag}
				<div class="tag link">
					<p on:click={() => search(tag)} on:keydown>#{tag}</p>
				</div>
			{/each}
		</div>
		<div class="actions">
			<div class="action">
				<p class="light-40"><span class="light">${skill.minimumprice}</span>/h</p>
			</div>
			<div class="action" on:click={handleNewConversation} on:keydown>
				<img src={`${assets}/icons/message.svg`} alt="message" />
			</div>
			<div
				class="action"
				on:mouseover={() => (hovering_heart = true)}
				on:focus
				on:mouseout={() => (hovering_heart = false)}
				on:blur
				on:click={favorited ? handleRemoveFromFavorites : handleAddToFavorites}
				on:keydown
			>
				{#if hovering_heart || favorited}
					<img class="icon-svg" src={`${assets}/icons/halfheart.svg`} alt="heart" />
				{:else}
					<img class="icon-svg" src={`${assets}/icons/heart.svg`} alt="heart" />
				{/if}
			</div>
		</div>
	</div>
</section>
<div style="height: 12px" />

<style>
	section {
		max-width: 100%;
		flex-direction: column;
		cursor: pointer;
		border-width: 1px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	section:hover {
		background-color: var(--color-light-2);
	}
	.contents {
		display: flex;
		flex-direction: row;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.thumbnail {
		height: 180px;
		width: 240px;
	}
	.content {
		display: flex;
		flex-direction: column;
		padding: 8px;
		justify-content: space-between;
		width: 278px;
	}
	.sub {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.preview-image {
		height: 180px;
		width: 240px;
	}
	.tag-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.tags {
		display: flex;
		flex-direction: row;
		z-index: 99;
	}
	.tag {
		padding: 8px;
		border-width: 0px 1px 0px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.tag:hover {
		background-color: var(--color-primary);
	}
	.tag:hover p {
		color: var(--color-dark);
	}
	.actions {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.action {
		height: 16px;
		padding: 8px;
		border-width: 0px 0px 0px 1px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.chosen {
		background-color: var(--color-light-2);
	}
	@media only screen and (max-width: 600px) {
		.thumbnail,
		.preview-image {
			height: 60px;
			width: 80px;
		}
	}
</style>
