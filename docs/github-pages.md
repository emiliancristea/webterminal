# GitHub Pages Deployment

This repository is fully compatible with GitHub Pages and provides a comprehensive demo experience when deployed as a static site.

## Live Demo

🌐 **[View Live Demo](https://emiliancristea.github.io/webterminal/)**

## Features on GitHub Pages

### ✅ What Works
- **Interactive Terminal Interface**: Full UI with demo commands
- **Responsive Design**: Mobile and desktop optimized
- **Demo Commands**: Realistic terminal responses for common commands
- **Command History**: Navigate through previous commands
- **Professional UI**: Complete terminal styling and animations
- **Help System**: Built-in help for available demo commands

### 📋 Demo Commands Available
- `echo <text>` - Echo text back
- `ls`, `ls -la` - List directory contents (demo)
- `pwd` - Show current directory
- `whoami` - Show current user
- `date` - Show current date/time
- `mkdir <name>` - Create directory (demo)
- `touch <name>` - Create file (demo)
- `clear` - Clear terminal
- `help` - Show available commands

### ⚠️ Limitations on GitHub Pages
- **No Real Command Execution**: Commands are simulated, not executed
- **No File System Access**: File operations are demonstration only
- **No Persistent Sessions**: State resets on page refresh
- **No Backend Features**: WebSocket and API functionality disabled

## Deployment

### Automatic Deployment
This repository is configured for automatic GitHub Pages deployment:

1. **Enable GitHub Pages**: Repository Settings → Pages → Source: GitHub Actions
2. **Automatic Triggers**: Push to `main` branch triggers deployment
3. **Manual Deployment**: Use "Deploy to GitHub Pages" workflow in Actions tab
4. **Live URL**: Available at `https://emiliancristea.github.io/webterminal/`

### Manual Deployment
```bash
# Build for GitHub Pages
GITHUB_PAGES=true npm run build

# Deploy the dist/public directory to your static hosting
```

## Full Functionality

For complete terminal functionality with real command execution:

### Option 1: Replit (Recommended)
1. Import repository to Replit
2. Dependencies install automatically
3. Full backend functionality included

### Option 2: Self-Hosted
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the full stack: `npm run dev`
4. Access at `http://localhost:5173`

### Option 3: Docker (Coming Soon)
Docker containerization is planned for easy deployment.

## Technical Implementation

### Environment Detection
The application automatically detects the hosting environment:
- GitHub Pages or static hosting triggers demo mode
- Backend availability is checked dynamically
- Seamless fallback to demo when backend unavailable

### Demo Mode Features
- Realistic command responses
- Simulated execution delays
- Command history preservation
- Professional help system
- Clear limitations messaging

## Development

See the main [README.md](../README.md) for full development instructions.

---

**Note**: The GitHub Pages demo showcases the UI and basic functionality. For a full Linux terminal experience, deploy with the backend server included.
