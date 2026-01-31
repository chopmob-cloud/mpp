import { AnimatedMermaid, type AnimationStep } from "./AnimatedMermaid";

const steps: AnimationStep[] = [
	{
		selector: ".actor, .actor-box, .actor-line",
		description: "Client and Server are the two participants in the MPP flow",
	},
	{
		index: { messageLine0: [0], messageText: [0] },
		description: "Client sends initial request: GET /resource",
	},
	{
		index: { messageLine1: [0], messageText: [1, 2] },
		description:
			"Server responds with 402 Payment Required and a challenge in WWW-Authenticate",
	},
	{
		index: { note: [0], noteText: [0, 1] },
		description:
			"Client fulfills the payment challenge (signs transaction, pays invoice, etc.)",
	},
	{
		index: { messageLine0: [1], messageText: [3, 4] },
		description: "Client retries request with Authorization credential",
	},
	{
		index: { note: [1], noteText: [2], messageLine1: [1], messageText: [5, 6] },
		description: "Server verifies payment and returns 200 OK with a receipt",
	},
];

const ASCII_DIAGRAM = `
┌────────┐                                              ┌────────┐
│ Client │                                              │ Server │
└───┬────┘                                              └───┬────┘
    │                                                       │
    │  (1) GET /resource                                    │
    │──────────────────────────────────────────────────────>│
    │                                                       │
    │  (2) 402 Payment Required                             │
    │      WWW-Authenticate: Payment <challenge>            │
    │<- - - - - - - - - - - - - - - - - - - - - - - - - - - │
    │                                                       │
    │  (3) Client fulfills payment challenge                │
    │      (signs transaction, pays invoice, etc.)          │
    │                                                       │
    │  (4) GET /resource                                    │
    │      Authorization: Payment <credential>              │
    │──────────────────────────────────────────────────────>│
    │                                                       │
    │                       (5) Server verifies and settles │
    │                                                       │
    │  (6) 200 OK                                           │
    │      Payment-Receipt: <receipt>                       │
    │<- - - - - - - - - - - - - - - - - - - - - - - - - - - │
    │                                                       │
`;

export function MppFlowDiagram({ ascii = false }: { ascii?: boolean }) {
	if (ascii) {
		return (
			<pre
				style={{
					fontFamily: "monospace",
					fontSize: "12px",
					lineHeight: 1.4,
					overflow: "auto",
					padding: "1rem",
					background: "var(--vocs-color_background2)",
					borderRadius: "8px",
				}}
			>
				{ASCII_DIAGRAM}
			</pre>
		);
	}

	return (
		<AnimatedMermaid
			src="/diagrams/mpp-flow.svg"
			steps={steps}
			autoPlayInterval={2500}
		/>
	);
}
