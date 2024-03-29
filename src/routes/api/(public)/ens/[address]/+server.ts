import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ethers } from 'ethers';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(env.PRIVATE_ETHEREUM_RPC);
    let ens_name = await provider.lookupAddress(params.address!);
    return new Response(ens_name);
  } catch (err: any) {
    throw error(500, err.body.message);
  }
};
