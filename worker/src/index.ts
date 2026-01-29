import { Mpay, tempo } from "mpay/server";

interface Env {
	AUTH_PASS: string;
	AUTH_USER: string;
	ASSETS: Fetcher;
	MPP_CHAIN_ID?: string;
	MPP_RPC_URL?: string;
	MPP_SECRET_KEY?: string;
}

const DEFAULT_SECRET_KEY = "please-change-secret-key-not-for-production";
const PATHUSD = "0x20c0000000000000000000000000000000000000";
const RECIPIENT = "0xa726a1CD723409074DF9108A2187cfA19899aCF8";

function createPayment(env: Env) {
	const chainId = Number(env.MPP_CHAIN_ID ?? "42431");
	const rpcUrl = env.MPP_RPC_URL ?? "https://rpc.moderato.tempo.xyz";

	return Mpay.create({
		method: tempo({
			chainId,
			rpcUrl,
		}),
		realm: "mpp.dev",
		secretKey: env.MPP_SECRET_KEY ?? DEFAULT_SECRET_KEY,
	});
}

function createPaidPingHandler(env: Env) {
	const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();
	const payment = createPayment(env);
	return payment.charge({
		description: "Ping endpoint access",
		request: {
			amount: "100000",
			currency: PATHUSD,
			expires,
			recipient: RECIPIENT,
		},
	});
}

function unauthorizedResponse() {
	return new Response("Unauthorized", {
		status: 401,
		headers: {
			"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
			"Content-Type": "text/plain",
			"WWW-Authenticate": 'Basic realm="mpp-docs"',
		},
	});
}

function getBasicAuthHeader(request: Request) {
	return (
		request.headers.get("X-Basic-Auth") ??
		request.headers.get("x-basic-auth") ??
		request.headers.get("Authorization")
	);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (!env.AUTH_PASS) {
			return new Response("Missing AUTH_PASS", {
				status: 500,
				headers: {
					"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
					"Content-Type": "text/plain",
				},
			});
		}

		const expectedUser = env.AUTH_USER || "eng";
		const expectedPass = env.AUTH_PASS;

		const authHeader = getBasicAuthHeader(request);
		if (!authHeader || !authHeader.startsWith("Basic ")) {
			return unauthorizedResponse();
		}

		let authenticated = false;
		try {
			const credentials = atob(authHeader.slice(6));
			const [user, pass] = credentials.split(":");
			if (user === expectedUser && pass === expectedPass) {
				authenticated = true;
			}
		} catch {
			authenticated = false;
		}

		if (!authenticated) {
			return unauthorizedResponse();
		}

		const url = new URL(request.url);
		const method = request.method;
		if (method === "GET" && url.pathname === "/ping") {
			return new Response("tm!", {
				headers: { "Content-Type": "text/plain" },
			});
		}

		if (method === "GET" && url.pathname === "/ping/paid") {
			const result = await createPaidPingHandler(env)(request);

			if (result.status === 402) {
				const challenge = result.challenge as Response;
				const body = await challenge.text();
				return new Response(body, {
					status: 402,
					headers: challenge.headers,
				});
			}

			const response = result.withReceipt(
				new Response("tm! thanks for paying", {
					headers: { "Content-Type": "text/plain" },
				}),
			);
			return new Response("tm! thanks for paying", {
				status: 200,
				headers: response.headers,
			});
		}

		const assetResponse = await env.ASSETS.fetch(request);
		if (assetResponse.status !== 404) {
			const headers = new Headers(assetResponse.headers);
			headers.set("Cache-Control", "private, no-store");
			return new Response(assetResponse.body, {
				status: assetResponse.status,
				statusText: assetResponse.statusText,
				headers,
			});
		}

		const indexUrl = new URL("/index.html", request.url);
		const indexRequest = new Request(indexUrl, request);
		const indexResponse = await env.ASSETS.fetch(indexRequest);
		const headers = new Headers(indexResponse.headers);
		headers.set("Cache-Control", "private, no-store");
		return new Response(indexResponse.body, {
			status: indexResponse.status,
			statusText: indexResponse.statusText,
			headers,
		});
	},
};
