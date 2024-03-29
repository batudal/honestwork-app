
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const PRODUCTION_ENV: string;
	export const PRIVATE_ALCHEMY_APIKEY: string;
	export const PRIVATE_SPACES_KEY: string;
	export const PRIVATE_SPACES_SECRET: string;
	export const PRIVATE_SPACES_URL: string;
	export const PRIVATE_SPACES_BUCKETNAME: string;
	export const PRIVATE_SPACES_REGION_URL: string;
	export const PRIVATE_IMAGEKIT_URL: string;
	export const PRIVATE_ETHEREUM_RPC: string;
	export const PRIVATE_ARBITRUM_RPC: string;
	export const PRIVATE_OPENAI_KEY: string;
	export const PRIVATE_MONGODB_URI: string;
	export const PRIVATE_DISCORD_BOT_TOKEN: string;
	export const PRIVATE_DISCORD_GUILD_SKILLS: string;
	export const PRIVATE_DISCORD_GUILD_JOBS: string;
	export const PRIVATE_DISCORD_GUILD_TEST: string;
	export const MANPATH: string;
	export const NIX_PROFILES: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const TERM: string;
	export const SHELL: string;
	export const npm_config_metrics_registry: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_config_global_prefix: string;
	export const TERM_PROGRAM_VERSION: string;
	export const COLOR: string;
	export const npm_config_noproxy: string;
	export const npm_config_local_prefix: string;
	export const ZSH: string;
	export const USER: string;
	export const LS_COLORS: string;
	export const COMMAND_MODE: string;
	export const npm_config_globalconfig: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const WARP_IS_LOCAL_SHELL_SESSION: string;
	export const npm_execpath: string;
	export const PAGER: string;
	export const WARP_USE_SSH_WRAPPER: string;
	export const LSCOLORS: string;
	export const PATH: string;
	export const npm_package_json: string;
	export const npm_config_engine_strict: string;
	export const _: string;
	export const WARP_PS1: string;
	export const npm_config_userconfig: string;
	export const npm_config_init_module: string;
	export const __CFBundleIdentifier: string;
	export const npm_command: string;
	export const PWD: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const npm_package_name: string;
	export const XPC_FLAGS: string;
	export const NIX_SSL_CERT_FILE: string;
	export const npm_config_node_gyp: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const SHLVL: string;
	export const HOME: string;
	export const HOMEBREW_PREFIX: string;
	export const npm_config_cache: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const LC_CTYPE: string;
	export const SSH_SOCKET_DIR: string;
	export const npm_config_user_agent: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const CONDA_CHANGEPS1: string;
	export const npm_node_execpath: string;
	export const npm_config_prefix: string;
	export const COLORTERM: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_NFT_ADDRESS: string;
	export const PUBLIC_STARTER_NFT_ADDRESS: string;
	export const PUBLIC_LISTING_ADDRESS: string;
	export const PUBLIC_ESCROW_ADDRESS: string;
	export const PUBLIC_REGISTRY_ADDRESS: string;
	export const PUBLIC_MAINNET_DAI_ADDRESS: string;
	export const PUBLIC_ARBITRUM_USDC_ADDRESS: string;
	export const PUBLIC_IMAGEKIT_URL: string;
	export const PUBLIC_MARKPROMPT_PRODUCTION_KEY: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		PRODUCTION_ENV: string;
		PRIVATE_ALCHEMY_APIKEY: string;
		PRIVATE_SPACES_KEY: string;
		PRIVATE_SPACES_SECRET: string;
		PRIVATE_SPACES_URL: string;
		PRIVATE_SPACES_BUCKETNAME: string;
		PRIVATE_SPACES_REGION_URL: string;
		PRIVATE_IMAGEKIT_URL: string;
		PRIVATE_ETHEREUM_RPC: string;
		PRIVATE_ARBITRUM_RPC: string;
		PRIVATE_OPENAI_KEY: string;
		PRIVATE_MONGODB_URI: string;
		PRIVATE_DISCORD_BOT_TOKEN: string;
		PRIVATE_DISCORD_GUILD_SKILLS: string;
		PRIVATE_DISCORD_GUILD_JOBS: string;
		PRIVATE_DISCORD_GUILD_TEST: string;
		MANPATH: string;
		NIX_PROFILES: string;
		TERM_PROGRAM: string;
		NODE: string;
		INIT_CWD: string;
		TERM: string;
		SHELL: string;
		npm_config_metrics_registry: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_config_global_prefix: string;
		TERM_PROGRAM_VERSION: string;
		COLOR: string;
		npm_config_noproxy: string;
		npm_config_local_prefix: string;
		ZSH: string;
		USER: string;
		LS_COLORS: string;
		COMMAND_MODE: string;
		npm_config_globalconfig: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		WARP_IS_LOCAL_SHELL_SESSION: string;
		npm_execpath: string;
		PAGER: string;
		WARP_USE_SSH_WRAPPER: string;
		LSCOLORS: string;
		PATH: string;
		npm_package_json: string;
		npm_config_engine_strict: string;
		_: string;
		WARP_PS1: string;
		npm_config_userconfig: string;
		npm_config_init_module: string;
		__CFBundleIdentifier: string;
		npm_command: string;
		PWD: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		npm_package_name: string;
		XPC_FLAGS: string;
		NIX_SSL_CERT_FILE: string;
		npm_config_node_gyp: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		SHLVL: string;
		HOME: string;
		HOMEBREW_PREFIX: string;
		npm_config_cache: string;
		LESS: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		LC_CTYPE: string;
		SSH_SOCKET_DIR: string;
		npm_config_user_agent: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		CONDA_CHANGEPS1: string;
		npm_node_execpath: string;
		npm_config_prefix: string;
		COLORTERM: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: string]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_NFT_ADDRESS: string;
		PUBLIC_STARTER_NFT_ADDRESS: string;
		PUBLIC_LISTING_ADDRESS: string;
		PUBLIC_ESCROW_ADDRESS: string;
		PUBLIC_REGISTRY_ADDRESS: string;
		PUBLIC_MAINNET_DAI_ADDRESS: string;
		PUBLIC_ARBITRUM_USDC_ADDRESS: string;
		PUBLIC_IMAGEKIT_URL: string;
		PUBLIC_MARKPROMPT_PRODUCTION_KEY: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
