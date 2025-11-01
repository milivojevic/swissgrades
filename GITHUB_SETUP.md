# GitHub Repository Setup Guide

This guide will help you create a GitHub repository and push your local code.

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository settings**:
   - Name: `swissgrades` (or your preferred name)
   - Description: `🇨🇭 Interactive Swiss grading system visualizer on Cloudflare Workers`
   - Visibility: **Public** (recommended for portfolio)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. **Click "Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/swissgrades.git

# OR if you prefer SSH (recommended):
git remote add origin git@github.com:YOUR-USERNAME/swissgrades.git

# Verify remote
git remote -v
```

## Step 3: Push to GitHub

```bash
# Push main branch to GitHub
git push -u origin main
```

If you get authentication errors:
- **HTTPS**: Use Personal Access Token (not password)
- **SSH**: Set up SSH key (see GitHub docs)

## Step 4: Configure Repository Settings (Optional)

### About Section
1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add:
   - Description: `🇨🇭 Interactive Swiss grading system visualizer`
   - Website: `https://swissgrades.cheddar.workers.dev`
   - Topics: `cloudflare-workers`, `education`, `visualization`, `plotly`, `grading-system`, `typescript`

### Pages (Optional - for GitHub Pages)
If you want to also host on GitHub Pages:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, Folder: `/static`

### Repository Settings
Consider enabling:
- **Discussions**: For community Q&A
- **Issues**: Bug reports and feature requests
- **Wiki**: Additional documentation

## Step 5: Add Badges (Optional)

Update README_GITHUB.md with real links:

```markdown
[![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/swissgrades?style=for-the-badge)](https://github.com/YOUR-USERNAME/swissgrades/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YOUR-USERNAME/swissgrades?style=for-the-badge)](https://github.com/YOUR-USERNAME/swissgrades/network)
[![GitHub issues](https://img.shields.io/github/issues/YOUR-USERNAME/swissgrades?style=for-the-badge)](https://github.com/YOUR-USERNAME/swissgrades/issues)
[![GitHub license](https://img.shields.io/github/license/YOUR-USERNAME/swissgrades?style=for-the-badge)](https://github.com/YOUR-USERNAME/swissgrades/blob/main/LICENSE)
```

## Step 6: Rename README_GITHUB.md to README.md

Once pushed to GitHub, you may want to replace README.md with README_GITHUB.md:

```bash
# Backup current README
mv README.md README_QUICKREF.md

# Use GitHub version as main README
mv README_GITHUB.md README.md

# Commit the change
git add README.md README_QUICKREF.md
git commit -m "📝 Use GitHub README as main, keep quick reference"
git push
```

## Quick Commands Reference

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# Push changes
git push origin main

# View remotes
git remote -v
```

## Troubleshooting

### Authentication Failed (HTTPS)
Generate a Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

### SSH Key Not Set Up
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

### Large Files
If you have files >50MB:
```bash
# Use Git LFS
git lfs install
git lfs track "*.large"
git add .gitattributes
```

## Next Steps

After pushing to GitHub:

1. **Share your work**:
   - Add link to portfolio
   - Share on LinkedIn/Twitter
   - Post in relevant communities

2. **Set up CI/CD** (optional):
   - GitHub Actions for automated deployment
   - Automated testing on PR

3. **Monitor usage**:
   - Star notifications
   - Issue tracking
   - Pull request reviews

4. **Keep improving**:
   - Add features from CONTRIBUTING.md wishlist
   - Fix issues as reported
   - Update documentation

## Repository URLs

After setup, your repository will be at:
- **Web**: `https://github.com/YOUR-USERNAME/swissgrades`
- **Clone HTTPS**: `https://github.com/YOUR-USERNAME/swissgrades.git`
- **Clone SSH**: `git@github.com:YOUR-USERNAME/swissgrades.git`

---

**You're all set!** 🎉 Your code is now ready to share with the world.
