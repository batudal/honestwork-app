<script lang="ts">
	import type { DealDB } from '$lib/stores/Types';
	import { assets, base } from '$app/paths';
	import { ethers } from 'ethers';
	import { env } from '$env/dynamic/public';
	import { escrow_abi, erc20_abi } from '$lib/stores/ABI';
	import { userAddress, networkSigner, userToken } from '$lib/stores/Network';
	import { findTokenName } from '$lib/stores/Constants';
	import { toast } from '@zerodevx/svelte-toast';

	export let slot: number;
	export let conversation: any;
	export let role: string;
	export let deal: DealDB;

	const approve = async (amount: ethers.BigNumberish) => {
		try {
			const Token = new ethers.Contract(deal.token_address, erc20_abi, $networkSigner);
			const tx = await Token.approve(env.PUBLIC_ESCROW_ADDRESS, amount);
			let receipt = await tx.wait();
			if (receipt && receipt.status == 1) {
				toast.push(
					`<p class="light-60"><span style='color:var(--color-success)'>success: </span>approved ${findTokenName(
						deal.network,
						deal.token_address
					)}.</p>`
				);
			}
		} catch (error: any) {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${error.code}</p>`
			);
		}
	};
	const handleExecute = async () => {
		await approve(ethers.utils.parseEther(deal.total_amount));
		try {
			const Payment = new ethers.Contract(env.PUBLIC_ESCROW_ADDRESS!, escrow_abi, $networkSigner);
			const tx = await Payment.createDealSignature(
				$userAddress,
				conversation.peerAddress,
				deal.token_address,
				deal.total_amount,
				deal.downpayment,
				$userToken,
				deal.signature
			);
			let receipt = await tx.wait();
			if (receipt && receipt.status == 1) {
				//todo: move to event watcher / indexer
				const res = await fetch(`/api/auth/login/${$userAddress}`);
				const salt = await res.json();
				const signature = await $networkSigner.signMessage(salt);
				const url = `${base}/api/execute_deal/${$userAddress}/${conversation.peerAddress}/${signature}`;
				const body = {
					slot: slot
				};
				const response = await fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(body)
				});
				await conversation.send(
					`Meta:${JSON.stringify({
						type: 'job execution',
						network: deal.network,
						token: findTokenName(deal.network, deal.token_address),
						token_address: deal.token_address,
						total_amount: deal.total_amount,
						downpayment: deal.downpayment
					})}`
				);
				toast.push(
					`<p class="light-60"><span style='color:var(--color-success)'>success: </span>executed agreement.</p>`
				);
			}
		} catch (error: any) {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${error.code}</p>`
			);
		}
	};
	const handleAccept = async () => {
		try {
			const Escrow = new ethers.Contract(env.PUBLIC_ESCROW_ADDRESS!, escrow_abi, $networkSigner);
			const recruiter_address = role == 'recruiter' ? $userAddress : conversation.peerAddress;
			const creator_address = role == 'recruiter' ? conversation.peerAddress : $userAddress;
			const message_hash = await Escrow.getMessageHash(
				recruiter_address,
				creator_address,
				deal.token_address,
				deal.total_amount,
				deal.downpayment
			);

			let hash_array = ethers.utils.arrayify(message_hash);
			let signature = await $networkSigner.signMessage(hash_array);
			const url = `${base}/api/accept_deal/${recruiter_address}/${creator_address}`;
			const response = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					slot: slot,
					signature: signature
				})
			});
			if (response.ok) {
				await conversation.send(
					`Meta:${JSON.stringify({
						type: 'job acceptance',
						network: deal.network,
						token: findTokenName(deal.network, deal.token_address),
						token_address: deal.token_address,
						total_amount: deal.total_amount,
						downpayment: deal.downpayment
					})}`
				);
				toast.push(
					`<p class="light-60"><span style='color:var(--color-success)'>success: </span>accepted job offer.</p>`
				);
			}
		} catch (error: any) {
			console.log(error);
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${error}</p>`
			);
		}
	};
</script>

{#if deal.status == 'offered'}
	<main>
		<section>
			{#each Object.entries(deal) as [key, value]}
				{#if key != 'signature'}
					<div class="info">
						<p class="light-60">{key}</p>
						{#if key === 'token_address'}
							<a
								href={`https://bscscan.com/address/${value}`}
								target="_blank"
								rel="noreferrer"
								class="info-value"
							>
								<p class="link">
									{value.toString().substring(0, 6) +
										'...' +
										value.toString().substring(value.toString().length - 4)}
								</p>
								<div style="width:4px" />
								<img src={assets + '/icons/external.svg'} alt="Token address" /></a
							>
						{:else if key === 'total_amount' || key === 'downpayment'}
							<p>${parseFloat(ethers.utils.formatEther(value)).toLocaleString()}</p>
						{:else}
							<p>{value}</p>
						{/if}
					</div>
				{/if}
			{/each}
		</section>
		{#if role == 'creator'}
			<div class="command-bar">
				<div class="action-button-full yellow link" on:click={handleAccept} on:keydown>
					<p>accept offer</p>
				</div>
			</div>
		{/if}
	</main>
{:else if deal.status == 'accepted'}
	<main>
		<section>
			{#each Object.entries(deal) as [key, value]}
				{#if key != 'signature'}
					<div class="info">
						<p class="light-60">{key}</p>
						{#if key === 'token_address'}
							<a href="https://bscscan.com/" target="_blank" rel="noreferrer" class="info-value">
								<p class="link">
									{value.toString().substring(0, 6) +
										'...' +
										value.toString().substring(value.toString().length - 4)}
								</p>
								<div style="width:4px" />
								<img src={assets + '/icons/external.svg'} alt="Token address" /></a
							>
						{:else if key === 'total_amount' || key === 'downpayment'}
							<p>${parseFloat(ethers.utils.formatEther(value)).toLocaleString()}</p>
						{:else}
							<p>{value}</p>
						{/if}
					</div>
				{/if}
			{/each}
		</section>
		{#if role == 'recruiter'}
			<div class="command-bar">
				<div class="action-button-full yellow link" on:click={handleExecute} on:keydown>
					<p>execute agreement</p>
				</div>
			</div>
		{/if}
	</main>
{/if}

<style>
	main {
		width: 480px;
	}
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}
	.command-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 32px;
		box-sizing: border-box;
		margin-top: 8px;
	}
	.command {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		width: 164px;
	}
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
	.action-button {
		height: 32px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid var(--color-light-20);
	}
	.action-button-full {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		cursor: pointer;
		padding: 8px 12px;
		box-sizing: border-box;
	}
	.info {
		width: 100%;
		height: 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.info:hover {
		background-color: var(--color-light-2);
	}
	.info-value {
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
	}
</style>