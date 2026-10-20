# Lantern 🏮

A lightweight, self-hosted system monitor for developers running homelab infrastructure. Monitor CPU, memory, and processes across multiple machines from a single desktop dashboard.

---

## What it does

Lantern gives you a single desktop dashboard showing live CPU usage, memory usage, and top processes for every machine in your homelab. No cloud, no telemetry, no subscriptions — just a small agent running on each machine and a desktop app to watch them all.

---

## Architecture

```
Electron (desktop app)
  └── React dashboard
  └── IPC bridge
        └── HTTP polling → FastAPI agent (runs on each machine)
                                └── reads /proc directly
```

- **`app/`** — Electron + React desktop application (Windows, macOS, Linux)
- **`agent/`** — Lightweight FastAPI agent, runs on each monitored machine
- **`docs/`** — Architecture decisions and setup notes

---

## Requirements

**Desktop app**
- Node.js 18+
- npm

**Agent** (each monitored machine)
- Python 3.10+
- Linux (reads from `/proc`)

---

## Getting started

### 1. Run the agent on a machine you want to monitor

```bash
cd agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

The agent starts on `http://0.0.0.0:8000` by default.

### 2. Run the desktop app

```bash
cd app
npm install
npm run dev
```

---

## Building

```bash
cd app
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Desktop app | Electron, React, TypeScript |
| Styling | Tailwind CSS |
| Bundler | electron-vite |
| Agent | Python, FastAPI, uvicorn |
| Metrics | `/proc` (no external dependencies) |

---

## Status

Early development. Single-machine support working. Multi-machine support and packaging coming soon.

---

## License

MIT