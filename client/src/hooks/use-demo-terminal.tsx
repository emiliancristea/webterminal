import { useState, useCallback, useRef, useEffect } from "react";

interface TerminalOutput {
  id: string;
  type: "command" | "output" | "error";
  content: string;
  timestamp: Date;
  exitCode?: string;
}

interface PromptInfo {
  user: string;
  hostname: string;
  directory: string;
}

interface FileSystemEntry {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: FileSystemEntry[];
}

export function useDemoTerminal() {
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentDirectory, setCurrentDirectory] = useState("/home/user");
  const [prompt, setPrompt] = useState<PromptInfo>({
    user: "user",
    hostname: "webterminal",
    directory: "~",
  });

  const outputIdCounter = useRef(0);

  // Demo filesystem
  const [fileSystem, setFileSystem] = useState<FileSystemEntry>({
    name: "/",
    type: "directory",
    children: [
      {
        name: "home",
        type: "directory",
        children: [
          {
            name: "user",
            type: "directory",
            children: [
              {
                name: "welcome.txt",
                type: "file",
                content: `Welcome to WebTerminal Demo!

This is a simulated Linux environment running in your browser.
For full functionality with real command execution, you need a backend server.

Demo Commands Available:
- ls                List directory contents
- cd <directory>    Change directory
- pwd               Print working directory
- cat <file>        Display file contents
- mkdir <name>      Create directory
- touch <name>      Create file
- echo <text>       Display text
- whoami            Show current user
- date              Show current date
- clear             Clear terminal
- help              Show this help

Note: This is a demo version. For real Linux command execution,
deploy the full application with the backend server.`,
              },
              {
                name: "demo.js",
                type: "file",
                content: `console.log("Hello from WebTerminal Demo!");
console.log("This is a simulated Node.js file.");
console.log("For real Node.js execution, use the full version.");`,
              },
              {
                name: "projects",
                type: "directory",
                children: [
                  {
                    name: "my-app",
                    type: "directory",
                    children: [
                      {
                        name: "package.json",
                        type: "file",
                        content: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "Demo Node.js project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}`,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "etc",
        type: "directory",
        children: [
          {
            name: "hosts",
            type: "file",
            content: "127.0.0.1 localhost\n::1 localhost",
          },
        ],
      },
    ],
  });

  const addOutput = useCallback(
    (type: TerminalOutput["type"], content: string, exitCode?: string) => {
      const newOutput: TerminalOutput = {
        id: `output-${++outputIdCounter.current}`,
        type,
        content,
        timestamp: new Date(),
        exitCode,
      };
      setOutput((prev) => [...prev, newOutput]);
    },
    [],
  );

  const updatePrompt = useCallback((dir: string) => {
    const displayDir = dir.replace("/home/user", "~");
    setPrompt({
      user: "user",
      hostname: "webterminal",
      directory: displayDir,
    });
  }, []);

  const findFileSystemEntry = useCallback(
    (path: string): FileSystemEntry | null => {
      const parts = path.split("/").filter(Boolean);
      let current = fileSystem;

      for (const part of parts) {
        if (current.type !== "directory" || !current.children) {
          return null;
        }
        const found = current.children.find((child) => child.name === part);
        if (!found) return null;
        current = found;
      }

      return current;
    },
    [fileSystem],
  );

  const executeCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return;

      // Add command to output
      addOutput("command", command);

      // Add to history
      setCommandHistory((prev) => {
        const newHistory = [...prev, command];
        return newHistory.slice(-100);
      });

      setHistoryIndex(-1);
      setCurrentCommand("");
      setIsLoading(true);

      // Simulate processing delay
      setTimeout(() => {
        const [cmd, ...args] = command.trim().split(/\s+/);
        let output = "";
        let exitCode = "0";

        switch (cmd) {
          case "ls":
            const targetDir = args[0] || currentDirectory;
            const entry = findFileSystemEntry(targetDir);
            if (entry && entry.type === "directory" && entry.children) {
              output = entry.children
                .map((child) =>
                  child.type === "directory" ? `${child.name}/` : child.name,
                )
                .join("  ");
            } else {
              output = `ls: cannot access '${targetDir}': No such file or directory`;
              exitCode = "2";
            }
            break;

          case "pwd":
            output = currentDirectory;
            break;

          case "cd":
            const newDir = args[0] || "/home/user";
            let targetPath = newDir;

            if (newDir === "~") {
              targetPath = "/home/user";
            } else if (newDir === "..") {
              const parts = currentDirectory.split("/").filter(Boolean);
              parts.pop();
              targetPath = "/" + parts.join("/");
              if (targetPath === "/") targetPath = "/home/user";
            } else if (!newDir.startsWith("/")) {
              targetPath = currentDirectory + "/" + newDir;
            }

            const dirEntry = findFileSystemEntry(targetPath);
            if (dirEntry && dirEntry.type === "directory") {
              setCurrentDirectory(targetPath);
              updatePrompt(targetPath);
              output = "";
            } else {
              output = `bash: cd: ${newDir}: No such file or directory`;
              exitCode = "1";
            }
            break;

          case "cat":
            if (!args[0]) {
              output = "cat: missing file operand";
              exitCode = "1";
            } else {
              const filePath = args[0].startsWith("/")
                ? args[0]
                : currentDirectory + "/" + args[0];
              const fileEntry = findFileSystemEntry(filePath);
              if (fileEntry && fileEntry.type === "file") {
                output = fileEntry.content || "";
              } else {
                output = `cat: ${args[0]}: No such file or directory`;
                exitCode = "1";
              }
            }
            break;

          case "mkdir":
            if (!args[0]) {
              output = "mkdir: missing operand";
              exitCode = "1";
            } else {
              output = `Demo: Directory '${args[0]}' would be created`;
            }
            break;

          case "touch":
            if (!args[0]) {
              output = "touch: missing file operand";
              exitCode = "1";
            } else {
              output = `Demo: File '${args[0]}' would be created`;
            }
            break;

          case "echo":
            output = args.join(" ");
            break;

          case "whoami":
            output = "user";
            break;

          case "date":
            output = new Date().toString();
            break;

          case "clear":
            setOutput([]);
            setIsLoading(false);
            return;

          case "help":
            output = `WebTerminal Demo - Available Commands:

Navigation:
  ls [dir]      - List directory contents
  cd [dir]      - Change directory (try: cd projects/my-app)
  pwd           - Print working directory

File Operations:
  cat <file>    - Display file contents (try: cat welcome.txt)
  mkdir <name>  - Create directory (demo only)
  touch <name>  - Create file (demo only)

System:
  whoami        - Current user
  date          - Current date and time
  echo <text>   - Display text
  clear         - Clear terminal
  help          - Show this help

Demo Files to Explore:
  cat welcome.txt
  cat demo.js
  cd projects/my-app && cat package.json

Note: This is a demo version. For real Linux command execution,
you need the full application with a backend server.`;
            break;

          case "node":
            if (args[0] === "--version" || args[0] === "-v") {
              output = "v20.19.4 (demo)";
            } else if (args[0] === "demo.js") {
              output = `Hello from WebTerminal Demo!
This is a simulated Node.js file.
For real Node.js execution, use the full version.`;
            } else {
              output = `Demo: Node.js command simulated
For real Node.js execution, deploy with backend server`;
            }
            break;

          case "npm":
            if (args[0] === "--version" || args[0] === "-v") {
              output = "10.8.2 (demo)";
            } else {
              output = `Demo: npm command simulated
For real package management, deploy with backend server`;
            }
            break;

          case "git":
            if (args[0] === "--version") {
              output = "git version 2.34.1 (demo)";
            } else {
              output = `Demo: Git command simulated
For real Git operations, deploy with backend server`;
            }
            break;

          default:
            output = `bash: ${cmd}: command not found
Try 'help' for available demo commands`;
            exitCode = "127";
        }

        addOutput("output", output + (output ? "\n" : ""), exitCode);
        setIsLoading(false);
      }, 500); // Simulate processing delay
    },
    [currentDirectory, findFileSystemEntry, addOutput, updatePrompt],
  );

  const clearTerminal = useCallback(() => {
    setOutput([]);
  }, []);

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (commandHistory.length === 0) return;

      if (direction === "up") {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else {
        if (historyIndex === -1) return;

        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (
          newIndex === commandHistory.length - 1 &&
          historyIndex === newIndex
        ) {
          setHistoryIndex(-1);
          setCurrentCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    },
    [commandHistory, historyIndex],
  );

  // Initialize demo terminal
  useEffect(() => {
    const timer = setTimeout(() => {
      addOutput(
        "output",
        `Welcome to WebTerminal Demo v1.0

🚀 GitHub Pages Demo Mode Active

This is a simulated Linux environment running entirely in your browser.
No backend server is required for this demo.

✨ Features Available:
• File system navigation (ls, cd, pwd)
• File viewing (cat welcome.txt)
• Basic shell commands
• Command history
• Responsive mobile interface

🔧 For Full Linux Environment:
Deploy the complete application with backend server for:
• Real command execution
• Package management (npm, apt)
• File editing and creation
• Git operations
• Development tools

Try: help
     ls
     cat welcome.txt
     cd projects/my-app

`,
        "0",
      );
      setIsInitializing(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [addOutput]);

  return {
    output,
    currentCommand,
    setCurrentCommand,
    prompt,
    isConnected: true, // Always "connected" in demo mode
    isLoading,
    isInitializing,
    executeCommand,
    clearTerminal,
    navigateHistory,
    handleResize: () => {}, // No-op for demo
  };
}
