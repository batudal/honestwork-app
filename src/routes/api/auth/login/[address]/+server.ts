import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ params }) => {
	const apiUrl =
		parseInt(env.PRODUCTION_ENV) == 1
			? env.PRIVATE_HONESTWORK_API
			: env.PRIVATE_LOCAL_HONESTWORK_API;
	const url = `${apiUrl}/salt/${params.address}`;
	let response = await fetch(url, {
		method: 'POST',
		headers: new Headers({
			Authorization: 'Basic ' + btoa(`${env.PRIVATE_CLIENT_KEY}:${env.PRIVATE_CLIENT_PASSWORD}`),
			'Content-Type': 'application/json'
		})
	});
	let data = await response.json();
	return json(data);
};
