<script lang="ts">
	import { assets, base } from '$app/paths';
	import { ethers } from 'ethers';
	import { env } from '$env/dynamic/public';
	import { escrow_abi } from '$lib/stores/ABI';
	import { userAddress, networkProvider } from '$lib/stores/Network';
	import AgreementDB from '$lib/components/messages/AgreementDB.svelte';
	import AgreementChain from '$lib/components/messages/AgreementChain.svelte';
	import NewAgreement from './NewAgreement.svelte';
	import type { Deal } from '$lib/stores/Types';
	import { Svrollbar } from 'svrollbar';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';

	export let conversation: any;

	let feedHeight: number;
	let viewport: Element;
	let contents: Element;
	let new_agreement = false;

	$: if (browser) {
		feedHeight = window.innerHeight;
	}

	type UniqueDeal = {
		[key: number]: Deal;
	};

	let unq_deals: UniqueDeal = {};

	const fetchDealsChain = async () => {
		let chain_deals: Deal[] = [];
		try {
			const paymentContract = new ethers.Contract(
				env.PUBLIC_ESCROW_ADDRESS,
				escrow_abi,
				$networkProvider
			);
			const deals = await paymentContract.getDealsOf($userAddress);
			for await (const id of deals) {
				chain_deals.push(await fetchDeal(id));
				unq_deals[id] = await fetchDeal(id);
			}
		} catch (error) {
			console.log(error);
		}
		return unq_deals;
	};

	const fetchDeal = async (id: number) => {
		try {
			const paymentContract = new ethers.Contract(
				env.PUBLIC_ESCROW_ADDRESS,
				escrow_abi,
				$networkProvider
			);
			const deal = await paymentContract.getDeal(id);
			return deal;
		} catch (error) {
			console.log(error);
		}
	};

	const fetchDealsDB = async () => {
		const creator_url = `${base}/api/get_deals/${conversation.peerAddress}/${$userAddress}`;
		const recruiter_url = `${base}/api/get_deals/${$userAddress}/${conversation.peerAddress}`;
		const recruiter_response = await fetch(recruiter_url);
		const creator_response = await fetch(creator_url);
		const recruiter_deals = await recruiter_response.json();
		const creator_deals = await creator_response.json();
		return {
			recruiter_deals,
			creator_deals
		};
	};
	const fakeTransition = (node: any) => fade(node, { duration: 0 });
</script>

<main class="wrapper">
	<div
		bind:this={viewport}
		class="viewport"
		style={`height:${(feedHeight - 160).toString() + 'px'}`}
	>
		<div bind:this={contents} class="contents">
			<div class="agreements-container">
				{#if new_agreement}
					<div class="new-agreement" on:click={() => (new_agreement = false)} on:keydown>
						<img src={`${assets}/icons/chevron_left_active.svg`} alt="New Agreement" />
						<div style="width:4px;" />
						<p class="yellow">back to agreements</p>
					</div>
					<div style="height:12px" />
					<NewAgreement {conversation} />
				{:else}
					<div class="new-agreement" on:click={() => (new_agreement = true)} on:keydown>
						<img src={`${assets}/icons/notes-plus.svg`} alt="New Agreement" />
						<div style="width:4px;" />
						<p class="yellow">create new agreement</p>
					</div>
					<div style="height:28px" />
					{#await fetchDealsDB() then deals}
						<div class="section-title">
							<img src={`${assets}/icons/clipboard.svg`} alt="Human Run" />
							<div style="width:4px" />
							<p class="yellow">drafts</p>
						</div>
						<div style="height:12px" />
						{#if deals.recruiter_deals.length > 0}
							{#each deals.recruiter_deals as deal, i}
								{#if deal.status == 'offered' || deal.status == 'accepted'}
									<AgreementDB {conversation} role={'recruiter'} {deal} slot={i} />
									<div style="height:24px" />
								{/if}
							{/each}
						{/if}
						{#if deals.creator_deals.length > 0}
							{#each deals.creator_deals as deal, j}
								{#if deal.status == 'offered' || deal.status == 'accepted'}
									<AgreementDB {conversation} role={'creator'} {deal} slot={j} />
									<div style="height:24px" />
								{/if}
							{/each}
						{/if}
					{/await}
					<div style="height:28px" />
					{#await fetchDealsChain() then deals}
						<div class="section-title">
							<img src={`${assets}/icons/human-run.svg`} alt="Human Run" />
							<div style="width:4px" />
							<p class="yellow">ongoing deals</p>
						</div>
						<div style="height:12px" />
						{#if Object.entries(deals).length > 0}
							{#each Object.entries(deals) as [id, deal]}
								<AgreementChain {conversation} {deal} {id} />
							{/each}
						{/if}
					{/await}
				{/if}
			</div>
		</div>
	</div>
	<Svrollbar
		alwaysVisible
		{viewport}
		{contents}
		vThumbOut={fakeTransition}
		vTrackOut={fakeTransition}
	/>
</main>

<style>
	.section-title {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	main {
		width: 520px;
		height: calc(100vh - 128px);
		margin-top: 32px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
	.agreements-container {
		width: 100%;
		height: 100%;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.new-agreement {
		width: fit-content;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--color-light-20);
		cursor: pointer;
		padding: 6px 8px;
	}
	.new-agreement:hover {
		background-color: var(--color-light-2);
	}
	.wrapper {
		position: relative;
		-ms-overflow-style: none; /* for Internet Explorer, Edge */
		scrollbar-width: none; /* for Firefox */
		overflow-y: scroll;
		--svrollbar-track-width: 1px;
		--svrollbar-track-opacity: 1;
		--svrollbar-thumb-width: 1px;
		--svrollbar-thumb-background: #d9ab55;
		--svrollbar-thumb-opacity: 1;
		height: 100%;
	}

	.viewport {
		position: relative;
		overflow: scroll;
		box-sizing: border-box;

		/* hide scrollbar */
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.viewport::-webkit-scrollbar {
		/* hide scrollbar */
		display: none;
	}
	.contents {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
	}
</style>
