<div class="container">
	<div class="benefits-card">
		<img src="icons/landing/sale.svg" alt="Sale icon" class="icon" />
		<h4 class="title">low fees</h4>
		<p class="description">
			HonestWork employers’ fees are as low as 5%. There are no fees for freelancers, only a
			one-time investment in HonestWork NFT.
		</p>
	</div>
	<div class="benefits-card">
		<img src="icons/landing/mail-multiple.svg" alt="Messages icon" class="icon" />
		<h4 class="title">provable messages</h4>
		<p class="description">
			Provable messages ensure fast and fair dispute resolution without compromising your personal
			data.
		</p>
	</div>
	<div class="benefits-card">
		<img src="icons/landing/airdrop.svg" alt="Airdrop icon" class="icon" />
		<h4 class="title">airdrops</h4>
		<p class="description">
			Keep an eye out for upcoming airdrops! All active HonestWork NFT holders will receive an
			airdrop with the launch of $WORK token.
		</p>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		width: 80vw;
		max-width: 960px;
	}
	.benefits-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 20px;
		gap: 22px;
		background: var(--color-dark);
		border: 1px solid var(--color-light-10);
		width: 100%;
		max-width: 340px;
	}
	.icon {
		height: 56px;
		width: 56px;
	}
	.title {
		text-transform: uppercase;
		color: var(--color-dark);
		background: var(--color-primary);
		margin: 0;
	}
	.description {
		font-family: 'DM Mono';
		font-weight: 400;
		font-size: 14px;
		line-height: 24px;
		color: var(--color-light);
		text-transform: none;
	}

	@media (max-width: 780px) {
		.container {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
