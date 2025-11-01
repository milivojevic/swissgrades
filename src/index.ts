export interface Env {
	ASSETS: Fetcher;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Serve static assets from the ASSETS binding
		return env.ASSETS.fetch(request);
	},
};
