export type SkillType = {
	slot: number;
	user_address: string;
	created_at: number;
	title: string;
	description: string;
	image_urls: Array<string>;
	minimum_price: number;
	links: Array<string>;
	publish: boolean;
};

export type UserType = {
	username: string;
	show_ens: boolean;
	title: string;
	image_url: string;
	show_nft: boolean;
	nft_address: string;
	nft_id: number;
	email: string;
	timezone: string;
	bio: string;
	links: Array<string>;
};

export type JobType = {
	slot: number;
	user_address: string;
	email: string;
	username: string;
	created_at: number;
	title: string;
	description: string;
	image_url: string;
	budget: number;
	links: Array<string>;
	tags: Array<string>;
	installments: number;
	tokens_accepted: Array<Network>;
	sticky_duration: string;
	timezone: string;
	application: Array<ApplicantType>;
};

export type ApplicantType = {
	user_address: string;
	job_id: string;
	cover_letter: string;
	date: number;
};
export type Network = {
	id: number;
	tokens: Array<Token>;
};
export type Token = {
	address: string;
};

export type Watchlist = {
	input: {
		address: string;
		slot: number;
	};
	username: string;
	title: string;
	image_url: string;
};

export type Favorite = {
	input: {
		address: string;
		slot: number;
	};
	username: string;
	title: string;
	image_url: string;
};
