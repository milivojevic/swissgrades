# Contributing to Swiss Grading Visualizer

First off, thank you for considering contributing to the Swiss Grading Visualizer! 🎓

This project was built through human-AI collaboration with GitHub Copilot, and we welcome contributions from developers of all skill levels.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by basic principles of respect and collaboration:

- Be welcoming and inclusive
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Cloudflare Account**: Free tier for testing deployments

### Setting Up Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/swissgrades.git
   cd swissgrades
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start local development server**:
   ```bash
   npm run start
   ```

5. **Open in browser**: http://localhost:8787

### Project Structure

```
swissgrades/
├── src/
│   └── index.ts              # Worker entry point
├── static/
│   ├── index.html            # UI structure
│   ├── styles.css            # Responsive styling
│   ├── grading.js            # Core calculations
│   ├── main.js               # UI orchestration
│   └── favicon.svg           # Icon
├── DOCUMENTATION.md          # Comprehensive guide
├── DEVLOG.md                 # Development history
├── README.md                 # Quick reference
└── wrangler.toml             # Cloudflare config
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

**Branch naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `style/` - Formatting, cosmetic changes

### 2. Make Your Changes

- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation if needed
- Test locally before committing

### 3. Test Locally

```bash
# Start dev server
npm run start

# Test in browser at http://localhost:8787

# Try different scenarios:
# - Mobile viewport (responsive design)
# - Various MP/PPP combinations
# - Edge cases (MP=1, MP=100, etc.)
# - Keyboard navigation
# - Touch/swipe gestures
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git commit -m "✨ Add dark mode toggle

- Implement CSS custom properties for theming
- Add toggle button in header
- Persist preference in cookie
- Update documentation"
```

**Commit message format**:
```
<emoji> <type>: <subject>

<body (optional)>

<footer (optional)>
```

**Emoji guide**:
- ✨ `:sparkles:` - New feature
- 🐛 `:bug:` - Bug fix
- 📝 `:memo:` - Documentation
- 🎨 `:art:` - UI/styling
- ♻️ `:recycle:` - Refactoring
- ⚡ `:zap:` - Performance
- 🔧 `:wrench:` - Configuration
- ✅ `:white_check_mark:` - Tests

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template
- Submit for review

## Coding Standards

### JavaScript Style

```javascript
// ✅ Good: Clear function names, JSDoc comments
/**
 * Calculate grade from points using linear interpolation
 * @param {number} points - Points scored
 * @param {number} ppp - Minimum passing points
 * @param {number} mp - Maximum points
 * @returns {number} Calculated grade (1.0 to 6.0)
 */
function calculateGrade(points, ppp, mp) {
  if (points < ppp) {
    return linearInterpolate(points, 0, 1.0, ppp, 4.0);
  }
  return linearInterpolate(points, ppp, 4.0, mp, 6.0);
}

// ❌ Avoid: Unclear names, no documentation
function calc(p, x, y) {
  if (p < x) return lerp(p, 0, 1, x, 4);
  return lerp(p, x, 4, y, 6);
}
```

### CSS Style

```css
/* ✅ Good: Mobile-first, clear selectors */
.chart-container {
  width: 100%;
  min-height: 400px;
}

@media (min-width: 768px) {
  .chart-container {
    min-height: 600px;
  }
}

/* ❌ Avoid: Desktop-first, overly specific */
body div.container div.wrapper div.chart {
  width: 100%;
}
```

### General Principles

1. **DRY (Don't Repeat Yourself)**
   - Extract common logic into functions
   - Use single source of truth pattern

2. **KISS (Keep It Simple, Stupid)**
   - Prefer clarity over cleverness
   - Simple solutions are easier to maintain

3. **Separation of Concerns**
   - `grading.js`: Pure calculation logic
   - `main.js`: UI orchestration
   - `styles.css`: Presentation only

4. **Progressive Enhancement**
   - Core functionality works without JS
   - Enhanced experience with JS enabled

## Testing

### Manual Testing Checklist

Before submitting a PR, test these scenarios:

#### Desktop (1920x1080)
- [ ] Both models visible side-by-side
- [ ] Charts render correctly
- [ ] Hover tooltips show grade bands
- [ ] Color coding correct (red <4, green ≥4)
- [ ] Navigation buttons work
- [ ] Keyboard arrows switch pages

#### Mobile (375x667)
- [ ] Single model per page
- [ ] Full-screen charts
- [ ] Detail tables hidden
- [ ] Swipe gestures work
- [ ] Touch interactions responsive
- [ ] Navigation dots indicate position

#### Edge Cases
- [ ] MP = 1 (minimum)
- [ ] MP = 100 (large scale)
- [ ] PPP = MP (no passing grades)
- [ ] PPP = 0 (all passing)
- [ ] Granularity = 0.25 (fine grades)
- [ ] Granularity = 1.0 (whole grades)

#### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### Future: Automated Testing

We welcome contributions to add:
- Unit tests for `grading.js` calculations
- E2E tests with Playwright/Cypress
- Visual regression tests

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change user-facing behavior
- Modify configuration options
- Fix bugs that affect usage
- Improve performance significantly

### Documentation Files

- **README.md**: Quick start and overview
- **DOCUMENTATION.md**: Comprehensive guide
- **DEVLOG.md**: Development history
- **Inline comments**: Complex logic explanation

### Documentation Style

```javascript
// ✅ Good: Explains WHY and HOW
/**
 * Round grade down to lower half-grade boundary (Abrunden model).
 * This conservative approach ensures students must clearly demonstrate
 * competency to achieve higher grades.
 * 
 * Example: 4.7 → 4.5, 5.3 → 5.0
 */

// ❌ Avoid: States the obvious
/**
 * Rounds down
 */
```

## Submitting Changes

### Pull Request Guidelines

1. **Title**: Clear and descriptive
   - ✅ "Add CSV export functionality"
   - ❌ "Update stuff"

2. **Description**: Explain what and why
   ```markdown
   ## What
   Adds ability to export grade tables as CSV files
   
   ## Why
   Teachers requested ability to import data into spreadsheets
   
   ## How
   - Added export button to each model
   - Implemented CSV generation with proper escaping
   - Includes headers and all grade band data
   
   ## Testing
   - Tested with Excel and Google Sheets
   - Handles special characters correctly
   - Works on mobile and desktop
   ```

3. **Screenshots**: For visual changes
   - Before/after comparisons
   - Mobile and desktop views
   - Different browser rendering

4. **Breaking Changes**: Clearly marked
   ```markdown
   ⚠️ **BREAKING CHANGE**: Cookie format updated
   Users will need to re-enter preferences after this update.
   ```

### Review Process

1. Maintainer reviews code and tests locally
2. Feedback provided via PR comments
3. Make requested changes
4. Push updates (adds to same PR)
5. Approved PRs merged to `main`
6. Automatic deployment to production

## Reporting Bugs

### Before Submitting

1. Check existing issues for duplicates
2. Test in latest browser version
3. Clear cache and cookies
4. Try in incognito/private mode

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what's wrong

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 11, macOS 14]
- Browser: [e.g. Chrome 120, Firefox 121]
- Device: [e.g. Desktop, iPhone 14]
- Screen size: [e.g. 1920x1080]

**Additional context**
Any other relevant information
```

## Suggesting Enhancements

### Enhancement Request Template

```markdown
**Feature Description**
Clear explanation of the feature

**Use Case**
Why is this needed? Who benefits?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you thought about

**Additional Context**
Mockups, examples, references
```

### Enhancement Ideas

Current wishlist (feel free to tackle!):

- **CSV Export**: Download grade tables
- **Dark Mode**: Alternative color scheme
- **Custom Models**: User-defined grading curves
- **Print View**: PDF-friendly layout
- **URL Sharing**: Share specific configurations
- **Grade Distribution**: Histogram visualization
- **Internationalization**: Multi-language support
- **PWA Support**: Offline functionality

## Questions?

- **Documentation**: See [DOCUMENTATION.md](DOCUMENTATION.md)
- **Development Log**: See [DEVLOG.md](DEVLOG.md)
- **Issues**: Open a GitHub issue
- **Live Demo**: https://swissgrades.cheddar.workers.dev

## Recognition

Contributors will be acknowledged in:
- GitHub contributors list
- Project documentation
- Release notes

Thank you for helping make Swiss Grading Visualizer better! 🎓✨

---

*This contributing guide inspired by open source best practices and adapted for this project's collaborative nature.*
