# 🧊 Fridge to Recipe — AI Recipe Generator

Turn your fridge ingredients into delicious recipes with AI. Type in what you have, get a structured interactive recipe back.

## Features

- **AI-Powered Recipes** — Enter ingredients, get a complete recipe from Gemini AI
- **Checkable Steps** — Track your cooking progress step by step
- **Scalable Servings** — Adjust servings, ingredient quantities scale proportionally
- **Ingredient Swaps** — Toggle between original and alternative ingredients
- **Error Handling** — Graceful handling of malformed AI responses, network errors, empty results
- **Mobile Responsive** — Works beautifully on all screen sizes
- **Dark Mode** — Modern dark UI with gradient accents

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite |
| Backend | Node.js, Express |
| AI | Google Gemini 2.0 Flash |

## Setup

### 1. Clone and install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure API key

```bash
cd backend
cp .env.example .env
# Edit .env and add your Gemini API key
```

Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Run

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open http://localhost:5173

## Project Structure

```
frontend/
  src/
    components/
      PromptInput.jsx     — Free-form ingredient input
      RecipeView.jsx      — Interactive recipe display
      ErrorState.jsx      — Error + retry UI
      LoadingState.jsx    — Animated loading state
    lib/
      api.js              — Backend API client
      validateResult.js   — JSON shape validation
    App.jsx               — Root component with state machine
    App.css               — All styles

backend/
  server.js               — Express server + Gemini API proxy
  .env.example            — Environment variable template
```

## Error Handling

All failure modes are handled explicitly:

| Failure | Handling |
|---------|----------|
| Malformed JSON | Caught at backend parse, returns 502 with message |
| Wrong shape | Validated at both backend and frontend, error state shown |
| Empty response | Treated as failure, not as empty-but-valid |
| Slow response | Loading state shown, no silent hangs |
| Failed request | Error state with retry button |
| Stale response | requestId ref guard prevents old responses overwriting new ones |

## AI Usage Note

This project uses Google Gemini AI to generate recipes from ingredients. The AI is prompted to return strict JSON which is validated before rendering.

## Known Limitations

- Recipes depend on AI quality — results may vary
- No persistent storage (recipes are lost on refresh)
- Single recipe at a time

## Time Spent

~4 hours
