# TollsMap - Smart Route Planning with Toll Optimization

A Google Maps-like web application for finding optimal routes based on toll costs, distance, and time. Built with React, Vite, and Mapbox GL JS.

## Features

- 🗺️ **Interactive Map**: Powered by Mapbox with custom route visualization
- 💰 **Toll Cost Optimization**: Find routes within your toll budget
- 🚫 **Route Preferences**: Avoid tolls, highways, or both
- 🧭 **Turn-by-Turn Navigation**: Google Maps-style navigation interface
- 📍 **Location Search**: Autocomplete address search with Mapbox Geocoding
- 📊 **Route Comparison**: Compare multiple route options side-by-side
- 💵 **Toll Breakdown**: Detailed toll information for each route

## Technologies

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Mapbox GL JS** - Interactive maps
- **Turf.js** - Geospatial calculations
- **TollGuru API** - Toll cost data
- **React Context** - State management

## Getting Started

### Prerequisites

- Node.js 22.12+ or 20.19+
- Mapbox API token (free tier available)
- TollGuru API key (optional, for live toll data)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/tolls-map.git
cd tolls-map
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file in the root directory:
\`\`\`env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
VITE_TOLLGURU_API_KEY=your_tollguru_key_here
VITE_ENABLE_OSRM_FALLBACK=true
VITE_OSRM_SERVER_URL=https://router.project-osrm.org
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the \`dist\` directory.

## Deployment

### GitHub Pages

1. Update the \`base\` path in \`vite.config.js\` to match your repository name
2. Deploy to GitHub Pages:
\`\`\`bash
npm run deploy
\`\`\`

The app will be available at \`https://YOUR_USERNAME.github.io/tolls-map/\`

## Usage

1. **Set Origin & Destination**: Enter starting point and destination
2. **Set Preferences**:
   - Set maximum toll budget
   - Toggle "Avoid Tolls" to exclude toll roads
   - Toggle "Avoid Highways" to use local roads
3. **Search Routes**: Click "Search Routes" to find optimal paths
4. **Compare Options**: View multiple routes with costs and times
5. **Start Navigation**: Select a route and click "Start Navigation"

## API Keys

### Mapbox Token
Get your free token at [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)
- 100,000 free requests/month

### TollGuru API Key (Optional)
Get your key at [https://tollguru.com/toll-api](https://tollguru.com/toll-api)
- 500 free requests/month
- Falls back to static toll database if not configured

## License

MIT

## Author

Built with Claude Code
