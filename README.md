# Web Terminal

A full-featured Linux terminal environment accessible through your web browser. Experience authentic command-line interactions with real Linux command execution, persistent sessions, and mobile-optimized design.

![Web Terminal](https://img.shields.io/badge/Terminal-Web%20Based-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue)
![Express](https://img.shields.io/badge/Express-4.21+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![CI/CD](https://github.com/emiliancristea/webterminal/actions/workflows/ci.yml/badge.svg)

## 🚀 Features

### Core Terminal Functionality

- **Real Linux Command Execution**: Execute actual shell commands, not simulations
- **Persistent Sessions**: Maintain terminal state across browser refreshes and reconnections
- **Working Directory Management**: Isolated temporary directories for each session
- **Command History**: Full command history with output preservation
- **Environment Variables**: Persistent environment variable support

### Security & Sandboxing

- **Secure Command Execution**: Restricted access to dangerous system operations
- **Session Isolation**: Each session operates in its own sandboxed environment
- **Safe Defaults**: Protection against destructive commands like `rm -rf /`

### Modern Web Interface

- **Real-time Communication**: WebSocket-based bidirectional terminal communication
- **Mobile Optimized**: Touch-friendly interface with virtual keyboard support
- **Responsive Design**: Seamless experience from mobile to desktop
- **Professional UI**: Built with shadcn/ui components and Tailwind CSS
- **Dark/Light Theme**: Adaptive theming support

### Developer Experience

- **TypeScript First**: Full type safety across client and server
- **Modern Stack**: React 18, Vite, Express.js, WebSockets
- **Database Ready**: Drizzle ORM with PostgreSQL schema design
- **Component Library**: Extensive UI components with Radix UI primitives

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast development server and optimized builds
- **TanStack React Query** - Server state management and caching
- **Wouter** - Lightweight client-side routing
- **shadcn/ui** - High-quality component library
- **Tailwind CSS** - Utility-first styling framework
- **Framer Motion** - Smooth animations and transitions

### Backend

- **Express.js** - Web application framework
- **WebSocket (ws)** - Real-time bidirectional communication
- **Node.js Child Process** - Secure command execution
- **Session Management** - Persistent terminal sessions
- **TypeScript** - Type-safe server development

### Database & ORM

- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Production-ready database (optional)
- **Zod** - Schema validation and type inference

### Development Tools

- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing with Autoprefixer
- **TypeScript Compiler** - Static type checking

## 📦 Installation

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **PostgreSQL** (optional, for persistent data)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/emiliancristea/webterminal.git
   cd webterminal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup** (optional)

   ```bash
   # For database features (optional)
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🚦 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# TypeScript type checking
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database migration (if using PostgreSQL)
npm run db:push
```

### Project Structure

```
webterminal/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── terminal/   # Terminal-specific components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and config
│   │   ├── pages/          # Application pages/routes
│   │   └── index.css       # Global styles
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket handling
│   ├── storage.ts         # Data storage abstraction
│   └── vite.ts            # Vite integration for development
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── drizzle.config.ts      # Database configuration
```

### Key Components

#### Terminal Components

- **TerminalOutput**: Renders command output and history
- **TerminalInput**: Handles command input and execution
- **FileExplorer**: Browse and manage files
- **MobileToolbar**: Mobile-specific terminal controls
- **CommandBar**: Quick access to common commands

#### Custom Hooks

- **useTerminal**: Core terminal state and command execution
- **useWebSocket**: WebSocket connection management
- **useMobile**: Mobile device detection and optimization
- **useToast**: Notification system integration

## 🔧 Configuration

### Environment Variables

```bash
# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/webterminal

# Development
NODE_ENV=development|production

# Replit Integration (if deploying on Replit)
REPL_ID=your-repl-id
```

### Customization

#### Styling

- Edit `tailwind.config.ts` for theme customization
- Modify `client/src/index.css` for global styles
- Components use CSS variables for easy theming

#### Terminal Behavior

- Configure command restrictions in `server/routes.ts`
- Modify session settings in `server/storage.ts`
- Adjust WebSocket settings for different environments

## 🌐 API Reference

### REST Endpoints

#### Sessions

```http
POST /api/sessions
# Creates a new terminal session
# Returns: { id, currentDirectory, environmentVars, createdAt }

GET /api/sessions/:id
# Retrieves session information
# Returns: Session object
```

#### Commands

```http
POST /api/sessions/:id/commands
# Executes a command in the session
# Body: { command: string }
# Returns: { output, exitCode, timestamp }

GET /api/sessions/:id/commands
# Retrieves command history
# Returns: Array of command objects
```

### WebSocket Events

#### Client → Server

```javascript
// Execute command
{
  type: 'command',
  sessionId: 'session-id',
  command: 'ls -la'
}

// Change directory
{
  type: 'cd',
  sessionId: 'session-id',
  directory: '/home/user'
}
```

#### Server → Client

```javascript
// Command output
{
  type: 'output',
  sessionId: 'session-id',
  output: 'command output text',
  exitCode: 0
}

// Directory changed
{
  type: 'directory',
  sessionId: 'session-id',
  currentDirectory: '/new/path'
}
```

## 📱 Mobile Support

The Web Terminal is fully optimized for mobile devices:

- **Touch Interface**: Tap-to-focus input with mobile keyboard support
- **Virtual Toolbar**: Quick access to common keys (Tab, Ctrl, Alt, Arrows)
- **Responsive Layout**: Adaptive interface that scales beautifully
- **Gesture Support**: Swipe navigation and touch-friendly controls
- **Screen Optimization**: Efficient use of limited screen space

## 🔒 Security

### Command Restrictions

- Dangerous commands are blocked (e.g., `sudo`, `rm -rf /`)
- Operations are restricted to session-specific directories
- No access to system-critical files or processes

### Session Isolation

- Each session operates in isolated temporary directories
- Environment variables are session-scoped
- No cross-session data leakage

### Best Practices

- Always run in a containerized environment for production
- Configure firewall rules for the server port
- Regular security updates for dependencies

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Add tests** if applicable
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Update documentation for new features
- Test on both desktop and mobile

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **shadcn** - For the beautiful UI component library
- **Tailwind Labs** - For the utility-first CSS framework
- **Drizzle Team** - For the type-safe ORM

## 🚀 Deployment

### GitHub Pages Demo (Recommended for Quick Preview)

**🌐 [Try the Live Demo](https://emiliancristea.github.io/webterminal/)**

Experience the Web Terminal interface with an interactive demo that works entirely in your browser:

**✅ Demo Features:**
- Full terminal UI with professional styling
- Interactive command execution with realistic responses
- Command history and navigation
- Mobile-optimized interface
- Help system with available commands

**📋 Available Demo Commands:**
```bash
help          # Show available commands
ls -la        # List directory contents
pwd           # Show current directory  
echo "text"   # Echo text back
date          # Show current date/time
whoami        # Show current user
clear         # Clear terminal
```

**⚠️ Demo Limitations:**
- Commands are simulated, not executed on a real system
- No file system access or persistent storage
- Limited to predefined demo commands

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**: Go to repository Settings → Pages → Source: GitHub Actions
2. **Automatic Deployment**: Push to main branch triggers automatic deployment
3. **Manual Deployment**: Use the "Deploy to GitHub Pages" workflow in Actions tab
4. **Access**: Your app will be available at `https://yourusername.github.io/webterminal/`

### Replit (Recommended for Full Functionality)

This project is optimized for Replit deployment:

1. Import the repository to Replit
2. Install dependencies automatically
3. Run with the built-in runner

### Traditional Hosting

1. Build the project: `npm run build`
2. Deploy the `dist/` directory to your server
3. Configure reverse proxy for WebSocket support
4. Set up PostgreSQL database (optional)

### Docker (Coming Soon)

Docker support is planned for easy containerized deployment.

---

**Happy Terminal-ing! 🖥️✨**

For questions or support, please open an issue on GitHub.
