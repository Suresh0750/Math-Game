# Math Tables Practice

A focused web app to memorize **multiplication tables**, **squares**, and **cubes** for aptitude test preparation (e.g. Zoho interviews).

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Local Storage** — no backend required.

## Features

- **Multiplication Tables** — Pick any table (2–12 or custom) and range (1–10, 1–20, 1–30, custom)
- **Squares & Cubes** — Configurable ranges with preset and custom options
- **Sequential or Random** question order
- **Learn while practicing** — Wrong answers show the correct answer immediately
- **Live score** — Correct, wrong, remaining, and accuracy
- **Optional timer** — No timer, 5s, 10s, or custom per question
- **Review wrong answers** — Re-practice only missed questions
- **Statistics dashboard** — Track progress, best accuracy, weakest table
- **Auto-save** — Preferences and stats persist in Local Storage
- **Keyboard-friendly** — Enter to submit/continue, arrow keys to navigate

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install & Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. Choose a practice type on the home screen
2. Configure table/range, order, and timer
3. Answer questions one at a time
4. Review wrong answers after finishing
5. Check the Statistics dashboard for progress

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Local Storage

## Future Ideas

- Mixed tables (2–12 together)
- Daily challenge & streak counter
- Dark mode & sound effects
- PWA for offline use
