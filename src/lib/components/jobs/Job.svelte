<svelte:options immutable={true} />

<script lang="ts">
	import type { JobType } from '$lib/stores/Types';
	import { placeholder_image } from '$lib/stores/Constants';
	import { parseContent } from '$lib/stores/Parser';
	import { base, assets } from '$app/paths';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let chosen: boolean;
	export let job: JobType;

	let hashtags = job.tags;
	let tier: number = 0;

	onMount(async () => {
		await getUserTier();
	});
	const search = (tag: string) => {
		dispatch('search', { text: tag });
	};
	const getUserTier = async () => {
		try {
			let res = await fetch(`${base}/api/membership/${job.useraddress}`);
			tier = await res.json();
		} catch (err) {
			console.log(err);
		}
	};

	const parseDate = (date: Date) => {
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let year = date.getFullYear();
		return `${month}/${day}/${year}`;
	};

	$: infos = [
		// {
		// 	key: 'listed on:',
		// 	value: parseDate(new Date(job.created_at))
		// },
		{
			key: 'member tier:',
			value: tier
		},
		{
			key: 'budget:',
			value: '$' + job.budget.toString().slice(0, 6)
		}
	];
</script>

<section class={chosen ? 'chosen' : ''}>
	<div class="title-bar">
		<div class="tags">
			<div class="tag">
				<p class="yellow">
					{job.username}
				</p>
			</div>
			<div class="tag">
				<p>{job.title}</p>
			</div>
		</div>
		<div class="status-tag">
			{#if job.dealid == -1}
				<p style="color:var(--color-success)" class="active-tag">active</p>
				<div style="width: 4px" />
				<img src={`${assets}/icons/check.svg`} alt="arrow" />
			{:else}
				<p style="color:var(--color-error)">taken</p>
				<div style="width: 4px" />
				<img src={`${assets}/icons/calendar-remove.svg`} alt="arrow" />
			{/if}
		</div>
	</div>
	<div class="contents">
		<img
			src={job.imageurl ? job.imageurl + '?tr=h-240,w-240' : placeholder_image}
			alt="gallery"
			class="preview-image"
		/>
		<div style="width:12px;" />
		<div class="content">
			<div class="body-text light-60">
				{parseContent(job.description).slice(0, 140) + '...'}
			</div>
			<div style="height: 16px" />
			<div class="hashtags">
				{#if hashtags && hashtags.length > 0}
					{#each hashtags as hashtag}
						<div class="hashtag">
							<p class="light-60" on:click={() => search(hashtag)} on:keydown>{hashtag}</p>
						</div>
						{#if hashtag != hashtags[hashtags.length - 1]}
							<div style="width: 4px" />
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div class="tag-bar">
		<div class="tags">
			{#if infos && infos.length > 0}
				{#each infos as info}
					<div class="tag">
						<p><span class="light-40">{info.key}</span> {info.value}</p>
					</div>
				{/each}
			{/if}
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
		padding: 12px;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 362px;
	}
	.preview-image {
		height: 120px;
		width: 120px;
	}
	.tag-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.tags {
		display: flex;
		flex-direction: row;
	}
	.tag {
		padding: 8px;
		border-width: 0px 1px 0px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.title-bar {
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: var(--color-light-20);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.chosen {
		background-color: var(--color-light-2);
	}
	.hashtags {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		z-index: 99;
	}
	.hashtag {
		padding: 4px 8px;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.hashtag:hover {
		background-color: var(--color-primary);
	}
	.hashtag:hover p {
		color: var(--color-dark);
	}
	.status-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 8px;
	}

	@media only screen and (max-width: 600px) {
		.active-tag {
			display: none;
		}
	}
</style>
