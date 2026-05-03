# 🚀 Cosmic Command

> A space-themed focus and productivity app built with React. Complete missions, unlock your space station, and conquer deep space — one focused session at a time.

---

## What is Cosmic Command?

Cosmic Command turns your focus sessions into a space exploration adventure. Instead of staring at a plain countdown timer, you're launching missions, building a space station, and watching your progress accumulate across every session. Two modes keep it flexible — lock in for a timed mission or explore freely with an open-ended stopwatch.

---

## Features

### 🎯 Two Focus Modes
- **Mission Mode** — Countdown timer with presets (15 / 25 / 50 min) or a custom duration. The ring fills as you focus. Complete the timer to trigger the Mission Complete animation.
- **Free Explore Mode** — A stopwatch that counts upward. Stop whenever you're done. Session is saved automatically.

### 🛰 Space Station Tools (Gamification)
Your cumulative focus time unlocks five station modules. Progress **carries over across all sessions** — you never lose your place.

| Module | Unlock at | Color |
|---|---|---|
| ◈ Solar Panels | 10 minutes | Gold |
| ⬡ Biodome | 30 minutes | Green |
| ✦ Satellite | 1 hour | Cyan |
| ⊛ Comm Array | 2 hours | Purple |
| ⊕ Warp Core | 5 hours | Red |

Each unlock triggers a unique animated popup (solar beam, growing dome, orbiting satellite, radio waves, spinning warp rings).

### 🎬 Animations & Modals
- **Mission Complete** — Rocket launches, spark particles burst, expanding rings, and a checkmark draws itself in
- **Mission Crashed** — Explosion rings and radiating shockwaves when you abort early
- **Module Unlocked** — Custom SVG animation per module
- **Station Complete** — Confetti, rainbow headline, and a trophy when all 5 modules are online

### 📋 Session History
- Logs up to 20 recent sessions in `localStorage`
- Shows focus time, category tag, date, and completion status (✅ complete / 💥 aborted / 🌌 free)

### 🏷 Focus Categories
Pick your category **before** launching. It locks during the session so your log stays accurate.
`Coding` · `Studying` · `Designing` · `Writing` · `Research` · `Other`

### ⏱ Accurate Timer
Uses the **timestamp offset method** (`Date.now()` + `requestAnimationFrame`) instead of `setInterval` — stays accurate even when the browser tab is backgrounded or the device sleeps.

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 (hooks only) |
| Styling | Inline CSS-in-JS (no Tailwind dependency) |
| Fonts | Orbitron + Exo 2 via Google Fonts |
| Storage | `localStorage` (no backend required) |
| Timer | `requestAnimationFrame` + timestamp offset |
| Bundler | Works with Vite, Create React App, or any standard React setup |

---

## Getting Started

### Prerequisites
- Node.js 16+
- A React project (Vite recommended)

### Installation

```bash
# 1. Copy CosmicCommand.jsx into your project
cp CosmicCommand.jsx src/

# 2. Import it in your entry point
# src/App.jsx or src/main.jsx
import CosmicCommand from "./CosmicCommand";

export default function App() {
  return <CosmicCommand />;
}

# 3. Run your dev server
npm run dev
```

No additional packages needed — the component is fully self-contained.

---

## Project Structure

```
CosmicCommand.jsx
│
├── CSS string (injected via <style> tag)
├── Starfield          — animated background stars
├── Ring               — SVG circular progress ring
│
├── Unlock SVG animations
│   ├── SolarSVG       — beam hitting solar panels
│   ├── BioSVG         — dome growing with trees
│   ├── SatSVG         — satellite orbiting a planet
│   ├── CommsSVG       — dish with expanding radio waves
│   └── WarpSVG        — spinning ellipse rings + core
│
├── SuccessModal       — mission complete celebration
├── CrashModal         — abort / mission failed
├── UnlockModal        — per-module unlock animation
├── AllDoneModal       — all 5 modules unlocked
│
└── CosmicCommand      — main app (state, timer, UI)
```

---

## localStorage Keys

| Key | Value |
|---|---|
| `cc_tot` | Total cumulative focus seconds (integer) |
| `cc_hist` | JSON array of last 20 session objects |

Clearing `localStorage` resets all progress.

---

## Roadmap / Ideas

- [ ] Sound effects on mission complete / module unlock
- [ ] Daily / weekly focus streaks
- [ ] Export session history as CSV
- [ ] Background ambient space music toggle
- [ ] Mobile PWA with offline support

---

## License

MIT — free to use, modify, and build on.

---

*Built with React. Fuelled by focus. Powered by the cosmos.*
