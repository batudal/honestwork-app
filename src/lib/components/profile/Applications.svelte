<script lang="ts">
	import { goto } from '$app/navigation';
	import { assets, base } from '$app/paths';
	import type { JobType, UserType, ApplicationType } from '$lib/stores/Types';

	export let user: UserType;

	let jobs: JobType[] = [];
	let drawer_open = false;

	const fetchJobs = async (app: ApplicationType) => {
		for await (const item of user.application) {
			let record_id = item.job_id.split(':');
			const url = `${base}/api/get_job/${record_id[1]}/${record_id[2]}`;
			const response = await fetch(url);
			jobs.push(await response.json());
		}
	};
</script>

<main>
	{#if user.application.length > 0}
		{#each user.application as app}
			{#await fetchJobs(app)}
				loading jobs
			{:then}
				{#each jobs as job}
					<div class="container">
						<div
							class="header"
							on:click={() => goto(`${base}/job/${job.user_address}/${job.slot}`)}
							on:keydown
						>
							<img class="job-image" src={job.image_url} alt="sdf" />
							<div class="content">
								<p>{job.title}</p>
								<p class="yellow">{job.username}</p>
							</div>
						</div>
					</div>
					{#if drawer_open}
						{@html job.description}
					{/if}
					<div
						class={drawer_open ? 'drawer drawer-open' : 'drawer'}
						on:click={() => (drawer_open = !drawer_open)}
						on:keydown
					>
						{#if drawer_open}
							<p class="light-60">hide cover letter</p>
							<div style="width:4px" />
							<img src={`${assets}/icons/corner-right-up_passive.svg`} alt="drawer" />
						{:else}
							<img src={`${assets}/icons/corner-left-down_active.svg`} alt="drawer" />
							<div style="width:4px" />
							<p class="light-60">show cover letter</p>
						{/if}
					</div>
				{/each}
			{/await}
		{/each}
	{:else}
		<p class="light-60">You have not applied to any jobs yet.</p>
	{/if}
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
		border-width: 1px 1px 0px 1px;
		border-style: solid;
		border-color: var(--color-light-10);
		align-items: flex-start;
		padding: 8px;
		box-sizing: border-box;
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
		box-sizing: border-box;
	}
	.header {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 12px;
		cursor: pointer;
		box-sizing: border-box;
	}
	.header:hover {
		background-color: var(--color-light-2);
	}
	.drawer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-width: 1px 1px 1px 1px;
		border-style: solid;
		border-color: var(--color-light-10);
		cursor: pointer;
		padding: 8px;
		background-color: var(--color-light-2);
	}
	.drawer-open {
		border-width: 0px 1px 1px 1px;
	}
</style>