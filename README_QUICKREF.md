# Swiss Primary School Grading System Visualizer

Interactive web application for visualizing different grading models used in Swiss primary schools.

🌐 **Live**: https://swissgrades.cheddar.workers.dev

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run start
# Opens at http://localhost:8787

# Deploy to Cloudflare
npm run deploy
```

## What It Does

Compares two grading approaches:
1. **Inclusive** - Standard rounding (4.25 → 4.5)
2. **Exclusive (Abrunden)** - Always rounds down (4.25 → 4.0)

Shows:
- Interactive color-coded charts
- Grade band analysis  
- Fairness metrics
- Point-to-grade conversion tables

## Project Structure

```
├── package.json          # Dependencies
├── wrangler.toml         # Cloudflare config
├── src/index.ts          # Worker entry
└── static/               # Frontend
    ├── index.html        # Structure
    ├── styles.css        # Styling
    ├── main.js           # UI logic
    └── grading.js        # Calculations
```

## Documentation

See **[DOCUMENTATION.md](./DOCUMENTATION.md)** for comprehensive guide covering:
- Complete file-by-file breakdown
- Technology stack explanations  
- Development setup for beginners
- Deployment instructions
- How to learn more

## Features

✅ Responsive design (desktop/mobile)  
✅ Interactive hover tooltips  
✅ Persistent settings (cookies)  
✅ Keyboard + swipe navigation  
✅ Real-time updates with debouncing  
✅ Downloadable charts (PNG)  

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Plotly.js 2.35.2
- **Backend**: Cloudflare Workers (Serverless)
- **Tools**: Node.js, npm, Wrangler

## Development

Built with human expertise + GitHub Copilot AI assistance.

### Local Development

Changes auto-reload when you edit files in `static/`.

### Adding Comments

See code files for extensive inline documentation explaining:
- What each function does
- Why design decisions were made
- How calculations work
- Examples of expected behavior

## License

Educational use. Built to help Swiss educators understand grading system impacts.

---

*For complete beginner-friendly guide: [DOCUMENTATION.md](./DOCUMENTATION.md)*
