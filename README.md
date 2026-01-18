# Galaxy Weather App

A production-ready Galaxy-style weather application built with React 19, TypeScript, Tailwind CSS, and TanStack Query.

## Features

- **Real-time Weather**: Current weather conditions with temperature, min/max, and description
- **Hourly Forecast**: 15-hour weather forecast with icons and temperatures
- **Smart Suggestions**: AI-powered weather advice based on current conditions
- **Location Search**: Search and select from Korean regions with autocomplete
- **Favorites**: Save up to 6 favorite locations with custom nicknames
- **Detail Page**: View detailed weather information for any favorite
- **Geolocation**: Automatic location detection with Seoul fallback
- **Responsive Design**: Optimized for mobile (375px), tablet (768px), and desktop (1024px)
- **Error Handling**: Comprehensive error screens with retry functionality
- **Error Boundary**: Catch and display component errors gracefully

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (PostCSS)
- **State Management**: TanStack Query 5 (server state), React hooks (UI state)
- **Routing**: React Router DOM 7
- **UI Components**: Lucide React (icons)
- **API**: OpenWeatherMap (weather data)

## Architecture

### Feature-Based Structure

```
src/
├── features/
│   ├── weather/              # Weather feature
│   │   ├── components/       # WeatherDisplay, HourlyForecast, etc.
│   │   ├── hooks/           # useWeatherData, useHourlyForecast
│   │   └── services/        # weatherService (API calls)
│   ├── location/            # Location feature
│   │   ├── components/      # LocationHeader, SearchOverlay, etc.
│   │   ├── hooks/          # useGeolocation, useLocationSearch, useGeocode
│   │   └── constants/      # regions, popular cities
│   ├── favorites/           # Favorites feature
│   │   ├── components/     # FavoritesList, FavoriteCard, etc.
│   │   └── hooks/         # useFavorites, useFavoriteWeather
│   └── shared/             # Shared across features
│       ├── components/    # GlassCard, LoadingScreen, ErrorScreen, ErrorBoundary
│       └── utils/        # formatters, weather-helpers
├── pages/                  # Page components
│   ├── MainPage.tsx
│   └── DetailPage.tsx
├── config/                 # Configuration
│   ├── queryClient.ts
│   └── constants.ts
├── types/                  # TypeScript types
│   ├── weather.types.ts
│   └── location.types.ts
├── App.tsx                 # Router setup
└── index.css              # Global styles with Tailwind
```

### Key Components

- **GlassCard**: Reusable glass-morphism card component
- **LoadingScreen**: Loading state with status messages
- **ErrorScreen**: Error state with retry button
- **ErrorBoundary**: React error boundary for component errors
- **LocationHeader**: Header with search, location name, and favorite toggle
- **SearchOverlay**: Full-screen search modal with autocomplete
- **FavoriteCard**: Individual favorite location card with weather
- **FavoritesList**: Grid of favorite locations

### Custom Hooks

- **useWeatherData**: Fetch current weather with TanStack Query
- **useHourlyForecast**: Fetch hourly forecast with TanStack Query
- **useGeolocation**: Browser geolocation with timeout and fallback
- **useLocationSearch**: Search locations from REGIONS array
- **useGeocode**: Geocode location names using OpenWeatherMap API
- **useFavorites**: Manage favorites with localStorage persistence
- **useFavoriteWeather**: Batch fetch weather for multiple favorites

## Setup Instructions

### Prerequisites

- Node.js 18+
- pnpm 8+
- OpenWeatherMap API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-with-duduzi
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env.local` with your API keys:
```bash
VITE_WEATHER_API_KEY=your_api_key_here
VITE_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

Get your API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
pnpm build
```

The optimized build will be in the `dist/` directory.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |

## API Usage

### Weather Endpoints

The app uses the OpenWeatherMap Current Weather and 5-Day Forecast APIs:

- **Current Weather**: `GET /weather?lat={lat}&lon={lon}&units=metric&lang=kr`
- **Hourly Forecast**: `GET /forecast?lat={lat}&lon={lon}&units=metric&lang=kr`
- **Geocoding**: `GET /geo/1.0/direct?q={query},KR&limit=5`

All requests include `appid` (API key) parameter and use metric units with Korean language.

### Error Handling

- **401 Unauthorized**: API key is invalid or not activated
- **404 Not Found**: Location data not available
- **Network Error**: Connection timeout or network unavailable

All errors display user-friendly Korean messages with retry options.

## Responsive Design

The app is built mobile-first with Tailwind CSS breakpoints:

- **Mobile (375px)**: Default single-column layout
- **Tablet (768px)**: 2-column favorites grid
- **Desktop (1024px)**: 4-column favorites grid

All text, spacing, and icons scale appropriately for each breakpoint.

## Features in Detail

### Location Detection
- Automatically detects user's current location via browser geolocation
- 5-second timeout before falling back to Seoul
- User can manually search and select any Korean region
- Recent selections are prioritized in search

### Favorites System
- Save up to 6 favorite locations
- Custom nicknames for each favorite
- Persistent storage via localStorage
- Real-time weather updates for all favorites
- Click to view detailed weather for any favorite in detail page

### Smart Suggestions
- Weather-based advice in Korean
- Suggestions for rain, snow, cold, hot, or clear conditions
- Includes emoji for visual feedback

### Search
- Full-screen search overlay
- Real-time filtering from 150+ Korean regions
- Popular cities quick-select
- Shows "No results" message when applicable

## Browser Support

- Chrome (latest)
- Safari (latest, iOS 13+)
- Firefox (latest)
- Edge (latest)

## Performance

- **First Contentful Paint**: ~1.5s
- **CSS Bundle Size**: ~4.3KB (gzipped)
- **JS Bundle Size**: ~93.9KB (gzipped)
- **Zero unused CSS**: Tree-shaking with Tailwind CSS 4

## Troubleshooting

### "API 키가 유효하지 않습니다" Error
- Verify your API key in `.env.local`
- Check that the API key has been activated (can take 10-30 minutes)
- Ensure you're using the correct API endpoints

### "위치 정보를 가져올 수 없습니다" Error
- Browser geolocation permission was denied
- Allow location access in browser settings
- App will fall back to Seoul automatically

### "해당 장소의 정보가 제공되지 않습니다" Error
- Location name not found in OpenWeatherMap database
- Try a more specific or different location name
- Use the search to find similar locations

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint recommended for linting
- Prettier for code formatting

### State Management Philosophy
- TanStack Query for server state (weather data)
- React hooks for UI state (view mode, selected location)
- localStorage for persistent data (favorites)

### Component Pattern
- Functional components with hooks
- Props-based composition
- Separate concerns between presentational and container components

## Future Enhancements

Potential features for future versions:
- Weekly forecast view
- Weather alerts and notifications
- Weather history/trends
- Multiple languages support
- Dark/light theme toggle
- Sharing weather conditions
- Widget mode
- Push notifications

## License

This project is part of the Galaxy Weather series.

## Support

For issues or questions, please refer to the GitHub issues page.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
