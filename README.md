
# Customer Journey CRM Dashboard

A beautiful, glass-morphism styled Customer Journey CRM dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Glass morphism UI design
- 🔄 Drag-and-drop journey board
- 📊 Interactive charts (Donut, Area Sparkline)
- 🌐 RTL/LTR support with language toggle
- 🔐 Mock authentication system
- 📱 Fully responsive design
- ♿ Accessible components
- 🎯 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login

Use any email and password to log in (mock authentication).

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   ├── layout/          # Layout components
│   ├── common/          # Common components
│   ├── journey/         # Journey board components
│   └── charts/          # Chart components
├── features/
│   ├── auth/            # Authentication
│   └── projects/        # Project types
├── pages/               # Page components
├── mocks/               # Mock data
├── lib/                 # Utilities
└── App.tsx              # Main app with routing

## Available Routes

- `/login` - Login page
- `/dashboard` - Main journey board
- `/projects` - Projects list
- `/projects/:id` - Project detail
- `/settings/profile` - Profile settings with RTL toggle
- `/settings/security` - Security settings

## Key Features

### Journey Board
- Drag-and-drop cards within islands
- Glass morphism styling
- Animated connectors between islands
- Avatar group with task counters

### Analytics
- Interactive donut chart
- Area sparkline chart
- Knowledge base suggestions

### Settings
- RTL/LTR direction toggle
- Language selection (English/Persian)
- Profile management
- Two-factor authentication UI

## Technologies

- React 18
- TypeScript
- React Router 6
- Tailwind CSS
- Vazirmatn font (Google Fonts)

## Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## License

MIT
