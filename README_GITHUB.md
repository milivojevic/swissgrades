# 🇨🇭 Swiss Grading Visualizer

> Interactive visualization tool for Swiss grading system calculations deployed on Cloudflare Workers

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://swissgrades.cheddar.workers.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🎯 What It Does

An educational tool that visualizes how different Swiss grading models calculate final grades from raw points. Compare two models side-by-side:

- **Inclusive Model**: Traditional rounding to nearest half-grade
- **Abrunden Model**: Conservative rounding down (floor)

Perfect for teachers, students, and education administrators who need to understand or demonstrate grading calculations.

## ✨ Features

- 📊 **Interactive Charts**: Hover over data points to see grade bands
- 📱 **Fully Responsive**: Desktop side-by-side, mobile full-screen pagination
- 🎨 **Color-Coded**: Red for failing (<4), yellow-green for passing (≥4)
- 💾 **Persistent Settings**: Your preferences saved locally
- ⌨️ **Keyboard Navigation**: Arrow keys for quick comparison
- 📥 **Export Charts**: Download as PNG images
- 🌐 **Global CDN**: Fast loading worldwide via Cloudflare edge network

## 🚀 Quick Start

### Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Visit http://localhost:8787
```

### Deploy to Cloudflare Workers

```bash
# Authenticate (first time only)
npx wrangler login

# Deploy to production
npm run deploy
```

## 📖 Documentation

- **[Quick Reference](README.md)** - You are here!
- **[Complete Guide](DOCUMENTATION.md)** - 500+ line beginner-friendly guide
- **[Development Log](DEVLOG.md)** - Full development journey with technical decisions
- **[Grading Models](GRADING_MODELS.md)** - Swiss grading system explanation

## 🏗️ Architecture

```
swissgrades/
├── src/
│   └── index.ts              # Cloudflare Worker entry point
├── static/
│   ├── index.html            # Application structure
│   ├── styles.css            # Responsive design
│   ├── grading.js            # Grade calculation logic
│   ├── main.js               # UI orchestration
│   └── favicon.svg           # Swiss flag icon
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Cloudflare Workers** | Edge deployment, global CDN |
| **Plotly.js** | Interactive data visualization |
| **Vanilla JavaScript** | Client-side calculations |
| **TypeScript** | Development-time type safety |
| **CSS Grid** | Responsive layout |
| **ES6 Modules** | Code organization |

## 📐 Grading Models

### Inclusive Model (Traditional)
```javascript
// Linear interpolation between PPP→4.0 and MP→6.0
// Round to nearest half-grade (0.5, 1.0, 1.5, etc.)
roundingMode: "nearest"
```

### Abrunden Model (Conservative)
```javascript
// Same interpolation
// Round DOWN to lower half-grade (floor)
roundingMode: "floor"
```

Both models use the same linear interpolation formula but differ in final rounding behavior. See [GRADING_MODELS.md](GRADING_MODELS.md) for detailed explanation.

## 🎓 Use Cases

- **Teachers**: Understand how grading policies affect student outcomes
- **Students**: Visualize what points are needed for target grades
- **Administrators**: Compare fairness of different grading approaches
- **Education Research**: Analyze grading system properties

## 🧪 Example Scenarios

Try these configurations to explore the models:

1. **Standard Test**
   - MP: 23 points, PPP: 13 points, Granularity: 0.5

2. **Strict Grading**
   - MP: 100 points, PPP: 60 points, Granularity: 0.5

3. **Fine Gradations**
   - MP: 20 points, PPP: 12 points, Granularity: 0.25

## 🌍 Live Demo

**Production URL**: https://swissgrades.cheddar.workers.dev

Hosted on Cloudflare's global edge network with automatic HTTPS and caching.

## 🤝 Contributing

This project was developed through human-AI collaboration with GitHub Copilot. Contributions welcome!

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with clear commits
4. Test locally: `npm run start`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- ES6+ JavaScript with modern syntax
- Clear function names and comments
- Single responsibility principle
- Responsive design first

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **Swiss Education System**: For the grading model specifications
- **Plotly.js**: For excellent visualization capabilities
- **Cloudflare Workers**: For edge computing infrastructure
- **GitHub Copilot**: For AI-assisted development

## 📧 Contact

Questions or feedback? Open an issue on GitHub or visit the [live demo](https://swissgrades.cheddar.workers.dev).

---

**Built with** ❤️ **and** 🤖 **through human-AI collaboration**

*Last updated: November 1, 2025*
