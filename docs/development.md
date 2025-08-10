# Development Guide

## Getting Started

This guide will help you set up your development environment and understand the codebase structure for contributing to the Web Terminal project.

## Prerequisites

### Required Software
- **Node.js** 18 or higher
- **npm** 9 or higher (comes with Node.js)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/emiliancristea/webterminal.git
cd webterminal

# Install dependencies
npm install

# Verify installation
npm run check
```

### 2. Environment Variables (Optional)

Create a `.env` file in the root directory for database features:

```bash
# Database (optional - uses in-memory storage by default)
DATABASE_URL=postgresql://username:password@localhost:5432/webterminal

# Development mode
NODE_ENV=development

# Replit specific (if deploying on Replit)
REPL_ID=your-repl-id
```

### 3. Start Development

```bash
# Start development server with hot reload
npm run dev

# Open browser to http://localhost:5173
```

## Project Architecture

### High-Level Overview

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│                 │◄────────────────┤                 │
│  React Client   │                 │  Express Server │
│  (Frontend)     │────────────────►│  (Backend)      │
│                 │    HTTP/REST    │                 │
└─────────────────┘                 └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   File System   │
                                    │   (Sandboxed)   │
                                    └─────────────────┘
```

### Frontend Architecture

The client is a modern React application with TypeScript:

```
client/src/
├── components/          # Reusable UI components
│   ├── terminal/       # Terminal-specific components
│   │   ├── terminal-input.tsx
│   │   ├── terminal-output.tsx
│   │   ├── file-explorer.tsx
│   │   ├── mobile-toolbar.tsx
│   │   └── command-bar.tsx
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
│   ├── use-terminal.tsx
│   ├── use-websocket.tsx
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utility functions
│   ├── queryClient.ts
│   └── utils.ts
├── pages/              # Application pages
│   ├── terminal.tsx
│   └── not-found.tsx
├── App.tsx            # Main app component
└── main.tsx           # React entry point
```

### Backend Architecture

The server uses Express.js with WebSocket support:

```
server/
├── index.ts           # Server entry point & middleware
├── routes.ts          # API routes & WebSocket handlers
├── storage.ts         # Data storage abstraction
└── vite.ts           # Vite development integration
```

### Shared Code

```
shared/
└── schema.ts         # Database schema & TypeScript types
```

## Development Workflow

### 1. Code Structure Guidelines

#### TypeScript
- Use strict TypeScript settings
- Define proper interfaces for all data structures
- Prefer type inference over explicit typing when clear
- Use Zod schemas for runtime validation

#### React Components
- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for complex logic
- Follow the component composition pattern

#### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Use CSS variables for theming
- Keep responsive design in mind

### 2. Component Development

#### Creating New Components

```typescript
// components/terminal/new-component.tsx
import { cn } from "@/lib/utils";

interface NewComponentProps {
  className?: string;
  // other props
}

export function NewComponent({ className, ...props }: NewComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {/* component content */}
    </div>
  );
}
```

#### Using shadcn/ui Components

```bash
# Add new UI components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
```

### 3. Hook Development

```typescript
// hooks/use-example.tsx
import { useState, useEffect } from 'react';

export function useExample() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // effect logic
  }, []);

  return { state, setState };
}
```

### 4. API Development

#### Adding New Endpoints

```typescript
// server/routes.ts
app.get("/api/new-endpoint", async (req, res) => {
  try {
    // endpoint logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### WebSocket Events

```typescript
// server/routes.ts
ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  switch (message.type) {
    case 'new-event':
      // handle new event
      break;
  }
});
```

## Testing

### Running Tests

```bash
# Type checking
npm run check

# Build verification
npm run build
```

### Manual Testing

1. **Terminal Functionality**
   - Test basic commands: `ls`, `pwd`, `echo`
   - Test directory navigation: `cd`
   - Test file operations: `touch`, `mkdir`

2. **WebSocket Connection**
   - Verify real-time command execution
   - Test connection resilience
   - Check session persistence

3. **Mobile Interface**
   - Test touch interactions
   - Verify virtual keyboard
   - Check responsive layout

### Writing Tests (Future)

The project is set up to support testing with your preferred framework:

```typescript
// Example test structure
describe('Terminal Component', () => {
  it('should execute commands', () => {
    // test implementation
  });
});
```

## Building and Deployment

### Development Build

```bash
# Build for development with source maps
npm run build
```

### Production Build

```bash
# Set production environment
NODE_ENV=production npm run build

# Start production server
npm start
```

### Build Output

```
dist/
├── public/            # Client build output
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
└── index.js          # Server build output
```

## Debugging

### Client Debugging

1. **Browser Developer Tools**
   - Use React Developer Tools extension
   - Monitor WebSocket connections in Network tab
   - Check console for errors

2. **Vite Development**
   - Hot module replacement for instant updates
   - Source maps for debugging TypeScript
   - Fast refresh for React components

### Server Debugging

1. **Console Logging**
   ```typescript
   console.log('Debug info:', { sessionId, command });
   ```

2. **Request Logging**
   - All API requests are logged with timing
   - WebSocket events are logged
   - Command execution is tracked

### Common Issues

#### WebSocket Connection Failed
- Check if server is running on correct port
- Verify firewall settings
- Test with `wscat` for isolation

#### Commands Not Executing
- Check command restrictions in `routes.ts`
- Verify session ID is valid
- Test with curl for API isolation

#### Build Errors
- Clear node_modules and reinstall
- Check TypeScript configuration
- Verify import paths

## Performance Optimization

### Frontend Performance

1. **Code Splitting**
   - Use dynamic imports for large components
   - Implement route-based code splitting

2. **State Management**
   - Use React Query for server state
   - Minimize re-renders with useMemo/useCallback

3. **Bundle Optimization**
   - Analyze bundle size with Vite's built-in tools
   - Tree-shake unused dependencies

### Backend Performance

1. **WebSocket Optimization**
   - Implement connection pooling
   - Use message batching for high-frequency updates

2. **Command Execution**
   - Implement command caching
   - Add request rate limiting

## Contributing Guidelines

### Code Style

1. **Formatting**
   - Use Prettier for consistent formatting
   - Follow existing indentation (2 spaces)
   - Use semicolons and trailing commas

2. **Naming Conventions**
   - Use camelCase for variables and functions
   - Use PascalCase for components and types
   - Use kebab-case for file names

3. **Import Organization**
   ```typescript
   // External libraries
   import React from 'react';
   import { useState } from 'react';
   
   // Internal imports
   import { Component } from '@/components/component';
   import { useHook } from '@/hooks/use-hook';
   
   // Types
   import type { ComponentProps } from './types';
   ```

### Commit Messages

Follow conventional commit format:

```
feat: add new terminal command
fix: resolve WebSocket connection issue
docs: update API documentation
refactor: improve component structure
test: add unit tests for hooks
```

### Pull Request Process

1. **Before Submitting**
   - Run `npm run check` to verify TypeScript
   - Test your changes thoroughly
   - Update documentation if needed

2. **PR Description**
   - Describe what changes were made
   - Explain why the changes were necessary
   - Include any breaking changes

3. **Review Process**
   - Address feedback promptly
   - Keep commits focused and atomic
   - Update branch with latest main if needed

## Advanced Topics

### Custom WebSocket Events

```typescript
// Define new event types in shared/schema.ts
export interface CustomEvent {
  type: 'custom';
  sessionId: string;
  data: any;
}

// Handle in server/routes.ts
case 'custom':
  // handle custom event
  break;

// Send from client
ws.send(JSON.stringify({
  type: 'custom',
  sessionId: session.id,
  data: customData
}));
```

### Database Integration

```typescript
// Add new table to shared/schema.ts
export const newTable = pgTable("new_table", {
  id: varchar("id").primaryKey(),
  // other columns
});

// Use in server/routes.ts
const result = await db.select().from(newTable);
```

### Mobile Optimizations

```typescript
// Use mobile hook
const isMobile = useIsMobile();

// Conditional rendering
{isMobile ? <MobileComponent /> : <DesktopComponent />}

// Touch event handling
const handleTouch = (event: TouchEvent) => {
  // handle touch
};
```

## Troubleshooting

### Common Development Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 5173
   lsof -ti:5173 | xargs kill
   ```

2. **Module Resolution Errors**
   - Check tsconfig.json path mappings
   - Verify file extensions in imports
   - Clear TypeScript cache

3. **WebSocket Connection Issues**
   - Check server logs for errors
   - Verify WebSocket server is running
   - Test with browser developer tools

### Getting Help

- Check existing issues on GitHub
- Review documentation in `/docs`
- Test with minimal reproduction case
- Include error messages and logs in reports

---

Happy coding! 🚀