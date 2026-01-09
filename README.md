# Premium Homes - Real Estate Website

A modern, responsive real estate website built with React and Redux, inspired by Century 21 Albania.

## Features

- 🏠 Property listings with search and filter functionality
- 🌓 Light/Dark theme toggle
- 🌍 Multi-language support (English/Albanian)
- 📱 Fully responsive design
- 🔍 Advanced property search with filters
- 🎨 Modern, clean UI with smooth animations
- 📊 Redux state management for scalable architecture

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **Redux Saga** - Side effect management for async operations
- **React Router** - Navigation (ready for routing)
- **CSS3** - Styling with CSS variables for theming

## Project Structure

```
PremiumHomeWebPage/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Hero/
│   │   ├── PropertyCard/
│   │   ├── PropertyList/
│   │   ├── CitiesSection/
│   │   └── Footer/
│   ├── store/
│   │   ├── slices/
│   │   │   ├── propertiesSlice.js
│   │   │   ├── filtersSlice.js
│   │   │   └── uiSlice.js
│   │   ├── sagas/
│   │   │   ├── propertiesSaga.js
│   │   │   └── rootSaga.js
│   │   ├── selectors/
│   │   │   └── propertySelectors.js
│   │   └── store.js
│   ├── data/
│   │   └── sampleProperties.js
│   ├── utils/
│   │   └── propertyHelpers.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## Redux Toolkit + Redux Saga Store Structure

The application uses **Redux Toolkit** for state management and **Redux Saga** for side effects, following modern best practices:

### Store Configuration
- Uses `configureStore` from Redux Toolkit
- Includes Redux Saga middleware for async operations
- Automatically includes Redux DevTools support
- Thunk middleware is disabled (using Saga instead)

### Properties Slice (`propertiesSlice.js`)
- Manages property data state
- Handles loading and error states
- Tracks selected property
- **Actions**: 
  - `fetchPropertiesStart` - Triggers saga to fetch properties
  - `fetchPropertiesSuccess` - Dispatched by saga on success
  - `fetchPropertiesFailure` - Dispatched by saga on error
  - `setProperties`, `setSelectedProperty`, `addProperty`, `clearSelectedProperty`

### Properties Saga (`store/sagas/propertiesSaga.js`)
- Handles async operations using Redux Saga
- Watches for `fetchPropertiesStart` actions
- Uses `takeLatest` to handle only the most recent request
- Simulates API call (replace with real API endpoint)
- Dispatches success/failure actions based on result

### Filters Slice (`filtersSlice.js`)
- Search query
- Property type (apartment, villa, office, land)
- Transaction type (sale, rent)
- City filter
- Price range
- Bedrooms filter
- Sort options
- **Actions**: `setSearchQuery`, `setPropertyType`, `setTransactionType`, `setCity`, `setMinPrice`, `setMaxPrice`, `setBedrooms`, `setSortBy`, `resetFilters`

### UI Slice (`uiSlice.js`)
- Theme (light/dark)
- Language (en/sq)
- Menu state
- Search modal state
- **Actions**: `setTheme`, `toggleTheme`, `setLanguage`, `toggleMenu`, `closeMenu`, `toggleSearchModal`, `closeSearchModal`

### Selectors (`store/selectors/propertySelectors.js`)
Uses `createSelector` from Redux Toolkit for memoized selectors:
- `selectAllProperties` - All properties
- `selectFilteredProperties` - Filtered and sorted properties (memoized)
- `selectFeaturedProperties` - Featured properties only
- `selectPropertiesByType` - Properties filtered by type
- `selectPropertiesByTransaction` - Properties filtered by transaction type
- `selectPropertyCount` - Count of filtered properties
- `selectPropertiesLoading` - Loading state
- `selectPropertiesError` - Error state
- `selectSelectedProperty` - Currently selected property

### Redux Toolkit Features Used
✅ `createSlice` - Simplified reducer logic with Immer  
✅ `createSelector` - Memoized selectors for performance  
✅ `configureStore` - Enhanced store setup with good defaults

### Redux Saga Features Used
✅ `takeLatest` - Handle only the latest request, cancel previous  
✅ `call` - Call async functions (API calls)  
✅ `put` - Dispatch actions  
✅ `all` - Run multiple sagas in parallel  
✅ Generator functions - Clean async flow control

## Branding

The website uses a premium color scheme:
- Primary: #667eea (Purple-blue)
- Secondary: #764ba2 (Deep purple)
- Supports both light and dark themes

## Customization

### Adding Properties

Edit `src/data/sampleProperties.js` to add or modify property listings.

### Styling

All styles use CSS variables defined in `src/index.css`. Modify these to change the color scheme and branding.

### Adding New Features

The Redux store is structured to easily accommodate new features. Simply add new slices or extend existing ones.

## License

This project is created for demonstration purposes.
