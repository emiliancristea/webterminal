import { useState, useCallback, useRef } from "react";
import { generateDemoOutput, demoPrompt, type DemoTerminalOutput } from "@/lib/github-pages";

interface PromptInfo {
  user: string;
  hostname: string;
  directory: string;
}

export function useDemoTerminal() {
  const [output, setOutput] = useState<DemoTerminalOutput[]>(() => generateDemoOutput());
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "echo 'Welcome to Web Terminal Demo!'",
    "ls -la",
    "pwd",
    "echo $USER",
    "date",
    "uname -a"
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt] = useState<PromptInfo>(demoPrompt);

  const outputIdCounter = useRef(100); // Start higher to avoid conflicts

  const addOutput = useCallback(
    (type: DemoTerminalOutput["type"], content: string, exitCode?: string) => {
      const newOutput: DemoTerminalOutput = {
        id: `demo-output-${++outputIdCounter.current}`,
        type,
        content,
        timestamp: new Date(),
        exitCode,
      };
      setOutput((prev) => [...prev, newOutput]);
    },
    [],
  );

  const simulateCommandExecution = useCallback((command: string) => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Generate demo response based on command
      let response = "";
      
      if (command.startsWith("echo ")) {
        response = command.substring(5).replace(/['"]/g, "");
      } else if (command === "ls" || command === "ls -la") {
        response = `total 24
drwxr-xr-x  4 user user 4096 Nov 20 10:30 .
drwxr-xr-x  3 root root 4096 Nov 20 10:29 ..
-rw-r--r--  1 user user  220 Nov 20 10:29 .bash_logout
-rw-r--r--  1 user user 3771 Nov 20 10:29 .bashrc
-rw-r--r--  1 user user  807 Nov 20 10:29 .profile
drwxr-xr-x  2 user user 4096 Nov 20 10:30 Documents
drwxr-xr-x  2 user user 4096 Nov 20 10:30 Downloads`;
      } else if (command === "pwd") {
        response = "/home/user";
      } else if (command === "whoami") {
        response = "demo";
      } else if (command === "date") {
        response = new Date().toString();
      } else if (command.startsWith("mkdir ")) {
        response = ""; // mkdir doesn't output anything on success
      } else if (command.startsWith("touch ")) {
        response = ""; // touch doesn't output anything on success  
      } else if (command === "clear") {
        setOutput([]);
        setIsLoading(false);
        return;
      } else if (command.includes("help") || command === "--help") {
        response = `Web Terminal Demo Mode

This is a demonstration of the Web Terminal interface running on GitHub Pages.
For full terminal functionality with real command execution, you need the backend server.

Available demo commands:
  echo <text>     - Echo text back
  ls, ls -la      - List directory contents
  pwd             - Show current directory
  whoami          - Show current user
  date            - Show current date/time
  mkdir <name>    - Create directory (demo)
  touch <name>    - Create file (demo)
  clear           - Clear terminal
  help            - Show this help

Note: This is a static demo. Real commands require a backend server.`;
      } else {
        // Unknown command
        response = `bash: ${command}: command not found

This is a demo environment running on GitHub Pages.
Type 'help' to see available demo commands.
For full functionality, deploy with a backend server.`;
      }

      addOutput("output", response, "0");
      setIsLoading(false);
    }, 300 + Math.random() * 500); // Random delay between 300-800ms
  }, [addOutput]);

  const executeCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return;

      // Add command to output
      addOutput("command", command);

      // Add to history
      setCommandHistory((prev) => {
        const newHistory = [...prev, command];
        return newHistory.slice(-100); // Keep last 100 commands
      });

      setHistoryIndex(-1);
      setCurrentCommand("");

      // Simulate command execution
      simulateCommandExecution(command);
    },
    [addOutput, simulateCommandExecution],
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

  const handleResize = useCallback(() => {
    // Demo mode doesn't need real resize handling
  }, []);

  return {
    output,
    currentCommand,
    setCurrentCommand,
    prompt,
    isConnected: true, // Always "connected" in demo mode
    isLoading,
    isInitializing: false, // Never initializing in demo mode
    executeCommand,
    clearTerminal,
    navigateHistory,
    handleResize,
  };
}