<script lang="ts">
	import { userAddress, networkSigner, networkProvider } from '$lib/stores/Network';
	import { assets, base } from '$app/paths';
	import { env } from '$env/dynamic/public';
	import { toast } from '@zerodevx/svelte-toast';
	import type { DealDB } from '$lib/stores/Types';
	import { ethers } from 'ethers';
	import { chains } from '$lib/stores/Constants';
	import { erc20_abi } from '$lib/stores/ABI';

	export let conversation: any;

	let total_amount: number;
	let downpayment: number;
	let show_network_dropdown = false;
	let show_token_dropdown = false;
	let show_recruitor_dropdown = false;
	let show_job_dropdown = false;

	// todo: fix these
	let chosen_network = 'choose network';
	let chosen_token = 'choose token';
	let chosen_token_address = '';
	let chosen_recruitor = $userAddress;
	let chosen_job = 'choose job';
	let chosen_job_slot = -1;

	const fetchJobs = async () => {
		try {
			const res = await fetch(`${base}/api/get_jobs/${$userAddress}`);
			const jobs = await res.json();
			return jobs;
		} catch (error) {
			console.log(error);
		}
	};

	const fetchDecimals = async () => {
		try {
			const Token = new ethers.Contract(chosen_token_address, erc20_abi, $networkProvider);
			const decimals = await Token.decimals();
			return decimals;
		} catch (err) {
			console.log(err);
		}
	};

	const handleCreateAgreementOffer = async () => {
		if (chosen_recruitor === $userAddress) {
			try {
				const decimals = await fetchDecimals();
				const salt_res = await fetch(`${base}/api/auth/login/${$userAddress}`, {
					method: 'POST'
				});
				let salt = await salt_res.json();
				let message =
					'HonestWork: New Agreement\n' +
					`${salt}\n` +
					'\n' +
					'For more info: https://docs.honestwork.app';
				let signature = await $networkSigner.signMessage(message);
				const url = `${base}/api/add_deal/${$userAddress}/${conversation.peerAddress}/${signature}`;
				const body: DealDB = {
					status: '',
					network: chosen_network,
					tokenaddress: chosen_token_address,
					totalamount: ethers.utils.parseUnits(total_amount.toString(), decimals).toString(),
					downpayment: ethers.utils.parseUnits(downpayment.toString(), decimals).toString(),
					jobid: chosen_job_slot,
					signature: ''
				};
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(body)
				});
				if (response.ok) {
					await conversation.send(
						`Meta:${JSON.stringify({
							type: 'job offer',
							network: chosen_network,
							token: chosen_token,
							token_address: chosen_token_address,
							total_amount: ethers.utils.parseUnits(total_amount.toString(), decimals).toString(),
							downpayment: ethers.utils.parseUnits(downpayment.toString(), decimals).toString(),
							job_id: chosen_job_slot,
							recruiter: $userAddress
						})}`
					);
					toast.push(
						`<p class="light-60"><span style='color:var(--color-success)'>success: </span>new job offer sent.</p>`
					);
				}
			} catch (error) {
				toast.push(
					`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${error}</p>`
				);
			}
		}
	};
</script>

<div class="dropdown-container">
	<div class="placeholder"><p>recruitor</p></div>
	<div class="dropdown">
		<div
			class="dropdown-chosen"
			on:click={() => (show_recruitor_dropdown = !show_recruitor_dropdown)}
			on:keydown
		>
			<p>
				{chosen_recruitor.substring(0, 6) +
					'...' +
					chosen_recruitor.substring(chosen_recruitor.length - 4)}
				<span class="light-60">({chosen_recruitor == $userAddress ? 'YOU' : 'PEER'})</span>
			</p>
			<img
				src={show_recruitor_dropdown
					? `${assets}/icons/chevron_active.svg`
					: `${assets}/icons/chevron_passive.svg`}
				alt="Dropdown"
				style="width:10px;"
			/>
		</div>
		{#if show_recruitor_dropdown}
			<div class="dropdown-menu">
				<div
					class="dropdown-item"
					on:click={() => (chosen_recruitor = conversation.peerAddress)}
					on:keydown
				>
					<p>
						{conversation.peerAddress.substring(0, 6) +
							'...' +
							conversation.peerAddress.substring(conversation.peerAddress.length - 4)}
						<span class="light-60">(PEER)</span>
					</p>
				</div>
				<div class="dropdown-item" on:click={() => (chosen_recruitor = $userAddress)} on:keydown>
					<p>
						{$userAddress.substring(0, 6) + '...' + $userAddress.substring($userAddress.length - 4)}
						<span class="light-60">(YOU)</span>
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
<div style="height:8px" />
<div class="dropdown-container">
	<div class="placeholder"><p>job</p></div>
	<div class="dropdown">
		<div
			class="dropdown-chosen"
			on:click={() => (show_job_dropdown = !show_job_dropdown)}
			on:keydown
		>
			<p>{chosen_job}</p>
			<img
				src={show_job_dropdown
					? `${assets}/icons/chevron_active.svg`
					: `${assets}/icons/chevron_passive.svg`}
				alt="Dropdown"
				style="width:10px;"
			/>
		</div>
		{#if show_job_dropdown}
			<div class="dropdown-menu">
				{#await fetchJobs() then jobs}
					{#if jobs != null}
						{#each jobs as job}
							<div
								class="dropdown-item"
								on:click={() => {
									chosen_job = `#${job.slot} ${job.title} $${job.budget}`;
									chosen_job_slot = job.slot;
									show_job_dropdown = false;
								}}
								on:keydown
							>
								<p>
									<span class="yellow">#{job.slot}</span>
									{job.title} <span class="light-60">${job.budget}</span>
								</p>
							</div>
						{/each}
						{#if chosen_job_slot != -1}
							<div
								class="dropdown-item"
								on:click={() => {
									chosen_job = 'deal without job';
									chosen_job_slot = -1;
									show_job_dropdown = false;
								}}
								on:keydown
							>
								<p class="light-60">deal without job</p>
							</div>
						{/if}
					{:else}
						<div class="dropdown-item">
							<p class="light-60">you don't have any job listings online.</p>
						</div>
					{/if}
				{/await}
			</div>
		{/if}
	</div>
</div>
<div style="height:8px" />
<div class="dropdown-container">
	<div class="placeholder"><p>network</p></div>
	<div class="dropdown">
		<div
			class="dropdown-chosen"
			on:click={() => (show_network_dropdown = !show_network_dropdown)}
			on:keydown
		>
			<p>{chosen_network}</p>
			<img
				src={show_network_dropdown
					? `${assets}/icons/chevron_active.svg`
					: `${assets}/icons/chevron_passive.svg`}
				alt="Dropdown"
				style="width:10px;"
			/>
		</div>
		{#if show_network_dropdown}
			<div class="dropdown-menu">
				{#each chains as chain}
					<div
						class="dropdown-item"
						on:click={() => {
							chosen_network = chain.name;
							show_network_dropdown = false;
						}}
						on:keydown
					>
						<p>{chain.name}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
<div style="height:8px" />
<div class="dropdown-container">
	<div class="placeholder"><p>token</p></div>
	<div class="dropdown">
		<div
			class="dropdown-chosen"
			on:click={() => (show_token_dropdown = !show_token_dropdown)}
			on:keydown
		>
			<p>{chosen_token}</p>
			<img
				src={show_token_dropdown
					? `${assets}/icons/chevron_active.svg`
					: `${assets}/icons/chevron_passive.svg`}
				alt="Dropdown"
				style="width:10px;"
			/>
		</div>
		{#if show_token_dropdown}
			<div class="dropdown-menu">
				{#each chains as chain}
					{#each chain.tokens as token}
						<div
							class="dropdown-item"
							on:click={() => {
								chosen_token = token.symbol;
								chosen_token_address = token.address;
								show_token_dropdown = false;
							}}
							on:keydown
						>
							<p>{token.name}</p>
						</div>
					{/each}
				{/each}
			</div>
		{/if}
	</div>
</div>
<div style="height:8px" />
<div class="input-container">
	<div class="placeholder"><p>total amount</p></div>
	<input type="text" placeholder="($)" bind:value={total_amount} />
</div>
<div style="height:8px" />
<div class="input-container">
	<div class="placeholder"><p>downpayment</p></div>
	<input type="text" placeholder="($)" bind:value={downpayment} />
</div>
<div style="height:12px" />
<div class="action-button-full link yellow" on:click={handleCreateAgreementOffer} on:keydown>
	<p>send offer</p>
</div>

<style>
	.placeholder {
		height: 32px;
		display: flex;
		background-color: var(--color-dark);
		border-width: 1px 0px 1px 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		padding: 8px;
		color: var(--color-light-40);
	}
	input {
		width: 100%;
		height: 32px;
	}
	.dropdown-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		height: 32px;
	}
	.dropdown {
		flex: 1;
		width: 100%;
		height: 32px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		position: relative;
	}
	.dropdown-chosen {
		flex: 1;
		height: 32px;
		padding: 8px;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		cursor: pointer;
	}
	.dropdown-chosen:hover {
		background-color: var(--color-light-2);
	}
	.dropdown-menu {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 32px;
		background-color: var(--color-dark);
		border-width: 0px 1px 1px 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		flex: 1;
		width: 100%;
		z-index: 9999;
	}
	.dropdown-item {
		padding: 8px;
		width: 100%;
		cursor: pointer;
		box-sizing: border-box;
	}
	.dropdown:hover .dropdown-menu {
		display: flex;
	}
	.dropdown-item:hover {
		background-color: var(--color-light-2);
	}
	.input-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		height: 32px;
	}
	input {
		flex: 1;
	}
	.action-button-full {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--color-primary);
		cursor: pointer;
		padding: 8px 12px;
		box-sizing: border-box;
	}
</style>
