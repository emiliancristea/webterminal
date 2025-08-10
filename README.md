# 🖥️ Web Terminal

<div align="center">

**A full-featured Linux terminal environment accessible through your web browser**

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21+-000000?logo=express)](https://expressjs.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-FF6B6B)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

[🚀 **Live Demo**](https://replit.com/@emiliancristea/webterminal) • [📖 **Documentation**](docs/) • [🐛 **Report Bug**](https://github.com/emiliancristea/webterminal/issues)

</div>

---

## ✨ Overview

Experience the power of a **real Linux terminal** in your browser. Web Terminal provides authentic command-line interactions with actual shell command execution, persistent sessions, and a mobile-optimized design that works seamlessly across all devices.

### 🎯 Key Highlights

- **🔄 Real Command Execution** - Execute actual Linux commands, not simulations
- **📱 Mobile-First Design** - Touch-optimized interface with virtual keyboard support  
- **⚡ Real-time Communication** - WebSocket-powered instant terminal responses
- **🔒 Secure Sandbox** - Protected environment with command restrictions
- **💾 Session Persistence** - Maintain state across browser refreshes
- **🎨 Modern UI** - Built with shadcn/ui and Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/emiliancristea/webterminal.git
cd webterminal

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:5173
```

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🏗️ Architecture

### Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>React 18, TypeScript, Vite, TanStack Query, Wouter</td>
</tr>
<tr>
<td><strong>UI/Styling</strong></td>
<td>shadcn/ui, Tailwind CSS, Radix UI, Framer Motion</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Express.js, WebSocket (ws), Node.js Child Process</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>Drizzle ORM, PostgreSQL (optional), Zod validation</td>
</tr>
<tr>
<td><strong>Development</strong></td>
<td>ESBuild, PostCSS, TypeScript</td>
</tr>
</table>

### Project Structure

```
webterminal/
├── 📁 client/              # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   │   ├── 📁 terminal/    # Terminal-specific components
│   │   │   └── 📁 ui/          # shadcn/ui components
│   │   ├── 📁 hooks/       # Custom React hooks
│   │   ├── 📁 lib/         # Utilities and configuration
│   │   ├── 📁 pages/       # Application pages/routes
│   │   └── 📄 main.tsx     # React entry point
│   └── 📄 index.html       # HTML template
├── 📁 server/              # Express.js backend
│   ├── 📄 index.ts         # Server entry point
│   ├── 📄 routes.ts        # API routes & WebSocket handlers
│   ├── 📄 storage.ts       # Data storage abstraction
│   └── 📄 vite.ts          # Development server integration
├── 📁 shared/              # Shared types and schemas
│   └── 📄 schema.ts        # Database schema & TypeScript types
├── 📁 docs/                # Documentation
│   ├── 📄 architecture.md  # System architecture overview
│   ├── 📄 development.md   # Development guide
│   ├── 📄 api.md           # API reference
│   └── 📄 deployment.md    # Deployment instructions
└── 📄 package.json         # Dependencies and scripts
```

---

## 🎮 Features

### 🔧 Core Terminal Functionality
- **Real Linux Command Execution** - Execute actual shell commands with full output
- **Working Directory Management** - Isolated temporary directories for each session
- **Command History** - Complete command history with output preservation
- **Environment Variables** - Persistent environment variable support
- **File Operations** - Create, edit, and manage files within sessions

### 🔐 Security & Sandboxing
- **Secure Command Execution** - Restricted access to dangerous system operations
- **Session Isolation** - Each session operates in its own sandboxed environment
- **Command Filtering** - Protection against destructive commands
- **Resource Limits** - Memory and CPU usage constraints

### 🌐 Modern Web Interface
- **Real-time Communication** - WebSocket-based terminal communication
- **Mobile Optimized** - Touch-friendly interface with virtual keyboard
- **Responsive Design** - Seamless experience from mobile to desktop
- **Professional UI** - Built with modern design principles
- **Theme Support** - Dark/light theme compatibility

### 👨‍💻 Developer Experience
- **TypeScript First** - Full type safety across the entire stack
- **Hot Reload** - Instant development feedback with Vite
- **Component Library** - Extensive UI components with Radix UI
- **Database Ready** - Optional PostgreSQL integration with Drizzle ORM

---

## 📱 Mobile Support

Web Terminal is **fully optimized for mobile devices**:

- 📱 **Touch Interface** - Tap-to-focus input with mobile keyboard support
- ⌨️ **Virtual Toolbar** - Quick access to common keys (Tab, Ctrl, Alt, Arrows)
- 📏 **Responsive Layout** - Adaptive interface that scales beautifully
- 👆 **Gesture Support** - Swipe navigation and touch-friendly controls
- 📺 **Screen Optimization** - Efficient use of limited screen space

---

## 🔌 API Reference

### REST Endpoints

#### Sessions
```http
POST /api/sessions
# Creates a new terminal session
# Returns: { id, currentDirectory, environmentVars, createdAt }

GET /api/sessions/:id
# Retrieves session information
```

#### Commands
```http
POST /api/sessions/:id/commands
# Executes a command in the session
# Body: { command: string }

GET /api/sessions/:id/commands
# Retrieves command history
```

### WebSocket Events

#### Client → Server
```javascript
// Execute command
{ type: 'command', sessionId: 'session-id', command: 'ls -la' }

// Change directory  
{ type: 'cd', sessionId: 'session-id', directory: '/path' }
```

#### Server → Client
```javascript
// Command output
{ type: 'output', sessionId: 'session-id', output: 'result', exitCode: 0 }

// Directory changed
{ type: 'directory', sessionId: 'session-id', currentDirectory: '/new/path' }
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Database (optional - uses in-memory storage by default)
DATABASE_URL=postgresql://user:password@localhost:5432/webterminal

# Development/Production mode
NODE_ENV=development|production

# Server port (defaults to 5000)
PORT=5000

# Replit deployment (if using Replit)
REPL_ID=your-repl-id
```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# TypeScript type checking
npm run check

# Production build
npm run build

# Start production server
npm start

# Database migration (if using PostgreSQL)
npm run db:push
```

---

## 🔒 Security

### Built-in Security Features

- **Command Restrictions** - Dangerous commands are blocked (e.g., `sudo`, `rm -rf /`)
- **Session Isolation** - Operations restricted to session-specific directories
- **Resource Limits** - CPU and memory usage constraints
- **Input Sanitization** - All inputs are validated and sanitized

### Security Best Practices

- Always run in a containerized environment for production
- Configure firewall rules for the server port
- Regular security updates for dependencies
- Monitor command execution logs

---

## 🚀 Deployment

### Replit (Recommended)
```bash
# Import repository to Replit
# Dependencies install automatically
# Run with built-in runner
```

### Docker (Coming Soon)
```bash
# Docker support planned for easy containerized deployment
docker build -t webterminal .
docker run -p 5000:5000 webterminal
```

### Traditional Hosting
```bash
# Build the project
npm run build

# Deploy dist/ directory to your server
# Configure reverse proxy for WebSocket support
# Set up PostgreSQL database (optional)
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Update documentation for new features
- Test on both desktop and mobile

### Commit Message Format
```
feat: add new terminal command
fix: resolve WebSocket connection issue
docs: update API documentation
refactor: improve component structure
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) - For the amazing React framework
- [Vite Team](https://vitejs.dev/) - For the lightning-fast build tool
- [shadcn](https://ui.shadcn.com/) - For the beautiful UI component library
- [Tailwind Labs](https://tailwindcss.com/) - For the utility-first CSS framework
- [Drizzle Team](https://orm.drizzle.team/) - For the type-safe ORM

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[🐛 Report Bug](https://github.com/emiliancristea/webterminal/issues) • [✨ Request Feature](https://github.com/emiliancristea/webterminal/issues) • [💬 Discussions](https://github.com/emiliancristea/webterminal/discussions)

**Made with ❤️ for developers who love the terminal**

</div>