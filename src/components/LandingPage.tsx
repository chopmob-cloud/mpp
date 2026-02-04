"use client";

import { useState } from "react";
import { CliDemo } from "./CliDemo";

// Tempo logo SVG
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

// Stripe logo SVG
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

// Arrow icon for CTAs
function ArrowRightIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
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
	);
}

// Stream icon for the streaming feature highlight
function StreamIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M2 12h4l3-9 6 18 3-9h4" />
		</svg>
	);
}

// Code tabs component for Client/Server examples
function CodeTabs() {
	const [activeTab, setActiveTab] = useState<"client" | "server">("client");

	return (
		<div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10">
			<div className="flex items-center gap-0 border-b border-white/10">
				<button
					type="button"
					onClick={() => setActiveTab("client")}
					className={`text-[13px] font-medium px-4 py-3 transition-colors border-b-2 ${
						activeTab === "client"
							? "text-[var(--vocs-color-text)] border-[#0166FF]"
							: "text-[var(--vocs-color-text-3)] border-transparent hover:text-[var(--vocs-color-text-2)]"
					}`}
					style={{
						background: "none",
						cursor: "pointer",
						marginBottom: "-1px",
					}}
				>
					Client
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("server")}
					className={`text-[13px] font-medium px-4 py-3 transition-colors border-b-2 ${
						activeTab === "server"
							? "text-[var(--vocs-color-text)] border-[#0166FF]"
							: "text-[var(--vocs-color-text-3)] border-transparent hover:text-[var(--vocs-color-text-2)]"
					}`}
					style={{
						background: "none",
						cursor: "pointer",
						marginBottom: "-1px",
					}}
				>
					Server
				</button>
			</div>
			<div className="p-4 font-mono text-sm overflow-x-auto">
				{activeTab === "client" ? (
					<pre className="m-0 leading-relaxed">
						<code>
							<span className="text-[#c678dd]">import</span>
							<span className="text-[var(--vocs-color-text)]">
								{" "}
								{"{"} Fetch, tempo {"}"}{" "}
							</span>
							<span className="text-[#c678dd]">from</span>
							<span className="text-[#98c379]"> 'mpay/client'</span>
							{"\n\n"}
							<span className="text-[#e5c07b]">Fetch</span>
							<span className="text-[var(--vocs-color-text)]">
								.polyfill({"{"}
							</span>
							{"\n"}
							<span className="text-[var(--vocs-color-text)]">
								{"  "}methods: [
							</span>
							<span className="text-[#e5c07b]">tempo</span>
							<span className="text-[var(--vocs-color-text)]">
								({"{"} account {"}"})]
							</span>
							{"\n"}
							<span className="text-[var(--vocs-color-text)]">{"}"})</span>
							{"\n\n"}
							<span className="text-[#c678dd]">const</span>
							<span className="text-[var(--vocs-color-text)]">
								{" "}
								res ={" "}
							</span>
							<span className="text-[#c678dd]">await</span>
							<span className="text-[var(--vocs-color-text)]"> </span>
							<span className="text-[#61afef]">fetch</span>
							<span className="text-[var(--vocs-color-text)]">(url)</span>
						</code>
					</pre>
				) : (
					<pre className="m-0 leading-relaxed">
						<code>
							<span className="text-[#c678dd]">import</span>
							<span className="text-[var(--vocs-color-text)]">
								{" "}
								{"{"} Mpay, tempo {"}"}{" "}
							</span>
							<span className="text-[#c678dd]">from</span>
							<span className="text-[#98c379]"> 'mpay/server'</span>
							{"\n\n"}
							<span className="text-[#c678dd]">const</span>
							<span className="text-[var(--vocs-color-text)]"> mpay = </span>
							<span className="text-[#e5c07b]">Mpay</span>
							<span className="text-[var(--vocs-color-text)]">
								.create({"{"}
							</span>
							{"\n"}
							<span className="text-[var(--vocs-color-text)]">
								{"  "}methods: [
							</span>
							<span className="text-[#e5c07b]">tempo</span>
							<span className="text-[var(--vocs-color-text)]">
								({"{"} recipient {"}"})]
							</span>
							{"\n"}
							<span className="text-[var(--vocs-color-text)]">{"}"})</span>
							{"\n\n"}
							<span className="text-[#c678dd]">return</span>
							<span className="text-[var(--vocs-color-text)]"> mpay.</span>
							<span className="text-[#61afef]">challenge</span>
							<span className="text-[var(--vocs-color-text)]">({"{"} </span>
							<span className="text-[var(--vocs-color-text)]">amount: </span>
							<span className="text-[#d19a66]">0.01</span>
							<span className="text-[var(--vocs-color-text)]"> {"}"})</span>
						</code>
					</pre>
				)}
			</div>
		</div>
	);
}

// MPP Logo component
function MppLogo({ className }: { className?: string }) {
	return (
		<img
			src="/mpp-logo-dark.svg"
			alt="MPP"
			className={className}
			style={{ height: "48px" }}
		/>
	);
}

export function LandingPage() {
	return (
		<div className="not-prose">
			{/* Hero Section - Simplified per feedback */}
			<section className="relative py-16 md:py-24 border-b border-white/[0.06]">
				<div className="mx-auto px-4 sm:px-6 lg:px-20">
					<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
						{/* Left side - Logo, tagline, links */}
						<div className="flex-1 space-y-6">
							<MppLogo />

							<p className="text-lg md:text-xl text-[var(--vocs-color-text-2)] leading-relaxed max-w-lg">
								HTTP payments for humans, software, and AI agents.
							</p>

							{/* Primary links */}
							<div className="flex flex-wrap gap-4">
								<a
									href="/overview"
									className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0166FF] text-white font-medium rounded-lg transition-all hover:bg-[#0052CC] no-underline"
								>
									Docs
									<ArrowRightIcon className="w-4 h-4" />
								</a>
								<a
									href="https://paymentauth.tempo.xyz"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--vocs-color-border)] text-[var(--vocs-color-text)] font-medium rounded-lg transition-all hover:bg-[var(--vocs-color-background-2)] no-underline"
								>
									IETF Spec
								</a>
							</div>

							{/* Co-authors */}
							<div className="flex items-center gap-4 pt-4">
								<span className="text-[12px] text-[var(--vocs-color-text-3)] uppercase tracking-wider">
									Co-authored by
								</span>
								<div className="flex items-center gap-5">
									<a
										href="https://tempo.xyz"
										target="_blank"
										rel="noopener noreferrer"
										className="no-underline hover:opacity-80 transition-opacity"
									>
										<TempoLogo
											className="text-[var(--vocs-color-text-2)]"
											style={{ width: "60px" }}
										/>
									</a>
									<a
										href="https://stripe.com"
										target="_blank"
										rel="noopener noreferrer"
										className="no-underline hover:opacity-80 transition-opacity"
									>
										<StripeLogo
											className="text-[var(--vocs-color-text-2)]"
											style={{ width: "50px" }}
										/>
									</a>
								</div>
							</div>
						</div>

						{/* Right side - Interactive demo */}
						<div className="flex-1 w-full min-w-0">
							<CliDemo />
						</div>
					</div>
				</div>
			</section>

			{/* Streaming - Key differentiator, highlighted prominently */}
			<section className="relative py-16 md:py-20 border-b border-white/[0.06] bg-gradient-to-b from-[#0166FF]/5 to-transparent">
				<div className="mx-auto px-4 sm:px-6 lg:px-20">
					<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
						{/* Left - Copy */}
						<div className="flex-1 space-y-5">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0166FF]/10 border border-[#0166FF]/20">
								<StreamIcon className="w-4 h-4 text-[#0166FF]" />
								<span className="text-[12px] font-medium text-[#0166FF] uppercase tracking-wider">
									What makes MPP different
								</span>
							</div>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--vocs-color-text)]">
								Off-chain streaming payments
							</h2>
							<p className="text-base md:text-lg text-[var(--vocs-color-text-2)] leading-relaxed">
								Pay per request, per token, or per second—without hitting the chain every time.
								MPP streams payments off-chain and settles on-chain when you want.
								Web-scale throughput, blockchain finality.
							</p>
						</div>

						{/* Right - Visual */}
						<div className="flex-1 w-full">
							<div className="bg-[#1e1e1e] rounded-xl p-6 border border-white/10">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<div className="w-2 h-2 rounded-full bg-[#98c379] animate-pulse" />
										<span className="font-mono text-sm text-[var(--vocs-color-text-2)]">
											Streaming $0.001/request
										</span>
									</div>
									<div className="h-px bg-white/10" />
									<div className="grid grid-cols-3 gap-4 text-center">
										<div>
											<div className="text-2xl font-semibold text-[var(--vocs-color-text)]">1M+</div>
											<div className="text-xs text-[var(--vocs-color-text-3)]">requests/sec</div>
										</div>
										<div>
											<div className="text-2xl font-semibold text-[var(--vocs-color-text)]">&lt;1ms</div>
											<div className="text-xs text-[var(--vocs-color-text-3)]">payment latency</div>
										</div>
										<div>
											<div className="text-2xl font-semibold text-[#98c379]">1</div>
											<div className="text-xs text-[var(--vocs-color-text-3)]">settlement tx</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Code Examples - Moved up per feedback */}
			<section className="relative py-16 md:py-20 border-b border-white/[0.06]">
				<div className="mx-auto px-4 sm:px-6 lg:px-20">
					<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
						{/* Left - Copy */}
						<div className="flex-1 space-y-5">
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--vocs-color-text)]">
								Add payments in minutes
							</h2>
							<p className="text-base md:text-lg text-[var(--vocs-color-text-2)] leading-relaxed">
								Polyfill fetch on the client. Return a 402 on the server. Done.
							</p>
							<div className="flex flex-wrap gap-3">
								<a
									href="/quickstart/server"
									className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#0166FF] text-white font-medium rounded-lg transition-all hover:bg-[#0052CC] no-underline"
								>
									Server quickstart
								</a>
								<a
									href="/quickstart/client"
									className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-[var(--vocs-color-border)] text-[var(--vocs-color-text)] font-medium rounded-lg transition-all hover:bg-[var(--vocs-color-background-2)] no-underline"
								>
									Client quickstart
								</a>
							</div>
						</div>

						{/* Right - Interactive code tabs */}
						<div className="flex-1 w-full">
							<CodeTabs />
						</div>
					</div>
				</div>
			</section>

			{/* Protocol Flow - Simplified */}
			<section className="relative py-16 md:py-20 border-b border-white/[0.06]">
				<div className="mx-auto px-4 sm:px-6 lg:px-20">
					<div className="max-w-3xl mx-auto text-center space-y-6">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--vocs-color-text)]">
							Standard HTTP, standard auth
						</h2>
						<p className="text-base md:text-lg text-[var(--vocs-color-text-2)]">
							MPP extends HTTP 402 with a challenge-credential-receipt flow.
							No proprietary APIs. Works with any HTTP client.
						</p>
					</div>

					{/* Protocol flow diagram */}
					<div className="mt-12 max-w-2xl mx-auto">
						<div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10">
							<div className="grid grid-cols-4 divide-x divide-white/10">
								<div className="p-4 text-center">
									<div className="text-[10px] font-medium uppercase tracking-wider text-[var(--vocs-color-text-3)] mb-2">1</div>
									<code className="text-sm text-[#0166FF]">GET</code>
								</div>
								<div className="p-4 text-center">
									<div className="text-[10px] font-medium uppercase tracking-wider text-[var(--vocs-color-text-3)] mb-2">2</div>
									<code className="text-sm text-[var(--vocs-color-destructive)]">402</code>
								</div>
								<div className="p-4 text-center">
									<div className="text-[10px] font-medium uppercase tracking-wider text-[var(--vocs-color-text-3)] mb-2">3</div>
									<code className="text-sm text-[#e5c07b]">Pay</code>
								</div>
								<div className="p-4 text-center">
									<div className="text-[10px] font-medium uppercase tracking-wider text-[var(--vocs-color-text-3)] mb-2">4</div>
									<code className="text-sm text-[#98c379]">200</code>
								</div>
							</div>
							<div className="border-t border-white/10 p-4 text-center">
								<span className="text-xs text-[var(--vocs-color-text-3)]">
									Request → Challenge → Credential → Receipt
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Payment Methods - Compact */}
			<section className="relative py-16 md:py-20">
				<div className="mx-auto px-4 sm:px-6 lg:px-20">
					<div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--vocs-color-text)]">
							Any payment method
						</h2>
						<p className="text-base md:text-lg text-[var(--vocs-color-text-2)]">
							Crypto, cards, or custom. One protocol, every rail.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
						<div className="bg-[var(--vocs-color-background-2)] rounded-xl p-5 border border-white/10">
							<TempoLogo
								className="text-[var(--vocs-color-text)] mb-3"
								style={{ width: "50px" }}
							/>
							<p className="text-sm text-[var(--vocs-color-text-2)]">
								Instant USDC settlement
							</p>
						</div>
						<div className="bg-[var(--vocs-color-background-2)] rounded-xl p-5 border border-white/10">
							<StripeLogo
								className="text-[var(--vocs-color-text)] mb-3"
								style={{ width: "42px" }}
							/>
							<p className="text-sm text-[var(--vocs-color-text-2)]">
								Cards and bank transfers
							</p>
						</div>
						<div className="bg-[var(--vocs-color-background-2)] rounded-xl p-5 border border-white/10">
							<span className="font-semibold text-[var(--vocs-color-text)] text-lg">+</span>
							<p className="text-sm text-[var(--vocs-color-text-2)] mt-3">
								Build your own
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
