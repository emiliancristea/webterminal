# WebTerminal Deployment Modes

WebTerminal supports two deployment modes to meet different needs:

## 🌐 Demo Mode (GitHub Pages)

**Perfect for:** Demonstrations, portfolios, static hosting
**Requirements:** None - works entirely in the browser

### Features Available:
- ✅ Complete simulated Linux environment
- ✅ File system navigation (`ls`, `cd`, `pwd`)
- ✅ File viewing (`cat`, `echo`)
- ✅ Directory operations (`mkdir`)
- ✅ Command history and shell features
- ✅ Responsive mobile interface
- ✅ No backend server required

### Demo Commands:
```bash
# Navigation
ls                    # List directory contents
cd projects/my-app    # Change to project directory
pwd                   # Show current directory

# File operations
cat welcome.txt       # Read welcome file
cat demo.js          # View demo JavaScript file
echo "Hello World"   # Display text

# System info
whoami               # Show current user
date                 # Show current date
help                 # Show available commands
```

### Deployment to GitHub Pages:
1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Push to main branch - automatic deployment via GitHub Actions
4. Access at `https://username.github.io/webterminal/`

## 🖥️ Full Backend Mode

**Perfect for:** Development, real Linux environments, production use
**Requirements:** Backend server (Node.js, WebSocket support)

### Features Available:
- ✅ **Real Linux command execution**
- ✅ **Package management** (npm, apt, pip)
- ✅ **File editing** (nano, vim)
- ✅ **Git operations** (clone, commit, push)
- ✅ **Development tools** (Node.js, Python, compilers)
- ✅ **Process management** (background tasks)
- ✅ **Network operations** (curl, wget)
- ✅ **Real file system** (create, edit, delete files)

### Backend Commands:
```bash
# Real development workflow
npm init -y                    # Create package.json
npm install express           # Install packages
node --version               # Check Node.js version
git clone <repository>       # Clone repositories
python3 app.py              # Run Python scripts
nano config.json            # Edit files with nano
curl https://api.github.com  # Network requests
```

### Deployment Options:

#### Replit (Recommended)
1. Import repository to Replit
2. Dependencies install automatically
3. Click "Run" - full backend available instantly
4. Perfect for development and testing

#### Railway/Vercel/Heroku
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with automatic builds
4. Production-ready hosting

#### Self-Hosted
1. Clone repository: `git clone <repo>`
2. Install dependencies: `npm install`
3. Build project: `npm run build`
4. Start server: `npm start`
5. Access at `http://localhost:5000`

## 🔄 Automatic Mode Detection

The application automatically detects which mode to use:

1. **Backend Available**: Uses full Linux environment with real command execution
2. **No Backend**: Falls back to demo mode automatically
3. **Visual Indicator**: Status bar shows "Full Backend" or "Demo Mode"

## 🚀 Quick Start

### For Demo (No Setup Required):
Visit: https://emiliancristea.github.io/webterminal/

### For Full Functionality:
[![Run on Replit](https://replit.com/badge/github/emiliancristea/webterminal)](https://replit.com/@your-username/webterminal)

## 📱 Mobile Support

Both modes include:
- ✅ Touch-optimized interface
- ✅ Virtual keyboard integration
- ✅ Mobile command toolbar
- ✅ Responsive file explorer
- ✅ Gesture navigation

## 🔧 Development

```bash
# Development server (full backend)
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages (demo mode)
git push origin main
```

## 🎯 Use Cases

### Demo Mode Perfect For:
- Portfolio demonstrations
- Educational examples
- Quick command line tutorials
- Static hosting environments
- No-setup required demos

### Full Backend Perfect For:
- Real development workflows
- Learning Linux/command line
- Remote development environments
- CI/CD integrations
- Production applications

---

Choose the mode that best fits your needs! 🚀
