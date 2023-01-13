import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ params }) => {
	console.log('params', params);

	const apiUrl =
		parseInt(env.PRODUCTION_ENV) == 1
			? env.PRIVATE_HONESTWORK_API
			: env.PRIVATE_LOCAL_HONESTWORK_API;
	const url = `${apiUrl}/users/${params.address}`;
	console.log('Url:', url);
	let response = await fetch(url);
	let data = await response.json();
	return json(data);
};
