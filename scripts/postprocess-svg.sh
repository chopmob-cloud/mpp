#!/bin/bash
SVG_FILE="$1"

# Add the animated-mermaid-svg class to the root SVG element
sed -i '' 's/id="my-svg"/id="my-svg" class="animated-mermaid-svg"/' "$SVG_FILE"

# Remove inline background-color: white so dark mode works
sed -i '' 's/background-color: white;/background-color: transparent;/' "$SVG_FILE"

# Remove inline fill/stroke from actor rects so CSS can control them
sed -i '' 's/fill="#eaeaea" stroke="#666"//g' "$SVG_FILE"

# Inject custom styles into the SVG
sed -i '' 's|</style>|#my-svg .note { fill: transparent !important; stroke: transparent !important; } #my-svg .messageLine1[marker-end*="crosshead"] { stroke: #b97676 !important; } #my-svg #crosshead path { fill: #b97676 !important; stroke: #b97676 !important; } #my-svg .messageLine1[marker-end*="arrowhead"] { stroke: #5b9a76 !important; }</style>|' "$SVG_FILE"

echo "Postprocessed $SVG_FILE"
