# Trench Crusade

A campaign management and leaderboard web app for narrative tabletop wargaming, built with Vite, React, TypeScript, Supabase, React Query, React Router v6, and Sass (CSS Modules).

## Features

- **Campaign Management:** Create, join, and manage narrative campaigns.
- **Warbands:** Create and edit warbands, select factions and subfactions, and view detailed warband stats and match history.
- **Skirmishes:** Record, resolve, and view pending and completed skirmishes with real-time updates.
- **Leaderboard:** Live campaign leaderboard with faction and subfaction columns.
- **Authentication:** Supabase-powered sign-up/login with email whitelist enforcement.
- **Accessibility:** All interactive elements use React-Aria for accessibility.
- **Dark/Light Mode:** Fully themed with SCSS variables and BEM naming, supporting dark and light modes.
- **Responsive Layout:** Grid-based warband and campaign lists, cards fill available space and maintain equal height.

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) (PostgreSQL, Auth, Edge Functions, Realtime)
- [React Query](https://tanstack.com/query/latest)
- [React Router v6](https://reactrouter.com/en/main)
- [Sass](https://sass-lang.com/) with CSS Modules (BEM naming)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)

## Development

### Prerequisites

- Node.js (18+ recommended)
- Yarn or npm
- Supabase project (see below)

### Setup

1. Clone the repo:
    ```sh
    git clone https://github.com/your-org/trench-crusade.git
    cd trench-crusade
    ```
2. Install dependencies:
    ```sh
    yarn install
    # or
    npm install
    ```
3. Copy `.env.example` to `.env` and set your Supabase keys:
    ```sh
    cp .env.example .env
    # Edit .env with your Supabase project URL and anon/public key
    ```
4. Start the dev server:
    ```sh
    yarn dev
    # or
    npm run dev
    ```

### Supabase Setup

- Create a Supabase project and configure the following tables:
    - `campaigns`, `warbands`, `skirmishes`, `profiles`, `factions`, `subfactions`, `oaths`, `whitelist`
- Set up RLS (Row Level Security) and policies as needed (see `supabase_profiles.sql`).

## Project Structure

- `src/pages/` — Main app pages (Campaigns, Warbands, Profile, etc.)
- `src/components/` — Reusable UI components (cards, tables, forms, etc.)
- `src/hooks/` — React Query hooks for data fetching and mutations
- `src/services/` — Supabase client and API service modules
- `src/types/` — TypeScript types
- `src/styles/` — Global and variable SCSS files

## Accessibility & Theming

- All interactive elements use React-Aria hooks/components for accessibility.
- All styles use SCSS variables and BEM naming, with dark/light mode support via CSS custom properties.

## License

MIT

---

_This project is a narrative campaign tracker for Trench Crusade and similar wargames. For questions or contributions, open an issue or pull request!_
...reactDom.configs.recommended.rules,

```

```
