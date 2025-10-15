## OZ Kitchen – Frontend App (Fusion Starter)

A production-ready React + Vite SPA with an integrated Express scaffold. This project focuses on the frontend flow for a weekly lunchbox planner (Index → Price Selection → Packaging → Receipt). Another team can implement the backend; this README explains how to run, build, and deploy the frontend independently.

### Key Features
- React 18 + TypeScript + Vite 7
- React Router 6 SPA routing
- TailwindCSS 3 with prebuilt UI primitives (Radix/shadcn-style)
- TanStack Query for data fetching/caching (ready for API integration)
- Express server scaffold (optional or via Netlify Function)

### Project Structure
```text
client/                   # React SPA frontend
  pages/                  # Route components (Index.tsx = home)
  components/ui/          # Reusable UI components
  components/MealCalendar.tsx
  App.tsx                 # App entry + router setup
  global.css              # Tailwind theme and styles

server/                   # Express API backend (scaffold)
  index.ts                # createServer() with example routes
  routes/                 # Demo route handlers

shared/                   # Shared types (client + server)
  api.ts                  # Example shared API type(s)

netlify/functions/        # Serverless handler wrapping Express
```

### Scripts
```bash
# Dev server (Vite)
pnpm dev        # preferred
# or
npm run dev

# Build
pnpm build                  # builds client and server bundles
pnpm build:client           # client-only build (Vite)
pnpm build:server           # server bundle (Vite + server config)

# Start (production, after build)
pnpm start

# Typecheck & Tests
pnpm typecheck
pnpm test
```

If pnpm is not available on your system, you can use npm equivalents:
```bash
npm install
npm run dev
npm run build
npm run start
```

### Prerequisites
- Node.js 20 LTS recommended
- Package manager: pnpm (preferred) or npm

If Corepack/pnpm activation fails on Windows, use npm as a fallback (see Troubleshooting).

### Environment Variables
Frontend uses Vite env vars at build time:
```bash
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.your-domain.com
```
Usage in code (example):
```ts
const BASE_URL = import.meta.env.VITE_API_URL;
```

### Development (Frontend-only)
1) Install deps
```bash
pnpm install
# or
npm install
```
2) Start dev server
```bash
pnpm dev
# or
npm run dev
```
3) Open the app: http://localhost:5173

You can build/deploy the SPA independently; the app will call your backend via `VITE_API_URL`.

### Production Build (SPA)
```bash
# client build (placed in dist/)
pnpm build:client
# or full build (client + server bundle)
pnpm build
```

Deploy the `dist/` directory to your host (Vercel, Netlify, Cloudflare Pages, etc.) and set `VITE_API_URL` accordingly.

For Netlify, ensure SPA fallback (a `netlify.toml` is included). Example:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Frontend Flow
- `/` (Index): Landing page with CTA → "Get Started"
- `/price` (PriceSelection): Choose monthly/weekly and enter a budget
- `/packaging` (Packaging): Select meals, assign to dates via modal calendar, adjust quantities
- `/receipt` (Receipt): Summary, subtotal, choose payment option (UI only)

Pages communicate via React Router state; API calls can be integrated later with TanStack Query.

### Integrating with a Remote API (Optional)
Create a small client in `client/lib/api.ts` and wire it using TanStack Query hooks. Suggested endpoints for the backend team:
- `GET /meals` → `MealOption[]`
- `GET /pricing` → `{ min: number; max: number }`
- `POST /plans` → `{ id: string }` with payload:
```json
{
  "subscriptionType": "weekly" | "monthly",
  "meals": [{ "optionId": "string", "dateISO": "YYYY-MM-DD", "quantity": 1 }],
  "budget": 1000
}
```
Use `VITE_API_URL` to point the frontend at your deployed API.

### Testing & Quality
```bash
pnpm typecheck
pnpm test
```
Add component/page tests under `client/` using Vitest if needed.

### Troubleshooting
**Windows: pnpm/Corepack error**
- Symptom: "Failed to switch pnpm to v10.x" or ENOENT
- Workarounds:
  - Use npm: `npm install && npm run dev`
  - Or install pnpm globally: `npm i -g pnpm` (then `pnpm -v`)

**esbuild EFTYPE / Node version issues**
- Use Node 20 LTS if possible
- Remove cached binaries and reinstall: delete `node_modules` then reinstall

**Blank page in production**
- Ensure SPA fallback to `index.html`
- Check `VITE_API_URL` is set at build time
