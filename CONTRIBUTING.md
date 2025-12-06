# Contributing to Let's Collab 🤝

Thank you for your interest in contributing! We welcome contributions from developers of all skill levels.

---

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. No harassment, trolling, or offensive behavior will be tolerated.

## How to Contribute

### 🐛 Report Bugs
[Create an issue](https://github.com/IronwallxR5/Let-s_Collab/issues) with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)

### ✨ Suggest Features
[Open an issue](https://github.com/IronwallxR5/Let-s_Collab/issues) describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives considered

### 💻 Submit Code
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Let-s_Collab.git
cd Let-s_Collab

# Add upstream remote
git remote add upstream https://github.com/IronwallxR5/Let-s_Collab.git

# Set up environment (see SETUP.md)
cd backend && npm install
cd ../frontend && npm install

# Create feature branch
git checkout -b feature/your-feature-name
```

## Code Style

- Use **const/let** instead of var
- Use **arrow functions** for consistency
- Follow **ES6+ syntax**
- Use **meaningful variable names**
- Add **comments for complex logic only**
- Run `npm run lint` before committing

### File Naming
- Components: `PascalCase.jsx` (e.g., `UserProfile.jsx`)
- Utilities: `camelCase.js` (e.g., `formatDate.js`)
- CSS: `kebab-case.css` (e.g., `user-profile.css`)

## Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-pdf-export` |
| Bug Fix | `fix/description` | `fix/socket-error` |
| Docs | `docs/description` | `docs/update-readme` |
| Refactor | `refactor/description` | `refactor/auth-service` |
| Performance | `perf/description` | `perf/optimize-rendering` |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

Examples:
feat: add PDF export functionality
fix: resolve CORS error
docs: update setup guide
refactor: simplify auth logic
perf: optimize canvas rendering
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

## Pull Request Process

1. **Before submitting:**
   - Ensure code follows style guidelines
   - Test your changes locally
   - Update documentation if needed
   - Rebase on latest `main` branch

2. **PR Title:** `<type>: <clear description>`
   - Example: `feat: add PDF export`

3. **PR Description should include:**
   - What changed and why
   - Related issue numbers (e.g., "Closes #123")
   - How to test the changes
   - Screenshots for UI changes

4. **After submission:**
   - Address review feedback promptly
   - Keep PR updated with main branch
   - Once approved, a maintainer will merge

## Questions?

- Check [existing documentation](README.md)
- Search [closed issues](https://github.com/IronwallxR5/Let-s_Collab/issues?q=is%3Aissue+is%3Aclosed)
- Ask in [GitHub Discussions](https://github.com/IronwallxR5/Let-s_Collab/discussions)

---

**Thank you for contributing to Let's Collab!** 🎉
