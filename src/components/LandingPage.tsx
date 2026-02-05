"use client";

import { useCallback, useRef, useState } from "react";
import { AsciiLogo } from "./AsciiLogo";
import { CliDemo } from "./CliDemo";

const SPEC_BASE = "https://paymentauth.tempo.xyz";

interface Spec {
	title: string;
	status: string;
	html: string;
	txt: string;
	xml: string;
	pdf: string;
}

interface SpecGroup {
	path: string;
	specs: Spec[];
}

const SPEC_GROUPS: SpecGroup[] = [
	{
		path: "~/Core",
		specs: [
			{
				title: 'The "Payment" HTTP Authentication Scheme',
				status: "Standards Track",
				html: "draft-httpauth-payment-00.html",
				txt: "draft-httpauth-payment-00.txt",
				xml: "draft-httpauth-payment-00.xml",
				pdf: "draft-httpauth-payment-00.pdf",
			},
		],
	},
	{
		path: "~/Extensions",
		specs: [
			{
				title: "Discovery Mechanisms for HTTP Payment Authentication",
				status: "Informational",
				html: "draft-payment-discovery-00.html",
				txt: "draft-payment-discovery-00.txt",
				xml: "draft-payment-discovery-00.xml",
				pdf: "draft-payment-discovery-00.pdf",
			},
		],
	},
	{
		path: "~/Intents",
		specs: [
			{
				title: "Charge Intent for HTTP Payment Authentication",
				status: "Informational",
				html: "draft-payment-intent-charge-00.html",
				txt: "draft-payment-intent-charge-00.txt",
				xml: "draft-payment-intent-charge-00.xml",
				pdf: "draft-payment-intent-charge-00.pdf",
			},
		],
	},
	{
		path: "~/Payment_Methods/Stripe",
		specs: [
			{
				title: "Stripe Charge Intent for HTTP Payment Authentication",
				status: "Informational",
				html: "draft-stripe-charge-00.html",
				txt: "draft-stripe-charge-00.txt",
				xml: "draft-stripe-charge-00.xml",
				pdf: "draft-stripe-charge-00.pdf",
			},
		],
	},
	{
		path: "~/Payment_Methods/Tempo",
		specs: [
			{
				title: "Tempo Charge Intent for HTTP Payment Authentication",
				status: "Informational",
				html: "draft-tempo-charge-00.html",
				txt: "draft-tempo-charge-00.txt",
				xml: "draft-tempo-charge-00.xml",
				pdf: "draft-tempo-charge-00.pdf",
			},
			{
				title: "Tempo Stream Intent for HTTP Payment Authentication",
				status: "Informational",
				html: "draft-tempo-stream-00.html",
				txt: "draft-tempo-stream-00.txt",
				xml: "draft-tempo-stream-00.xml",
				pdf: "draft-tempo-stream-00.pdf",
			},
		],
	},
	{
		path: "~/Transports",
		specs: [
			{
				title: "Payment Authentication Scheme: MCP Transport",
				status: "Informational",
				html: "draft-payment-transport-mcp-00.html",
				txt: "draft-payment-transport-mcp-00.txt",
				xml: "draft-payment-transport-mcp-00.xml",
				pdf: "draft-payment-transport-mcp-00.pdf",
			},
		],
	},
];

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setCopied(false), 2000);
	}, [text]);

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="text-[#0166FF] hover:text-[#0052CC] transition-colors shrink-0"
			aria-label="Copy to clipboard"
		>
			{copied ? (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
			) : (
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
					<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
				</svg>
			)}
		</button>
	);
}

function SpecRow({ spec, isLast }: { spec: Spec; isLast: boolean }) {
	return (
		<div className="pl-4 mb-4">
			<div className="flex items-center gap-3">
				<span className="text-gray-300 shrink-0 font-mono">
					{isLast ? "└──" : "├──"}
				</span>
				<span className="text-gray-900">{spec.title}</span>
				<span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded shrink-0">
					Draft
				</span>
				<span className="text-xs text-gray-400 shrink-0">{spec.status}</span>
			</div>
			<div className="flex items-center gap-1.5 text-sm pl-10 mt-1">
				<a
					href={`${SPEC_BASE}/${spec.html}`}
					className="text-[#0166FF] hover:underline no-underline"
				>
					HTML
				</a>
				<span className="text-gray-300">·</span>
				<a
					href={`${SPEC_BASE}/${spec.txt}`}
					className="text-[#0166FF] hover:underline no-underline"
				>
					TXT
				</a>
				<span className="text-gray-300">·</span>
				<a
					href={`${SPEC_BASE}/${spec.xml}`}
					className="text-[#0166FF] hover:underline no-underline"
				>
					XML
				</a>
				<span className="text-gray-300">·</span>
				<a
					href={`${SPEC_BASE}/${spec.pdf}`}
					className="text-[#0166FF] hover:underline no-underline"
				>
					PDF
				</a>
			</div>
		</div>
	);
}

function TempoLogo({
	className,
	style,
}: {
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<svg
			className={className}
			style={style}
			viewBox="0 0 830 185"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Tempo"
		>
			<title>Tempo</title>
			<path
				d="M61.5297 181.489H12.6398L57.9524 43.1662H0L12.6398 2.62335H174.096L161.456 43.1662H106.604L61.5297 181.489Z"
				fill="currentColor"
			/>
			<path
				d="M243.464 181.489H127.559L185.75 2.62335H301.178L290.207 36.727H223.192L211.029 75.1235H275.898L264.928 108.75H199.821L187.658 147.385H254.196L243.464 181.489Z"
				fill="currentColor"
			/>
			<path
				d="M295.923 181.489H257.05L315.479 2.62335H380.348L378.202 99.2107L441.401 2.62335H512.47L454.279 181.489H405.628L444.262 61.2912H443.547L364.131 181.489H335.274L336.466 59.8603H335.989L295.923 181.489Z"
				fill="currentColor"
			/>
			<path
				d="M567.193 35.7731L548.353 93.487H553.6C565.524 93.487 575.461 90.7046 583.411 85.1399C591.36 79.4162 596.527 71.3077 598.912 60.8142C600.979 51.7517 599.866 45.3126 595.573 41.4968C591.281 37.681 584.126 35.7731 574.109 35.7731H567.193ZM519.973 181.489H471.083L529.274 2.62335H588.657C602.331 2.62335 614.096 4.84923 623.953 9.30099C633.97 13.5938 641.283 19.7944 645.894 27.903C650.664 35.8526 652.254 45.1536 650.664 55.806C648.597 69.7973 643.191 82.1191 634.447 92.7715C625.702 103.424 614.334 111.692 600.343 117.574C586.511 123.298 571.009 126.16 553.838 126.16H537.859L519.973 181.489Z"
				fill="currentColor"
			/>
			<path
				d="M767.195 170.041C750.977 179.581 733.727 184.351 715.443 184.351H714.966C698.749 184.351 685.076 180.773 673.946 173.619C662.976 166.305 655.106 156.448 650.336 144.046C645.725 131.645 644.612 118.051 646.997 103.265C650.018 84.6629 656.934 67.4919 667.745 51.7517C678.557 36.0116 692.071 23.4512 708.288 14.0707C724.505 4.69025 741.836 0 760.279 0H760.755C777.609 0 791.52 3.57731 802.491 10.7319C813.62 17.8865 821.331 27.6645 825.624 40.0658C830.076 52.3082 831.03 66.061 828.486 81.3241C825.465 99.2902 818.549 116.223 807.737 132.122C796.926 147.862 783.412 160.502 767.195 170.041ZM699.703 139.277C703.995 147.385 711.468 151.439 722.121 151.439H722.597C731.342 151.439 739.451 148.18 746.923 141.661C754.555 134.984 760.994 126.08 766.241 114.951C771.646 103.821 775.621 91.4201 778.165 77.7468C780.55 64.3915 779.596 53.6596 775.303 45.551C771.01 37.2835 763.617 33.1497 753.124 33.1497H752.647C744.538 33.1497 736.668 36.4885 729.037 43.1662C721.564 49.8438 715.045 58.8268 709.481 70.1152C703.916 81.4036 699.862 93.646 697.318 106.842C694.774 120.198 695.569 131.009 699.703 139.277Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function StripeLogo({
	className,
	style,
}: {
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<svg
			className={className}
			style={style}
			viewBox="0 0 640 512"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Stripe"
		>
			<title>Stripe</title>
			<path
				d="M165 144.7l-43.3 9.2-.2 142.4c0 26.3 19.8 43.3 46.1 43.3 14.6 0 25.3-2.7 31.2-5.9v-33.8c-5.7 2.3-33.7 10.5-33.7-15.7V221h33.7v-37.8h-33.7zm89.1 51.6l-2.7-13.1H213v153.2h44.3V233.3c10.5-13.8 28.2-11.1 33.9-9.3v-40.8c-6-2.1-26.7-6-37.1 13.1zm92.3-72.3l-44.6 9.5v36.2l44.6-9.5zM44.9 228.3c0-6.9 5.8-9.6 15.1-9.7 13.5 0 30.7 4.1 44.2 11.4v-41.8c-14.7-5.8-29.4-8.1-44.1-8.1-36 0-60 18.8-60 50.2 0 49.2 67.5 41.2 67.5 62.4 0 8.2-7.1 10.9-17 10.9-14.7 0-33.7-6.1-48.6-14.2v40c16.5 7.1 33.2 10.1 48.5 10.1 36.9 0 62.3-15.8 62.3-47.8 0-52.9-67.9-43.4-67.9-63.4zM640 261.6c0-45.5-22-81.4-64.2-81.4s-67.9 35.9-67.9 81.1c0 53.5 30.3 78.2 73.5 78.2 21.2 0 37.1-4.8 49.2-11.5v-33.4c-12.1 6.1-26 9.8-43.6 9.8-17.3 0-32.5-6.1-34.5-26.9h86.9c.2-2.3.6-11.6.6-15.9zm-87.9-16.8c0-20 12.3-28.4 23.4-28.4 10.9 0 22.5 8.4 22.5 28.4zm-112.9-64.6c-17.4 0-28.6 8.2-34.8 13.9l-2.3-11H363v204.8l44.4-9.4.1-50.2c6.4 4.7 15.9 11.2 31.4 11.2 31.8 0 60.8-23.2 60.8-79.6.1-51.6-29.3-79.7-60.5-79.7zm-10.6 122.5c-10.4 0-16.6-3.8-20.9-8.4l-.3-66c4.6-5.1 11-8.8 21.2-8.8 16.2 0 27.4 18.2 27.4 41.4.1 23.9-10.9 41.8-27.4 41.8zm-126.7 33.7h44.6V183.2h-44.6z"
				fill="currentColor"
			/>
		</svg>
	);
}

export function LandingPage() {
	return (
		<div
			className="not-prose min-h-screen"
			style={{
				colorScheme: "light",
				backgroundColor: "#ffffff",
				color: "#111",
				fontFamily:
					'"Commit Mono", "Berkeley Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
			}}
		>
			{/* Hero */}
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-12 md:pt-24 md:pb-16">
				<div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
					{/* Left pane */}
					<div className="flex-1 space-y-8 min-w-0">
						{/* Logo */}
						<div>
							<AsciiLogo morph={false} />
						</div>

						{/* Tagline */}
						<div className="space-y-2 max-w-xl">
							<p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
								The machine-native payments protocol.
							</p>
							<p className="text-base md:text-lg text-gray-600 leading-relaxed">
								Accept payments from humans, software, or AI agents using standard HTTP—no billing accounts or manual signup required.
							</p>
						</div>

						{/* Co-authored by */}
						<div className="flex items-center gap-5">
							<span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
								Co-authored by
							</span>
							<div className="flex items-center gap-5">
								<a
									href="https://tempo.xyz"
									target="_blank"
									rel="noopener noreferrer"
									className="no-underline text-gray-400 hover:text-gray-600 transition-colors"
								>
									<TempoLogo style={{ width: "70px" }} />
								</a>
								<a
									href="https://stripe.com"
									target="_blank"
									rel="noopener noreferrer"
									className="no-underline text-gray-400 hover:text-gray-600 transition-colors"
								>
									<StripeLogo style={{ width: "55px" }} />
								</a>
							</div>
						</div>

						{/* CTA buttons */}
						<div className="flex flex-wrap gap-3">
							<a
								href="/quickstart/client"
								className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0166FF] text-white text-sm font-medium rounded-md hover:bg-[#0052CC] transition-colors no-underline"
							>
								Get started
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</a>
							<a
								href="https://github.com/tempoxyz/payment-auth-spec"
								className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors no-underline"
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
								</svg>
								View on GitHub
							</a>
						</div>

						{/* Copy-to-agent line */}
						<div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 max-w-md">
							<code className="text-sm text-gray-500 select-all flex-1 truncate">
								<span className="text-gray-300">$</span> claude -p &quot;read
								mpp.dev/llms-full.txt&quot;
							</code>
							<CopyButton text='claude -p "read mpp.dev/llms-full.txt"' />
						</div>
					</div>

					{/* Right pane — interactive demo */}
					<div className="flex-1 w-full min-w-0 flex flex-col">
						<CliDemo />
					</div>
				</div>
			</section>

			{/* Divider */}
			<div className="border-t border-gray-100" />

			{/* Specs */}
			<section className="mx-auto max-w-[1200px] px-6 pt-12 pb-16 md:pt-16 md:pb-20">
				<h2 className="text-xl font-bold text-gray-900">
					Protocol Specifications
				</h2>

				<hr className="border-gray-900 mb-8 mt-3" />

				<div className="space-y-6 text-sm">
					{SPEC_GROUPS.map((group) => (
						<div key={group.path}>
							<h3 className="text-base font-bold text-gray-900 mb-2">
								{group.path}
							</h3>
							{group.specs.map((spec, i) => (
								<SpecRow
									key={spec.html}
									spec={spec}
									isLast={i === group.specs.length - 1}
								/>
							))}
						</div>
					))}
				</div>
			</section>

			{/* Footer */}
			<div className="border-t border-gray-100" />
			<footer className="mx-auto max-w-[1200px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
				<div className="flex items-center gap-4">
					<a
						href="https://github.com/tempoxyz/payment-auth-spec"
						className="text-gray-400 hover:text-gray-600 no-underline"
					>
						GitHub
					</a>
					<a
						href="https://x.com/mpp"
						className="text-gray-400 hover:text-gray-600 no-underline"
					>
						X
					</a>
				</div>
				</footer>
		</div>
	);
}
