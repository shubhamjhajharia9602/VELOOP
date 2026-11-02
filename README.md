# VELOOP Level-Up Dashboard

A responsive React + Vite gamified progression dashboard with a PostgreSQL/Express API.

## Features

- Email/password sign-up and login using the Express API.
- XP total and XP history from the authenticated backend.
- Configurable level thresholds and sample next-level reward configuration in `src/data/tempData.js`.
- Current-level progression, XP progress, and visual level roadmap.
- Level-up celebration when a user crosses a level threshold during a session.
- Daily check-in using the backend's one-per-day endpoint.
- Playable 20-second Catch the Coins mini-game with score, completion/replay states, and an explicitly demo-only reward result.
- Additional earning cards for Watch & Earn, Refer & Earn, Daily Challenge and profile completion, marked Coming Soon until supported.
- Reward milestone cards clearly marked as development placeholders.
- Responsive CSS Modules and accessible focus/keyboard handling for the level-up modal.

## Frontend setup

Requirements: Node.js 20.19+ or 22.12+ recommended.

```bash
npm install
npm run dev
```

Vite prints the local development URL (usually `http://localhost:5173`).

## Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` from `.env.example` and set the PostgreSQL credentials and a long random `JWT_SECRET`. Then run:

```bash
npm run dev
```

The API listens on port `5000` by default. The frontend API base URL is configured in `src/services/api.js`.

## Database tables

The backend expects PostgreSQL tables named `users`, `user_xp_history`, and `daily_checkins`. Create them using the schema supplied by your project/database setup before testing authentication and XP endpoints.

## Demo / placeholder disclosure

The level thresholds and rewards in `src/data/tempData.js` are sample configuration based on the supplied design brief, not official production reward rules. Reward claiming is stored locally in the browser and does not issue redeemable items. The mini-game's +25 XP result is a visual prototype reward and does not change account XP. Earning concepts not backed by approved server endpoints are marked Coming Soon.

## Production checklist

- Confirm official level thresholds, badges, and reward values with the product owner.
- Implement server-side reward claim validation before enabling real rewards.
- Configure production API URL and secure environment variables.
- Run `npm run build`, test on mobile/tablet/desktop, push source to GitHub, and deploy to Vercel/Netlify.
