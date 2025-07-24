# Tuneforger

<div align="center">
  <img src="./public/logo.png" alt="Tuneforger Logo" width="200" height="200">
  <p><em>AI-Powered Spotify Playlist Generator</em></p>
</div>

An AI-powered playlist generator that creates personalized Spotify playlists using artificial intelligence. Tuneforger analyzes your music preferences and generates curated playlists tailored to your taste, mood, or specific requirements.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Convex
- **Build Tool**: Vite
- **AI Integration**: Custom AI algorithms for playlist generation
- **External APIs**: Spotify Web API
- **Code Quality**: ESLint + TypeScript ESLint

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript ESLint
- **Package Manager**: npm/yarn
- **Hot Reload**: Vite HMR with React Fast Refresh

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Git
- A Spotify account 
- Convex account for backend services

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tuneforger
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   VITE_CONVEX_URL=your_convex_deployment_url
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```

4. **Set up Convex backend**
   ```bash
   npx convex dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Convex Setup

1. Sign up for a [Convex account](https://convex.dev)
2. Create a new project
3. Run `npx convex dev` to deploy your backend functions
4. Update your `.env.local` file with the Convex deployment URL

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Automatically fix ESLint issues where possible
- `npx convex dev` - Start Convex backend in development mode
- `npx convex deploy` - Deploy Convex backend to production

