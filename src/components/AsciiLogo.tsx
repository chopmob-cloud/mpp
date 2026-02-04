"use client";

import { useEffect, useMemo, useState } from "react";

const ASCII_ART = `@@@@@@@@%                                $@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%$$$=       
@@@@@@@@@@$                             $@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@$=    
@@@@@@@@@@@$                           %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@$   
@@@@@@@@@@@@$                        =%@@@@@@@@@@@%===================$$$%@@@@@@@@@@@$===================$$$%@@@@@@@@@= 
@@@@@@@@@@@@@%                      =@@@@@@@@@@@@@%                        $@@@@@@@@@=                        $@@@@@@@% 
@@@@@@@@@@@@@@@=                   $@@@@@@@@@@@@@@%                         @@@@@@@@@=                         @@@@@@@@=
@@@@@@@@%@@@@@@@$                 $@@@@@@@@@@@@@@@%                         @@@@@@@@@=                         @@@@@@@@=
@@@@@@@@=$@@@@@@@$               %@@@@@@@=%@@@@@@@%                        $@@@@@@@@@=                        $@@@@@@@@ 
@@@@@@@@= $@@@@@@@$            =%@@@@@@%  %@@@@@@@%======================%%@@@@@@@@@@$======================%%@@@@@@@@$ 
@@@@@@@@=  =@@@@@@@@=         =@@@@@@@$   %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@$  
@@@@@@@@=    $@@@@@@@$       $@@@@@@@$    %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=   
@@@@@@@@=     $@@@@@@@$     $@@@@@@@=     %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%$=      
@@@@@@@@=      $@@@@@@@$   %@@@@@@%=      %@@@@@@@%                          %@@@@@@@$                                  
@@@@@@@@=       =@@@@@@@%$@@@@@@@%        %@@@@@@@%                          %@@@@@@@$                                  
@@@@@@@@=         $@@@@@@@@@@@@@$         %@@@@@@@%                          %@@@@@@@$                                  
@@@@@@@@=          $@@@@@@@@@@@$          %@@@@@@@%                          %@@@@@@@$                                  
@@@@@@@@=           $@@@@@@@@@=           %@@@@@@@%                          %@@@@@@@$                                  
@@@@@@@@=            =@@@@@@%             %@@@@@@@%                          %@@@@@@@$                                  
@@@@@@@@=              %@@@$              %@@@@@@@%                          %@@@@@@@$                                  
%%%%%%%%=               $%$               $%%%%%%%$                          $%%%%%%%$`;

// Characters to cycle through for "filled" positions
const FILL_CHARS = [
	"@",
	"#",
	"%",
	"&",
	"£",
	"$",
	"█",
	"▓",
	"▒",
	"░",
	"■",
	"●",
	"◆",
	"★",
];

interface CharState {
	charIndex: number;
	nextChangeTime: number;
	cycleDuration: number;
}

export function AsciiLogo() {
	const lines = useMemo(() => ASCII_ART.split("\n"), []);

	// Initialize each character with its own state
	const [charStates, setCharStates] = useState<CharState[][]>(() => {
		return lines.map((line) =>
			line.split("").map(() => ({
				charIndex: Math.floor(Math.random() * FILL_CHARS.length),
				nextChangeTime: Date.now() + Math.random() * 1000,
				cycleDuration: 300 + Math.random() * 700, // 300ms to 1000ms per character
			})),
		);
	});

	useEffect(() => {
		let animationId: number;

		const animate = () => {
			const now = Date.now();

			setCharStates((prevStates) => {
				let hasChanges = false;
				const newStates = prevStates.map((lineStates) =>
					lineStates.map((state) => {
						if (now >= state.nextChangeTime) {
							hasChanges = true;
							return {
								charIndex: (state.charIndex + 1) % FILL_CHARS.length,
								nextChangeTime:
									now + state.cycleDuration + (Math.random() - 0.5) * 200,
								cycleDuration: state.cycleDuration,
							};
						}
						return state;
					}),
				);
				return hasChanges ? newStates : prevStates;
			});

			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationId);
	}, []);

	return (
		<div
			style={{
				fontFamily: "monospace",
				fontSize: "6px",
				lineHeight: 1.15,
				whiteSpace: "pre",
				letterSpacing: "1px",
				color: "#0166FF",
				opacity: 0.85,
				overflow: "hidden",
				textShadow: "0 0 20px rgba(1, 102, 255, 0.3)",
			}}
		>
			{lines.map((line, lineIdx) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static ASCII art lines don't reorder
				<div key={lineIdx}>
					{line.split("").map((char, charIdx) => {
						// Keep spaces as spaces
						if (char === " " || char === ";") {
							// biome-ignore lint/suspicious/noArrayIndexKey: static chars don't reorder
							return <span key={charIdx}>{char}</span>;
						}
						const state = charStates[lineIdx]?.[charIdx];
						const displayChar = state ? FILL_CHARS[state.charIndex] : char;
						// biome-ignore lint/suspicious/noArrayIndexKey: static chars don't reorder
						return <span key={charIdx}>{displayChar}</span>;
					})}
				</div>
			))}
		</div>
	);
}
