# Web Terminal Examples

This directory contains example configurations and usage patterns for Web Terminal.

## Basic Examples

### Simple Terminal Session
```javascript
// Example of creating a new terminal session
const session = await fetch('/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    currentDirectory: '/home/user'
  })
});

const sessionData = await session.json();
console.log('Session created:', sessionData.id);
```

### WebSocket Command Execution
```javascript
// Example of executing commands via WebSocket
const ws = new WebSocket('ws://localhost:5000');

ws.onopen = () => {
  // Execute a command
  ws.send(JSON.stringify({
    type: 'command',
    sessionId: 'session-id',
    command: 'ls -la'
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'output') {
    console.log('Command output:', message.output);
  }
};
```

## Configuration Examples

### Environment Variables
```bash
# Example .env configuration
DATABASE_URL=postgresql://username:password@localhost:5432/webterminal
NODE_ENV=development
PORT=5000
REPL_ID=your-repl-id
```

### Custom Component Usage
```tsx
// Example of using terminal components in your own React app
import { TerminalInput, TerminalOutput } from '@/components/terminal';
import { useTerminal } from '@/hooks/use-terminal';

function CustomTerminal() {
  const { session, executeCommand, commandHistory } = useTerminal();

  return (
    <div className="terminal-container">
      <TerminalOutput history={commandHistory} />
      <TerminalInput onExecute={executeCommand} />
    </div>
  );
}
```

## Deployment Examples

### Docker Deployment (Coming Soon)
```dockerfile
# Example Dockerfile (planned feature)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Nginx Configuration
```nginx
# Example nginx configuration for reverse proxy
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Advanced Usage

### Custom Command Handlers
```typescript
// Example of adding custom command handling
const customCommands = {
  'weather': async (args: string[]) => {
    const city = args[0] || 'London';
    const response = await fetch(`https://api.weather.com/v1/current?location=${city}`);
    const data = await response.json();
    return `Weather in ${city}: ${data.temperature}°C, ${data.description}`;
  },
  
  'joke': async () => {
    const response = await fetch('https://api.jokes.com/random');
    const joke = await response.json();
    return joke.setup + '\n' + joke.punchline;
  }
};
```

### Database Integration
```typescript
// Example of using Drizzle ORM for custom data
import { drizzle } from 'drizzle-orm/node-postgres';
import { sessions, commands } from '@shared/schema';

const db = drizzle(connection);

// Create a new session with custom data
const newSession = await db.insert(sessions).values({
  userId: 'user123',
  currentDirectory: '/home/user',
  environmentVars: { CUSTOM_VAR: 'value' }
}).returning();

// Query command history
const history = await db
  .select()
  .from(commands)
  .where(eq(commands.sessionId, sessionId))
  .orderBy(desc(commands.timestamp));
```

## Mobile Integration

### Touch Event Handling
```typescript
// Example of custom touch event handling for mobile
function MobileTerminalControls() {
  const handleSwipeLeft = () => {
    // Navigate to previous command in history
  };

  const handleSwipeRight = () => {
    // Navigate to next command in history
  };

  const handleLongPress = () => {
    // Show context menu
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Terminal content */}
    </div>
  );
}
```

## Testing Examples

### Unit Test Example
```typescript
// Example unit test for terminal hooks
import { renderHook, act } from '@testing-library/react';
import { useTerminal } from '@/hooks/use-terminal';

describe('useTerminal', () => {
  it('should execute commands correctly', async () => {
    const { result } = renderHook(() => useTerminal());

    await act(async () => {
      await result.current.executeCommand('echo "Hello World"');
    });

    expect(result.current.commandHistory).toContain('Hello World');
  });
});
```

### Integration Test Example
```typescript
// Example integration test for WebSocket communication
import WebSocket from 'ws';

describe('WebSocket Integration', () => {
  it('should handle command execution via WebSocket', (done) => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.on('open', () => {
      ws.send(JSON.stringify({
        type: 'command',
        sessionId: 'test-session',
        command: 'echo "test"'
      }));
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('output');
      expect(message.output).toContain('test');
      ws.close();
      done();
    });
  });
});
```