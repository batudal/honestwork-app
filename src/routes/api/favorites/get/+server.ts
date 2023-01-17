import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ cookies }) => {
	const userAddress = cookies.get('honestwork_address')!;
	const apiUrl =
		parseInt(env.PRODUCTION_ENV) == 1
			? env.PRIVATE_HONESTWORK_API
			: env.PRIVATE_LOCAL_HONESTWORK_API;
	const hwapiUrl = `${apiUrl}/favorites/${userAddress}`;
	const response = await fetch(hwapiUrl);
	return response;
};