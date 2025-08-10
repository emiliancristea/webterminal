# Web Terminal Application

## Overview

This is a real Linux terminal environment accessible through a web browser, built with React and Express.js. The application provides authentic Linux command execution in a secure sandboxed environment, allowing users to run actual shell commands, manage files, install packages, and work with development tools. The system features real-time communication through WebSockets, persistent session management, and a mobile-optimized responsive design.

## Recent Changes (January 2025)

- **Real Linux Environment**: Implemented actual command execution using Node.js child_process instead of simulation
- **Security Sandbox**: Added secure command execution with restricted access to dangerous operations
- **Working Directory Management**: Each session gets isolated working directories in system temp space
- **Mobile Optimization**: Enhanced touch controls and virtual keyboard support for mobile devices
- **Performance Improvements**: Fixed WebSocket connection stability and reduced resize event spam
- **Claude Code Integration**: Full support for Claude Code installation and workflow with npm global packages
- **Development Environment**: Enhanced Node.js v20.19.3 environment with proper npm configuration and project templates

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **React + TypeScript**: Modern React application with full TypeScript support for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Component Library**: Extensive use of shadcn/ui components with Radix UI primitives for accessible, customizable UI elements
- **Styling**: Tailwind CSS with custom terminal color scheme and JetBrains Mono font for authentic terminal appearance
- **State Management**: React Query for server state management and custom hooks for local state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture

- **Express.js Server**: RESTful API server with WebSocket support for real-time terminal communication
- **Session Management**: Persistent terminal sessions with command history and environment state
- **Memory Storage**: In-memory data storage with interfaces designed for easy database migration
- **Real Command Execution**: Secure Linux command execution using Node.js child_process with sandboxing
- **Working Directory Isolation**: Each session gets isolated temporary directories for file operations
- **Security Controls**: Restricted access to dangerous system commands (sudo, rm -rf /, etc.)
- **WebSocket Communication**: Real-time bidirectional communication for terminal input/output

### Database Schema Design

- **Sessions Table**: Stores terminal session state including current directory and environment variables
- **Commands Table**: Maintains command history with output and exit codes
- **Files Table**: Virtual file system with support for directories, permissions, and content management
- **Drizzle ORM**: Type-safe database operations with Zod schema validation

### Mobile-First Design

- **Responsive Layout**: Adaptive interface that scales from mobile to desktop
- **Touch Optimizations**: Mobile-specific controls including virtual keyboard support and touch-friendly buttons
- **Progressive Enhancement**: Core terminal functionality works across all device types

### Real-Time Features

- **WebSocket Integration**: Live terminal session communication with automatic reconnection
- **Command Streaming**: Real-time output display as commands execute
- **Session Persistence**: Maintains terminal state across disconnections and page refreshes

## External Dependencies

### Core Framework Dependencies

- **React Ecosystem**: React 18+ with React DOM for modern frontend development
- **Express.js**: Web application framework for Node.js backend services
- **WebSocket (ws)**: Real-time bidirectional communication between client and server
- **Vite**: Next-generation frontend build tool with hot module replacement

### Database and ORM

- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL client optimized for edge environments
- **Drizzle-Kit**: Database migration and introspection tools

### UI and Styling

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality React component library built on Radix UI
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives
- **Lucide React**: Beautiful, customizable SVG icon library

### State Management and Data Fetching

- **TanStack React Query**: Powerful data synchronization for React applications
- **React Hook Form**: Performant, flexible forms with easy validation
- **Zod**: TypeScript-first schema declaration and validation library

### Development and Build Tools

- **TypeScript**: Static type checking for enhanced developer experience
- **ESBuild**: Ultra-fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

### Terminal and System Integration

- **Child Process**: Node.js built-in module for executing shell commands
- **Path Utilities**: File system path manipulation and resolution
- **WebSocket Server**: Real-time communication infrastructure for terminal sessions
