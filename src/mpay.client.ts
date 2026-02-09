import { Mpay, tempo } from "mpay/client";
import { wrapFetch } from "./lib/network-store";
import { config } from "./wagmi.config";

const trackedFetch = wrapFetch(globalThis.fetch);

export const { fetch } = Mpay.create({
	fetch: trackedFetch,
	methods: [tempo.stream({ ...config.connectors.at(0), deposit: 5_000_000n })],
	polyfill: false,
});
