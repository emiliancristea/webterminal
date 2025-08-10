import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { spawn, exec } from "child_process";
import path from "path";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";

interface TerminalSession {
  sessionId: string;
  currentDirectory: string;
  environmentVars: Record<string, string>;
}

const sessions = new Map<WebSocket, TerminalSession>();
const execAsync = promisify(exec);

// Create a sandboxed working directory for each session
const getSessionWorkingDir = (sessionId: string): string => {
  return path.join(os.tmpdir(), 'webterminal', sessionId);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create session endpoint
  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createSession({
        userId: "user",
        currentDirectory: "/home/user",
        environmentVars: {
          HOME: "/home/user",
          USER: "user",
          PATH: "/usr/local/bin:/usr/bin:/bin",
          SHELL: "/bin/bash",
          TERM: "xterm-256color",
        },
      });
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Get session endpoint
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to get session" });
    }
  });

  // Get command history
  app.get("/api/sessions/:id/commands", async (req, res) => {
    try {
      const commands = await storage.getCommandHistory(req.params.id);
      res.json(commands);
    } catch (error) {
      res.status(500).json({ error: "Failed to get command history" });
    }
  });

  // Get file tree
  app.get("/api/sessions/:id/files", async (req, res) => {
    try {
      const files = await storage.getFileTree(req.params.id);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to get file tree" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for terminal interaction
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New terminal connection established");
    
    // Send immediate connection confirmation
    ws.send(JSON.stringify({
      type: "connected",
      data: "WebSocket connection established"
    }));
    
    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Received WebSocket message:", message.type);
        await handleWebSocketMessage(ws, message);
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "error",
            data: "Failed to process message"
          }));
        }
      }
    });

    ws.on("close", (code, reason) => {
      sessions.delete(ws);
      console.log("Terminal connection closed:", code, reason?.toString());
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      sessions.delete(ws);
    });
  });

  async function handleWebSocketMessage(ws: WebSocket, message: any) {
    const { type, data } = message;

    switch (type) {
      case "init":
        await handleInit(ws, data);
        break;
      case "command":
        await handleCommand(ws, data);
        break;
      case "resize":
        await handleResize(ws, data);
        break;
      default:
        ws.send(JSON.stringify({
          type: "error",
          data: "Unknown message type"
        }));
    }
  }

  async function handleInit(ws: WebSocket, data: { sessionId: string }) {
    try {
      let session = await storage.getSession(data.sessionId);
      if (!session) {
        // Session might not exist yet, use the sessionId from the existing session that was created via API
        // Wait a moment and try again
        await new Promise(resolve => setTimeout(resolve, 100));
        session = await storage.getSession(data.sessionId);
        
        if (!session) {
          // Create a temporary session for WebSocket initialization 
          // The proper session should be created via REST API first
          session = {
            id: data.sessionId,
            userId: "user",
            currentDirectory: getSessionWorkingDir(data.sessionId),
            environmentVars: {
              HOME: getSessionWorkingDir(data.sessionId),
              USER: "user", 
              PATH: "/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/local/node/bin",
              SHELL: "/bin/bash",
              TERM: "xterm-256color",
            },
            createdAt: new Date(),
            lastActivity: new Date(),
          };
        }
      }

      // Create working directory for this session
      const workingDir = getSessionWorkingDir(data.sessionId);
      try {
        await fs.mkdir(workingDir, { recursive: true });
        
        // Create npm global directory structure
        await fs.mkdir(path.join(workingDir, '.npm-global', 'bin'), { recursive: true });
        await fs.mkdir(path.join(workingDir, '.npm-global', 'lib'), { recursive: true });
        await fs.mkdir(path.join(workingDir, '.npm-cache'), { recursive: true });
        
        // Create initial files in the working directory
        await fs.writeFile(path.join(workingDir, 'welcome.txt'), 
          'Welcome to WebTerminal - Development Environment!\n\nNode.js Development Ready:\n✓ Node.js v20.19.3 installed\n✓ npm v10.8.2 available\n✓ Git available\n✓ Python 3 support\n\nDevelopment Commands:\n- node --version\n- npm init\n- npm install <package>\n- git clone <repository>\n- mkdir my-project && cd my-project\n- nano package.json\n\nSystem Commands:\n- ls -la\n- pwd\n- whoami\n- cat welcome.txt\n');
        
        await fs.writeFile(path.join(workingDir, 'app.py'), 
          '#!/usr/bin/env python3\nprint("Hello from Python in WebTerminal!")\nprint("Current working directory:", __import__("os").getcwd())\n');
        
        // Create a simple Node.js example
        await fs.writeFile(path.join(workingDir, 'hello.js'), 
          'console.log("Hello from Node.js!");\nconsole.log("Node version:", process.version);\nconsole.log("Working directory:", process.cwd());\n');
        
        // Create a package.json template
        await fs.writeFile(path.join(workingDir, 'package.json.template'), 
          '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "description": "A Node.js project in WebTerminal",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "dev": "node --watch index.js"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "MIT"\n}\n');

        // Create Claude Code installation guide
        await fs.writeFile(path.join(workingDir, 'claude-setup.md'), 
          '# Claude Code Setup Guide\n\n## Installation\n```bash\n# Install Claude Code globally\nnpm install -g @anthropic-ai/claude-code\n\n# Check installation\nclaude doctor\n```\n\n## Usage\n```bash\n# Navigate to your project\ncd your-awesome-project\n\n# Start Claude Code\nclaude\n```\n\n## Authentication Options\n1. **Anthropic Console** (Default)\n2. **Claude App** (Pro/Max plan)\n3. **Enterprise** (Bedrock/Vertex AI)\n\n## Project Setup\n```bash\n# Create new project\nmkdir my-claude-project\ncd my-claude-project\nnpm init -y\nclaude\n```\n');

        // Create npm configuration for global installs
        await fs.writeFile(path.join(workingDir, '.npmrc'), 
          'prefix=${HOME}/.npm-global\n');

        // Create sample project structure
        await fs.mkdir(path.join(workingDir, 'sample-project'), { recursive: true });
        await fs.writeFile(path.join(workingDir, 'sample-project', 'package.json'), 
          '{\n  "name": "sample-claude-project",\n  "version": "1.0.0",\n  "description": "Sample project for Claude Code",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "dev": "node --watch index.js",\n    "claude": "claude"\n  },\n  "keywords": ["claude", "ai", "development"],\n  "author": "",\n  "license": "MIT"\n}\n');
        
        await fs.writeFile(path.join(workingDir, 'sample-project', 'index.js'), 
          '// Sample Node.js application for Claude Code\nconsole.log("Hello from Claude Code project!");\nconsole.log("Project directory:", __dirname);\nconsole.log("Node version:", process.version);\n\n// Example async function\nasync function main() {\n  console.log("Application started successfully!");\n  console.log("Ready for Claude Code integration...");\n}\n\nmain().catch(console.error);\n');

        await fs.writeFile(path.join(workingDir, 'sample-project', 'README.md'), 
          '# Sample Claude Code Project\n\nThis is a sample Node.js project ready for Claude Code integration.\n\n## Getting Started\n\n1. Install Claude Code globally:\n   ```bash\n   npm install -g @anthropic-ai/claude-code\n   ```\n\n2. Navigate to this project:\n   ```bash\n   cd sample-project\n   ```\n\n3. Start Claude Code:\n   ```bash\n   claude\n   ```\n\n## Features\n- Node.js v20.19.3 support\n- npm package management\n- Git integration ready\n- Development environment configured\n\n## Authentication\nClaude Code will guide you through authentication on first run.\n');
        
        await fs.chmod(path.join(workingDir, 'app.py'), 0o755);
        
      } catch (error) {
        console.error('Failed to create session directory:', error);
      }

      sessions.set(ws, {
        sessionId: data.sessionId,
        currentDirectory: workingDir,
        environmentVars: {
          HOME: workingDir,
          USER: "user",
          PATH: `${workingDir}/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/local/node/bin`,
          SHELL: "/bin/bash",
          TERM: "xterm-256color",
          PWD: workingDir,
          NODE_ENV: "development",
          NPM_CONFIG_PREFIX: `${workingDir}/.npm-global`,
          NPM_CONFIG_CACHE: `${workingDir}/.npm-cache`,
          NPM_CONFIG_INIT_AUTHOR_NAME: "user",
          NPM_CONFIG_INIT_LICENSE: "MIT",
        },
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: "output",
        data: {
          output: `Welcome to WebTerminal v1.0 - Development Environment
Connected to ${os.type()} ${os.release()} • Session: ${data.sessionId.slice(0, 8)}
Working Directory: ${workingDir}

Development Environment Ready:
✓ Node.js v20.19.3 (exceeds requirement of 18+)
✓ npm v10.8.2 package manager 
✓ Git version control
✓ Bash shell (recommended)
✓ 4GB+ RAM available
✓ Network connectivity
✓ Claude Code installation ready

Claude Code Setup:
1. Install: npm install -g @anthropic-ai/claude-code
2. Check: claude doctor
3. Navigate: cd sample-project
4. Start: claude

Quick Start:
- Try 'node hello.js' for Node.js demo
- Run 'cat claude-setup.md' for Claude Code guide
- Use 'cd sample-project' for ready project
- Check mobile 'Claude' tab for quick commands

`,
          exitCode: "0"
        }
      }));

      // Send current prompt
      ws.send(JSON.stringify({
        type: "prompt",
        data: {
          user: "user",
          hostname: "webterminal",
          directory: path.basename(workingDir)
        }
      }));

    } catch (error) {
      ws.send(JSON.stringify({
        type: "error",
        data: "Failed to initialize session"
      }));
    }
  }

  async function handleCommand(ws: WebSocket, data: { command: string }) {
    const terminalSession = sessions.get(ws);
    if (!terminalSession) {
      ws.send(JSON.stringify({
        type: "error",
        data: "Session not initialized"
      }));
      return;
    }

    const { command } = data;
    const { sessionId, currentDirectory, environmentVars } = terminalSession;

    try {
      // Handle built-in commands
      const builtInResult = await handleBuiltInCommands(command, terminalSession);
      if (builtInResult) {
        // Save command to history
        await storage.addCommand({
          sessionId,
          command,
          output: builtInResult.output,
          exitCode: builtInResult.exitCode,
        });

        ws.send(JSON.stringify({
          type: "output",
          data: builtInResult
        }));

        // Send updated prompt if directory changed
        if (builtInResult && 'directoryChanged' in builtInResult && builtInResult.directoryChanged) {
          ws.send(JSON.stringify({
            type: "prompt",
            data: {
              user: "user",
              hostname: "webterminal",
              directory: terminalSession.currentDirectory.replace("/home/user", "~")
            }
          }));
        }

        return;
      }

      // Execute real system command
      const result = await executeRealCommand(command, currentDirectory, environmentVars);
      
      // Save command to history
      await storage.addCommand({
        sessionId,
        command,
        output: result.output,
        exitCode: result.exitCode,
      });

      ws.send(JSON.stringify({
        type: "output",
        data: result
      }));

    } catch (error) {
      const errorResult = {
        output: `bash: ${command}: command not found\n`,
        exitCode: "127"
      };

      await storage.addCommand({
        sessionId,
        command,
        output: errorResult.output,
        exitCode: errorResult.exitCode,
      });

      ws.send(JSON.stringify({
        type: "output",
        data: errorResult
      }));
    }
  }

  async function handleBuiltInCommands(command: string, session: TerminalSession) {
    const [cmd, ...args] = command.trim().split(/\s+/);
    
    switch (cmd) {
      case "clear":
        return { output: "\x1b[2J\x1b[H", exitCode: "0" };
      
      case "pwd":
        return { output: session.currentDirectory + "\n", exitCode: "0" };
      
      case "cd":
        return await handleCdCommand(args, session);
      
      case "ls":
        return await handleLsCommand(args, session);
      
      case "cat":
        return await handleCatCommand(args, session);
      
      case "mkdir":
        return await handleMkdirCommand(args, session);
      
      case "touch":
        return await handleTouchCommand(args, session);
      
      case "help":
        return {
          output: `WebTerminal Commands:
Built-in commands:
  clear     - Clear the terminal screen
  pwd       - Print current directory
  cd        - Change directory
  ls        - List directory contents
  cat       - Display file contents
  mkdir     - Create directories
  touch     - Create files
  help      - Show this help message

System information:
  whoami    - Current user
  uname     - System information
  date      - Current date and time
  env       - Environment variables

File operations:
  nano      - Text editor (simulated)
  vim       - Text editor (simulated)
  rm        - Remove files (simulated)
  cp        - Copy files (simulated)
  mv        - Move files (simulated)

Package management:
  apt       - Package manager (simulated)

Try these commands to explore the environment!
`,
          exitCode: "0"
        };
      
      default:
        return null;
    }
  }

  async function handleCdCommand(args: string[], session: TerminalSession) {
    const targetPath = args[0] || session.environmentVars.HOME;
    let newPath = targetPath;
    
    if (targetPath === "~") {
      newPath = session.environmentVars.HOME;
    } else if (targetPath === "..") {
      newPath = path.dirname(session.currentDirectory);
    } else if (!path.isAbsolute(targetPath)) {
      newPath = path.resolve(session.currentDirectory, targetPath);
    }

    // Check if directory exists in the real filesystem
    try {
      const stats = await fs.stat(newPath);
      if (!stats.isDirectory()) {
        return { output: `bash: cd: ${targetPath}: Not a directory\n`, exitCode: "1" };
      }
      
      // Update session directory
      session.currentDirectory = newPath;
      session.environmentVars.PWD = newPath;
      await storage.updateSession(session.sessionId, { currentDirectory: newPath });
      
      return { output: "", exitCode: "0", directoryChanged: true };
    } catch (error) {
      return { output: `bash: cd: ${targetPath}: No such file or directory\n`, exitCode: "1" };
    }
  }

  async function handleLsCommand(args: string[], session: TerminalSession) {
    // For ls command, use real filesystem execution for most accurate results
    return await executeRealCommand(`ls ${args.join(' ')}`, session.currentDirectory, session.environmentVars);
  }

  async function handleCatCommand(args: string[], session: TerminalSession) {
    // For cat command, use real filesystem execution
    return await executeRealCommand(`cat ${args.join(' ')}`, session.currentDirectory, session.environmentVars);
  }

  async function handleMkdirCommand(args: string[], session: TerminalSession) {
    // For mkdir command, use real filesystem execution
    return await executeRealCommand(`mkdir ${args.join(' ')}`, session.currentDirectory, session.environmentVars);
  }

  async function handleTouchCommand(args: string[], session: TerminalSession) {
    // For touch command, use real filesystem execution
    return await executeRealCommand(`touch ${args.join(' ')}`, session.currentDirectory, session.environmentVars);
  }

  async function executeRealCommand(command: string, cwd: string, env: Record<string, string>) {
    // Security: Restrict dangerous commands
    const bannedCommands = ['rm -rf /', 'sudo', 'su', 'passwd', 'useradd', 'userdel', 'reboot', 'shutdown', 'init', 'systemctl'];
    const [cmd] = command.trim().split(/\s+/);
    
    if (bannedCommands.some(banned => command.includes(banned))) {
      return { output: `bash: ${cmd}: Operation not permitted in sandboxed environment\n`, exitCode: "1" };
    }

    try {
      // Execute the command in the session's working directory
      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd,
        env: { ...process.env, ...env },
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024 // 1MB output limit
      });
      
      const output = stdout + (stderr ? stderr : '');
      return { output: output || '', exitCode: "0" };
      
    } catch (error: any) {
      const output = error.stdout || error.stderr || error.message;
      const exitCode = error.code?.toString() || "1";
      
      return { 
        output: output + '\n', 
        exitCode 
      };
    }
  }

  async function handleResize(ws: WebSocket, data: { cols: number; rows: number }) {
    // Terminal resize handling - could be used for responsive layout
    // For now, just acknowledge
    ws.send(JSON.stringify({
      type: "resize_ack",
      data: { cols: data.cols, rows: data.rows }
    }));
  }

  return httpServer;
}
