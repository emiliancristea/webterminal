# API Documentation

## Overview

The Web Terminal API provides endpoints for managing terminal sessions and executing commands. The API uses REST for session management and WebSockets for real-time terminal communication.

## Base URL

```
http://localhost:5173/api  (development)
https://your-domain.com/api  (production)
```

## Authentication

Currently, the API does not require authentication. Sessions are managed by unique session IDs generated server-side.

## REST API Endpoints

### Sessions

#### Create Session
```http
POST /api/sessions
```

Creates a new terminal session with isolated environment.

**Response:**
```json
{
  "id": "uuid-string",
  "userId": null,
  "currentDirectory": "/home/user",
  "environmentVars": {},
  "createdAt": "2025-01-10T10:00:00Z",
  "lastActivity": "2025-01-10T10:00:00Z"
}
```

#### Get Session
```http
GET /api/sessions/:sessionId
```

Retrieves information about a specific session.

**Parameters:**
- `sessionId` (string): The unique session identifier

**Response:**
```json
{
  "id": "uuid-string",
  "currentDirectory": "/tmp/webterminal/session-id",
  "environmentVars": {
    "PATH": "/usr/local/bin:/usr/bin:/bin",
    "HOME": "/home/user"
  },
  "createdAt": "2025-01-10T10:00:00Z",
  "lastActivity": "2025-01-10T10:00:00Z"
}
```

#### List Session Commands
```http
GET /api/sessions/:sessionId/commands
```

Retrieves command history for a session.

**Parameters:**
- `sessionId` (string): The unique session identifier

**Response:**
```json
[
  {
    "id": "command-uuid",
    "sessionId": "session-uuid",
    "command": "ls -la",
    "output": "total 8\ndrwxr-xr-x 2 user user 4096 Jan 10 10:00 .\ndrwxr-xr-x 3 user user 4096 Jan 10 10:00 ..",
    "exitCode": "0",
    "timestamp": "2025-01-10T10:00:00Z"
  }
]
```

## WebSocket API

The WebSocket connection is established at `/ws` and handles real-time terminal communication.

### Connection

```javascript
const ws = new WebSocket('ws://localhost:5173/ws');
```

### Message Format

All WebSocket messages follow this structure:

```json
{
  "type": "message_type",
  "sessionId": "session-uuid",
  "data": { ... }
}
```

### Client → Server Events

#### Execute Command
```json
{
  "type": "command",
  "sessionId": "session-uuid",
  "command": "ls -la"
}
```

#### Change Directory
```json
{
  "type": "cd",
  "sessionId": "session-uuid",
  "directory": "/path/to/directory"
}
```

#### Terminal Resize
```json
{
  "type": "resize",
  "sessionId": "session-uuid",
  "cols": 80,
  "rows": 24
}
```

### Server → Client Events

#### Command Output
```json
{
  "type": "output",
  "sessionId": "session-uuid",
  "output": "command output text",
  "exitCode": 0,
  "finished": true
}
```

#### Directory Changed
```json
{
  "type": "directory",
  "sessionId": "session-uuid",
  "currentDirectory": "/new/path"
}
```

#### Error Messages
```json
{
  "type": "error",
  "sessionId": "session-uuid",
  "message": "Command not found",
  "code": "COMMAND_NOT_FOUND"
}
```

#### Session Status
```json
{
  "type": "status",
  "sessionId": "session-uuid",
  "status": "active|inactive|terminated"
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created (new session)
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (session not found)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": true,
  "message": "Description of the error",
  "code": "ERROR_CODE",
  "details": {
    // Additional error context
  }
}
```

### Common Error Codes

- `SESSION_NOT_FOUND` - The specified session ID does not exist
- `COMMAND_BLOCKED` - The command is restricted for security reasons
- `DIRECTORY_ACCESS_DENIED` - Cannot access the specified directory
- `WEBSOCKET_CONNECTION_FAILED` - WebSocket connection could not be established

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:

- Command execution rate limits (e.g., 10 commands per second)
- Session creation limits (e.g., 5 sessions per IP)
- WebSocket message rate limits

## Security Considerations

### Command Restrictions

The following commands are blocked for security:

- `sudo` and privilege escalation commands
- `rm -rf /` and destructive file operations
- System service management commands
- Network configuration commands

### Directory Access

- Sessions are limited to their isolated working directories
- Cannot access system directories like `/etc`, `/root`, `/sys`
- File operations are restricted to session-specific temporary directories

### Input Validation

- All command inputs are validated and sanitized
- Path traversal attempts are blocked
- Special characters are properly escaped

## Examples

### JavaScript Client Example

```javascript
class WebTerminalClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.sessionId = null;
  }

  async createSession() {
    const response = await fetch(`${this.serverUrl}/api/sessions`, {
      method: 'POST'
    });
    const session = await response.json();
    this.sessionId = session.id;
    return session;
  }

  connectWebSocket() {
    this.ws = new WebSocket(`${this.serverUrl.replace('http', 'ws')}/ws`);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }

  executeCommand(command) {
    if (this.ws && this.sessionId) {
      this.ws.send(JSON.stringify({
        type: 'command',
        sessionId: this.sessionId,
        command: command
      }));
    }
  }

  handleMessage(message) {
    switch (message.type) {
      case 'output':
        console.log('Command output:', message.output);
        break;
      case 'directory':
        console.log('Directory changed:', message.currentDirectory);
        break;
      case 'error':
        console.error('Error:', message.message);
        break;
    }
  }
}

// Usage
const client = new WebTerminalClient('http://localhost:5173');
await client.createSession();
client.connectWebSocket();
client.executeCommand('ls -la');
```

### cURL Examples

```bash
# Create a new session
curl -X POST http://localhost:5173/api/sessions

# Get session information
curl http://localhost:5173/api/sessions/your-session-id

# Get command history
curl http://localhost:5173/api/sessions/your-session-id/commands
```

## WebSocket Testing

You can test the WebSocket API using tools like `wscat`:

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:5173/ws

# Send command (paste this JSON)
{"type":"command","sessionId":"your-session-id","command":"echo hello"}
```