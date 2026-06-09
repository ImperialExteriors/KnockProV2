# Imperial Exteriors — KPI Tracker

A mobile-first PWA for tracking door-to-door sales KPIs. Reps open it on their phone, save it to their home screen like an app, and tap to track Doors Knocked, Conversations, Inspections, and Claims Filed. Live leaderboard, celebration modals, daily "winning day" status, and a PIN-protected manager portal with daily/weekly history and CSV export.

**Stack:** React 18 + Vite + Tailwind CSS. No backend required to start (localStorage), structured to plug in Supabase/Firebase later.

---

## ⚠️ Read this first: the localStorage limitation

The prototype stores data in each phone's **localStorage**. That means:

- ✅ Each rep's own tracking works perfectly and persists across days
- ❌ The **leaderboard and manager portal only see data entered on that same device**

For a true live team leaderboard where everyone's numbers sync, you must connect a shared backend. The entire data layer lives in **one file** (`src/lib/storage.js`) with step-by-step Supabase instructions in the comments at the bottom — swap that file and nothing else changes.

---

## Project structure

```
imperial-kpi-tracker/
├── index.html              # App shell, fonts, PWA meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js      # 🎨 Brand colors live here
├── postcss.config.js
├── .gitignore
├── public/
│   ├── manifest.json       # PWA install config
│   ├── sw.js               # Service worker (offline support)
│   ├── icon-192.png        # App icons (replace with real logo icons)
│   └── icon-512.png
└── src/
    ├── main.jsx            # Entry point + service worker registration
    ├── index.css           # Tailwind + global styles
    ├── config.js           # 🔧 Reps, KPI targets, scoring, PIN
    ├── lib/
    │   └── storage.js      # 💾 ALL data persistence (swap for backend here)
    └── components/
        ├── Header.jsx          # Logo placeholder lives here
        ├── HomeScreen.jsx      # Rep dropdown + manager PIN
        ├── RepPortal.jsx       # Rep dashboard
        ├── KPICard.jsx         # +1/−1 cards
        ├── ProgressBubbles.jsx # Filling progress dots
        ├── CelebrationModal.jsx
        ├── DailyStatus.jsx     # "Winning Day Locked In"
        ├── Leaderboard.jsx
        └── ManagerPortal.jsx   # Daily/weekly/history + CSV export
```

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). To test on your phone on the same Wi-Fi: `npm run dev -- --host` and open the network URL it shows.

## Deploy

### Vercel (recommended)
1. Push this repo to GitHub (steps below)
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
3. Vercel auto-detects Vite. Click **Deploy**. Done.
4. Every future `git push` auto-deploys.

### Netlify
1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project**
2. Pick the repo. Build command: `npm run build`. Publish directory: `dist`
3. Deploy. Every push auto-deploys.

### GitHub Pages (also works)
`vite.config.js` uses `base: './'`, so the build runs fine from a subpath. Build with `npm run build` and publish the `dist/` folder (e.g., with the `gh-pages` package or a GitHub Action).

## First push to GitHub

```bash
# 1. Create a new EMPTY repo on github.com (no README, no .gitignore)

# 2. In this project folder:
git init
git add .
git commit -m "Initial version: Imperial KPI tracker v1"

# 3. Connect and push (replace YOUR-USERNAME/YOUR-REPO):
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Future updates are normal version control — no rebuilding:

```bash
git add .
git commit -m "Describe what changed"
git push        # Vercel/Netlify redeploys automatically
```

## How to customize

### Add / remove / rename reps
Edit the `REPS` array in **`src/config.js`**. Each rep needs a unique `id`, a `name`, an `emoji` avatar, and a `color`. Don't reuse an old rep's `id` for a new person — history is stored by id.

### Change KPI targets or scoring
Edit the `KPIS` array in **`src/config.js`** — `target` is the daily goal, `points` is leaderboard scoring, `bubbleValue` is how many units each progress bubble represents.

### Change the manager PIN
`MANAGER_PIN` in **`src/config.js`**. (Note: a client-side PIN keeps reps out of the manager view, but it isn't real security — anyone who reads the source can find it. Fine for internal use; a real backend with auth fixes this properly.)

### Update branding / colors
All brand colors are named in **`tailwind.config.js`** under `colors.imperial`. Change the hex values there and the whole app updates.

### Add your logo
1. Drop `logo.png` into `/public`
2. In `src/components/Header.jsx`, replace the marked placeholder block with `<img src="./logo.png" alt="Imperial Exteriors" className="h-12" />`
3. For the home-screen app icon, replace `public/icon-192.png` and `public/icon-512.png` with your logo at those sizes.

### Export data
Manager Portal (PIN 4449) → **Export CSV** button (top right). Exports the full history: Date, Rep, all four KPI counts, whether they hit a daily target, and total score.

## Installing on rep phones (PWA)

- **iPhone:** open the site in Safari → Share → **Add to Home Screen**
- **Android:** open in Chrome → menu (⋮) → **Add to Home screen** / **Install app**

It opens fullscreen like a native app and works offline after the first load.

## Connecting a real backend later

Everything is in `src/lib/storage.js` — every function is already `async`, so swapping localStorage for Supabase or Firebase requires changing **only that file**. Full Supabase table schema and example queries are in the comments at the bottom of that file. Once connected, the leaderboard polling in `Leaderboard.jsx` can be upgraded to a realtime subscription for instant updates.

## Future upgrades

- **Admin rep editing** — manage reps from the manager portal instead of editing `config.js`
- **GPS check-in** — stamp knocks with location to verify territory coverage
- **Team goals** — weekly team-wide targets with a shared progress bar
- **Weekly awards** — auto-crowned "Rep of the Week" every Monday morning
- **Push notifications** — afternoon nudges ("2 hours of daylight left — 14 doors to target")
- **Streak tracking** — consecutive winning days, with streak flames on the leaderboard
- **Slack / Google Sheets integration** — auto-post the daily board to Slack at 6 PM, or sync rows into the Imperial Sheets operating system
