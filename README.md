# Token Engine

A powerful design system extractor and token scraper built with React, Vite, and Puppeteer.

## 🚀 Features

- **Design System Extraction**: Scrape design tokens (colors, typography, spacing, etc.) from any website.
- **Visual Analysis**: Dashboard to visualize design drift and inconsistencies.
- **Code Export**: Export extracted tokens to various formats (JSON, CSS variables, etc.).
- **Real-time Preview**: Analyze live websites with a built-in scraper service.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React, Tailwind CSS
- **Backend**: Express, Puppeteer (Stealth mode), Cheerio
- **Typescript**: Fully typed for better developer experience

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manojcx-max/Token-engine.git
   cd Token-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   Copy `.env.example` to `.env` and fill in your settings.

## 🏃‍♂️ Running Locally

To start both the frontend and the extractor service:

```bash
npm run start
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 📄 License

MIT
