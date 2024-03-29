<script lang="ts">
	import type { PageData } from './$types';
	import type { Deal, SkillType, User, JobType } from '$lib/stores/Types';
	import CreatorCard from '$lib/components/creator/CreatorCard.svelte';
	import Skill from '$lib/components/profile/Skill.svelte';
	import SkillCard from '$lib/components/creator/SkillCard.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { Svrollbar } from 'svrollbar';
	import Favorite from '$lib/components/creator/Favorite.svelte';
	import Watchlist from '$lib/components/creator/Watchlist.svelte';
	import { userAddress } from '$lib/stores/Network';
	import { ethers } from 'ethers';
	import { env } from '$env/dynamic/public';
	import { escrow_abi } from '$lib/stores/ABI';
	import { networkSigner } from '$lib/stores/Network';
	import { base, assets } from '$app/paths';

	export let data: PageData;
	let viewport: Element;
	let contents: Element;
	let feedHeight = 0;
	$: if (browser) feedHeight = window.innerHeight - 146;
	let tabs: string[] = ['skills', 'favorites', 'watchlist', 'job history'];
	let chosen_tab: string = 'skills';
	let chosen_skill: SkillType | null = null;
	let user: User = data.user;
	let addr: string = $page.params['address'];

	const fetchDeals = async () => {
		const Escrow = new ethers.Contract(env.PUBLIC_ESCROW_ADDRESS!, escrow_abi, $networkSigner);
		const deals = await Escrow.getDealsOf($userAddress);
		return deals;
	};
	const fetchJob = async (deal: Deal) => {
		const url = `${base}/api/get_job/${deal.recruiter}/${deal.jobId}`;
		const response = await fetch(url);
		const job: JobType = await response.json();
		return job;
	};
</script>

<svelte:head>
	<title>HW | Creator</title>
	<meta name="description" content="HonestWork Skills Page" />
</svelte:head>

<div style="height: 16px" />
<main>
	<CreatorCard {user} {addr} />
	<div style="width: 12px" />
	<div class="details">
		<div class="bar">
			{#each tabs as tab, index}
				<div class="bar-item" on:click={() => (chosen_tab = tabs[index])} on:keydown>
					<p class={chosen_tab == tab ? 'yellow' : 'light-60'}>{tab}</p>
				</div>
			{/each}
		</div>
		<div class="wrapper">
			<div
				class="viewport"
				bind:this={viewport}
				style={`width:520px; height:${feedHeight.toString() + 'px'}`}
			>
				<div class="contents" bind:this={contents}>
					{#if chosen_skill != null}
						<div class="back-container">
							<div class="bar-item" on:click={() => (chosen_skill = null)} on:keydown>
								<p class="yellow link">back to skills</p>
							</div>
						</div>
					{/if}
					{#if chosen_tab == 'skills'}
						{#if chosen_skill == null}
							{#if data.skills != null}
								{#each data.skills as skill, i}
									<div style="height: 8px" />
									<div on:click={() => (chosen_skill = skill)} on:keydown>
										<Skill slot={i} {skill} width={508} />
									</div>
								{/each}
							{/if}
						{:else}
							<SkillCard skill={chosen_skill} />
						{/if}
					{:else if chosen_tab == 'favorites'}
						{#if data.user.favorites != null}
							{#each data.user.favorites as favorite}
								<Favorite {favorite} />
							{/each}
						{/if}
					{:else if chosen_tab == 'watchlist'}
						{#if data.user.watchlist != null}
							{#each data.user.watchlist as watchlist}
								<Watchlist {watchlist} />
							{/each}
						{/if}
					{:else if chosen_tab == 'job history'}
						{#await fetchDeals() then deals}
							{#if deals != null}
								{#each deals as deal}
									{#await fetchJob(deal.jobId) then job}
										<div class="container">
											<div class="left">
												<img src={job.imageurl} alt={job.username} class="job-image" />
												<a class="content" href={`${base}/job/${deal.recruiter}/${job.slot}`}>
													<div class="username">
														<p class="link">{job.username}</p>
														<div style="width:4px" />
														<img
															src={`${assets}/icons/external.svg`}
															alt="external"
															style="margin-top:-2px"
														/>
													</div>
													<p class="light-60">{job.title}</p>
												</a>
											</div>
										</div>
									{/await}
								{/each}
							{/if}
						{/await}
					{/if}
					<div style="height:32px;" />
				</div>
			</div>
			<Svrollbar {viewport} {contents} alwaysVisible />
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}
	.details {
		width: 520px;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.bar {
		height: 32px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		padding: 0 12px 0 0;
	}
	.bar-item {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 8px 12px;
		border-width: 0px 1px 0px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		cursor: pointer;
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
		background-color: var(--color-dark);
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
	.contents {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.back-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.container {
		display: flex;
		flex-direction: row;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		justify-content: space-between;
		align-items: center;
	}
	.job-image {
		width: 60px;
		height: 60px;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 12px;
	}
	.username {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	.left {
		display: flex;
		flex-direction: row;
	}
</style>
