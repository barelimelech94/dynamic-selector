# Dynamic Selector

A React + TypeScript + Vite project featuring a dynamic multi-select listbox component with search, pagination, and customizable item selection.

## Features

-   Built with Vite for fast development
-   Written in React 19 with TypeScript
-   Dynamic search with debounced input
-   Paginated results with "Show More" functionality
-   Multi-select with initial pre-selected items
-   Unit tested with Vitest and Testing Library
-   Customizable styles via CSS

## Getting Started

### Prerequisites

-   Node.js (v18 or newer)
-   npm

### Installation

```
npm install
```

### Development

```
npm run dev
```

Open http://localhost:5173 to view the app.

### Testing

```
npm test
```

## Project Structure

```
src/
  api/                # Mock API for demo
  components/         # Reusable React components
  hooks/              # Custom React hooks
  utils/              # Types and config
  App.tsx             # Main app entry
  main.tsx            # ReactDOM bootstrap
```

## Main Components

-   ExampleMultiSelectListboxDynamicSelector: Core dynamic selector component
-   SearchBox: Search input
-   ResultsBox: Displays paginated, selectable items
-   ItemButton: Individual selectable item
-   LoadingIndicator: Spinner for loading states

## Customization

-   Update `src/utils/config.ts` to change page size, debounce delay, or mock items.
-   Style components via their respective `.css` files.

## License

MIT
