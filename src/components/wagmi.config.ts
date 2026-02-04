import { QueryClient } from "@tanstack/react-query";
import { tempoModerato } from "viem/chains";
import { createConfig, webSocket } from "wagmi";
import { KeyManager, webAuthn } from "wagmi/tempo";

export const alphaUsd =
	"0x20c0000000000000000000000000000000000001" as `0x${string}`;

export const queryClient = new QueryClient();

const chain = tempoModerato.extend({ feeToken: alphaUsd });

export const config = createConfig({
	connectors: [
		webAuthn({
			keyManager: KeyManager.localStorage(),
		}),
	],
	chains: [chain],
	multiInjectedProviderDiscovery: false,
	transports: {
		[tempoModerato.id]: webSocket(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
